import { Box, Flex, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);

const TypingIndicator = () => {
  return (
    <Flex
      align="center"
      gap="0.75rem"
      color="#888888"
      fontSize="0.85rem"
      mb="0.75rem"
      fontWeight="300"
      animation="typingAppear 0.4s ease-out"
      sx={{
        '@keyframes typingAppear': {
          from: {
            opacity: 0,
            transform: 'translateY(10px)',
          },
          to: {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
      }}
    >
      <Text>thinking...</Text>
      <Flex gap="0.3rem">
        {[0, 1, 2].map((i) => (
          <MotionBox
            key={i}
            w="4px"
            h="4px"
            bg="linear-gradient(135deg, #4a9eff 0%, #66b3ff 100%)"
            borderRadius="50%"
            boxShadow="0 0 8px rgba(74, 158, 255, 0.3)"
            animate={{
              opacity: [0.3, 1, 0.3],
              transform: ['scale(0.8)', 'scale(1.2)', 'scale(0.8)'],
              boxShadow: [
                '0 0 4px rgba(74, 158, 255, 0.2)',
                '0 0 12px rgba(74, 158, 255, 0.6)',
                '0 0 4px rgba(74, 158, 255, 0.2)'
              ],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.16,
            }}
          />
        ))}
      </Flex>
    </Flex>
  );
};

export default TypingIndicator;