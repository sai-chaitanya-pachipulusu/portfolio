import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const MLIcon = ({ onClick }) => {
  return (
    <Box
      onClick={onClick}
      cursor="pointer"
      _hover={{
        transform: 'scale(1.1)',
        transition: 'transform 0.2s ease-in-out',
      }}
      p={4} // Add some padding to make it easier to click
    >
      <Text fontSize="2xl" fontWeight="bold" color="white">
        ML
      </Text>
    </Box>
  );
};

export default MLIcon; 