import { graphRAGService } from '../../lib/graphRagService.js';
import { getLLM } from '../../lib/llm.js';

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
    console.log(`🔍 Processing: "${message}"`);
    
    // Use Graph RAG search
    const searchResult = await graphRAGService.search(message, {
      maxResults: 5,
      useGraphTraversal: true,
      communityLevel: 1
    });

    console.log(`📊 Search completed: ${searchResult.searchType}, confidence: ${searchResult.confidence}%`);
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
    
    // Generate response with LLM
    const prompt = `You are Sai Chaitanya Pachipulusu's AI assistant. Answer based on this context:

${searchResult.context}

User Question: ${message}

Provide a helpful, specific response about Sai's background.`;

    const responseText = await llm.predict(prompt);

    return res.status(200).json({
      message: responseText,
      sources: searchResult.sources,
      confidence: searchResult.confidence,
      searchType: searchResult.searchType,
      graphStats: searchResult.graphStats
    });

  } catch (error) {
    console.error("❌ Chat error:", error);
    
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
      message: "I'm Sai's AI assistant! Ask me about his ML projects, technologies, or experience. (Experiencing technical issues)",
      sources: ['portfolio'],
      confidence: 50
    });
  }
}