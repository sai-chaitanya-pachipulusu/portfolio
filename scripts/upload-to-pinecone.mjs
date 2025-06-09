import fs from 'fs/promises';

// Direct Pinecone API client (no package dependencies)
class PineconeAPI {
  constructor(apiKey, environment = 'gcp-starter') {
    this.apiKey = apiKey;
    this.environment = environment;
    this.baseUrl = 'https://api.pinecone.io';
  }

  async createIndex(name, dimension = 384) {
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

    console.log(`✅ Index ${name} created`);
    return true;
  }

  async listIndexes() {
    const response = await fetch(`${this.baseUrl}/indexes`, {
      headers: {
        'Api-Key': this.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to list indexes: ${response.status}`);
    }

    return await response.json();
  }

  async getIndexHost(indexName) {
    const response = await fetch(`${this.baseUrl}/indexes/${indexName}`, {
      headers: {
        'Api-Key': this.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get index info: ${response.status}`);
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
  console.log("🚀 Starting Pinecone upload...");

  try {
    // Check environment
    if (!process.env.PINECONE_API_KEY) {
      throw new Error("PINECONE_API_KEY environment variable required");
    }

    const pinecone = new PineconeAPI(process.env.PINECONE_API_KEY);
    const indexName = "sai-portfolio-rag";
    const namespace = "sai-portfolio";

    // Create index if it doesn't exist
    await pinecone.createIndex(indexName, 384);
    
    // Wait a bit for index to be ready
    console.log("⏳ Waiting for index to be ready...");
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Dynamic import for embeddings service
    const { getEmbeddingService } = await import('../lib/embeddings.js');
    const embeddingService = getEmbeddingService();

    // Load processed sources
    const sourcesData = JSON.parse(
      await fs.readFile('./data/processed_sources.json', 'utf-8')
    );

    console.log(`📊 Processing ${sourcesData.length} documents...`);

    // Process in batches
    const batchSize = 20;
    let totalUploaded = 0;

    for (let i = 0; i < sourcesData.length; i += batchSize) {
      const batch = sourcesData.slice(i, i + batchSize);
      const vectors = [];

      console.log(`🔄 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(sourcesData.length/batchSize)}`);

      // Generate embeddings for batch
      for (const source of batch) {
        try {
          console.log(`  📝 Processing: ${source.id}`);
          
          const embedding = await embeddingService.getEmbedding(source.content);
          
          vectors.push({
            id: source.id,
            values: embedding,
            metadata: {
              content: source.content.substring(0, 2000), // Limit size
              sourceId: source.id,
              type: source.metadata?.type || 'document',
              chunkIndex: source.metadata?.chunkIndex || 0
            }
          });

        } catch (error) {
          console.error(`  ❌ Failed to process ${source.id}:`, error.message);
          continue;
        }
      }

      // Upload batch
      if (vectors.length > 0) {
        try {
          await pinecone.upsertVectors(indexName, vectors, namespace);
          totalUploaded += vectors.length;
          console.log(`  ✅ Uploaded ${vectors.length} vectors (Total: ${totalUploaded})`);
          
          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 2000));
          
        } catch (error) {
          console.error(`  ❌ Upload failed:`, error.message);
        }
      }
    }

    // Test query
    console.log("\n🧪 Testing with sample query...");
    const testQuery = "What projects has Sai worked on?";
    const testEmbedding = await embeddingService.getEmbedding(testQuery);
    const queryResult = await pinecone.queryVectors(indexName, testEmbedding, 3, namespace);

    console.log("\n🎯 Upload Summary:");
    console.log(`   📊 Total documents processed: ${sourcesData.length}`);
    console.log(`   ✅ Total vectors uploaded: ${totalUploaded}`);
    console.log(`   🔍 Test query returned: ${queryResult.matches?.length || 0} results`);

    if (queryResult.matches && queryResult.matches.length > 0) {
      console.log(`   🎯 Top result score: ${queryResult.matches[0].score}`);
    }

    console.log("\n✅ Pinecone upload completed successfully!");

  } catch (error) {
    console.error("❌ Upload failed:", error);
    process.exit(1);
  }
}

uploadToPinecone();
