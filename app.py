import os
import torch
import uvicorn
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from transformers import (
    AutoModelForCausalLM, 
    AutoTokenizer, 
    BitsAndBytesConfig,
    pipeline
)
import bitsandbytes as bnb
from optimum.gptq import GPTQQuantizer, load_quantized_model

# Initialize FastAPI app
app = FastAPI(title="LLM Quantization Demo")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model configuration
MODEL_ID = os.environ.get("MODEL_ID", "TinyLlama/TinyLlama-1.1B-Chat-v1.0")
QUANTIZATION_METHOD = os.environ.get("QUANTIZATION_METHOD", "bitsandbytes")  # bitsandbytes, gptq, or awq
QUANTIZATION_BITS = int(os.environ.get("QUANTIZATION_BITS", "4"))

# Global variables for model and tokenizer
model = None
tokenizer = None

class ChatRequest(BaseModel):
    messages: List[Dict[str, str]]
    max_tokens: Optional[int] = 1024
    temperature: Optional[float] = 0.7

class ModelInfo(BaseModel):
    model_id: str
    quantization_method: str
    quantization_bits: int
    model_size_gb: float
    quantized_size_gb: float
    memory_usage_gb: float

@app.on_event("startup")
async def startup_event():
    global model, tokenizer
    
    print(f"Loading model {MODEL_ID} with {QUANTIZATION_METHOD} {QUANTIZATION_BITS}-bit quantization...")
    
    # Load tokenizer
    tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
    
    # Load and quantize model based on selected method
    if QUANTIZATION_METHOD == "bitsandbytes":
        # BitsAndBytes configuration for 4-bit quantization
        bnb_config = BitsAndBytesConfig(
            load_in_4bit=QUANTIZATION_BITS == 4,
            load_in_8bit=QUANTIZATION_BITS == 8,
            bnb_4bit_use_double_quant=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_compute_dtype=torch.float16
        )
        
        # Load quantized model
        model = AutoModelForCausalLM.from_pretrained(
            MODEL_ID,
            quantization_config=bnb_config,
            device_map="auto",
            torch_dtype=torch.float16
        )
        
        print(f"Successfully loaded {MODEL_ID} with {QUANTIZATION_METHOD} {QUANTIZATION_BITS}-bit quantization")
        
    elif QUANTIZATION_METHOD == "gptq":
        # For GPTQ quantization (would normally quantize first, but we'll load a pre-quantized model)
        model = load_quantized_model(MODEL_ID)
        print(f"Successfully loaded {MODEL_ID} with GPTQ quantization")
        
    elif QUANTIZATION_METHOD == "awq":
        # For AWQ quantization, typically you'd load a pre-quantized model
        from transformers import AwqConfig
        
        awq_config = AwqConfig(bits=QUANTIZATION_BITS)
        model = AutoModelForCausalLM.from_pretrained(
            MODEL_ID,
            quantization_config=awq_config,
            device_map="auto"
        )
        print(f"Successfully loaded {MODEL_ID} with AWQ quantization")
    
    else:
        # Load in full precision as fallback
        model = AutoModelForCausalLM.from_pretrained(
            MODEL_ID, 
            device_map="auto",
            torch_dtype=torch.float16
        )
        print(f"Successfully loaded {MODEL_ID} in full precision (no quantization)")

@app.get("/")
async def root():
    return {"message": "LLM Quantization Demo API is running"}

@app.get("/model-info")
async def model_info():
    """Get information about the currently loaded model"""
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    # Calculate model size
    original_size_gb = sum(p.numel() * p.element_size() for p in model.parameters()) / (1024**3)
    quantized_size_gb = sum(p.numel() * (QUANTIZATION_BITS/8) for p in model.parameters()) / (1024**3)
    
    # Get current GPU memory usage
    if torch.cuda.is_available():
        memory_usage_gb = torch.cuda.max_memory_allocated() / (1024**3)
    else:
        memory_usage_gb = 0.0
    
    return ModelInfo(
        model_id=MODEL_ID,
        quantization_method=QUANTIZATION_METHOD,
        quantization_bits=QUANTIZATION_BITS,
        model_size_gb=original_size_gb,
        quantized_size_gb=quantized_size_gb,
        memory_usage_gb=memory_usage_gb
    )

@app.post("/chat")
async def chat(request: ChatRequest):
    """Process a chat request with the quantized model"""
    if model is None or tokenizer is None:
        raise HTTPException(status_code=500, detail="Model or tokenizer not loaded")
    
    try:
        # Format messages for the model's expected format
        formatted_messages = []
        for msg in request.messages:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            formatted_messages.append({"role": role, "content": content})
        
        # Create a text generation pipeline
        gen_pipeline = pipeline(
            "text-generation",
            model=model,
            tokenizer=tokenizer,
            max_length=request.max_tokens,
            temperature=request.temperature,
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id
        )
        
        # Generate response
        prompt = tokenizer.apply_chat_template(
            formatted_messages, 
            tokenize=False, 
            add_generation_prompt=True
        )
        response = gen_pipeline(prompt, max_new_tokens=request.max_tokens)[0]['generated_text']
        
        # Extract only the newly generated text
        new_text = response[len(prompt):].strip()
        
        return {"response": new_text}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")

@app.get("/quantization-methods")
async def quantization_methods():
    """Get information about available quantization methods"""
    return {
        "methods": [
            {
                "name": "bitsandbytes",
                "description": "Uses the bitsandbytes library to perform 4-bit or 8-bit quantization at runtime",
                "supported_bits": [4, 8],
                "advantages": [
                    "Simple to use - just load the model with the right config",
                    "Does not require pre-quantization step",
                    "Supports various quantization types (NF4, FP4, Int8)"
                ],
                "disadvantages": [
                    "Slightly slower inference than pre-quantized models",
                    "Quality may degrade for very small models"
                ]
            },
            {
                "name": "gptq",
                "description": "GPTQ is a post-training quantization method that performs better quantization than dynamic methods",
                "supported_bits": [3, 4, 8],
                "advantages": [
                    "Better quality than dynamic quantization",
                    "Faster inference than dynamic methods",
                    "Can achieve 3-bit precision with good quality"
                ],
                "disadvantages": [
                    "Requires a pre-quantization step (can be time-consuming)",
                    "More complex setup"
                ]
            },
            {
                "name": "awq",
                "description": "Activation-aware Weight Quantization (AWQ) balances the quantization difficulty across layers",
                "supported_bits": [4, 8],
                "advantages": [
                    "Better preservation of model quality",
                    "Good for efficient deployment",
                    "Optimizes for the activation pattern"
                ],
                "disadvantages": [
                    "Requires pre-computing activation statistics",
                    "More complex implementation"
                ]
            }
        ],
        "pruning_methods": [
            {
                "name": "magnitude_pruning",
                "description": "Removes weights with the lowest absolute values",
                "sparsity_range": "30-90%",
                "advantages": [
                    "Simple to implement",
                    "Works well for high sparsity"
                ]
            },
            {
                "name": "structured_pruning",
                "description": "Removes entire neurons or attention heads",
                "sparsity_range": "10-50%",
                "advantages": [
                    "Better for hardware acceleration",
                    "Reduces computation proportionally"
                ]
            }
        ],
        "distillation_methods": [
            {
                "name": "knowledge_distillation",
                "description": "Trains a smaller student model to mimic a larger teacher model",
                "size_reduction": "2-10x",
                "advantages": [
                    "Creates truly smaller models",
                    "Can retain most capabilities of larger models",
                    "Improves inference speed significantly"
                ]
            },
            {
                "name": "speculative_decoding",
                "description": "Uses a small model to predict tokens that a larger model verifies",
                "speedup": "2-4x",
                "advantages": [
                    "Maintains quality of the larger model",
                    "Improves inference speed"
                ]
            }
        ]
    }

# Tutorial endpoints with educational content
@app.get("/tutorial/quantization")
async def quantization_tutorial():
    """Learn about model quantization techniques"""
    return {
        "title": "LLM Quantization Tutorial",
        "introduction": "Quantization reduces model precision to decrease memory footprint and increase inference speed.",
        "steps": [
            "1. Choose a quantization method (bitsandbytes, GPTQ, AWQ)",
            "2. Decide on precision level (4-bit vs 8-bit)",
            "3. Configure quantization parameters",
            "4. Load and quantize your model",
            "5. Evaluate quality vs original model"
        ],
        "code_examples": {
            "bitsandbytes_4bit": """
# BitsAndBytes 4-bit Quantization
from transformers import AutoModelForCausalLM, BitsAndBytesConfig
import torch

quantization_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_use_double_quant=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.float16
)

model = AutoModelForCausalLM.from_pretrained(
    "mistralai/Mistral-7B-Instruct-v0.2",
    quantization_config=quantization_config,
    device_map="auto"
)
""",
            "gptq_quantization": """
# GPTQ Quantization
from optimum.gptq import GPTQQuantizer
from transformers import AutoModelForCausalLM, AutoTokenizer

model_id = "mistralai/Mistral-7B-Instruct-v0.2"
model = AutoModelForCausalLM.from_pretrained(model_id)
tokenizer = AutoTokenizer.from_pretrained(model_id)

# Initialize quantizer
quantizer = GPTQQuantizer(
    bits=4,
    dataset="c4",  # Calibration dataset
    block_name_to_quantize="model.layers"
)

# Quantize the model
quantized_model = quantizer.quantize_model(model, tokenizer)

# Save quantized model
quantized_model.save_pretrained("./quantized_model")
"""
        },
        "resources": [
            {"name": "Hugging Face Quantization Guide", "url": "https://huggingface.co/docs/transformers/main/quantization"},
            {"name": "BitsAndBytes Documentation", "url": "https://github.com/TimDettmers/bitsandbytes"},
            {"name": "GPTQ Paper", "url": "https://arxiv.org/abs/2210.17323"}
        ]
    }

@app.get("/tutorial/distillation")
async def distillation_tutorial():
    """Learn about model distillation techniques"""
    return {
        "title": "LLM Distillation Tutorial",
        "introduction": "Distillation creates smaller models by training them to mimic larger models' outputs.",
        "steps": [
            "1. Select a teacher model (e.g., Llama-2-70B)",
            "2. Choose a student architecture (e.g., Llama-2-7B)",
            "3. Prepare a dataset for distillation",
            "4. Train student to minimize divergence from teacher outputs",
            "5. Evaluate and fine-tune the student model"
        ],
        "code_examples": {
            "simple_distillation": """
# Simple Distillation Example
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, Trainer, TrainingArguments

# Load teacher and student models
teacher_model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-2-70b")
student_model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-2-7b")
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-2-7b")

# Define custom distillation loss
class DistillationTrainer(Trainer):
    def compute_loss(self, model, inputs, return_outputs=False):
        # Get student outputs
        outputs = model(**inputs)
        student_logits = outputs.logits
        
        # Get teacher outputs (no gradient needed)
        with torch.no_grad():
            teacher_outputs = self.teacher_model(**inputs)
            teacher_logits = teacher_outputs.logits
        
        # KL divergence loss
        loss_fct = torch.nn.KLDivLoss(reduction="batchmean")
        loss = loss_fct(
            torch.nn.functional.log_softmax(student_logits / self.temperature, dim=-1),
            torch.nn.functional.softmax(teacher_logits / self.temperature, dim=-1)
        )
        
        return (loss, outputs) if return_outputs else loss
"""
        },
        "resources": [
            {"name": "Knowledge Distillation Paper", "url": "https://arxiv.org/abs/1503.02531"},
            {"name": "Distilling LLMs", "url": "https://arxiv.org/abs/2303.18223"},
            {"name": "TinyLlama Project", "url": "https://github.com/jzhang38/TinyLlama"}
        ]
    }

@app.get("/tutorial/pruning")
async def pruning_tutorial():
    """Learn about model pruning techniques"""
    return {
        "title": "LLM Pruning Tutorial",
        "introduction": "Pruning removes unnecessary weights from models to reduce size and improve efficiency.",
        "methods": [
            {
                "name": "Magnitude Pruning",
                "description": "Removes weights with smallest absolute values",
                "implementation": """
# Magnitude Pruning Example
import torch

def magnitude_prune(model, sparsity=0.5):
    for name, param in model.named_parameters():
        if 'weight' in name:
            # Calculate threshold
            tensor = param.data.cpu()
            threshold = torch.quantile(tensor.abs().flatten(), sparsity)
            
            # Create binary mask (1 for keep, 0 for prune)
            mask = (tensor.abs() > threshold).float()
            
            # Apply mask to weights
            param.data.mul_(mask.to(param.device))
    
    return model
"""
            },
            {
                "name": "Structured Pruning",
                "description": "Removes entire neurons or attention heads",
                "implementation": """
# Attention Head Pruning Example
import torch

def attention_head_importance(model, dataset):
    # Compute importance of each attention head using dataset
    head_importance = {}
    
    for batch in dataset:
        # Forward pass with head attribution
        outputs = model(**batch, output_attentions=True)
        attentions = outputs.attentions
        
        # Update importance based on attention activations
        for layer_idx, layer_attention in enumerate(attentions):
            if layer_idx not in head_importance:
                head_importance[layer_idx] = torch.zeros(layer_attention.size(1))
            
            # Sum of attention values as importance metric
            importance = layer_attention.abs().sum(dim=(0, 2, 3))
            head_importance[layer_idx] += importance.detach().cpu()
    
    return head_importance

def prune_heads(model, head_importance, prune_ratio=0.3):
    # Sort heads by importance and prune least important ones
    heads_to_prune = {}
    
    for layer_idx, importance in head_importance.items():
        # Number of heads to prune in this layer
        n_heads = len(importance)
        n_to_prune = int(n_heads * prune_ratio)
        
        # Get indices of least important heads
        _, indices = torch.topk(importance, k=n_heads - n_to_prune, largest=True)
        to_prune = [i for i in range(n_heads) if i not in indices]
        
        if to_prune:
            heads_to_prune[layer_idx] = to_prune
    
    # Prune heads
    model.prune_heads(heads_to_prune)
    return model
"""
            }
        ],
        "resources": [
            {"name": "Pruning LLMs", "url": "https://arxiv.org/abs/2305.11627"},
            {"name": "Sparse Neural Networks", "url": "https://arxiv.org/abs/1801.09797"},
            {"name": "SparseGPT", "url": "https://arxiv.org/abs/2301.00774"}
        ]
    }

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True) 