import { PineconeClient } from '@pinecone-database/pinecone';
import { getPineconeClient } from './pinecone.js';

let pinecone = null;

export async function getPineconeClient() {
  if (!pinecone) {
    pinecone = new PineconeClient();
    await pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT,
      apiKey: process.env.PINECONE_API_KEY,
    });
  }
  return pinecone;
}