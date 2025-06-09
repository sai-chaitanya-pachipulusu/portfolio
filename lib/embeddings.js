// Embedding service for the portfolio chatbot
class EmbeddingService {
  constructor() {
    this.huggingFaceApiKey = process.env.HUGGINGFACE_API_KEY;
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    //this.defaultModel = "sentence-transformers/all-MiniLM-L6-v2";
    this.defaultModel = "mixedbread-ai/mxbai-embed-large-v1";
  }

  async getEmbedding(text) {
    const providers = [
      { name: 'huggingface', fn: () => this.getHuggingFaceEmbedding(text) },
      { name: 'openai', fn: () => this.getOpenAIEmbedding(text) },
      { name: 'fallback', fn: () => this.getFallbackEmbedding(text) }
    ];

    let lastError;
    for (const provider of providers) {
      try {
        console.log(`Trying ${provider.name} embedding provider...`);
        const result = await provider.fn();
        console.log(`Successfully got embedding from ${provider.name}`);
        return result;
      } catch (error) {
        console.warn(`${provider.name} embedding failed:`, error.message);
        lastError = error;
        continue;
      }
    }

    throw new Error(`All embedding providers failed. Last error: ${lastError?.message}`);
  }

  async getHuggingFaceEmbedding(text) {
    if (!this.huggingFaceApiKey) {
      throw new Error('HuggingFace API key not configured');
    }

    const normalizedText = text.trim().slice(0, 1000);
    const apiUrl = `https://api-inference.huggingface.co/pipeline/feature-extraction/${this.defaultModel}`;

      // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.huggingFaceApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: normalizedText,
          options: { wait_for_model: true }
        }),
        signal: controller.signal // Add abort signal
      });
      
      clearTimeout(timeoutId);
    
      if (!response.ok) {
        let errorBody = 'Unknown error';
        try {
          errorBody = await response.text(); 
        } catch (textError) {
          console.error("Could not read error response body as text.");
        }
        console.error(`Hugging Face API error response (${response.status}): ${errorBody}`); 
        throw new Error(`Hugging Face API request failed with status ${response.status}: ${errorBody}`);
      }
      
      const result = await response.json();
      
      if (Array.isArray(result) && Array.isArray(result[0]) && result[0].length > 0) {
        return result[0];
      } else if (Array.isArray(result) && result.length > 0) {
        return result;
      } else {
        console.warn('Unexpected embedding format received:', result);
        return this.getFallbackEmbedding(text);
      }
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('HuggingFace API timeout');
      }
      throw error;
    } 
  }
  async getOpenAIEmbedding(text) {
    if (!this.openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey: this.openaiApiKey });

    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });

    return response.data[0].embedding;
  }

  getFallbackEmbedding(text) {
    console.warn('Using fallback embedding (simple hash-based)');
    const hash = this.simpleHash(text);
    const dimension = 384;
    const vector = new Array(dimension).fill(0);
    
    for (let i = 0; i < dimension; i++) {
      vector[i] = Math.sin(hash + i) * 0.1;
    }
    
    return vector;
  }

  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  }

  async embedQuery(text) {
    return this.getEmbedding(text);
  }

  async embedDocuments(documents) {
    const embeddings = [];
    for (const doc of documents) {
      const embedding = await this.getEmbedding(doc);
      embeddings.push(embedding);
    }
    return embeddings;
  }
   
}

/**
 * Generate a deterministic mock embedding for testing
 * @param {string} text - Text to generate mock embedding for
 * @returns {Array} - Mock embedding vector
 */
function generateMockEmbedding(text) {
  const seed = text.length;
  const dimension = 384;
  
  return Array.from({ length: dimension }, (_, i) => {
    const val = Math.sin(seed + i) * 10000;
    return Math.cos(val) * 0.5;
  });
}

/**
 * Calculate cosine similarity between two vectors
 * @param {Array} a - First vector
 * @param {Array} b - Second vector
 * @returns {number} - Cosine similarity (0-1)
 */
function cosineSimilarity(a, b) {
  if (!a || !b || a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  if (normA === 0 || normB === 0) return 0;
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Calculate similarity between two texts by comparing embeddings
 * @param {string} text1 - First text
 * @param {string} text2 - Second text
 * @returns {number} - Similarity score (0-1)
 */
async function calculateSimilarity(text1, text2) {
  const embeddings = getEmbeddings();
  
  const embedding1 = await embeddings.embedQuery(text1);
  const embedding2 = await embeddings.embedQuery(text2);
  
  return cosineSimilarity(embedding1, embedding2);
}

// Singleton instance
let embeddingInstance = null;
let embeddingModel = null;

export function getEmbeddingService() {
  if (!embeddingInstance) {
    embeddingInstance = new EmbeddingService();
  }
  return embeddingInstance;
}

/**
 * Get the embeddings model instance (backward compatibility)
 * @returns {Object} - Embeddings model instance
 */
function getEmbeddings() {
  if (!embeddingModel) {
    const service = getEmbeddingService();
    embeddingModel = {
      embedQuery: async (text) => {
        try {
          return await service.getEmbedding(text);
        } catch (error) {
          console.error('Error generating embedding:', error);
          return generateMockEmbedding(text);
        }
      }
    };
  }
  
  return embeddingModel;
}

// Backward compatibility exports
export async function getEmbeddingFromHF(text) {
  const service = getEmbeddingService();
  return service.getHuggingFaceEmbedding(text);
}

// Export functions using CommonJS syntax for backward compatibility
/*
module.exports = {
  getEmbeddings,
  calculateSimilarity,
  cosineSimilarity,
  getEmbeddingService
};
*/

export default getEmbeddingService();