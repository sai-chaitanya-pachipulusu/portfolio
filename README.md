# LLM Quantization and Optimization Demo

This project demonstrates how to quantize, distill, and prune large language models (LLMs) to create smaller and more efficient versions. It includes both a practical implementation and educational resources to help you understand the techniques.

## Getting Started

### Prerequisites

- Docker and Docker Compose
- NVIDIA GPU with CUDA support
- NVIDIA Container Toolkit installed

### Running the Demo

1. Clone this repository:
   ```bash
   git clone <your-repo-url>
   cd <repo-directory>
   ```

2. Start the service:
   ```bash
   docker-compose up -d
   ```

3. Access the API at `http://localhost:8000`

## Available Models

By default, the system uses TinyLlama (1.1B parameters), but you can configure it to use other models by changing the `MODEL_ID` environment variable in the docker-compose.yml file.

Some recommended models to try:
- `TinyLlama/TinyLlama-1.1B-Chat-v1.0` (1.1B parameters, fast)
- `microsoft/phi-2` (2.7B parameters, high quality for size)
- `NousResearch/Nous-Hermes-2-Yi-6B` (6B parameters, good balance)
- `microsoft/Phi-3-mini-4k-instruct` (3.8B parameters, latest)

## Quantization Methods

This demo supports three quantization methods:

1. **BitsAndBytes** (Default): Runtime quantization that's easy to use
2. **GPTQ**: Post-training quantization with better quality
3. **AWQ**: Activation-aware weight quantization

Change the method by setting the `QUANTIZATION_METHOD` environment variable.

## Learning Resources

### API Endpoints

The server provides several educational endpoints:

- `/tutorial/quantization` - Learn about LLM quantization techniques
- `/tutorial/distillation` - Learn about knowledge distillation for LLMs
- `/tutorial/pruning` - Learn about model pruning techniques
- `/quantization-methods` - Compare different quantization approaches

### YouTube Tutorials

Here are some excellent YouTube tutorials on model optimization:

1. [Hugging Face Quantization Guide](https://www.youtube.com/watch?v=dVP_N3fKjgM) - Comprehensive guide to quantizing models with transformers
2. [GPTQ & AWQ Explained](https://www.youtube.com/watch?v=TPwu7Y0-QFk) - Deep dive into advanced quantization methods
3. [Knowledge Distillation for LLMs](https://www.youtube.com/watch?v=e54YK8V84Hw) - How to distill knowledge from large to small models

## Hands-On Exercises

To get hands-on experience with these techniques:

1. **Try Different Quantization Levels**: Change `QUANTIZATION_BITS` from 4 to 8 and compare performance
2. **Compare Models**: Try the same prompt with different model sizes (e.g., Phi-2 vs Llama-2-7b)
3. **Benchmark Performance**: Use the `/model-info` endpoint to check memory usage and load times

## Advanced Usage

### Implementing Custom Pruning

The app.py file includes examples of how to implement:
- Magnitude-based pruning (removing smallest weights)
- Structured pruning (removing attention heads)

### Distillation Project

For a complete distillation project, follow these steps:
1. Set up a teacher model (large) and student model (small)
2. Create a dataset of teacher model outputs
3. Train the student model to match teacher outputs
4. Evaluate and fine-tune the student model

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 