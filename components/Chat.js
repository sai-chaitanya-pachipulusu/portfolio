import { useState, useEffect, useRef } from 'react';
import {
  Box,
  VStack,
  Input,
  Flex,
  Text,
  Button,
  useToast,
  Spinner,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Badge,
  Tooltip,
} from '@chakra-ui/react';
import { IoSend } from 'react-icons/io5';
import { FaRobot, FaTimes } from 'react-icons/fa';
import { ChatIcon } from "@chakra-ui/icons";
import Message from './Message';
import TypingIndicator from './TypingIndicator';

export default function Chat() {
  const [messages, setMessages] = useState([
    { 
      text: "Hi! I'm Sai's AI assistant. I can answer questions about his experience, skills, projects, and more. What would you like to know?", 
      isUser: false 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message to API
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Call API with the user's message
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });
      
      if (!response.ok) {
         // Attempt to read the error body if chat fails
        const errorBody = await response.text();
        console.error('Chat API failed response:', errorBody);
        throw new Error(`Failed to get response: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Add AI response
      setMessages(prev => [...prev, { 
        text: data.response, 
        isUser: false,
        sources: data.sources || [] 
      }]);
    } catch (error) {
      console.error('Error getting response:', error);
      
      // Add error message
      setMessages(prev => [...prev, { 
        text: `Sorry, I encountered an error processing your request: ${error.message || 'Unknown error'}. Please try again.`, // Show error message
        isUser: false 
      }]);
      
      // Show error toast
      toast({
        title: 'Error',
        description: `Failed to get response from the server: ${error.message || 'Unknown error'}`, // Show error message in toast
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Clear chat history
  const clearChat = () => {
    setMessages([{ 
      text: "Hi! I'm Sai's AI assistant. I can answer questions about his experience, skills, projects, and more. What would you like to know?", 
      isUser: false 
    }]);
    // Consider clearing session/cache if implemented
    // localStorage.removeItem('chatSessionId');
    // setSessionId(null);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button with Tooltip */}
      <Tooltip 
        label="Ask my AI assistant about my work (Powered by Graph RAG)"
        aria-label="Chatbot tooltip" 
        placement="left" 
        hasArrow
      >
        <IconButton
          icon={<ChatIcon />}
          isRound={true}
          size="lg"
          colorScheme="blue"
          position="fixed"
          bottom="40px"
          right="40px"
          onClick={onOpen}
          aria-label="Open Chat"
          boxShadow="lg"
          zIndex={1100} // Ensure button is above other content but below drawer maybe
        />
      </Tooltip>

      {/* Chat Drawer */}
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent 
          bg="gray.900" 
          color="white"
          borderLeft="1px solid"
          borderColor="gray.700"
        >
          <DrawerCloseButton />
          <DrawerHeader 
            borderBottomWidth="1px" 
            borderColor="gray.700"
            bg="gray.800"
          >
            <Flex justify="space-between" align="center">
              <Flex align="center" gap={2}>
                <FaRobot color="#3182ce" />
                <Text fontWeight="bold">Chat with Sai's AI</Text>
                <Badge colorScheme="blue" ml={2}>Beta</Badge>
              </Flex>
              <Button 
                size="sm" 
                colorScheme="blue" 
                variant="ghost" 
                onClick={clearChat}
                _hover={{ bg: 'gray.700' }}
              >
                Clear Chat
              </Button>
            </Flex>
          </DrawerHeader>

          <DrawerBody p={0} display="flex" flexDirection="column">
            <VStack
              flex="1"
              p={4}
              spacing={4}
              overflowY="auto"
              align="stretch"
              css={{
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'gray.600',
                  borderRadius: '24px',
                },
              }}
            >
              {messages.map((msg, i) => (
                <Message 
                  key={i} 
                  text={msg.text} 
                  isUser={msg.isUser} 
                  sources={msg.sources}
                />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </VStack>

            {/* Input Area */}
            <Box
              position="sticky"
              bottom={0}
              p={4}
              bg="gray.800"
              borderTop="1px solid"
              borderColor="gray.700"
            >
              <Flex gap={2}>
                <Input
                  placeholder="Ask about Sai's experience, skills, or projects..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  bg="gray.700"
                  border="none"
                  color="white"
                  _focus={{ 
                    outline: "none", 
                    boxShadow: "0 0 0 1px #3182ce"
                  }}
                  _placeholder={{ color: 'gray.400' }}
                />
                <Button 
                  onClick={handleSend} 
                  isDisabled={!input.trim() || isLoading}
                  isLoading={isLoading}
                  colorScheme="blue"
                  leftIcon={<IoSend />}
                  _hover={{ transform: 'scale(1.05)' }}
                  transition="transform 0.2s"
                >
                  Send
                </Button>
              </Flex>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}