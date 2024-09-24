import { Box, Heading, Text, Link, VStack } from "@chakra-ui/react";

const Contact = () => (
    <Box>
      <Heading as="h2" size="md" mb={4} textTransform="lowercase" fontWeight="semibold">Contact</Heading>
      <VStack align="start" spacing={1}>
        <Text>
          <Link href="mailto:siai.chaitanyap@gmail.com" color="grey.700" textTransform="lowercase">Email</Link>
        </Text>
        <Text>
          <Link href="https://www.linkedin.com/in/psaichaitanya/" isExternal color="grey.700" textTransform="lowercase">LinkedIn</Link>
        </Text>
      </VStack>
    </Box>
  );
  

export default Contact;