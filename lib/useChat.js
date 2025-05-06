import { useState, useEffect, useRef } from 'react';
import { useToast } from '@chakra-ui/react';

export default function useChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Thinking...');
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const toast = useToast();
  
  const loadingMessages = [
    "Thinking...",
    "Processing your question...",
    "Let me check that for you...",
    "Searching through Sai's information...",
    "Analyzing relevant details...",
  ];

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        text: "Hi! I'm Sai's AI assistant. Feel free to ask me anything about him!",
        isUser: false,
      }]);
    }
  }, [messages.length]);

  // Load session from localStorage
  useEffect(() => {
    const savedSessionId = localStorage.getItem('chatSessionId');
    if (savedSessionId) {
      setSessionId(savedSessionId);
      fetchPreviousMessages(savedSessionId);
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchPreviousMessages = async (sid) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/get-conversation?sessionId=${sid}`);
      const data = await response.json();
      
      if (response.ok && data.messages && data.messages.length > 0) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error fetching previous messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (input.trim() === '' || isLoading) return;
    
    // Add user message immediately
    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    
    setInput("");
    setIsLoading(true);
    
    // Randomly select a loading message
    const randomLoadingMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    setLoadingMessage(randomLoadingMessage);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, sessionId })
      });
      
      const data = await response.json();
      
      // Add assistant response
      setMessages(prev => [...prev, { 
        text: data.response, 
        isUser: false 
      }]);
      
      if (data.sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem('chatSessionId', data.sessionId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        text: "Sorry, I couldn't process your request. Please try again.", 
        isUser: false 
      }]);
      
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    
    setIsLoading(false);
  };

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear this chat?')) {
      setMessages([{
        text: "Hi! I'm Sai's AI assistant. Feel free to ask me anything about him!",
        isUser: false,
      }]);
      localStorage.removeItem('chatSessionId');
      setSessionId(null);
    }
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    loadingMessage,
    sendMessage,
    clearChat,
    messagesEndRef,
  };
}