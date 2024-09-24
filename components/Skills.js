import { Box, Heading, Text, VStack } from "@chakra-ui/react";

const Skills = () => (
  <Box>
    <Heading as="h2" size="md" mb={4} textTransform="lowercase" fontWeight="semibold">Skills</Heading>
    <VStack align="start" spacing={1} textTransform="lowercase">
      <Text>Python, C++, CUDA</Text>
      <Text>Machine Learning, Deep Learning</Text>
      <Text>PyTorch, TensorFlow, Keras</Text>
      <Text>SQL, AWS, Docker</Text>
    </VStack>
  </Box>
);
export default Skills;
