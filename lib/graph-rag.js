const { getEmbeddings, cosineSimilarity } = require('./embeddings');
const { createKnowledgeGraph, KnowledgeGraph } = require('./knowledge-graph');
const fs = require('fs').promises; // Use promises API
const path = require('path');

// Define paths for loading/saving RAG data
// Use process.cwd() for reliable path resolution in different contexts (scripts vs API routes)
const dataDir = path.resolve(process.cwd(), 'data'); // Changed from path.join(__dirname, '..', 'data')
const outputGraphPath = path.join(dataDir, 'graph.json');
const outputEmbeddingsPath = path.join(dataDir, 'embeddings.json');
const outputSourcesPath = path.join(dataDir, 'processed_sources.json');

// Cache for storing computed embeddings and graph data (will be loaded from file)
let graphCache = null;
let embeddingsCache = {};
let processedSourcesCache = []; // Cache for processed sources

/**
 * Process text data sources, build embeddings and knowledge graph, and save them to files.
 * @param {Array} sources - Array of text sources with metadata
 */
async function initializeGraphRAG(sources) {
  try {
    console.log('Initializing Graph RAG system...');
    
    // Reset caches for initialization run
    embeddingsCache = {}; 
    processedSourcesCache = [];
    
    // 1. Generate embeddings for all sources
    const embeddingModel = getEmbeddings();
    
    // Process each source document
    for (const source of sources) {
      // Split content into paragraphs/chunks for better retrieval
      const chunks = splitIntoChunks(source.content, 200, 20); // Assuming splitIntoChunks exists below
      
      // Generate embeddings for each chunk
      for (const [index, chunk] of chunks.entries()) {
        let embedding = null;
        // No need to check cache here as we are rebuilding it
        try {
          embedding = await embeddingModel.embedQuery(chunk);
          embeddingsCache[chunk] = embedding; // Store in the temporary cache for this run
        } catch (error) {
          console.error(`Error generating embedding for chunk ${index} of ${source.id}:`, error);
          embeddingsCache[chunk] = null; // Mark as failed
        }
        
        processedSourcesCache.push({
          id: `${source.id}-${index}`,
          content: chunk,
          metadata: {
            ...source.metadata,
            chunkIndex: index,
            sourceId: source.id
          },
          // Embedding is stored in embeddingsCache by content key
        });
      }
    }
    console.log(`Generated embeddings for ${Object.keys(embeddingsCache).length} unique chunks.`);

    // 2. Build knowledge graph from processed sources
    const graph = await createKnowledgeGraph(processedSourcesCache, embeddingsCache);
    // graphCache = graph; // Don't store in memory cache during init script run
    console.log('Knowledge graph created.');

    // 3. Save data to files
    console.log('Saving RAG data to files...');
    
    // Save embeddings
    await fs.writeFile(outputEmbeddingsPath, JSON.stringify(embeddingsCache, null, 2));
    console.log(`Embeddings saved to ${outputEmbeddingsPath}`);

    // Save processed sources
    await fs.writeFile(outputSourcesPath, JSON.stringify(processedSourcesCache, null, 2));
    console.log(`Processed sources saved to ${outputSourcesPath}`);

    // Save graph (custom serialization for KnowledgeGraph class)
    const serializableGraph = {
        nodes: Array.from(graph.nodes.entries()), // Convert Map to Array
        edges: Array.from(graph.edges.entries()), // Convert Map to Array
        sources: graph.sources // Already an array
    };
    await fs.writeFile(outputGraphPath, JSON.stringify(serializableGraph, null, 2));
    console.log(`Custom graph saved to ${outputGraphPath}`);

    console.log('Graph RAG data initialization and saving complete.');
    
    // No return value needed for the script context
    // return { graphCache, embeddingsCache, processedSources }; 

  } catch (error) {
    console.error('Failed to initialize and save Graph RAG data:', error);
    throw error; // Re-throw error for the script to catch
  }
}

// --- Loading function (to be used by graphRAGSearch) ---
async function loadRAGData() {
    console.log(`Attempting to load RAG data from directory: ${dataDir}`); // Log resolved path
    try {
        // Load Embeddings
        if (Object.keys(embeddingsCache).length === 0) {
            console.log(`Loading embeddings from: ${outputEmbeddingsPath}`);
            const embeddingsData = await fs.readFile(outputEmbeddingsPath, 'utf-8');
            embeddingsCache = JSON.parse(embeddingsData);
            console.log(`Loaded ${Object.keys(embeddingsCache).length} embeddings from cache.`);
        }

        // Load Processed Sources
        if (processedSourcesCache.length === 0) {
            console.log(`Loading processed sources from: ${outputSourcesPath}`);
            const sourcesData = await fs.readFile(outputSourcesPath, 'utf-8');
            processedSourcesCache = JSON.parse(sourcesData);
            console.log(`Loaded ${processedSourcesCache.length} processed sources from cache.`);
        }

        // Load Graph
        if (!graphCache) {
            console.log(`Loading graph from: ${outputGraphPath}`);
            const graphData = await fs.readFile(outputGraphPath, 'utf-8');
            const serializedGraph = JSON.parse(graphData);
            
            // Reconstruct the custom KnowledgeGraph instance
            graphCache = new KnowledgeGraph(); // Instantiate the imported class
            graphCache.nodes = new Map(serializedGraph.nodes); // Restore Map from Array
            graphCache.edges = new Map(serializedGraph.edges); // Restore Map from Array
            graphCache.sources = serializedGraph.sources; // Restore Array

            console.log(`Custom Graph loaded from ${outputGraphPath} with ${graphCache.nodes.size} nodes.`);
        }
        console.log('RAG data loaded successfully.');
        return true;
    } catch (error) {
        // Add more specific error logging for file not found
        if (error.code === 'ENOENT') {
            console.error(`Failed to load RAG data: File not found at ${error.path}`);
            console.error('Please ensure you have run the initialization script (`node scripts/initialize-rag.js`) successfully.');
        } else {
            console.error('Failed to load RAG data from files:', error);
        }
        // Reset caches if loading fails to avoid partial state
        graphCache = null;
        embeddingsCache = {};
        processedSourcesCache = [];
        return false; // Indicate loading failed
    }
}

/**
 * Search for relevant information using both vector similarity and graph traversal
 * @param {string} query - User query
 * @param {number} maxResults - Maximum number of results to return
 * @returns {Array} - Array of relevant results with content and metadata
 */
async function graphRAGSearch(query, maxResults = 5) {
  try {
    // Ensure data is loaded
    if (!graphCache || Object.keys(embeddingsCache).length === 0) {
        const loaded = await loadRAGData();
        if (!loaded) {
             throw new Error('Graph RAG system data could not be loaded from files.');
        }
    }
    
    // 1. Generate embedding for the query
    const embeddingModel = getEmbeddings();
    const queryEmbedding = await embeddingModel.embedQuery(query);
    
    // 2. Find semantically similar nodes via vector search
    const semanticResults = findSimilarNodes(queryEmbedding, maxResults);
    
    // 3. Expand results using graph traversal
    // Need to ensure graphCache has the findRelatedNodes method after loading
    // It should, as we instantiated the KnowledgeGraph class
    const graphResults = graphCache.findRelatedNodes(semanticResults.map(r => r.id));
    
    // 4. Merge and rank results
    const mergedResults = mergeAndRankResults(semanticResults, graphResults);
    
    // 5. Return combined results
    return mergedResults.slice(0, maxResults);
  } catch (error) {
    console.error('Error in Graph RAG search:', error);
    // Fallback to simple text search
    return fallbackTextSearch(query, maxResults);
  }
}

/**
 * Split text into overlapping chunks for processing
 * @param {string} text - Text to split
 * @param {number} chunkSize - Target size of each chunk in words
 * @param {number} overlap - Number of words to overlap between chunks
 * @returns {Array} - Array of text chunks
 */
function splitIntoChunks(text, chunkSize = 200, overlap = 20) {
  // Simple splitting by paragraphs first
  const paragraphs = text.split(/\n\s*\n/);
  const chunks = [];
  let currentChunk = [];
  let currentSize = 0;
  
  for (const paragraph of paragraphs) {
    const words = paragraph.split(/\s+/);
    
    if (currentSize + words.length <= chunkSize) {
      // Add to current chunk
      currentChunk.push(paragraph);
      currentSize += words.length;
    } else {
      // Finish current chunk
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.join('\n\n'));
      }
      
      // Start new chunk with overlap
      if (overlap > 0 && currentChunk.length > 0) {
        // Take last few sentences for overlap
        const lastParagraph = currentChunk[currentChunk.length - 1];
        const sentences = lastParagraph.split(/[.!?]\s+/);
        const overlapText = sentences.slice(-2).join('. ');
        
        currentChunk = [overlapText, paragraph];
        currentSize = overlapText.split(/\s+/).length + words.length;
      } else {
        currentChunk = [paragraph];
        currentSize = words.length;
      }
    }
  }
  
  // Add final chunk
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join('\n\n'));
  }
  
  return chunks;
}

/**
 * Find semantically similar nodes based on vector similarity
 * @param {Array} queryEmbedding - Query embedding vector
 * @param {number} maxResults - Maximum number of results
 * @returns {Array} - Ranked array of similar nodes
 */
function findSimilarNodes(queryEmbedding, maxResults) {
  // Ensure embeddings are loaded (redundant if graphRAGSearch loads, but safe)
  if (Object.keys(embeddingsCache).length === 0) {
      console.warn('Embeddings cache is empty in findSimilarNodes. Attempting to load.');
      if (!embeddingsCache || Object.keys(embeddingsCache).length === 0) {
        console.error("Embeddings cache is empty and couldn't be loaded synchronously.");
        return [];
      }
  }
  const results = [];
  
  for (const [content, embedding] of Object.entries(embeddingsCache)) {
    if (!embedding) continue; // Skip failed embeddings
    
    const similarity = cosineSimilarity(queryEmbedding, embedding);
    if (similarity > 0.7) { // Threshold for relevance
      results.push({
        content,
        similarity,
        // Find the source that contains this content
        ...findSourceForContent(content)
      });
    }
  }
  
  // Sort by similarity (descending)
  return results.sort((a, b) => b.similarity - a.similarity).slice(0, maxResults);
}

/**
 * Find source information for a given content chunk
 * @param {string} content - Content to find source for
 * @returns {Object} - Source information including ID and metadata
 */
function findSourceForContent(content) {
    // Use the processedSourcesCache instead of graphCache.getSources()
    // Ensure processed sources are loaded (redundant check, handled by graphRAGSearch)
    if (processedSourcesCache.length === 0) {
        console.error("Processed sources cache is empty in findSourceForContent.");
        return { id: 'unknown-loading-error', metadata: {} };
    }

    for (const source of processedSourcesCache) {
        if (source.content === content) {
            return {
                id: source.id,
                metadata: source.metadata
            };
        }
    }
  
  return { id: 'unknown-not-found', metadata: {} };
}

/**
 * Merge semantic and graph results with ranking
 * @param {Array} semanticResults - Results from semantic search
 * @param {Array} graphResults - Results from graph traversal
 * @returns {Array} - Merged and ranked results
 */
function mergeAndRankResults(semanticResults, graphResults) {
  const seenIds = new Set();
  const combinedResults = [];
  
  // Add semantic results first (they're already ranked)
  for (const result of semanticResults) {
    seenIds.add(result.id);
    combinedResults.push({
      ...result,
      source: 'semantic'
    });
  }
  
  // Add unique graph results
  for (const result of graphResults) {
    if (!seenIds.has(result.id)) {
      seenIds.add(result.id);
      combinedResults.push({
        ...result,
        source: 'graph',
        // Add a graph relevance score
        graphRelevance: result.relevance || 0.5
      });
    }
  }
  
  // Final ranking: Combine semantic similarity with graph relevance
  return combinedResults.sort((a, b) => {
    const scoreA = a.similarity || 0 + (a.graphRelevance || 0);
    const scoreB = b.similarity || 0 + (b.graphRelevance || 0);
    return scoreB - scoreA;
  });
}

/**
 * Fallback text search when vector or graph search fails
 * @param {string} query - Search query
 * @param {number} maxResults - Maximum results to return
 * @returns {Array} - Search results
 */
function fallbackTextSearch(query, maxResults) {
    // Ensure processed sources are loaded (redundant check, handled by graphRAGSearch)
    if (processedSourcesCache.length === 0) {
        console.error("Processed sources cache is empty in fallbackTextSearch.");
        return [];
    }

  const results = [];
  const keywords = query.toLowerCase().split(/\s+/);
  
  // Simple keyword matching across processed sources
  for (const source of processedSourcesCache) { // Use loaded processed sources
    const content = source.content.toLowerCase();
    let matchCount = 0;
    
    for (const keyword of keywords) {
      if (content.includes(keyword)) {
        matchCount++;
      }
    }
    
    if (matchCount > 0) {
      results.push({
        id: source.id,
        content: source.content,
        metadata: source.metadata,
        relevance: matchCount / keywords.length
      });
    }
  }
  
  return results
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, maxResults);
}

// Export functions using CommonJS
module.exports = {
  initializeGraphRAG,
  graphRAGSearch
}; 