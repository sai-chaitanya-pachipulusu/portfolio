/**
 * Simple knowledge graph implementation for RAG
 * In a production environment, you would use a dedicated graph database like Neo4j
 */

/**
 * Create a knowledge graph from processed text sources
 * @param {Array} sources - Array of processed text sources with embeddings
 * @param {Object} embeddingsCache - Cache of precomputed embeddings (optional, for future use)
 * @returns {Object} - Knowledge graph instance
 */
async function createKnowledgeGraph(sources, embeddingsCache) {
  // Initialize graph structure
  const graph = new KnowledgeGraph();
  
  // Extract entities from sources
  const entities = await extractEntities(sources);
  
  // Add nodes for each source
  for (const source of sources) {
    graph.addNode(source.id, {
      type: 'chunk',
      content: source.content,
      metadata: source.metadata
    });
  }
  
  // Add entity nodes and connections to sources
  for (const entity of entities) {
    // Add entity node if it doesn't exist
    if (!graph.hasNode(entity.id)) {
      graph.addNode(entity.id, {
        type: 'entity',
        name: entity.name,
        category: entity.category
      });
    }
    
    // Connect entity to sources
    for (const sourceId of entity.sourceIds) {
      graph.addEdge(entity.id, sourceId, {
        type: 'mentioned_in',
        weight: entity.frequency || 1
      });
    }
  }
  
  // Connect related chunks based on similarity or sequence
  connectRelatedChunks(sources, graph);
  
  return graph;
}

/**
 * Extract entities from text sources
 * This is a simplified implementation - in production, use NER models
 * @param {Array} sources - Processed text sources
 * @returns {Array} - Extracted entities with their relationships
 */
async function extractEntities(sources) {
  const entities = [];
  const entityMap = new Map();
  
  // Common entity categories for ML/AI domain
  const categories = {
    TECH: ['python', 'pytorch', 'tensorflow', 'bert', 'gpt', 'llm', 'mistral', 'rag', 'aws', 'lambda', 'ec2', 'kubernetes', 'kafka', 'docker'],
    CONCEPT: ['machine learning', 'deep learning', 'natural language processing', 'nlp', 'artificial intelligence', 'ai', 'embeddings', 'fine-tuning', 'prompt engineering', 'computer vision'],
    METRIC: ['accuracy', 'f1', 'precision', 'recall', 'latency', 'throughput', 'cost']
  };
  
  // Flatten categories for easier lookup
  const categoryLookup = {};
  for (const [category, terms] of Object.entries(categories)) {
    for (const term of terms) {
      categoryLookup[term] = category;
    }
  }
  
  // Simple regex-based entity extraction
  for (const source of sources) {
    const content = source.content.toLowerCase();
    
    // Extract categorized entities
    for (const [term, category] of Object.entries(categoryLookup)) {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      const matches = content.match(regex) || [];
      
      if (matches.length > 0) {
        const entityId = `entity:${term}`;
        
        if (!entityMap.has(entityId)) {
          entityMap.set(entityId, {
            id: entityId,
            name: term,
            category,
            sourceIds: new Set([source.id]),
            frequency: matches.length
          });
        } else {
          const entity = entityMap.get(entityId);
          entity.sourceIds.add(source.id);
          entity.frequency += matches.length;
        }
      }
    }
    
    // Extract potential custom entities (capitalized multi-word phrases)
    const customEntityRegex = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/g;
    const customMatches = source.content.match(customEntityRegex) || [];
    
    for (const match of customMatches) {
      const normalizedName = match.toLowerCase();
      const entityId = `entity:custom:${normalizedName}`;
      
      if (!entityMap.has(entityId)) {
        entityMap.set(entityId, {
          id: entityId,
          name: match,
          category: 'CUSTOM',
          sourceIds: new Set([source.id]),
          frequency: 1
        });
      } else {
        const entity = entityMap.get(entityId);
        entity.sourceIds.add(source.id);
        entity.frequency += 1;
      }
    }
  }
  
  // Convert to array and normalize sourceIds to arrays
  for (const entity of entityMap.values()) {
    entities.push({
      ...entity,
      sourceIds: Array.from(entity.sourceIds)
    });
  }
  
  return entities;
}

/**
 * Connect related chunks based on similarity or sequence
 * @param {Array} sources - Processed text sources
 * @param {KnowledgeGraph} graph - Knowledge graph instance
 */
function connectRelatedChunks(sources, graph) {
  // Group sources by original document
  const documentChunks = {};
  
  for (const source of sources) {
    const docId = source.metadata.sourceId;
    if (!documentChunks[docId]) {
      documentChunks[docId] = [];
    }
    documentChunks[docId].push(source);
  }
  
  // Connect sequential chunks from the same document
  for (const chunks of Object.values(documentChunks)) {
    // Sort by chunk index
    chunks.sort((a, b) => a.metadata.chunkIndex - b.metadata.chunkIndex);
    
    // Connect sequential chunks
    for (let i = 0; i < chunks.length - 1; i++) {
      graph.addEdge(chunks[i].id, chunks[i + 1].id, {
        type: 'next_chunk',
        weight: 0.8
      });
      
      graph.addEdge(chunks[i + 1].id, chunks[i].id, {
        type: 'prev_chunk',
        weight: 0.8
      });
    }
  }
}

/**
 * Knowledge Graph class
 * Simple in-memory graph implementation
 */
class KnowledgeGraph {
  constructor() {
    this.nodes = new Map();
    this.edges = new Map();
    this.sources = []; // Store all content sources
  }
  
  /**
   * Add a node to the graph
   * @param {string} id - Node ID
   * @param {Object} data - Node data
   */
  addNode(id, data) {
    this.nodes.set(id, { id, ...data });
    
    // Keep track of content sources
    if (data.type === 'chunk') {
      this.sources.push({ id, content: data.content, metadata: data.metadata });
    }
  }
  
  /**
   * Check if a node exists
   * @param {string} id - Node ID
   * @returns {boolean} - Whether the node exists
   */
  hasNode(id) {
    return this.nodes.has(id);
  }
  
  /**
   * Add an edge between two nodes
   * @param {string} fromId - Source node ID
   * @param {string} toId - Target node ID
   * @param {Object} data - Edge data
   */
  addEdge(fromId, toId, data) {
    if (!this.nodes.has(fromId) || !this.nodes.has(toId)) {
      console.warn(`Cannot add edge between non-existent nodes: ${fromId} -> ${toId}`);
      return;
    }
    
    const edgeKey = `${fromId}->${toId}`;
    this.edges.set(edgeKey, { from: fromId, to: toId, ...data });
    
    // Ensure the adjacency list exists
    if (!this.edges.has(fromId)) {
      this.edges.set(fromId, new Set());
    }
    
    // Add to adjacency list
    this.edges.get(fromId).add(toId);
  }
  
  /**
   * Find nodes related to a set of source nodes via graph traversal
   * @param {Array} sourceIds - Starting node IDs
   * @param {number} maxDepth - Maximum traversal depth
   * @returns {Array} - Related nodes with relevance scores
   */
  findRelatedNodes(sourceIds, maxDepth = 2) {
    const visited = new Set();
    const results = [];
    
    // Breadth-first search
    const queue = sourceIds.map(id => ({ id, depth: 0, relevance: 1.0 }));
    
    while (queue.length > 0) {
      const { id, depth, relevance } = queue.shift();
      
      // Skip if already visited
      if (visited.has(id)) continue;
      visited.add(id);
      
      // Add to results if it's a content node
      const node = this.nodes.get(id);
      if (node && node.type === 'chunk') {
        results.push({
          id,
          content: node.content,
          metadata: node.metadata,
          relevance: relevance
        });
      }
      
      // Stop traversal if max depth reached
      if (depth >= maxDepth) continue;
      
      // Get neighbor edges
      const neighbors = this.getNeighbors(id);
      for (const [neighborId, edge] of neighbors) {
        // Calculate decaying relevance score based on edge weight and depth
        const neighborRelevance = relevance * (edge.weight || 0.5) * (1 / (depth + 1));
        
        // Only follow edges with sufficient relevance
        if (neighborRelevance > 0.2) {
          queue.push({
            id: neighborId,
            depth: depth + 1,
            relevance: neighborRelevance
          });
        }
      }
    }
    
    return results;
  }
  
  /**
   * Get all neighbors of a node with their edge data
   * @param {string} nodeId - Node ID
   * @returns {Array} - Array of [neighborId, edgeData] pairs
   */
  getNeighbors(nodeId) {
    const neighbors = [];
    
    for (const [edgeKey, edgeData] of this.edges.entries()) {
      if (edgeKey.startsWith(`${nodeId}->`)) {
        const toId = edgeKey.split('->')[1];
        neighbors.push([toId, edgeData]);
      }
    }
    
    return neighbors;
  }
  
  /**
   * Get all content sources
   * @returns {Array} - Array of content sources
   */
  getSources() {
    return this.sources;
  }
}

// Export using CommonJS
module.exports = {
  createKnowledgeGraph,
  KnowledgeGraph
}; 