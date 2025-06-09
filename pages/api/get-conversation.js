//import dbConnect from '../../lib/mongodb';
//import Conversation from '../../lib/Conversation';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { sessionId } = req.query;

  if (!sessionId) {
    return res.status(400).json({ message: 'Session ID is required' });
  }

  try {
    // Try to connect to MongoDB
    try {
      const dbConnect = await import('../../lib/mongodb').then(m => m.default);
      const Conversation = await import('../../lib/Conversation').then(m => m.default);
      
      await dbConnect();
      
      const conversation = await Conversation.findOne({ sessionId });
      
      if (conversation) {
        return res.status(200).json({ messages: conversation.messages });
      }
    } catch (dbError) {
      console.error('Error fetching conversation:', dbError);
      // Fall through to default response
    }
    
    // Return default welcome message if we couldn't get messages from DB
    return res.status(200).json({ 
      messages: [
        { text: "Hi! I'm Sai's AI assistant. Feel free to ask me anything about him!", isUser: false }
      ] 
    });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}