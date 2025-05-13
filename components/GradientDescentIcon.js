import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const GradientDescentIcon = ({ onClick }) => {
  return (
    <Box
      onClick={onClick}
      cursor="pointer"
      bg="transparent"
      border="none"
      _hover={{
        transform: 'scale(1.05)',
        color: 'cyan.400', // Example highlight color, can be adjusted
        transition: 'transform 0.2s ease-in-out, color 0.2s ease-in-out',
      }}
      p={2} // Add some padding
    >
      <Text fontSize="xl" fontWeight="medium" color="white">
        Gradient Descent
      </Text>
    </Box>
  );
};

export default GradientDescentIcon; 