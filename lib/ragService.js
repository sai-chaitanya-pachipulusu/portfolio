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
    console.log('Looking for data in:', dataDir);

    try {
      // Load processed sources and embeddings
      const portfolioPath = path.join(dataDir, 'enhanced_portfolio_data.json');
      const qaPath = path.join(dataDir, 'qa_database.json');
      console.log('Looking for portfolio data in:', portfolioPath);
      console.log('Looking for qa data in:', qaPath);

      const [portfolioData, qaData] = await Promise.all([
        fs.readFile(portfolioPath, 'utf8').then(JSON.parse),
        fs.readFile(qaPath, 'utf8').then(JSON.parse)
      ]);

      console.log('Portfolio data keys:', Object.keys(portfolioData));
      console.log('QA data keys:', Object.keys(qaData));

      // Convert to the format RAG expects
      const documents = [];
      
      // Add portfolio data
      if (portfolioData.sources) {
        console.log('Found portfolioData.sources:', portfolioData.sources.length);
        portfolioData.sources.forEach((source, index) => {
          documents.push({
            content: source.content,
            metadata: { sourceId: `portfolio_${index}`, ...source.metadata }
          });
        });
      } else if (Array.isArray(portfolioData)) {
        console.log('Portfolio data is array:', portfolioData.length);
        portfolioData.forEach((item, index) => {
          documents.push({
            content: item.content || JSON.stringify(item),
            metadata: { sourceId: `portfolio_${index}` }
          });
        });
      }
      
      // Add Q&A data
      if (qaData.questions) {
        console.log('Found qaData.questions:', qaData.questions.length);
        qaData.questions.forEach((qa, index) => {
          documents.push({
            content: `Q: ${qa.question}\nA: ${qa.answer}`,
            metadata: { sourceId: `qa_${index}`, type: 'qa' }
          });
        });
      }

      // Similar for QA data...
      console.log('Final documents count:', documents.length);

      this.knowledge = {
        documents: documents,
        embeddings: {} // Will be generated on-demand
      };

      console.log(`Loaded ${documents.length} documents with embeddings`);
    } catch (error) {
      console.error('Load knowledge error:', error);
      throw error;
    }
  }

  async search(query, options = {}) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const { maxResults = 10, threshold = 0.5 } = options;
    
    // Check cache
    const cacheKey = `search_${this.hashQuery(query)}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    try {
      // Get query embedding
      const queryEmbedding = await this.embeddings.getEmbedding(query);
      
      // Find similar documents
      const results = await this.findSimilar(queryEmbedding, threshold, maxResults);
      
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

  async findSimilar(queryEmbedding, threshold, maxResults) {
    const results = [];
      
    for (const doc of this.knowledge.documents) {
      let embedding = this.knowledge.embeddings[doc.content];
    
      // Generate embedding if missing
      if (!embedding) {
        try {
          embedding = await this.embeddings.getEmbedding(doc.content);
          this.knowledge.embeddings[doc.content] = embedding; // Cache it
        } catch (error) {
          console.warn('Failed to generate embedding:', error);
          continue;
        }
      }
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