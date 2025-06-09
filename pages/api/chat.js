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
    console.log(`Context length: ${searchResult.context?.length || 0} characters`);

    // Check if we have context
    if (!searchResult.context || searchResult.context.trim().length === 0) {
      console.warn('No context found, using default response');
      return res.status(200).json({
        message: "I'm Sai Chaitanya Pachipulusu's AI assistant. Sai has 5+ years of ML engineering experience at companies like Community Dreams Foundation, CGI, Imbuedesk. He's built production RAG systems and has expertise in Python, AI/ML, and cloud technologies. What would you like to know about his background?",
        sources: ['portfolio'],
        confidence: 80
      });
    }

    // Get LLM for response generation
    const llm = getLLM();
    
    // Create enhanced prompt with context
    const systemPrompt = `You are Sai Chaitanya Pachipulusu's AI assistant. Use the provided context to answer questions about his background, projects, and expertise.

Question: ${message}

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

    console.log('Sending prompt to LLM...');
    // Generate response (llm.predict returns a string)
    const responseText = await llm.predict(`${systemPrompt}\n\n${userPrompt}`);
    console.log('Response generated successfully');

    // Validate response
    if (!responseText || responseText.trim().length === 0) {
      console.error('LLM returned empty response');
      return res.status(200).json({
        message: "Based on the information I have, I can tell you about Sai's background. Could you please rephrase your question or ask about his specific projects, education, or technical skills?",
        sources: searchResult.sources,
        confidence: 50
      });
    }

    return res.status(200).json({
      message: responseText.trim(),
      sources: searchResult.sources,
      confidence: searchResult.confidence,
      searchType: searchResult.searchType
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Enhanced fallback with specific answers
    const quickAnswers = {
      'masters': "Sai completed his MS in Machine Learning at Stevens Institute of Technology with a 3.9 CGPA.",
      'education': "Sai has an MS in Machine Learning from Stevens Institute of Technology (3.9 CGPA).",
      'projects': "Sai's recent projects include: HR Matching Platform (saved $45K annually), Real-time Data Pipeline (processes 400 events/sec), and Computer Vision systems with 97% accuracy. He also built production RAG systems with 92% RAGAS scores.",
      'experience': "Sai has 5+ years of ML engineering experience at Imbuedesk, CGI, and Community Dreams Foundation."
    };

    const queryLower = message.toLowerCase();
    for (const [keyword, answer] of Object.entries(quickAnswers)) {
      if (queryLower.includes(keyword)) {
        return res.status(200).json({
          message: answer,
          sources: ['portfolio'],
          confidence: 85
        });
      }
    }
    
    return res.status(200).json({
      message: "I'm Sai's AI assistant! Ask me about his ML engineering experience, projects at Shell/CGI, or his MS from Stevens Institute.",
      sources: ['portfolio'],
      confidence: 70
    });
  }
}