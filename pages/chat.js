import { Box, Container } from '@chakra-ui/react';
import Chat from '../components/Chat';
import BlurSection from '../components/BlurSection';

export default function ChatPage() {
  return (
    <Container maxW="container.xl" py={8}>
      <BlurSection>
        <Box
          w="full"
          maxW="800px"
          mx="auto"
          h="calc(100vh - 100px)"
          bg="gray.900"
          borderRadius="xl"
          boxShadow="2xl"
          overflow="hidden"
        >
          <Chat />
        </Box>
      </BlurSection>
    </Container>
  );
}