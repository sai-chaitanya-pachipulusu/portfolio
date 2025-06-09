import { Pinecone } from "@pinecone-database/pinecone";

class PineconeService {
  constructor() {
    this.client = null;
    this.index = null;
    this.indexName = "sai-portfolio-rag";
    this.namespace = "sai-portfolio";
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log("🔧 Initializing Pinecone...");

      // Initialize Pinecone client
      this.client = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
      });

      // Get index
      this.index = this.client.Index(this.indexName);

      // Test connection
      const stats = await this.index.describeIndexStats();
      console.log(`✅ Pinecone connected: ${stats.totalVectorCount} vectors in index`);

      this.isInitialized = true;

    } catch (error) {
      console.error("❌ Pinecone initialization failed:", error);
      throw new Error(`Pinecone setup failed: ${error.message}`);
    }
  }

  async createIndex(dimension = 384) {
    try {
      console.log(`🏗️ Creating index: ${this.indexName}`);

      await this.client.createIndex({
        name: this.indexName,
        dimension: dimension,
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1'
          }
        }
      });

      console.log(`✅ Index created: ${this.indexName}`);
      
      // Wait for index to be ready
      await this.waitForIndexReady();

    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log(`ℹ️ Index ${this.indexName} already exists`);
      } else {
        throw error;
      }
    }
  }

  async waitForIndexReady(maxWaitTime = 60000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      try {
        const description = await this.client.describeIndex(this.indexName);
        if (description.status?.ready) {
          console.log("✅ Index is ready");
          return;
        }
        console.log("⏳ Waiting for index to be ready...");
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.log("⏳ Index not ready yet, waiting...");
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    throw new Error("Index did not become ready within timeout period");
  }

  async upsertVectors(vectors) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      console.log(`📤 Upserting ${vectors.length} vectors...`);

      // Batch upsert in chunks of 100
      const batchSize = 100;
      const batches = [];
      
      for (let i = 0; i < vectors.length; i += batchSize) {
        batches.push(vectors.slice(i, i + batchSize));
      }

      for (const [index, batch] of batches.entries()) {
        console.log(`📤 Processing batch ${index + 1}/${batches.length}`);
        
        await this.index.namespace(this.namespace).upsert(batch);
        
        // Small delay to avoid rate limiting
        if (index < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      console.log(`✅ Successfully upserted ${vectors.length} vectors`);

    } catch (error) {
      console.error("❌ Vector upsert failed:", error);
      throw error;
    }
  }

  async queryVectors(queryVector, options = {}) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const {
      topK = 5,
      filter = {},
      includeMetadata = true,
      includeValues = false
    } = options;

    try {
      const queryResponse = await this.index.namespace(this.namespace).query({
        vector: queryVector,
        topK: topK,
        filter: filter,
        includeMetadata: includeMetadata,
        includeValues: includeValues
      });

      return queryResponse.matches || [];

    } catch (error) {
      console.error("❌ Vector query failed:", error);
      throw error;
    }
  }

  async deleteVectors(ids) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      await this.index.namespace(this.namespace).deleteMany(ids);
      console.log(`🗑️ Deleted ${ids.length} vectors`);

    } catch (error) {
      console.error("❌ Vector deletion failed:", error);
      throw error;
    }
  }

  async getIndexStats() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const stats = await this.index.describeIndexStats();
      return {
        totalVectorCount: stats.totalVectorCount,
        dimension: stats.dimension,
        indexFullness: stats.indexFullness,
        namespaceStats: stats.namespaces || {}
      };

    } catch (error) {
      console.error("❌ Failed to get index stats:", error);
      return null;
    }
  }

  async clearNamespace() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      await this.index.namespace(this.namespace).deleteAll();
      console.log(`🧹 Cleared namespace: ${this.namespace}`);

    } catch (error) {
      console.error("❌ Failed to clear namespace:", error);
      throw error;
    }
  }
}

// Singleton instance
let pineconeInstance = null;

export function getPineconeService() {
  if (!pineconeInstance) {
    pineconeInstance = new PineconeService();
  }
  return pineconeInstance;
}

export default getPineconeService();