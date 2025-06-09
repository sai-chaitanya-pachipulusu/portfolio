import { vectorService } from './vectorService.js';
import { getLLMService } from './llm.js';
import fs from 'fs/promises';
import path from 'path';

class GraphRAGService {
  constructor() {
    this.vectorService = vectorService;
    this.llm = getLLMService();
    this.knowledgeGraph = null;
    this.communities = new Map();
    this.entityMap = new Map();
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Load pre-computed graph
      await this.loadKnowledgeGraph();
      
      // Initialize vector service
      await this.vectorService.initialize();
      
      this.isInitialized = true;
      console.log("✅ Graph RAG Service initialized");

    } catch (error) {
      console.error("❌ Graph RAG initialization failed:", error);
      // Continue with vector-only mode
      await this.vectorService.initialize();
      this.isInitialized = true;
    }
  }

  async loadKnowledgeGraph() {
    try {
      const graphPath = path.join(process.cwd(), 'data', 'graph.json');
      const graphData = JSON.parse(await fs.readFile(graphPath, 'utf-8'));
      
      this.knowledgeGraph = {
        nodes: new Map(graphData.nodes || []),
        edges: new Map(graphData.edges || []),
        communities: new Map(graphData.communities || [])
      };

      console.log(`📊 Loaded graph: ${this.knowledgeGraph.nodes.size} nodes, ${this.knowledgeGraph.edges.size} edges`);

    } catch (error) {
      console.warn("⚠️ Could not load knowledge graph:", error.message);
      this.knowledgeGraph = { nodes: new Map(), edges: new Map(), communities: new Map() };
    }
  }

  async search(query, options = {}) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const { maxResults = 5, useGraphTraversal = true, communityLevel = 1 } = options;

    try {
      console.log(`🔍 Graph RAG search: "${query}"`);

      // Phase 1: Vector similarity search
      const vectorResults = await this.vectorService.hybridSearch(query, {
        k: maxResults * 2 // Get more candidates for graph enhancement
      });

      console.log(`📊 Vector search found ${vectorResults.length} results`);

      if (vectorResults.length === 0) {
        return this.getFallbackResponse(query);
      }

      let finalResults = vectorResults;

      // Phase 2: Graph-based enhancement (if graph available)
      if (useGraphTraversal && this.knowledgeGraph.nodes.size > 0) {
        const graphEnhanced = await this.enhanceWithGraph(vectorResults, query);
        finalResults = this.rerankResults(vectorResults, graphEnhanced);
        console.log(`🕸️ Graph enhancement added ${graphEnhanced.length} related nodes`);
      }

      // Phase 3: Community-level summarization (advanced)
      const communities = this.identifyRelevantCommunities(finalResults);
      const communityContext = await this.generateCommunityContext(communities, query);

      const topResults = finalResults.slice(0, maxResults);
      const context = this.buildFinalContext(topResults, communityContext);

      return {
        results: topResults,
        context: context,
        sources: [...new Set(topResults.map(r => r.metadata?.sourceId).filter(Boolean))],
        confidence: topResults.length > 0 ? Math.round(topResults[0].score * 100) : 0,
        searchType: 'graph-rag-enhanced',
        communityInsights: communityContext,
        graphStats: {
          vectorResults: vectorResults.length,
          graphEnhanced: useGraphTraversal,
          communities: communities.length
        }
      };

    } catch (error) {
      console.error("❌ Graph RAG search failed:", error);
      return this.getFallbackResponse(query);
    }
  }

  async enhanceWithGraph(vectorResults, query) {
    const relatedNodes = [];
    const visitedNodes = new Set();

    for (const result of vectorResults.slice(0, 3)) { // Use top 3 as seeds
      const nodeId = this.findNodeId(result.content);
      if (!nodeId || visitedNodes.has(nodeId)) continue;

      // Traverse graph to find related nodes
      const related = this.traverseGraph(nodeId, 2, visitedNodes); // 2-hop traversal
      relatedNodes.push(...related);
    }

    return relatedNodes;
  }

  traverseGraph(startNodeId, maxDepth, visitedNodes) {
    const results = [];
    const queue = [{ nodeId: startNodeId, depth: 0, relevance: 1.0 }];

    while (queue.length > 0) {
      const { nodeId, depth, relevance } = queue.shift();

      if (visitedNodes.has(nodeId) || depth > maxDepth) continue;
      visitedNodes.add(nodeId);

      const node = this.knowledgeGraph.nodes.get(nodeId);
      if (node && node.type === 'content') {
        results.push({
          content: node.content,
          metadata: node.metadata,
          score: relevance * (1 / (depth + 1)), // Decay by depth
          graphDepth: depth
        });
      }

      // Add neighbors to queue
      const edges = Array.from(this.knowledgeGraph.edges.values())
        .filter(edge => edge.source === nodeId || edge.target === nodeId);

      for (const edge of edges) {
        const neighborId = edge.source === nodeId ? edge.target : edge.source;
        const edgeWeight = edge.weight || 0.5;
        
        queue.push({
          nodeId: neighborId,
          depth: depth + 1,
          relevance: relevance * edgeWeight
        });
      }
    }

    return results;
  }

  rerankResults(vectorResults, graphResults) {
    const combinedMap = new Map();

    // Add vector results with higher base score
    vectorResults.forEach(result => {
      combinedMap.set(result.content, {
        ...result,
        finalScore: result.score * 1.0, // Vector results get full weight
        source: 'vector'
      });
    });

    // Add graph results with adjusted score
    graphResults.forEach(result => {
      const existing = combinedMap.get(result.content);
      if (existing) {
        // Boost existing results found through both methods
        existing.finalScore = Math.min(existing.finalScore * 1.2, 1.0);
        existing.source = 'vector+graph';
      } else {
        // Add new graph discoveries
        combinedMap.set(result.content, {
          ...result,
          finalScore: result.score * 0.8, // Graph-only results get reduced weight
          source: 'graph'
        });
      }
    });

    return Array.from(combinedMap.values())
      .sort((a, b) => b.finalScore - a.finalScore);
  }

  identifyRelevantCommunities(results) {
    // Map results to communities they belong to
    const communities = new Set();
    
    for (const result of results) {
      const nodeId = this.findNodeId(result.content);
      const community = this.findCommunityForNode(nodeId);
      if (community) {
        communities.add(community);
      }
    }

    return Array.from(communities);
  }

  async generateCommunityContext(communities, query) {
    if (communities.length === 0) return "";

    try {
      const communityDescriptions = communities.map(c => c.summary || c.name).join("; ");
      
      const prompt = `Based on these related knowledge communities: ${communityDescriptions}

Generate 1-2 sentences of high-level context relevant to the query: "${query}"

Focus on connections and themes across the communities.`;

      const context = await this.llm.predict(prompt, { max_tokens: 150 });
      return context || "";

    } catch (error) {
      console.warn("Community context generation failed:", error);
      return "";
    }
  }

  buildFinalContext(results, communityContext) {
    let context = "";
    
    if (communityContext) {
      context += `Overview: ${communityContext}\n\n`;
    }
    
    context += "Relevant Information:\n";
    context += results.map((r, i) => `${i + 1}. ${r.content}`).join('\n\n');
    
    return context;
  }

  findNodeId(content) {
    // Find graph node ID for given content
    for (const [nodeId, node] of this.knowledgeGraph.nodes) {
      if (node.content === content) {
        return nodeId;
      }
    }
    return null;
  }

  findCommunityForNode(nodeId) {
    // Find which community a node belongs to
    for (const [communityId, community] of this.knowledgeGraph.communities) {
      if (community.nodes && community.nodes.includes(nodeId)) {
        return community;
      }
    }
    return null;
  }

  getFallbackResponse(query) {
    const responses = {
      'projects': "Sai's major projects include HR Matching Platform (saved $45K annually), Real-time Data Pipeline (400 events/sec), Computer Vision systems (97% accuracy), and production RAG systems with 92% RAGAS scores.",
      'technologies': "Sai works with Python, PyTorch, TensorFlow, AWS, GCP, Kubernetes, Docker, React, Node.js, and specializes in ML/AI, GenAI, RAG systems, Computer Vision, and NLP.",
      'experience': "Sai has 4+ years of ML engineering experience at Shell, CGI, and Community Dreams Foundation, with expertise in production AI systems.",
      'education': "Sai completed his MS in Machine Learning at Stevens Institute of Technology with a 3.9 CGPA."
    };

    const queryLower = query.toLowerCase();
    for (const [keyword, response] of Object.entries(responses)) {
      if (queryLower.includes(keyword)) {
        return {
          results: [{ content: response, score: 0.8 }],
          context: response,
          sources: ['portfolio'],
          confidence: 80,
          searchType: 'keyword-fallback'
        };
      }
    }

    return {
      results: [],
      context: "I'm Sai's AI assistant. Ask me about his projects, technologies, experience, or education!",
      sources: ['portfolio'], 
      confidence: 50,
      searchType: 'default-fallback'
    };
  }
}

export const graphRAGService = new GraphRAGService();
export default graphRAGService;
