import { getVectorService } from './vectorService.js';
import { getLLMService } from './llm.js';
import { getCacheService } from './cache.js';

class EnhancedRAGService {
  constructor() {
    this.vectorService = getVectorService();
    this.llm = getLLMService();
    this.cache = getCacheService();
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log('🚀 Initializing Enhanced RAG with Pinecone...');
      await this.vectorService.initialize();
      
      this.isInitialized = true;
      console.log('✅ Enhanced RAG Service ready with Pinecone backend');

    } catch (error) {
      console.error('❌ Enhanced RAG initialization failed:', error);
      this.isInitialized = true; // Continue with fallbacks
    }
  }

  async search(query, options = {}) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Check cache first
    const cacheKey = `enhanced_rag_${this.hashQuery(query)}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      console.log('💾 Cache hit for Enhanced RAG query');
      return cached;
    }

    try {
      console.log(`🔍 Enhanced RAG search: "${query}"`);
      
      // Use Pinecone vector search
      const vectorResults = await this.vectorService.semanticSearch(query, {
        topK: options.maxResults || 5,
        threshold: 0.7
      });

      const result = {
        context: vectorResults.map(r => r.content).join('\n\n'),
        sources: [...new Set(vectorResults.map(r => r.metadata?.sourceId).filter(Boolean))],
        confidence: vectorResults.length > 0 ? Math.round(vectorResults[0].score * 100) : 0,
        searchType: 'pinecone-enhanced',
        resultCount: vectorResults.length,
        results: vectorResults
      };

      // Cache the result
      this.cache.set(cacheKey, result, 30 * 60 * 1000); // 30 min cache

      console.log(`📊 Enhanced RAG found ${result.resultCount} results, confidence: ${result.confidence}%`);

      return result;

    } catch (error) {
      console.error('❌ Enhanced RAG search failed:', error);
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
      'experience': "Sai has 4+ years of ML engineering experience at companies like Shell, CGI, and Community Dreams Foundation, with expertise in production AI systems.",
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
          searchType: 'keyword-fallback',
          resultCount: 1
        };
      }
    }

    return {
      context: "I'm Sai Chaitanya Pachipulusu's AI assistant. Feel free to ask about his ML engineering experience, RAG expertise, projects, or technical skills!",
      sources: ['portfolio'],
      confidence: 70,
      searchType: 'default-fallback',
      resultCount: 0
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
