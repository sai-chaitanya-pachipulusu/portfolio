import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  text: String,
  isUser: Boolean,
  timestamp: { type: Date, default: Date.now }
});

const ConversationSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  messages: [MessageSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);