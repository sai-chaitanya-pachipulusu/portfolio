import { Flex, Box, Text, Avatar, useColorModeValue } from '@chakra-ui/react';

const Message = ({ text, isUser, sources = [] }) => {
  const bgColor = useColorModeValue(
    isUser ? 'blue.500' : 'gray.700',
    isUser ? 'blue.500' : 'gray.700'
  );
  const textColor = 'white';

  return (
    <Flex justify={isUser ? 'flex-end' : 'flex-start'} mb={4} width="100%">
      {!isUser && (
        <Avatar
          size="sm"
          name="AI Assistant"
          src="/images/ai-avatar.png"
          mr={2}
          bg="blue.500"
        />
      )}
      <Box
        maxW="80%"
        bg={bgColor}
        color={textColor}
        px={4}
        py={2}
        borderRadius="lg"
        boxShadow="sm"
        position="relative"
        _after={{
          content: '""',
          position: 'absolute',
          width: '0',
          height: '0',
          borderStyle: 'solid',
          borderWidth: isUser ? '0 0 10px 10px' : '10px 10px 0 0',
          borderColor: isUser 
            ? 'transparent transparent blue.500 transparent'
            : 'transparent gray.700 transparent transparent',
          top: '50%',
          transform: 'translateY(-50%)',
          [isUser ? 'right' : 'left']: '-10px',
        }}
      >
        <Text fontSize="sm" lineHeight="tall">{text}</Text>
        {sources && sources.length > 0 && (
          <Text fontSize="xs" mt={1} color="gray.300" opacity={0.8}>
            Sources: {sources.join(', ')}
          </Text>
        )}
      </Box>
      {isUser && (
        <Avatar
          size="sm"
          name="User"
          ml={2}
          bg="blue.500"
        />
      )}
    </Flex>
  );
};

export default Message;