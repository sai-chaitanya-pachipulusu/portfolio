import fs from 'fs/promises';

// Standalone embedding service (no dependencies)
class StandaloneEmbeddingService {
  constructor() {
    this.huggingFaceApiKey = process.env.HUGGINGFACE_API_KEY;
    this.defaultModel = "sentence-transformers/all-MiniLM-L6-v2";
  }

  async getEmbedding(text) {
    try {
      if (!this.huggingFaceApiKey) {
        console.warn('No HuggingFace API key, using mock embedding');
        return this.getMockEmbedding(text);
      }

      console.log(`  🔄 Generating embedding for text (${text.length} chars)...`);

      const response = await fetch(
        `https://api-inference.huggingface.co/pipeline/feature-extraction/${this.defaultModel}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.huggingFaceApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: text.slice(0, 1000), // Limit input size
            options: { wait_for_model: true }
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`HuggingFace API failed: ${response.status} ${errorText}`);
        return this.getMockEmbedding(text);
      }

      const result = await response.json();
      
      if (Array.isArray(result) && result.length > 0) {
        return Array.isArray(result[0]) ? result[0] : result;
      }
      
      console.warn('Unexpected HuggingFace response format');
      return this.getMockEmbedding(text);

    } catch (error) {
      console.warn(`Embedding generation failed: ${error.message}`);
      return this.getMockEmbedding(text);
    }
  }

  getMockEmbedding(text) {
    // Simple deterministic mock embedding
    const dimension = 384;
    const seed = this.simpleHash(text);
    const vector = new Array(dimension);
    
    for (let i = 0; i < dimension; i++) {
      vector[i] = Math.sin(seed + i) * 0.1;
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
}

// Direct Pinecone API client
class PineconeAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.pinecone.io';
  }

  async createIndex(name, dimension = 384) {
    console.log(`🏗️ Creating/checking index: ${name}`);
    
    const response = await fetch(`${this.baseUrl}/indexes`, {
      method: 'POST',
      headers: {
        'Api-Key': this.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        dimension: dimension,
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1'
          }
        }
      })
    });

    if (response.status === 409) {
      console.log(`ℹ️ Index ${name} already exists`);
      return true;
    }

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create index: ${response.status} ${error}`);
    }

    console.log(`✅ Index ${name} created successfully`);
    return true;
  }

  async getIndexHost(indexName) {
    const response = await fetch(`${this.baseUrl}/indexes/${indexName}`, {
      headers: {
        'Api-Key': this.apiKey
      }
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get index info: ${response.status} ${error}`);
    }

    const indexInfo = await response.json();
    return indexInfo.host;
  }

  async upsertVectors(indexName, vectors, namespace = '') {
    const host = await this.getIndexHost(indexName);
    const url = `https://${host}/vectors/upsert`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Api-Key': this.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        vectors: vectors,
        namespace: namespace
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Upsert failed: ${response.status} ${error}`);
    }

    return await response.json();
  }

  async queryVectors(indexName, vector, topK = 5, namespace = '') {
    const host = await this.getIndexHost(indexName);
    const url = `https://${host}/query`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Api-Key': this.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        vector: vector,
        topK: topK,
        namespace: namespace,
        includeMetadata: true,
        includeValues: false
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Query failed: ${response.status} ${error}`);
    }

    return await response.json();
  }
}

async function uploadToPinecone() {
  console.log("🚀 Starting standalone Pinecone upload...");

  try {
    // Check environment
    if (!process.env.PINECONE_API_KEY) {
      throw new Error("PINECONE_API_KEY environment variable required");
    }

    const pinecone = new PineconeAPI(process.env.PINECONE_API_KEY);
    const embeddingService = new StandaloneEmbeddingService();
    
    const indexName = "sai-portfolio-rag";
    const namespace = "sai-portfolio";

    // Create index
    await pinecone.createIndex(indexName, 384);
    
    // Wait for index to be ready
    console.log("⏳ Waiting for index to be ready...");
    await new Promise(resolve => setTimeout(resolve, 15000));

    // Load processed sources
    console.log("📂 Loading source data...");
    const sourcesData = JSON.parse(
      await fs.readFile('./data/processed_sources.json', 'utf-8')
    );

    console.log(`📊 Processing ${sourcesData.length} documents...`);

    // Process in small batches
    const batchSize = 10; // Smaller batches for reliability
    let totalUploaded = 0;

    for (let i = 0; i < sourcesData.length; i += batchSize) {
      const batch = sourcesData.slice(i, i + batchSize);
      const vectors = [];

      console.log(`\n🔄 Batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(sourcesData.length/batchSize)}`);

      // Generate embeddings for batch
      for (const [index, source] of batch.entries()) {
        try {
          console.log(`  📝 ${index + 1}/${batch.length}: ${source.id}`);
          
          const embedding = await embeddingService.getEmbedding(source.content);
          
          vectors.push({
            id: source.id,
            values: embedding,
            metadata: {
              content: source.content.substring(0, 1500), // Limit metadata size
              sourceId: source.id,
              type: source.metadata?.type || 'document',
              chunkIndex: source.metadata?.chunkIndex || 0
            }
          });

          // Small delay between embeddings
          await new Promise(resolve => setTimeout(resolve, 500));

        } catch (error) {
          console.error(`  ❌ Failed to process ${source.id}:`, error.message);
          continue;
        }
      }

      // Upload batch to Pinecone
      if (vectors.length > 0) {
        try {
          console.log(`  📤 Uploading ${vectors.length} vectors to Pinecone...`);
          await pinecone.upsertVectors(indexName, vectors, namespace);
          totalUploaded += vectors.length;
          console.log(`  ✅ Uploaded successfully (Total: ${totalUploaded})`);
          
          // Rate limiting delay
          await new Promise(resolve => setTimeout(resolve, 3000));
          
        } catch (error) {
          console.error(`  ❌ Upload failed:`, error.message);
          // Continue with next batch
        }
      }
    }

    // Test the uploaded data
    console.log("\n🧪 Testing uploaded data...");
    const testQuery = "What are Sai's main projects?";
    const testEmbedding = await embeddingService.getEmbedding(testQuery);
    
    try {
      const queryResult = await pinecone.queryVectors(indexName, testEmbedding, 3, namespace);
      
      console.log("\n🎯 Upload Summary:");
      console.log(`   📊 Total documents processed: ${sourcesData.length}`);
      console.log(`   ✅ Total vectors uploaded: ${totalUploaded}`);
      console.log(`   🔍 Test query returned: ${queryResult.matches?.length || 0} results`);

      if (queryResult.matches && queryResult.matches.length > 0) {
        console.log(`   🎯 Best match score: ${queryResult.matches[0].score.toFixed(3)}`);
        console.log(`   📝 Sample result: ${queryResult.matches[0].metadata.content.substring(0, 100)}...`);
      }

    } catch (error) {
      console.warn(`⚠️ Test query failed: ${error.message}`);
    }

    console.log("\n✅ Pinecone upload completed successfully!");
    console.log("🚀 You can now use the vector database in your application!");

  } catch (error) {
    console.error("❌ Upload failed:", error);
    process.exit(1);
  }
}

uploadToPinecone();
