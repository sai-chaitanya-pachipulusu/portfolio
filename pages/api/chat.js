import { getRAGService } from '../../lib/ragService.js';
import { getLLM } from '../../lib/llm.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get RAG service and search for relevant context
    const ragService = getRAGService();
    const searchResult = await ragService.search(message, {
      maxResults: 5,
      threshold: 0.3
    });

    // Get LLM for response generation
    const llm = getLLM();
    
    // Create enhanced prompt with context
    const systemPrompt = `You are Sai Chaitanya Pachipulusu's AI assistant. Use the provided context to answer questions about his background, projects, and expertise. If the context doesn't contain relevant information, provide general guidance but mention that you'd need more specific information.

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

    // Generate response
    const response = await llm.predict(`${systemPrompt}\n\n${userPrompt}`);

    return res.status(200).json({
      response: response,
      sources: searchResult.sources,
      confidence: searchResult.confidence
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Fallback response
    return res.status(200).json({
      response: "I'm having trouble accessing my knowledge base right now. Please feel free to email Sai directly at siai.chaitanyap@gmail.com for any questions about his work and experience.",
      sources: [],
      confidence: 0
    });
  }
} 