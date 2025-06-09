import { Box, Heading, Text, Link, VStack } from "@chakra-ui/react";

const Contact = () => (
    <Box>
      <Heading as="h2" size="lg" mb={4} textTransform="lowercase" fontWeight="semibold" color="white">
        Contact
      </Heading>
      <VStack align="start" spacing={1}>
        <Text color="white">
          <Link href="mailto:siai.chaitanyap@gmail.com" color="blue.300" textTransform="lowercase">Email</Link>
        </Text>
        <Text color="white">
          <Link href="https://www.linkedin.com/in/psaichaitanya/" isExternal color="blue.300" textTransform="lowercase">LinkedIn</Link>
        </Text>
        <Text color="white">
          <Link href="https://twitter.com/chai_anya" isExternal color="blue.300" textTransform="lowercase">Twitter</Link>
        </Text>
      </VStack>
    </Box>
  );
  

export default Contact;