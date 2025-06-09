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
  const graph = new KnowledgeGraph();
  const extractor = new EntityExtractor();
  
  console.log('Building knowledge graph...');
  
  // Extract entities
  const entities = await extractor.extractEntities(sources);
  console.log(`Extracted ${entities.length} entities`);
  
  // Add source nodes
  for (const source of sources) {
    graph.addNode(source.id, {
      type: 'chunk',
      content: source.content,
      metadata: source.metadata
    });
  }
  
  // Add entity nodes and connections
  for (const entity of entities) {
    graph.addNode(entity.id, {
      type: 'entity',
      name: entity.name,
      category: entity.category,
      frequency: entity.frequency
    });
    
    // Connect entity to sources
    for (const sourceId of entity.sourceIds) {
      graph.addEdge(entity.id, sourceId, {
        type: 'mentioned_in',
        weight: Math.min(entity.frequency * entity.weight, 1.0)
      });
    }
  }
  
  // Connect related chunks
  connectRelatedChunks(sources, graph);
  
  console.log('Knowledge graph created:', graph.getStats());
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
    this.sources = [];
    this.entityIndex = new Map(); // For faster entity lookup
    this.adjacencyList = new Map(); // For faster traversal
  }
  
  /**
   * Add a node to the graph
   * @param {string} id - Node ID
   * @param {Object} data - Node data
   */
  addNode(id, data) {
    this.nodes.set(id, { id, ...data });
    
    // Initialize adjacency list
    if (!this.adjacencyList.has(id)) {
      this.adjacencyList.set(id, new Set());
    }
    
    // Index entities
    if (data.type === 'entity') {
      this.entityIndex.set(data.name.toLowerCase(), id);
    }
    
    // Track content sources
    if (data.type === 'chunk') {
      this.sources.push({
        id,
        content: data.content,
        metadata: data.metadata
      });
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
  addEdge(fromId, toId, data = {}) {
    if (!this.hasNode(fromId) || !this.hasNode(toId)) {
      console.warn(`Cannot add edge: missing nodes ${fromId} -> ${toId}`);
      return;
    }

    const edgeKey = `${fromId}->${toId}`;
    this.edges.set(edgeKey, {
      from: fromId,
      to: toId,
      weight: data.weight || 1.0,
      type: data.type || 'related',
      ...data
    });

    // Update adjacency list
    this.adjacencyList.get(fromId).add(toId);
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
    
    // BFS with relevance scoring
    const queue = sourceIds.map(id => ({
      id,
      depth: 0,
      relevance: 1.0,
      path: [id]
    }));

    while (queue.length > 0) {
      const { id, depth, relevance, path } = queue.shift();

      if (visited.has(id) || depth > maxDepth) continue;
      visited.add(id);

      const node = this.nodes.get(id);
      if (node && node.type === 'chunk') {
        results.push({
          id,
          content: node.content,
          metadata: node.metadata,
          relevance,
          depth,
          discoveryPath: path
        });
      }

      // Explore neighbors
      const neighbors = this.adjacencyList.get(id) || new Set();
      for (const neighborId of neighbors) {
        if (!visited.has(neighborId)) {
          const edge = this.edges.get(`${id}->${neighborId}`);
          const edgeWeight = edge ? edge.weight : 0.5;
          
          // Calculate decaying relevance
          const newRelevance = relevance * edgeWeight * (1 / (depth + 2));
          
          if (newRelevance > 0.1) { // Relevance threshold
            queue.push({
              id: neighborId,
              depth: depth + 1,
              relevance: newRelevance,
              path: [...path, neighborId]
            });
          }
        }
      }
    }

    return results
      .filter(r => r.depth > 0) // Exclude source nodes
      .sort((a, b) => b.relevance - a.relevance);
  }
  
  getEntityById(entityName) {
    return this.entityIndex.get(entityName.toLowerCase());
  }
  
  getNodesByType(type) {
    return Array.from(this.nodes.values()).filter(node => node.type === type);
  }
  
  getStats() {
    const nodeTypes = {};
    const edgeTypes = {};
    
    for (const node of this.nodes.values()) {
      nodeTypes[node.type] = (nodeTypes[node.type] || 0) + 1;
    }
    
    for (const edge of this.edges.values()) {
      edgeTypes[edge.type] = (edgeTypes[edge.type] || 0) + 1;
    }

    return {
      nodeCount: this.nodes.size,
      edgeCount: this.edges.size,
      nodeTypes,
      edgeTypes,
      sourceCount: this.sources.length
    };
  }
}

class EntityExtractor {
  constructor() {
    // Enhanced entity patterns for ML/AI domain
    this.patterns = {
      TECHNOLOGY: {
        terms: [
          'python', 'pytorch', 'tensorflow', 'huggingface', 'transformers',
          'bert', 'gpt', 'llama', 'mistral', 'claude', 'openai',
          'aws', 'azure', 'gcp', 'lambda', 'ec2', 'kubernetes', 'docker',
          'react', 'nextjs', 'nodejs', 'javascript', 'typescript'
        ],
        weight: 1.0
      },
      CONCEPT: {
        terms: [
          'machine learning', 'deep learning', 'artificial intelligence',
          'natural language processing', 'computer vision', 'neural networks',
          'rag', 'retrieval augmented generation', 'embeddings', 'fine-tuning',
          'prompt engineering', 'knowledge graphs'
        ],
        weight: 0.9
      },
      METRIC: {
        terms: ['accuracy', 'precision', 'recall', 'f1-score', 'loss', 'latency'],
        weight: 0.7
      }
    };
  }

  async extractEntities(sources) {
    const entityMap = new Map();
    
    for (const source of sources) {
      const content = source.content.toLowerCase();
      
      // Extract known entities
      for (const [category, config] of Object.entries(this.patterns)) {
        for (const term of config.terms) {
          const regex = new RegExp(`\\b${this.escapeRegex(term)}\\b`, 'gi');
          const matches = content.match(regex) || [];
          
          if (matches.length > 0) {
            const entityId = `entity:${category.toLowerCase()}:${term}`;
            
            if (!entityMap.has(entityId)) {
              entityMap.set(entityId, {
                id: entityId,
                name: term,
                category,
                sourceIds: new Set([source.id]),
                frequency: matches.length,
                weight: config.weight
              });
            } else {
              const entity = entityMap.get(entityId);
              entity.sourceIds.add(source.id);
              entity.frequency += matches.length;
            }
          }
        }
      }
      
      // Extract custom entities (proper nouns, brand names)
      const customEntities = this.extractCustomEntities(source.content);
      for (const entity of customEntities) {
        const entityId = `entity:custom:${entity.name.toLowerCase()}`;
        
        if (!entityMap.has(entityId)) {
          entityMap.set(entityId, {
            id: entityId,
            name: entity.name,
            category: 'CUSTOM',
            sourceIds: new Set([source.id]),
            frequency: 1,
            weight: 0.5
          });
        } else {
          const existing = entityMap.get(entityId);
          existing.sourceIds.add(source.id);
          existing.frequency += 1;
        }
      }
    }

    // Convert to array and normalize
    return Array.from(entityMap.values()).map(entity => ({
      ...entity,
      sourceIds: Array.from(entity.sourceIds)
    }));
  }

  extractCustomEntities(content) {
    const entities = [];
    
    // Extract proper nouns and acronyms
    const patterns = [
      /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g, // Multi-word proper nouns
      /\b([A-Z]{2,})\b/g, // Acronyms
    ];

    for (const pattern of patterns) {
      const matches = content.match(pattern) || [];
      for (const match of matches) {
        if (match.length > 2) { // Filter out short matches
          entities.push({ name: match });
        }
      }
    }

    return entities;
  }

  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

// Export using CommonJS
module.exports = {
  createKnowledgeGraph,
  KnowledgeGraph,
  EntityExtractor
}; 