import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, VStack, Heading, Link, IconButton, Collapse, useDisclosure, Tooltip } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { FaLightbulb, FaArrowLeft, FaArrowRight, FaArrowDown } from 'react-icons/fa';

// Dynamically import GradientDescentAnimation
const GradientDescentAnimation = dynamic(() => import('../../components/GradientDescentAnimation'), { 
  ssr: false,
  loading: () => <Text color="white" textAlign="center" width="100%">Loading Animation...</Text> 
});

const GradientDescentPage = () => {
  const [isClient, setIsClient] = useState(false);
  const { isOpen: isTheoryOpen, onToggle: toggleTheory } = useDisclosure({ defaultIsOpen: false });
  const [theoryPosition, setTheoryPosition] = useState('right'); // 'right' or 'bottom'

  // Toggle between right sidebar and bottom panel layouts
  const toggleTheoryPosition = () => {
    setTheoryPosition(theoryPosition === 'right' ? 'bottom' : 'right');
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  // If not client-side yet, or if GradientDescentAnimation is still loading via dynamic import, show loading.
  if (!isClient) {
    return (
      <Flex minH="100vh" bg="black" alignItems="center" justifyContent="center">
        <Text color="white">Loading Page...</Text>
      </Flex>
    );
  }

  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" />
      </Head>
      <Box 
        minH="100vh" 
        bg="black" 
        color="white" 
        position="relative"
        sx={{
          fontFamily: "'Space Mono', monospace",
          "& code": {
            fontFamily: "'Space Mono', monospace",
            background: "rgba(255,255,255,0.1)",
            px: 1,
            borderRadius: "2px"
          }
        }}
      >
        {/* Toggle Button for Theory - Fixed position */}
        <Tooltip label={isTheoryOpen ? "Hide Theory" : "Understand Better"} placement="left">
          <IconButton
            icon={<FaLightbulb />}
            aria-label="Toggle theory"
            position="fixed"
            top="20px"
            right="20px"
            zIndex={10}
            onClick={toggleTheory}
            colorScheme="teal"
            size="md"
            variant="solid"
            borderRadius="full"
          />
        </Tooltip>

        {/* Display Theory based on selected position */}
        {theoryPosition === 'right' ? (
          <Flex 
            direction={{ base: 'column', xl: 'row' }} 
            h="100vh"
            w="100%"
          >
            {/* Main Animation Area */}
            <Box 
              w={{ base: '100%', xl: isTheoryOpen ? '60%' : '100%' }}
              h="100vh"
              display="flex" 
              alignItems="center" 
              justifyContent="center" 
              position="relative"
              overflow="hidden"
              transition="all 0.3s ease"
            >
              <GradientDescentAnimation /> 
            </Box>

            {/* Theory Sidebar - 40% width when open */}
            {isTheoryOpen && (
              <Box 
                w={{ base: '100%', xl: '40%' }}
                bg="black" 
                borderLeft={{ xl: "1px solid rgba(255,255,255,0.1)" }} 
                p={{ base: 4, md: 6 }} 
                overflowY="auto" 
                h={{ base: 'auto', xl: '100vh' }}
                maxH={{ base: '50vh', xl: '100vh' }}
                position="relative"
                sx={{
                  "&::-webkit-scrollbar": {
                    width: "6px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "rgba(0,0,0,0.1)",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "3px",
                  }
                }}
                animation="fadeIn 0.3s"
              >
                <IconButton
                  icon={<FaArrowDown />}
                  aria-label="Move theory to bottom"
                  position="absolute"
                  top="10px"
                  right="10px"
                  zIndex={2}
                  onClick={toggleTheoryPosition}
                  size="sm"
                  variant="ghost"
                />
                <TheoryContent />
              </Box>
            )}
          </Flex>
        ) : (
          <Box h="100vh" position="relative">
            {/* Main Animation Area */}
            <Box 
              h={isTheoryOpen ? { base: 'calc(100vh - 300px)', xl: 'calc(100vh - 250px)' } : '100vh'}
              display="flex" 
              alignItems="center" 
              justifyContent="center" 
              position="relative"
              overflow="hidden"
              transition="height 0.3s ease"
            >
              <GradientDescentAnimation />
            </Box>

            {/* Theory Bottom Panel - Limited to 50% height */}
            <Collapse in={isTheoryOpen} animateOpacity>
              <Box 
                bg="black" 
                borderTop="1px solid rgba(255,255,255,0.1)" 
                p={4} 
                overflowY="auto" 
                maxH={{ base: '50vh', xl: '50vh' }}
                position="relative"
                sx={{
                  "&::-webkit-scrollbar": {
                    width: "6px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "rgba(0,0,0,0.1)",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "3px",
                  }
                }}
              >
                <IconButton
                  icon={<FaArrowRight />}
                  aria-label="Move theory to side"
                  position="absolute"
                  top="10px"
                  right="10px"
                  zIndex={2}
                  onClick={toggleTheoryPosition}
                  size="sm"
                  variant="ghost"
                />
                <TheoryContent isCompact={true} />
              </Box>
            </Collapse>
          </Box>
        )}
      </Box>
    </>
  );
};

// Separate component for theory content to avoid duplication
const TheoryContent = ({ isCompact = false }) => (
  <VStack spacing={isCompact ? 3 : 6} align="start">
    <Heading 
      size="lg" 
      fontFamily="'Space Mono', monospace" 
      letterSpacing="wide"
      borderBottom="1px solid rgba(255,255,255,0.2)"
      pb={2}
      w="full"
    >
      About Gradient Descent
    </Heading>
    
    <Text lineHeight="tall" fontSize={isCompact ? "sm" : "md"}>
      Gradient Descent is an iterative optimization algorithm used to find the 
      minimum of a function. It works by repeatedly moving in the direction of the 
      steepest descent, which is the negative of the gradient.
    </Text>
    
    <Heading 
      size={isCompact ? "sm" : "md"}
      mt={isCompact ? 2 : 4}
      fontFamily="'Space Mono', monospace"
      letterSpacing="wide"
    >
      Key Concepts
    </Heading>
    
    <VStack spacing={isCompact ? 1 : 3} align="start" w="full">
      <Text fontSize={isCompact ? "sm" : "md"}>
        <Text as="span" fontWeight="bold" color="cyan.300">Cost Function:</Text> The function we want to minimize.
      </Text>
      
      <Text fontSize={isCompact ? "sm" : "md"}>
        <Text as="span" fontWeight="bold" color="cyan.300">Learning Rate:</Text> Determines the size of the steps we take. 
        Too small, and it's slow; too large, and it might overshoot or diverge.
      </Text>
      
      <Text fontSize={isCompact ? "sm" : "md"}>
        <Text as="span" fontWeight="bold" color="cyan.300">Iterations:</Text> The number of steps taken to reach the minimum.
      </Text>
      
      <Text fontSize={isCompact ? "sm" : "md"}>
        <Text as="span" fontWeight="bold" color="cyan.300">Local vs. Global Minima:</Text> Gradient descent can sometimes 
        get stuck in a local minimum rather than finding the absolute global 
        minimum, depending on the function and starting point.
      </Text>
    </VStack>
    
    <Heading 
      size={isCompact ? "sm" : "md"}
      mt={isCompact ? 2 : 4}
      fontFamily="'Space Mono', monospace"
      letterSpacing="wide"
    >
      In this Animation:
    </Heading>
    
    <VStack spacing={isCompact ? 1 : 3} align="start" w="full">
      <Text fontSize={isCompact ? "sm" : "md"}>- The surface represents the cost function <code>f(x,z) = x² + z²</code>.</Text>
      <Text fontSize={isCompact ? "sm" : "md"}>- The yellow cube shows the current position.</Text>
      <Text fontSize={isCompact ? "sm" : "md"}>- The green line traces the path taken.</Text>
      <Text fontSize={isCompact ? "sm" : "md"}>- The red cube marks the target minimum at (0,0).</Text>
      <Text fontSize={isCompact ? "sm" : "md"}>- You can adjust the starting X, Z, and the learning rate to see how they affect the descent!</Text>
    </VStack>
    
    <Heading 
      size={isCompact ? "sm" : "md"}
      mt={isCompact ? 2 : 4}
      fontFamily="'Space Mono', monospace"
      letterSpacing="wide"
    >
      Learn More:
    </Heading>
    
    <VStack spacing={isCompact ? 1 : 3} align="start" w="full">
      <Text fontSize={isCompact ? "sm" : "md"}>
        <Text as="span" fontWeight="bold" color="cyan.300">Calculus:</Text> Understanding derivatives and partial derivatives
      </Text>
      <Text fontSize={isCompact ? "sm" : "md"}>
        <Text as="span" fontWeight="bold" color="cyan.300">Linear Algebra:</Text> Matrix operations and vector spaces
      </Text>
      <Text fontSize={isCompact ? "sm" : "md"}>
        <Text as="span" fontWeight="bold" color="cyan.300">Optimization Theory:</Text> Convex optimization and mathematical optimization methods
      </Text>
    </VStack>
    
    {/* New Materials Section */}
    <Heading 
      size={isCompact ? "sm" : "md"}
      mt={isCompact ? 3 : 5}
      fontFamily="'Space Mono', monospace"
      letterSpacing="wide"
    >
      Materials:
    </Heading>
    
    <VStack spacing={isCompact ? 2 : 3} align="start" w="full">
      {/* YouTube video links with icons */}
      <Link
        href="https://www.youtube.com/watch?v=IHZwWFHWa-w"
        isExternal
        display="flex"
        alignItems="center"
        w="full"
        p={2}
        borderRadius="md"
        bg="rgba(255, 0, 0, 0.1)"
        _hover={{ bg: "rgba(255, 0, 0, 0.2)", textDecoration: "none" }}
        transition="all 0.2s"
      >
        <Box as="span" mr={2} fontSize="lg" role="img" aria-label="YouTube">📺</Box>
        <Text fontSize={isCompact ? "xs" : "sm"} fontWeight="medium">
          Neural Networks: 3Blue1Brown - But what is a neural network?
        </Text>
      </Link>
      
      <Link
        href="https://www.youtube.com/watch?v=sDv4f4s2SB8"
        isExternal
        display="flex"
        alignItems="center"
        w="full"
        p={2}
        borderRadius="md"
        bg="rgba(255, 0, 0, 0.1)"
        _hover={{ bg: "rgba(255, 0, 0, 0.2)", textDecoration: "none" }}
        transition="all 0.2s"
      >
        <Box as="span" mr={2} fontSize="lg" role="img" aria-label="YouTube">📺</Box>
        <Text fontSize={isCompact ? "xs" : "sm"} fontWeight="medium">
          Neural Networks: 3Blue1Brown - Gradient descent, how neural networks learn
        </Text>
      </Link>
      
      <Link
        href="https://www.youtube.com/watch?v=ORyfPJypKuU"
        isExternal
        display="flex"
        alignItems="center"
        w="full"
        p={2}
        borderRadius="md"
        bg="rgba(255, 0, 0, 0.1)"
        _hover={{ bg: "rgba(255, 0, 0, 0.2)", textDecoration: "none" }}
        transition="all 0.2s"
      >
        <Box as="span" mr={2} fontSize="lg" role="img" aria-label="YouTube">📺</Box>
        <Text fontSize={isCompact ? "xs" : "sm"} fontWeight="medium">
          StatQuest: Gradient Descent, Step-by-Step
        </Text>
      </Link>
      
    </VStack>
    
    <Box pt={isCompact ? 2 : 4} fontSize={isCompact ? "xs" : "sm"} color="gray.400" alignSelf="center" w="full" textAlign="center">
      <Text>
        Interested in learning more?
      </Text>
      <Link
        href="https://en.wikipedia.org/wiki/Gradient_descent" 
        isExternal
        color="cyan.300"
        _hover={{ textDecoration: "none", color: "cyan.200" }}
        display="inline-block"
        mt={1}
        fontStyle="italic"
      >
        Wikipedia: Gradient Descent
      </Link>
    </Box>
  </VStack>
);

export default GradientDescentPage; 