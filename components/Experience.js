import { Box, Heading, Text, VStack, Link } from "@chakra-ui/react";

const Experience = () => (
  <Box>
    <Heading as="h2" size="md" mb={4} textTransform="lowercase" fontWeight="semibold">Experience</Heading>
    <VStack align="start" spacing={4} textTransform="lowercase">
      <Box>
        <Link href="https://www.cgi.com/en" fontWeight="semibold">CGI</Link>
        <Text fontSize="sm" color="gray.500">Associate Software Engineer | Sep 2020 - Jun 2022</Text>
        <Text>Led data initiatives, developed dashboards, optimized ETL processes, and managed server deployments, reducing costs by 23% and earning 'Best Employee' for Q4 2021.</Text>
      </Box>
      <Box>
        <Link href="https://www.linkedin.com/company/imbuedesk/?originalSubdomain=in" fontWeight="semibold">Imbuedesk</Link>
        <Text fontSize="sm" color="gray.500">Machine Learning Engineer | May 2018 - Aug 2022</Text>
        <Text>Developed ML models, implemented OCR pipelines, improving efficiency and serving 50k+ users.</Text>
      </Box>
    </VStack>
  </Box>
);
export default Experience;
