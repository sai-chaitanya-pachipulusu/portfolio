import { Box, Text } from '@chakra-ui/react';

const Message = ({ text, isUser, sources = [] }) => {
  return (
    <Box
      textAlign={isUser ? 'right' : 'left'}
      fontSize="0.9rem"
      lineHeight="1.6"
      fontWeight="400"
      mb="0.75rem"
      position="relative"
      transition="all 0.3s ease"
      animation="messageSlide 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{
        transform: isUser ? 'translateX(2px)' : 'translateX(-2px)',
      }}
      _after={isUser ? {
        content: '""',
        position: 'absolute',
        right: '-8px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '3px',
        height: '3px',
        bg: '#4a9eff',
        borderRadius: '50%',
        animation: 'pulse 2s infinite',
      } : {}}
      _before={!isUser ? {
        content: '"→"',
        position: 'absolute',
        left: '-20px',
        top: 0,
        color: '#4a9eff',
        fontWeight: 300,
        opacity: 0,
        transition: 'all 0.3s ease',
        transform: 'translateX(-5px)',
      } : {}}
      sx={{
        '@keyframes messageSlide': {
          from: {
            opacity: 0,
            transform: 'translateY(20px) scale(0.95)',
          },
          to: {
            opacity: 1,
            transform: 'translateY(0) scale(1)',
          },
        },
        '@keyframes pulse': {
          '0%, 100%': {
            opacity: 0.4,
            transform: 'translateY(-50%) scale(1)',
          },
          '50%': {
            opacity: 1,
            transform: 'translateY(-50%) scale(1.5)',
          },
        },
        '&:hover::before': !isUser ? {
          opacity: 0.7,
          transform: 'translateX(0)',
        } : {},
      }}
    >
      <Text
        color={isUser ? '#4a9eff' : 'white'}
        fontWeight={isUser ? 500 : 400}
        whiteSpace="pre-line"
      >
        {text}
      </Text>
      {sources && sources.length > 0 && (
        <Text fontSize="xs" mt={1} color="gray.400" opacity={0.8}>
          Sources: {sources.join(', ')}
        </Text>
      )}
    </Box>
  );
};

export default Message;