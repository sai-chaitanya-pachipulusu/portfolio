import { Box,  Heading, Text, VStack } from "@chakra-ui/react";

const About = () => (
    <Box>
      <Heading as="h2" size="md" mb={4} textTransform="lowercase" fontWeight="semibold">About</Heading>
      <VStack align="start" spacing={1} textTransform="lowercase">
        <Text>
          I currently work at Community Dreams Foundation as a Machine Learning Engineer and building persona on the side. More details soon.
        </Text>
        <Text>
          I am passionate about applying the use of AI to solve real-world problems.
        </Text>
        <Text>
          I care deeply about learning and applying Machine Learning. I am also an avid enjoyer of seeing things grow.
        </Text>
        <Text>
          I am currently learning about Reinforcement Learning.
        </Text>
      </VStack>
    </Box>
  );
  
  export default About;