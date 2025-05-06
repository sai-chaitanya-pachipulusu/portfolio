import { getLLM } from '../../lib/llm';
import { getCachedResponse, setCachedResponse } from '../../lib/cache';
import { graphRAGSearch } from '../../lib/graph-rag';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { message, sessionId } = req.body;
  const currentSessionId = sessionId || uuidv4();

  // Check cache first for instant response
  const cachedResponse = getCachedResponse(message);
  if (cachedResponse) {
    return res.status(200).json({
      response: cachedResponse.text,
      sources: cachedResponse.sources,
      sessionId: currentSessionId,
      fromCache: true
    });
  }

  try {
    // 1. Perform RAG search to get relevant context
    const searchResults = await graphRAGSearch(message, 5);
    
    // 2. Format search results into context
    let context = '';
    let sources = [];

    if (searchResults && searchResults.length > 0) {
      // Add content from search results to context
      context = searchResults
        .map(result => result.content)
        .join('\n\n');
        
      // Extract source information for citation
      sources = searchResults.map(result => {
        const sourceType = result.metadata?.sourceType || 'unknown';
        // Format source citation based on type
        if (sourceType === 'resume') {
          return 'Resume';
        } else if (sourceType === 'medium') {
          return 'Medium Article';
        } else if (sourceType === 'twitter') {
          return 'Twitter';
        } else {
          return sourceType;
        }
      });
      
      // Remove duplicates
      sources = [...new Set(sources)];
    }

    // 3. Get LLM instance
    const llm = getLLM();

    // 4. Create prompt with context
    const prompt = `You are an AI assistant for Sai Chaitanya Pachipulusu, a Machine Learning Engineer specialized in RAG systems and LLMs.
    
CONTEXT INFORMATION:
${context}

Based ONLY on the context information provided above, answer the following question from a user.
If the answer cannot be found in the context, say "I don't have specific information about that, but I'd be happy to share what I know about Sai's experience with ML, AI, and data engineering."

USER QUESTION: ${message}

ANSWER:`;

    // 5. Get response from LLM
    const assistantResponse = await llm.predict(prompt);
    
    // 6. Cache the response for future use
    setCachedResponse(message, { 
      text: assistantResponse,
      sources: sources
    });

    // 7. Return response with sources
    return res.status(200).json({
      response: assistantResponse,
      sources: sources,
      sessionId: currentSessionId,
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    
    return res.status(200).json({
      response: "Sorry, I encountered an error while processing your request. Please try again.",
      sessionId: currentSessionId
    });
  }
}