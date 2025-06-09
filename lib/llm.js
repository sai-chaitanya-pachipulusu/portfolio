import OpenAI from 'openai';
//import { Ollama } from "langchain/llms/ollama";
//import { HuggingFaceInference } from "@huggingface/inference";
//import { HuggingFaceInference } from "langchain/llms/hf";
//import { HuggingFaceTransformers } from "@huggingface/transformers";
//const HF_API_URL = "https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf";
//const HF_API_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";
//const HF_API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-base";
/*
// For embeddings: Using a free alternative to OpenAI embeddings
export function getEmbeddings() {
  return new HuggingFaceTransformers({
    //modelName: "sentence-transformers/all-MiniLM-L6-v2",
    //modelName:"nvidia/Llama-3.1-Nemotron-70B-Instruct-HF",
    //modelName:"meta-llama/Llama-3.1-8B-Instruct",
    //modelName:"meta-llama/Llama-3.2-3B-Instruct",
    modelName: "multilingual-e5-large",
    apiKey: process.env.HUGGINGFACE_API_KEY
  });
}
*/
// For LLM: Using a free model from Hugging Face
// Simple wrapper for HuggingFace API
export function getLLM() {
  const predict = async (prompt) => {
    try {
      // Use Mistral-7B or LLAMA-2-13B models which generally perform better
      // const HF_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";
      const HF_API_URL = "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct"; // Changed to Phi-3-mini
      //const HF_API_URL = "https://api-inference.huggingface.co/models/distilbert/distilbert-base-uncased";
      
      // Add timeout to fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

      const response = await fetch(HF_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 512,
            temperature: 0.7,
            return_full_text: false
          }
        }),
      });

      //clearTimeout(timeoutId); // Clear the timeout
      
      // Parse the JSON response
      const result = await response.json();

      // Handle "model loading" response
      if (result.error && result.error.includes("loading")) {
        console.log("Model is loading...");
        // Wait 3 seconds before retrying
        await new Promise(resolve => setTimeout(resolve, 3000));
        return predict(prompt); // Retry the request
      }
      
      // Check if we have a valid response
      if (result[0] && result[0].generated_text) {
        return result[0].generated_text.trim();
      } else {
        console.error("Unexpected API response:", result);
        return "I'm having trouble generating a response right now. Please try again.";
      }
    } catch (error) {
      console.error('HuggingFace API Error:', error);
      return "I apologize, but I'm experiencing technical difficulties at the moment. Please try again later.";
    }
  };

  return { predict };
}

class LLMService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    this.config = {
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      max_tokens: 1000,
    };
  }

  async predict(prompt, options = {}) {
    const config = { ...this.config, ...options };
    
    try {
      const response = await this.openai.chat.completions.create({
        model: config.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: config.temperature,
        max_tokens: config.max_tokens,
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('LLM error:', error);
      throw error;
    }
  }

  async chat(systemPrompt, userPrompt, options = {}) {
    const config = { ...this.config, ...options };
    
    const response = await this.openai.chat.completions.create({
      model: config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: config.temperature,
      max_tokens: config.max_tokens,
    });

    return response.choices[0].message.content.trim();
  }
}

let instance = null;

export function getLLMService() {
  if (!instance) {
    instance = new LLMService();
  }
  return instance;
}

export default getLLMService();