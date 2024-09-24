import { Box, Heading, Text, VStack } from "@chakra-ui/react";

const Experience = () => (
  <Box>
    <Heading as="h2" size="md" mb={4} textTransform="lowercase" fontWeight="semibold">Experience</Heading>
    <VStack align="start" spacing={4} textTransform="lowercase">
      <Box>
        <Text fontWeight="semibold">CGI Information Systems and Management Consultants Pvt. Ltd</Text>
        <Text fontSize="sm" color="gray.500">Associate Software Engineer (Data Scientist) | Sep 2020 - Jun 2022</Text>
        <Text>Spearheaded data ingestion and transformation projects</Text>
      </Box>
      <Box>
        <Text fontWeight="semibold">Imbuedesk</Text>
        <Text fontSize="sm" color="gray.500">Machine Learning Engineer | May 2018 - Aug 2022</Text>
        <Text>Spearheaded data ingestion and transformation projects</Text>
      </Box>
    </VStack>
  </Box>
);
export default Experience;
