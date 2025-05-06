/*
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { PineconeClient } from '@pinecone-database/pinecone';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';

const prepareData = async () => {
  // Initialize Pinecone
  const pinecone = new PineconeClient();
  await pinecone.init({
    environment: process.env.PINECONE_ENVIRONMENT,
    apiKey: process.env.PINECONE_API_KEY,
  });

  // Load documents
  const loader = new DirectoryLoader('./data', {
    '.txt': (path) => new TextLoader(path),
  });
  const docs = await loader.load();

  // Create and populate vector store
  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
  await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), {
    pineconeIndex: index,
  });
};

prepareData().catch(console.error);
*/
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { getPineconeClient } from '../lib/pinecone';
import { getOpenAIEmbeddings } from '../lib/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';

async function prepareData() {
  try {
    // Initialize Pinecone
    const pinecone = await getPineconeClient();
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);

    // Validate index exists
    const indexesList = await pinecone.listIndexes();
    if (!indexesList.includes(process.env.PINECONE_INDEX_NAME)) {
      throw new Error(`Index ${process.env.PINECONE_INDEX_NAME} does not exist`);
    }

    // Load documents
    const loader = new DirectoryLoader('./data', {
      '.txt': (path) => new TextLoader(path),
    });
    
    console.log('Loading documents...');
    const docs = await loader.load();
    if (docs.length === 0) {
      throw new Error('No documents found in ./data directory');
    }
    console.log(`Loaded ${docs.length} documents`);

    // Create embeddings and store in Pinecone
    console.log('Creating embeddings and storing in Pinecone...');
    const namespace = process.env.PINECONE_NAMESPACE || 'default';
    await PineconeStore.fromDocuments(docs, getOpenAIEmbeddings(), {
      pineconeIndex: index,
      namespace,
    });

    console.log('Data preparation completed successfully!');
  } catch (error) {
    console.error('Error preparing data:', error);
    process.exit(1); // Exit with error code
  }
}

prepareData();