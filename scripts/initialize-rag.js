const fs = require('fs').promises;
const path = require('path');
const { initializeGraphRAG } = require('../lib/graph-rag');

// Define paths relative to the project root
const dataDir = path.join(__dirname, '..', 'data');
const sources = [
  { id: 'resume', filePath: path.join(dataDir, 'resume.txt'), metadata: { sourceType: 'resume' } },
  { id: 'medium', filePath: path.join(dataDir, 'medium_articles.txt'), metadata: { sourceType: 'medium' } },
  { id: 'twitter', filePath: path.join(dataDir, 'twitter_posts.txt'), metadata: { sourceType: 'twitter' } },
];
const outputGraphPath = path.join(dataDir, 'graph.json');
const outputEmbeddingsPath = path.join(dataDir, 'embeddings.json');
const outputSourcesPath = path.join(dataDir, 'processed_sources.json');

async function loadSourceContent(source) {
  try {
    const content = await fs.readFile(source.filePath, 'utf-8');
    return {
      ...source,
      content: content,
    };
  } catch (error) {
    console.error(`Error loading source file ${source.filePath}:`, error);
    return {
      ...source,
      content: '', // Return empty content on error
    };
  }
}

async function main() {
  console.log('Starting RAG initialization script...');

  // 1. Load content for all sources
  const sourcesWithContent = await Promise.all(sources.map(loadSourceContent));
  const validSources = sourcesWithContent.filter(s => s.content); // Filter out sources that failed to load

  if (validSources.length === 0) {
    console.error('No valid source content loaded. Exiting initialization.');
    process.exit(1);
  }

  console.log(`Loaded content for ${validSources.length} sources.`);

  // 2. Initialize Graph RAG (this will now also save files)
  try {
    await initializeGraphRAG(validSources); // Assuming initializeGraphRAG now saves the files
    console.log(`RAG data successfully generated and saved to:`);
    console.log(` - Graph: ${outputGraphPath}`);
    console.log(` - Embeddings: ${outputEmbeddingsPath}`);
    console.log(` - Processed Sources: ${outputSourcesPath}`); // Added processed sources saving
    console.log('Initialization complete.');
  } catch (error) {
    console.error('Error during RAG initialization:', error);
    process.exit(1);
  }
}

main(); 