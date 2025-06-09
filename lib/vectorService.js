import { getEmbeddingService } from './embeddings.js';
import { getCacheService } from './cache.js';

class StandalonePineconeService {
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
      console.log("🔧 Initializing Standalone Pinecone Service...");
      
      if (!this.apiKey) {
        console.warn("⚠️ PINECONE_API_KEY not found, using fallback mode");
        this.isInitialized = true;
        return;
      }

      // Get index host
      this.indexHost = await this.getIndexHost();
      this.isInitialized = true;
      
      console.log(`✅ Connected to Pinecone: ${this.indexName}`);

    } catch (error) {
      console.error("❌ Pinecone initialization failed:", error);
      console.log("🔄 Continuing in fallback mode...");
      this.isInitialized = true; // Continue without Pinecone
    }
  }

  async getIndexHost() {
    const response = await fetch(`https://api.pinecone.io/indexes/${this.indexName}`, {
      headers: { 'Api-Key': this.apiKey }
    });

    if (!response.ok) {
      throw new Error(`Failed to get index: ${response.status}`);
    }

    const indexInfo = await response.json();
    return indexInfo.host;
  }

  async semanticSearch(query, options = {}) {
    const { topK = 5, threshold = 0.7, useCache = true } = options;

    // Check cache
    const cacheKey = `search_${Buffer.from(query).toString('base64').slice(0, 32)}`;
    if (useCache) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        console.log("💾 Cache hit");
        return cached;
      }
    }

    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // If Pinecone is not available, use fallback
      if (!this.indexHost) {
        return this.getFallbackResults(query);
      }

      console.log(`🔍 Pinecone search: "${query}"`);

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
          topK: topK,
          namespace: this.namespace,
          includeMetadata: true
        })
      });

      if (!response.ok) {
        throw new Error(`Query failed: ${response.status}`);
      }

      const result = await response.json();
      
      const results = (result.matches || [])
        .filter(match => match.score >= threshold)
        .map(match => ({
          id: match.id,
          content: match.metadata?.content || '',
          metadata: match.metadata || {},
          score: match.score,
          similarity: match.score
        }));

      console.log(`📊 Found ${results.length} results`);

      // Cache results
      if (useCache && results.length > 0) {
        this.cache.set(cacheKey, results, 30 * 60 * 1000);
      }

      return results;

    } catch (error) {
      console.error("❌ Pinecone search failed:", error);
      return this.getFallbackResults(query);
    }
  }

  getFallbackResults(query) {
    console.log("🔄 Using fallback search");
    
    const fallbackData = {
      'projects': "Sai's major projects include HR Matching Platform (saved $45K annually), Real-time Data Pipeline (400 events/sec), Computer Vision systems (97% accuracy), and production RAG systems with 92% RAGAS scores.",
      'experience': "Sai has 4+ years of ML engineering experience at Shell, CGI, and Community Dreams Foundation, with expertise in production AI systems.",
      'education': "Sai completed his MS in Machine Learning at Stevens Institute of Technology with a 3.9 CGPA.",
      'skills': "Sai's expertise includes Python, ML/AI, GenAI, RAG systems, Computer Vision, NLP, AWS, GCP, Kubernetes, and Docker.",
      'rag': "Yes! Sai is highly experienced with RAG systems. He's built production RAG implementations with 92% RAGAS scores and enterprise chatbots achieving 84% accuracy.",
      'technologies': "Sai works with Python, PyTorch, TensorFlow, AWS, GCP, Kubernetes, Docker, React, Node.js, and specializes in ML/AI, GenAI, RAG systems, Computer Vision, and NLP."
    };

    const queryLower = query.toLowerCase();
    for (const [keyword, response] of Object.entries(fallbackData)) {
      if (queryLower.includes(keyword)) {
        return [{
          id: `fallback_${keyword}`,
          content: response,
          metadata: { sourceId: 'portfolio', type: 'fallback' },
          score: 0.85,
          similarity: 0.85
        }];
      }
    }

    return [{
      id: 'fallback_general',
      content: "I'm Sai's AI assistant! Ask me about his ML engineering experience, RAG expertise, projects at Shell/CGI, or technical skills.",
      metadata: { sourceId: 'portfolio', type: 'general' },
      score: 0.7,
      similarity: 0.7
    }];
  }

  async hybridSearch(query, options = {}) {
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

let vectorServiceInstance = null;

export function getVectorService() {
  if (!vectorServiceInstance) {
    vectorServiceInstance = new StandalonePineconeService();
  }
  return vectorServiceInstance;
}

export default getVectorService();
