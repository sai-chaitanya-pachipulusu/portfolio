import { getLLM } from '../../lib/llm.js';
import { getEnhancedRAGService } from '../../lib/enhancedRagService.js';

export default async function handler(req, res) {
  console.log('Chat API called with:', req.method);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  try {
    console.log(`Processing query: ${message}`);
    
    // Use Enhanced RAG Service (Graph RAG)
    const ragService = getEnhancedRAGService();
    
    // Search using Graph RAG
    const searchResult = await ragService.search(message, {
      maxResults: 5
    });

    console.log(`Graph RAG search completed. Type: ${searchResult.searchType}, Confidence: ${searchResult.confidence}%`);

    // Get LLM for response generation
    const llm = getLLM();
    
    // Create enhanced prompt with context
    const systemPrompt = `You are Sai Chaitanya Pachipulusu's AI assistant. Use the provided context to answer questions about his background, projects, and expertise.

Context:
${searchResult.context}

Instructions:
- Be conversational and helpful
- Reference specific projects, metrics, and achievements when relevant
- If asked about technical details, provide concrete examples from the context
- For career advice, draw from Sai's experience and documented insights
- If the question is outside the context, be honest about limitations`;

    const userPrompt = `User Question: ${message}

Please provide a helpful response based on Sai's portfolio and expertise.`;

    // Generate response (llm.predict returns a string)
    const responseText = await llm.predict(`${systemPrompt}\n\n${userPrompt}`);

    console.log('Response generated successfully');

    return res.status(200).json({
      message: responseText, // This is the actual response string
      sources: searchResult.sources,
      confidence: searchResult.confidence,
      searchType: searchResult.searchType,
      resultCount: searchResult.resultCount
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Fallback response
    return res.status(200).json({
      message: "I'm Sai's AI assistant! Ask me about his ML engineering experience, RAG expertise, projects at Shell/CGI, or technical skills. I'm experiencing some technical issues but can still help!",
      sources: ['portfolio'],
      confidence: 50,
      searchType: 'error-fallback'
    });
  }
} 