// lib/graph-rag.js - Convert to ES6 modules
import { getEmbeddingService, cosineSimilarity } from './embeddings.js';
import { createKnowledgeGraph, KnowledgeGraph } from './knowledge-graph.js';
import fs from 'fs/promises';
import path from 'path';

class GraphRAGSystem {
  constructor() {
    this.dataDir = path.resolve(process.cwd(), 'data');
    this.graphCache = null;
    this.embeddingsCache = {};
    this.processedSourcesCache = [];
    this.isInitialized = false;
  }

  get paths() {
    return {
      graph: path.join(this.dataDir, 'graph.json'),
      embeddings: path.join(this.dataDir, 'embeddings.json'),
      sources: path.join(this.dataDir, 'processed_sources.json')
    };
  }

  async initialize(sources) {
    try {
      console.log('Initializing Graph RAG system...');
      
      // Reset caches
      this.embeddingsCache = {};
      this.processedSourcesCache = [];
      
      // Process sources with better chunking
      await this.processSources(sources);
      
      // Build knowledge graph
      const graph = await createKnowledgeGraph(this.processedSourcesCache, this.embeddingsCache);
      
      // Save all data
      await this.saveData(graph);
      
      console.log('Graph RAG initialization complete');
      this.isInitialized = true;
      
    } catch (error) {
      console.error('Failed to initialize Graph RAG:', error);
      throw error;
    }
  }

  async processSources(sources) {
    const embeddingModel = getEmbeddingService();
    let processedCount = 0;
    
    console.log(`Processing ${sources.length} sources...`);
    
    for (const source of sources) {
      try {
        // Improved chunking with overlap
        const chunks = this.smartChunking(source.content, {
          maxChunkSize: 300,
          overlap: 50,
          preserveSentences: true
        });
        
        // Process chunks with batch optimization
        for (const [index, chunk] of chunks.entries()) {
          try {
            const embedding = await embeddingModel.embedQuery(chunk);
            this.embeddingsCache[chunk] = embedding;
            
            this.processedSourcesCache.push({
              id: `${source.id}-${index}`,
              content: chunk,
              metadata: {
                ...source.metadata,
                chunkIndex: index,
                sourceId: source.id,
                chunkSize: chunk.split(/\s+/).length
              }
            });
            
            processedCount++;
            
            // Progress logging
            if (processedCount % 10 === 0) {
              console.log(`Processed ${processedCount} chunks...`);
            }
            
          } catch (error) {
            console.warn(`Failed to process chunk ${index} of ${source.id}:`, error.message);
            this.embeddingsCache[chunk] = null;
          }
        }
        
      } catch (error) {
        console.error(`Failed to process source ${source.id}:`, error);
      }
    }
    
    console.log(`Generated embeddings for ${Object.keys(this.embeddingsCache).length} chunks`);
  }

  smartChunking(text, options = {}) {
    const {
      maxChunkSize = 300,
      overlap = 50,
      preserveSentences = true
    } = options;
    
    // Split into sentences first
    const sentences = text.split(/(?<=[.!?])\s+/);
    const chunks = [];
    let currentChunk = [];
    let currentSize = 0;
    
    for (const sentence of sentences) {
      const words = sentence.split(/\s+/);
      
      if (currentSize + words.length <= maxChunkSize) {
        currentChunk.push(sentence);
        currentSize += words.length;
      } else {
        // Finish current chunk
        if (currentChunk.length > 0) {
          chunks.push(currentChunk.join(' '));
        }
        
        // Start new chunk with overlap
        const overlapSentences = this.getOverlapSentences(currentChunk, overlap);
        currentChunk = [...overlapSentences, sentence];
        currentSize = currentChunk.reduce((sum, s) => sum + s.split(/\s+/).length, 0);
      }
    }
    
    // Add final chunk
    if (currentChunk.length > 0) {
      chunks.push(currentChunk.join(' '));
    }
    
    return chunks.filter(chunk => chunk.trim().length > 20); // Filter out tiny chunks
  }

  getOverlapSentences(sentences, overlapWords) {
    const overlap = [];
    let wordCount = 0;
    
    for (let i = sentences.length - 1; i >= 0 && wordCount < overlapWords; i--) {
      const words = sentences[i].split(/\s+/).length;
      overlap.unshift(sentences[i]);
      wordCount += words;
    }
    
    return overlap;
  }

  async saveData(graph) {
    try {
      // Ensure data directory exists
      await fs.mkdir(this.dataDir, { recursive: true });
      
      // Save with atomic writes
      const saves = [
        this.atomicWrite(this.paths.embeddings, this.embeddingsCache),
        this.atomicWrite(this.paths.sources, this.processedSourcesCache),
        this.atomicWrite(this.paths.graph, this.serializeGraph(graph))
      ];
      
      await Promise.all(saves);
      console.log('All data saved successfully');
      
    } catch (error) {
      console.error('Failed to save data:', error);
      throw error;
    }
  }

  async atomicWrite(filePath, data) {
    const tempPath = `${filePath}.tmp`;
    await fs.writeFile(tempPath, JSON.stringify(data, null, 2));
    await fs.rename(tempPath, filePath);
  }

  serializeGraph(graph) {
    return {
      nodes: Array.from(graph.nodes.entries()),
      edges: Array.from(graph.edges.entries()),
      sources: graph.sources,
      metadata: {
        created: new Date().toISOString(),
        nodeCount: graph.nodes.size,
        edgeCount: graph.edges.size
      }
    };
  }

  async loadData() {
    console.log('Loading RAG data...');
    
    try {
      // More robust path resolution
      const dataDir = process.cwd() + '/data';
      console.log('Data directory:', dataDir);
      
      // Check files exist and log their paths
      const embeddingsPath = dataDir + '/embeddings.json';
      const sourcesPath = dataDir + '/processed_sources.json';
      const graphPath = dataDir + '/graph.json';
      
      console.log('Looking for files:', { embeddingsPath, sourcesPath, graphPath });
      
      // Load all data in parallel with better error handling
      const [embeddingsData, sourcesData, graphData] = await Promise.all([
        fs.readFile(embeddingsPath, 'utf-8').then(JSON.parse).catch(e => {
          console.error('Failed to load embeddings:', e.message);
          throw e;
        }),
        fs.readFile(sourcesPath, 'utf-8').then(JSON.parse).catch(e => {
          console.error('Failed to load sources:', e.message); 
          throw e;
        }),
        fs.readFile(graphPath, 'utf-8').then(JSON.parse).catch(e => {
          console.error('Failed to load graph:', e.message);
          throw e;
        })
      ]);

      // Restore caches
      this.embeddingsCache = embeddingsData;
      this.processedSourcesCache = sourcesData;
      
      // Reconstruct graph
      this.graphCache = new KnowledgeGraph();
      this.graphCache.nodes = new Map(graphData.nodes);
      this.graphCache.edges = new Map(graphData.edges);
      this.graphCache.sources = graphData.sources;

      console.log(`Loaded Graph RAG: ${Object.keys(this.embeddingsCache).length} embeddings, ${this.graphCache.nodes.size} nodes`);
      this.isInitialized = true;
      
      return true;
    } catch (error) {
      console.error('Failed to load Graph RAG data:', error);
      return false;
    }
  }

  async search(query, options = {}) {
    const {
      maxResults = 5,
      similarityThreshold = 0.6,
      includeGraphTraversal = true,
      contextWindow = 3
    } = options;

    try {
      // Ensure data is loaded
      if (!this.isInitialized) {
        const loaded = await this.loadData();
        if (!loaded) {
          throw new Error('Could not load GraphRAG data');
        }
      }

      // Get query embedding
      const embeddingService = getEmbeddingService();
      const queryEmbedding = await embeddingService.embedQuery(query);

      // Vector similarity search
      const semanticResults = this.findSimilarNodes(queryEmbedding, maxResults * 2, similarityThreshold);

      let finalResults = semanticResults;

      // Enhance with graph traversal
      if (includeGraphTraversal && this.graphCache && semanticResults.length > 0) {
        console.log('Enhancing with graph traversal...');

        const graphResults = this.graphCache.findRelatedNodes(
          semanticResults.slice(0, 3).map(r => r.id), // Only use top 3 for graph traversal
          contextWindow
        );

        console.log(`Found ${graphResults.length} graph-related nodes`);
        finalResults = this.mergeAndRankResults(semanticResults, graphResults);
      }

      const topResults = finalResults.slice(0, maxResults);

      return {
        results: topResults,
        context: topResults.map(r => r.content).join('\n\n'),
        sources: [...new Set(topResults.map(r => r.metadata?.sourceId).filter(Boolean))],
        confidence: topResults.length > 0 ? Math.round(topResults[0].similarity * 100) : 0,
        searchType: includeGraphTraversal ? 'graph-enhanced' : 'vector-only',
        resultCount: finalResults.length
      };

    } catch (error) {
      console.error('Graph RAG search failed:', error);
      return this.fallbackSearch(query, maxResults);
    }
  }

  findSimilarNodes(queryEmbedding, maxResults, threshold) {
    const results = [];
    
    for (const [content, embedding] of Object.entries(this.embeddingsCache)) {
      if (!embedding) continue;
      
      const similarity = cosineSimilarity(queryEmbedding, embedding);
      if (similarity >= threshold) {
        const sourceInfo = this.findSourceForContent(content);
        results.push({
          content,
          similarity,
          ...sourceInfo
        });
      }
    }
    
    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, maxResults * 2); // Get more for graph enhancement
  }

  findSourceForContent(content) {
    const source = this.processedSourcesCache.find(s => s.content === content);
    return source ? {
      id: source.id,
      metadata: source.metadata
    } : {
      id: 'unknown',
      metadata: {}
    };
  }

  mergeAndRankResults(semanticResults, graphResults) {
    const seenIds = new Set();
    const combined = [];
    
    // Add semantic results (prioritized)
    for (const result of semanticResults) {
      seenIds.add(result.id);
      combined.push({
        ...result,
        source: 'semantic',
        finalScore: result.similarity
      });
    }
    
    // Add unique graph results
    for (const result of graphResults) {
      if (!seenIds.has(result.id)) {
        seenIds.add(result.id);
        combined.push({
          ...result,
          source: 'graph',
          finalScore: (result.relevance || 0.5) * 0.8 // Slightly lower priority
        });
      }
    }
    
    return combined.sort((a, b) => b.finalScore - a.finalScore);
  }

  fallbackSearch(query, maxResults) {
    console.warn('Using fallback text search');
    
    const results = [];
    const keywords = query.toLowerCase().split(/\s+/);
    
    for (const source of this.processedSourcesCache) {
      const content = source.content.toLowerCase();
      let matchScore = 0;
      
      for (const keyword of keywords) {
        if (content.includes(keyword)) {
          matchScore += 1;
        }
      }
      
      if (matchScore > 0) {
        results.push({
          id: source.id,
          content: source.content,
          metadata: source.metadata,
          similarity: matchScore / keywords.length,
          source: 'fallback'
        });
      }
    }
    
    return {
      results: results
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, maxResults),
      query,
      resultCount: results.length,
      isFallback: true
    };
  }
}

// Create singleton instance
// Export using ES6 syntax
export const graphRAGSystem = new GraphRAGSystem();

// Export functions for backward compatibility
export async function initializeGraphRAG(sources) {
  return graphRAGSystem.initialize(sources);
}

export async function graphRAGSearch(query, maxResults = 5) {
  const searchResult = await graphRAGSystem.search(query, { maxResults });
  return searchResult.results; // Return just results for compatibility
}

export { GraphRAGSystem };
export default graphRAGSystem;