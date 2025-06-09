import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';

function Error({ statusCode, hasGetInitialProps, err }) {
  const router = useRouter();

  return (
    <Box
      minH="100vh"
      bg="#0a0a0a"
      color="white"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Heading mb={4}>
        {statusCode ? `${statusCode} - Server Error` : 'Client Error'}
      </Heading>
      <Text mb={6} color="gray.400">
        {statusCode === 404
          ? 'This page could not be found.'
          : 'An error occurred. Please try again.'}
      </Text>
      <Button
        colorScheme="blue"
        onClick={() => router.push('/')}
      >
        Go Home
      </Button>
    </Box>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error; 