import { useState, useEffect, useRef } from 'react';
import {
  Box,
  VStack,
  Textarea,
  Text,
  IconButton,
  useToast,
  useBreakpointValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  ScaleFade,
} from '@chakra-ui/react';
import { IoSend } from 'react-icons/io5';
import { FiMessageCircle } from 'react-icons/fi';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      text: "Hi! I'm here to help you learn more about Sai's work and experience. You can ask me about his projects, skills, or anything else you'd like to know!",
      isUser: false
    },
    {
      text: "Try asking questions like:\n• \"What technologies do you work with?\"\n• \"Tell me about your recent projects\"\n• \"What's your experience with ML?\"",
      isUser: false
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatHovered, setIsChatHovered] = useState(false);
  
  const messagesEndRef = useRef(null);
  const messagesWrapperRef = useRef(null);
  const chatInputRef = useRef(null);
  const toast = useToast();

  // Responsive breakpoints - OPTION 5: Custom breakpoints (ACTIVE)
  const chatMode = useBreakpointValue({
    base: 'mobile',    // < 480px → Floating button + Full screen modal
    sm: 'mobile',      // 480px-639px → Floating button + Full screen modal  
    md: 'mobile',      // 640px-1023px → Floating button + Full screen modal
    lg: 'mobile',     // 1024px-1439px → Always visible sidebar
    xl: 'sidebar',     // 1440px+ → Always visible sidebar
    '2xl': 'sidebar'   // 1536px+ → Always visible sidebar
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Prevent body scroll when chat is hovered (only for sidebar mode)
  useEffect(() => {
    if (chatMode === 'sidebar') {
      if (isChatHovered) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
      
      return () => {
        document.body.style.overflow = 'auto';
      };
    }
  }, [isChatHovered, chatMode]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messagesWrapperRef.current) {
      messagesWrapperRef.current.scrollTop = messagesWrapperRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setInput('');
    setIsLoading(true);

    if (chatInputRef.current) {
      chatInputRef.current.style.height = 'auto';
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get response: ${response.status}`);
      }

      const data = await response.json();
      setMessages(prev => [...prev, {
        text: data.response,
        isUser: false,
        sources: data.sources || []
      }]);
    } catch (error) {
      console.error('Error getting response:', error);
      setMessages(prev => [...prev, {
        text: "Sorry, I encountered an error. Please email siai.chaitanyap@gmail.com for assistance.",
        isUser: false
      }]);
      toast({
        title: 'Error',
        description: 'Failed to get response from the server.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  // 🎯 MOBILE MODE - Full Screen Modal with Floating Button (< 1024px)
  if (chatMode === 'mobile') {
    return (
      <>
        {/* Floating Chat Bubble */}
        <ScaleFade in={!isOpen} initialScale={0.8}>
          <Box
            position="fixed"
            bottom="20px"
            right="20px"
            zIndex={1000}
            onClick={onOpen}
            cursor="pointer"
          >
            <Box
              width="60px"
              height="60px"
              borderRadius="full"
              bg="rgba(74, 158, 255, 0.9)"
              backdropFilter="blur(10px)"
              border="2px solid rgba(255, 255, 255, 0.2)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="0 8px 32px rgba(74, 158, 255, 0.3)"
              transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              _hover={{
                transform: 'scale(1.1) rotate(5deg)',
                boxShadow: '0 12px 40px rgba(74, 158, 255, 0.4)',
              }}
              animation="float 3s ease-in-out infinite"
            >
              <FiMessageCircle size={24} color="white" />
            </Box>
          </Box>
        </ScaleFade>

        {/* Full Screen Chat Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="full" motionPreset="slideInBottom">
          <ModalOverlay bg="rgba(0, 0, 0, 0.8)" backdropFilter="blur(10px)" />
          <ModalContent bg="rgba(10, 10, 10, 0.95)" backdropFilter="blur(20px)" m={0}>
            <ModalHeader 
              pb={2} 
              fontSize="lg" 
              fontWeight="600" 
              color="white"
              borderBottom="1px solid rgba(255, 255, 255, 0.1)"
            >
              Chat with Sai's AI Assistant
            </ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody p={0} display="flex" flexDirection="column" height="calc(100vh - 80px)">
              {/* Mobile Messages */}
              <Box
                ref={messagesWrapperRef}
                flex="1"
                overflowY="auto"
                p="1rem"
                sx={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  '&::-webkit-scrollbar': { display: 'none' },
                }}
              >
                <VStack spacing={3} align="stretch">
                  {messages.map((msg, i) => (
                    <Message key={i} text={msg.text} isUser={msg.isUser} sources={msg.sources} />
                  ))}
                  {isLoading && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </VStack>
              </Box>
              
              {/* Mobile Input */}
              <Box p="1rem" borderTop="1px solid rgba(255, 255, 255, 0.1)">
                <Box position="relative">
                  <Textarea
                    ref={chatInputRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about Sai's work..."
                    bg="rgba(255, 255, 255, 0.05)"
                    border="1px solid rgba(255, 255, 255, 0.1)"
                    borderRadius="12px"
                    color="white"
                    fontSize="1rem"
                    p="12px 50px 12px 16px"
                    resize="none"
                    minH="50px"
                    maxH="120px"
                    _focus={{ borderColor: "rgba(74, 158, 255, 0.5)", boxShadow: "0 0 0 1px rgba(74, 158, 255, 0.3)" }}
                    _placeholder={{ color: '#888888' }}
                  />
                  <IconButton
                    icon={<IoSend />}
                    onClick={handleSend}
                    isDisabled={!input.trim() || isLoading}
                    isLoading={isLoading}
                    position="absolute"
                    right="8px"
                    top="50%"
                    transform="translateY(-50%)"
                    bg="rgba(74, 158, 255, 0.8)"
                    color="white"
                    borderRadius="8px"
                    size="sm"
                    _hover={{ bg: "rgba(74, 158, 255, 1)" }}
                  />
                </Box>
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
          }
        `}</style>
      </>
    );
  }

  // 🎯 DESKTOP/WIDE SCREEN MODE - Always Visible Sidebar (1024px+)
  return (
    <>
      {/* Always Visible Chat Sidebar */}
      <Box
        position="fixed"
        left="0"
        bottom="0"
        width="320px"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="flex-end"
        zIndex={1000}
        pointerEvents="auto"
        onMouseEnter={() => setIsChatHovered(true)}
        onMouseLeave={() => setIsChatHovered(false)}
      >
        {/* Messages Container */}
        <Box
          ref={messagesWrapperRef}
          flex="1"
          overflowY="hidden"
          overflowX="hidden"
          transition="all 0.3s ease"
          pb="140px"
          position="relative"
          _hover={{
            overflowY: 'auto',
          }}
          sx={{
            // Completely hide scrollbar
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          <VStack
            spacing={3}
            align="stretch"
            p="2rem 1.25rem 1rem 1.25rem"
            minHeight="100%"
            justifyContent="flex-end"
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
        </Box>

        {/* Chat Input */}
        <Box
          position="fixed"
          bottom="2rem"
          left="2rem"
          width="280px"
          zIndex={1001}
          pointerEvents="auto"
        >
          <Box
            position="relative"
            bg="rgba(0, 0, 0, 0.3)"
            borderRadius="8px"
            p="12px"
            backdropFilter="blur(10px)"
            border="1px solid rgba(255, 255, 255, 0.1)"
          >
            <Textarea
              ref={chatInputRef}
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Ask about my work, projects.."
              bg="transparent"
              border="none"
              borderRadius="0"
              color="white"
              fontSize="0.95rem"
              fontWeight="400"
              pr="3rem"
              resize="none"
              minH="24px"
              maxH="240px"
              _focus={{
                outline: 'none',
                boxShadow: 'none',
              }}
              _placeholder={{
                color: '#888888',
                fontWeight: 300,
              }}
              sx={{
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            />
            
            <IconButton
              icon={<IoSend />}
              onClick={handleSend}
              isDisabled={!input.trim() || isLoading}
              isLoading={isLoading}
              position="absolute"
              right="8px"
              top="50%"
              transform="translateY(-50%)"
              bg="transparent"
              borderRadius="50%"
              width="36px"
              height="36px"
              opacity={0.6}
              _hover={{
                opacity: 1,
                transform: 'translateY(-50%) scale(1.1)',
                bg: 'rgba(74, 158, 255, 0.1)',
              }}
              _active={{
                transform: 'translateY(-50%) scale(0.95)',
              }}
              sx={{
                '& svg': {
                  color: '#4a9eff',
                  transition: 'all 0.3s ease',
                },
                '&:hover svg': {
                  color: '#66b3ff',
                  transform: 'translateX(1px)',
                },
              }}
              aria-label="Send message"
            />
          </Box>
        </Box>
      </Box>
    </>
  );
}