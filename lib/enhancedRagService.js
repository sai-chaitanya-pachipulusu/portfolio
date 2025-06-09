//import { graphRAGSearch } from './graph-rag.js';
import { getLLMService } from './llm.js';
import { getCacheService } from './cache.js';

class EnhancedRAGService {
  constructor() {
    this.llm = getLLMService();
    this.cache = getCacheService();
    this.isInitialized = false;
  }

  async initialize() {
    // Graph RAG will auto-initialize when first used
    this.isInitialized = true;
    console.log('Enhanced RAG Service initialized with Graph RAG');
  }

  async search(query, options = {}) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Check cache first
    const cacheKey = `graph_rag_${this.hashQuery(query)}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      console.log('Cache hit for Graph RAG query');
      return cached;
    }

    try {
      console.log('Executing Graph RAG search...');
      // Dynamic import for CommonJS module
      const { graphRAGSearch } = await import('./graph-rag.js');
      
      // Use Graph RAG for enhanced search
      const searchResult = await graphRAGSearch(query, {
        maxResults: options.maxResults || 5,
        similarityThreshold: 0.6,
        includeGraphTraversal: true,
        contextWindow: 3
      });

      const result = {
        context: searchResult.context,
        sources: searchResult.sources,
        confidence: searchResult.confidence,
        searchType: searchResult.searchType,
        resultCount: searchResult.resultCount
      };

      // Cache the result
      this.cache.set(cacheKey, result, 30 * 60 * 1000); // 30 min cache

      return result;

    } catch (error) {
      console.error('Enhanced RAG search failed:', error);
      return this.getFallbackResponse(query);
    }
  }

  async generateResponse(query, context, sources = []) {
    const systemPrompt = `You are Sai Chaitanya Pachipulusu's AI assistant. Use the provided context from his portfolio to answer questions accurately and professionally.

Context from Graph RAG:
${context}

Guidelines:
- Answer based on the provided context
- Be specific and mention relevant details
- If the context doesn't contain the answer, say so politely
- Highlight Sai's expertise and achievements
- Keep responses conversational but informative`;

    const userPrompt = `Question: ${query}

Please provide a comprehensive answer based on the context about Sai's background.`;

    try {
      const response = await this.llm.predict(`${systemPrompt}\n\n${userPrompt}`, {
        max_tokens: 800,
        temperature: 0.7
      });

      return {
        text: response,
        sources: sources,
        confidence: 95,
        type: 'graph-rag-enhanced'
      };

    } catch (error) {
      console.error('LLM generation failed:', error);
      return {
        text: "I'm having trouble generating a response right now. Please try asking about Sai's experience, projects, or technical skills.",
        sources: [],
        confidence: 50,
        type: 'fallback'
      };
    }
  }

  getFallbackResponse(query) {
    const fallbackResponses = {
      'rag': "Yes! Sai is highly experienced with RAG systems. He's built production RAG implementations with 92% RAGAS scores and enterprise chatbots achieving 84% accuracy.",
      'experience': "Sai has 5+ years of ML engineering experience at companies like Shell, CGI, and Community Dreams Foundation, with expertise in production AI systems.",
      'projects': "Sai's notable projects include HR Matching Platform (saving $45K annually), Real-time Data Pipeline (400 events/sec), and Computer Vision systems with 97% accuracy.",
      'education': "Sai completed his MS in Machine Learning at Stevens Institute of Technology with a 3.9 CGPA.",
      'skills': "Sai's expertise includes Python, ML/AI, GenAI, RAG systems, Computer Vision, NLP, AWS, GCP, Kubernetes, and Docker."
    };

    const queryLower = query.toLowerCase();
    for (const [keyword, response] of Object.entries(fallbackResponses)) {
      if (queryLower.includes(keyword)) {
        return {
          context: response,
          sources: ['portfolio'],
          confidence: 80,
          searchType: 'keyword-fallback'
        };
      }
    }

    return {
      context: "I'm Sai Chaitanya Pachipulusu's AI assistant. Feel free to ask about his ML engineering experience, RAG expertise, projects, or technical skills!",
      sources: ['portfolio'],
      confidence: 70,
      searchType: 'default-fallback'
    };
  }

  hashQuery(query) {
    return Buffer.from(query.toLowerCase().trim()).toString('base64').slice(0, 32);
  }
}

let enhancedRagInstance = null;

export function getEnhancedRAGService() {
  if (!enhancedRagInstance) {
    enhancedRagInstance = new EnhancedRAGService();
  }
  return enhancedRagInstance;
}

export default getEnhancedRAGService();
