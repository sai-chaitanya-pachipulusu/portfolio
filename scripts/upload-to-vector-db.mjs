import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { getEmbeddingService } from '../lib/embeddings.js';
import fs from 'fs/promises';

async function uploadToVectorDB() {
  console.log("🚀 Uploading data to vector database...");

  try {
    // Initialize Pinecone
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    const embeddingService = getEmbeddingService();

    // Load your processed data
    const sourcesData = JSON.parse(
      await fs.readFile('./data/processed_sources.json', 'utf-8')
    );

    console.log(`📊 Processing ${sourcesData.length} documents...`);

    // Prepare documents for vector store
    const documents = sourcesData.map(source => ({
      pageContent: source.content,
      metadata: {
        sourceId: source.id,
        ...source.metadata
      }
    }));

    // Create vector store and upload
    await PineconeStore.fromDocuments(
      documents,
      embeddingService,
      {
        pineconeIndex: pinecone.Index("sai-portfolio-rag"),
        textKey: "text",
        namespace: "sai-portfolio",
      }
    );

    console.log("✅ Data uploaded to vector database successfully!");

  } catch (error) {
    console.error("❌ Upload failed:", error);
    process.exit(1);
  }
}

uploadToVectorDB();
