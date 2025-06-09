import { getEmbeddingService } from './embeddings.js';
import { getCacheService } from './cache.js';

class ProductionVectorService {
    constructor() {
      this.embeddings = getEmbeddingService();
      this.cache = getCacheService();
      this.apiKey = process.env.PINECONE_API_KEY;
      this.indexName = "sai-portfolio-rag";
      this.namespace = "sai-portfolio";
      this.indexHost = null;
      this.isInitialized = false;
    }

  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log("🔧 Initializing Production Vector Service with Pinecone...");
      
      if (!this.apiKey) {
        throw new Error("PINECONE_API_KEY not found in environment");
      }

      // Get index host
      this.indexHost = await this.getIndexHost();
      this.isInitialized = true;
      
      console.log(`✅ Connected to Pinecone index: ${this.indexName}`);

    } catch (error) {
      console.error("❌ Pinecone initialization failed:", error);
      throw error;
    }
  }

  async getIndexHost() {
    const response = await fetch(`https://api.pinecone.io/indexes/${this.indexName}`, {
      headers: {
        'Api-Key': this.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get index host: ${response.status}`);
    }

    const indexInfo = await response.json();
    return indexInfo.host;
  }

  async semanticSearch(query, options = {}) {
    const { topK = 5, threshold = 0.7, useCache = true } = options;

    // Check cache first
    const cacheKey = `pinecone_search_${Buffer.from(query).toString('base64').slice(0, 32)}`;
    if (useCache) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        console.log("💾 Cache hit for Pinecone search");
        return cached;
      }
    }

    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log(`🔍 Pinecone semantic search: "${query}"`);

      // Generate query embedding
      const queryVector = await this.embeddings.getEmbedding(query);
      
      // Query Pinecone
      const response = await fetch(`https://${this.indexHost}/query`, {
        method: 'POST',
        headers: {
          'Api-Key': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          vector: queryVector,
          topK: topK * 2, // Get more for filtering
          namespace: this.namespace,
          includeMetadata: true,
          includeValues: false
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Pinecone query failed: ${response.status} ${errorText}`);
      }

      const queryResult = await response.json();
      
      // Process and filter results
      const results = (queryResult.matches || [])
        .filter(match => match.score >= threshold)
        .slice(0, topK)
        .map(match => ({
          id: match.id,
          content: match.metadata?.content || '',
          metadata: match.metadata || {},
          score: match.score,
          similarity: match.score
        }));

      console.log(`📊 Pinecone returned ${results.length} results (${queryResult.matches?.length || 0} total matches)`);

      // Cache results
      if (useCache && results.length > 0) {
        this.cache.set(cacheKey, results, 30 * 60 * 1000); // 30 min cache
      }

      return results;

    } catch (error) {
      console.error("❌ Pinecone search failed:", error);
      
      // Fallback to simple responses
      return this.getFallbackResults(query);
    }
  }

  getFallbackResults(query) {
    const fallbackData = {
      'projects': {
        content: "Sai's major projects include HR Matching Platform (saved $45K annually), Real-time Data Pipeline (400 events/sec), Computer Vision systems (97% accuracy), and production RAG systems with 92% RAGAS scores.",
        score: 0.85
      },
      'experience': {
        content: "Sai has 4+ years of ML engineering experience at Shell, CGI, and Community Dreams Foundation, with expertise in production AI systems.",
        score: 0.85
      },
      'education': {
        content: "Sai completed his MS in Machine Learning at Stevens Institute of Technology with a 3.9 CGPA.",
        score: 0.85
      },
      'skills': {
        content: "Sai's expertise includes Python, ML/AI, GenAI, RAG systems, Computer Vision, NLP, AWS, GCP, Kubernetes, and Docker.",
        score: 0.85
      }
    };

    const queryLower = query.toLowerCase();
    for (const [keyword, data] of Object.entries(fallbackData)) {
      if (queryLower.includes(keyword)) {
        return [{
          id: `fallback_${keyword}`,
          content: data.content,
          metadata: { sourceId: 'fallback', type: 'fallback' },
          score: data.score,
          similarity: data.score
        }];
      }
    }

    return [{
      id: 'fallback_general',
      content: "I'm Sai's AI assistant. Ask me about his projects, experience, education, or technical skills!",
      metadata: { sourceId: 'fallback', type: 'general' },
      score: 0.7,
      similarity: 0.7
    }];
  }

  async hybridSearch(query, options = {}) {
    // For now, just use semantic search since Pinecone handles this well
    return await this.semanticSearch(query, options);
  }

  async keywordSearch(query, options = {}) {
    const { topK = 5, filter = {} } = options;

    try {
      // Simple keyword-based filtering using metadata
      const keywords = query.toLowerCase().split(/\s+/).filter(word => word.length > 2);
      
      // Create filter for keywords in metadata
      const keywordFilter = {
        ...filter,
        $or: keywords.map(keyword => ({
          content: { $contains: keyword }
        }))
      };

      // Use a simple vector query with keyword filter
      // This is a simplified approach - in production, you'd use a proper text search engine
      const allResults = await this.pinecone.queryVectors(
        new Array(384).fill(0), // Zero vector for pure metadata filtering
        {
          topK: topK * 3,
          filter: keywordFilter,
          includeMetadata: true
        }
      );

      return allResults.slice(0, topK).map(match => ({
        id: match.id,
        content: match.metadata?.content || '',
        metadata: match.metadata || {},
        score: this.calculateKeywordScore(query, match.metadata?.content || ''),
        similarity: this.calculateKeywordScore(query, match.metadata?.content || '')
      }));

    } catch (error) {
      console.error("❌ Keyword search failed:", error);
      return [];
    }
  }

  calculateKeywordScore(query, content) {
    const queryWords = query.toLowerCase().split(/\s+/);
    const contentWords = content.toLowerCase().split(/\s+/);
    
    let matches = 0;
    for (const queryWord of queryWords) {
      if (contentWords.some(contentWord => contentWord.includes(queryWord))) {
        matches++;
      }
    }
    
    return matches / queryWords.length;
  }

  combineSearchResults(semanticResults, keywordResults, semanticWeight, keywordWeight) {
    const scoreMap = new Map();

    // Add semantic results
    semanticResults.forEach(result => {
      scoreMap.set(result.id, {
        ...result,
        finalScore: result.score * semanticWeight,
        searchTypes: ['semantic']
      });
    });

    // Add keyword results
    keywordResults.forEach(result => {
      const existing = scoreMap.get(result.id);
      if (existing) {
        // Combine scores for items found in both searches
        existing.finalScore += result.score * keywordWeight;
        existing.searchTypes.push('keyword');
        existing.finalScore = Math.min(existing.finalScore, 1.0); // Cap at 1.0
      } else {
        // Add new keyword-only results
        scoreMap.set(result.id, {
          ...result,
          finalScore: result.score * keywordWeight,
          searchTypes: ['keyword']
        });
      }
    });

    // Sort by final score
    return Array.from(scoreMap.values())
      .sort((a, b) => b.finalScore - a.finalScore);
  }

  async uploadDocuments(documents) {
    try {
      console.log(`📤 Uploading ${documents.length} documents to vector store...`);

      if (!this.isInitialized) {
        await this.initialize();
      }

      // Generate embeddings and prepare vectors
      const vectors = [];
      
      for (const [index, doc] of documents.entries()) {
        try {
          console.log(`🔄 Processing document ${index + 1}/${documents.length}`);
          
          const embedding = await this.embeddings.getEmbedding(doc.content);
          
          vectors.push({
            id: doc.id || `doc_${index}`,
            values: embedding,
            metadata: {
              content: doc.content,
              sourceId: doc.metadata?.sourceId || 'unknown',
              ...doc.metadata
            }
          });

          // Process in batches to avoid memory issues
          if (vectors.length >= 50) {
            await this.pinecone.upsertVectors(vectors);
            vectors.length = 0; // Clear array
          }

        } catch (error) {
          console.error(`❌ Failed to process document ${index}:`, error);
          continue;
        }
      }

      // Upload remaining vectors
      if (vectors.length > 0) {
        await this.pinecone.upsertVectors(vectors);
      }

      console.log("✅ Document upload completed");

    } catch (error) {
      console.error("❌ Document upload failed:", error);
      throw error;
    }
  }

  async getVectorStats() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const response = await fetch(`https://${this.indexHost}/describe_index_stats`, {
        method: 'POST',
        headers: {
          'Api-Key': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        throw new Error(`Failed to get stats: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error("❌ Failed to get vector stats:", error);
      return null;
    }
  }

  async clearVectorStore() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      await this.pinecone.clearNamespace();
      console.log("🧹 Vector store cleared");

    } catch (error) {
      console.error("❌ Failed to clear vector store:", error);
      throw error;
    }
  }
}

// Singleton instance
let vectorServiceInstance = null;

export function getVectorService() {
  if (!vectorServiceInstance) {
    vectorServiceInstance = new ProductionVectorService();
  }
  return vectorServiceInstance;
}

export default getVectorService();
