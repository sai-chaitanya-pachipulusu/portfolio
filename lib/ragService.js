import { getEmbeddingService } from './embeddings.js';
import { getLLMService } from './llm.js';
import { getCacheService } from './cache.js';
import fs from 'fs/promises';
import path from 'path';

class RAGService {
  constructor() {
    this.embeddings = getEmbeddingService();
    this.llm = getLLMService();
    this.cache = getCacheService();
    this.knowledge = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      await this.loadKnowledge();
      this.isInitialized = true;
      console.log('RAG Service initialized');
    } catch (error) {
      console.error('RAG initialization failed:', error);
      this.knowledge = { documents: [], embeddings: {} };
    }
  }

  async loadKnowledge() {
    const dataDir = path.resolve(process.cwd(), 'data');
    
    try {
      // Load processed sources and embeddings
      const sourcesPath = path.join(dataDir, 'processed_sources.json');
      const embeddingsPath = path.join(dataDir, 'embeddings.json');
      
      const [sourcesData, embeddingsData] = await Promise.all([
        fs.readFile(sourcesPath, 'utf8').then(JSON.parse),
        fs.readFile(embeddingsPath, 'utf8').then(JSON.parse)
      ]);

      this.knowledge = {
        documents: sourcesData,
        embeddings: embeddingsData
      };

      console.log(`Loaded ${sourcesData.length} documents with embeddings`);
    } catch (error) {
      console.warn('Could not load knowledge files:', error.message);
      throw error;
    }
  }

  async search(query, options = {}) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const { maxResults = 5, threshold = 0.3 } = options;
    
    // Check cache
    const cacheKey = `search_${this.hashQuery(query)}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    try {
      // Get query embedding
      const queryEmbedding = await this.embeddings.getEmbedding(query);
      
      // Find similar documents
      const results = this.findSimilar(queryEmbedding, threshold, maxResults);
      
      // Build context
      const context = results.map(r => r.content).join('\n\n');
      const sources = results.map(r => r.source).filter(Boolean);

      const searchResult = {
        context,
        sources: [...new Set(sources)], // Remove duplicates
        confidence: results.length > 0 ? results[0].similarity * 100 : 0
      };

      // Cache result
      this.cache.set(cacheKey, searchResult, 30 * 60 * 1000); // 30 min
      
      return searchResult;
    } catch (error) {
      console.error('RAG search failed:', error);
      return this.getFallbackResponse(query);
    }
  }

  findSimilar(queryEmbedding, threshold, maxResults) {
    const results = [];
    
    for (const doc of this.knowledge.documents) {
      const embedding = this.knowledge.embeddings[doc.content];
      if (!embedding) continue;
      
      const similarity = this.cosineSimilarity(queryEmbedding, embedding);
      if (similarity >= threshold) {
        results.push({
          content: doc.content,
          similarity,
          source: doc.metadata?.sourceId || 'Unknown',
          metadata: doc.metadata
        });
      }
    }

    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, maxResults);
  }

  cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

    let dotProduct = 0, normA = 0, normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    const norm = Math.sqrt(normA) * Math.sqrt(normB);
    return norm === 0 ? 0 : dotProduct / norm;
  }

  getFallbackResponse(query) {
    return {
      context: '',
      sources: [],
      confidence: 0,
      isFallback: true
    };
  }

  hashQuery(query) {
    return Buffer.from(query).toString('base64').slice(0, 32);
  }
}

let ragInstance = null;

export function getRAGService() {
  if (!ragInstance) {
    ragInstance = new RAGService();
  }
  return ragInstance;
}

export default getRAGService(); 