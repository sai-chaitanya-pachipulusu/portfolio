import { Box, Flex } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);

const TypingIndicator = () => {
  return (
    <Flex gap={2} align="center">
      {[0, 1, 2].map((i) => (
        <MotionBox
          key={i}
          animate={{
            y: [-4, 0, -4],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
          w="8px"
          h="8px"
          borderRadius="full"
          bg="blue.300"
        />
      ))}
    </Flex>
  );
};

export default TypingIndicator;