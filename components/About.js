import { Box, Heading, Text, VStack, Link, Icon, Flex } from "@chakra-ui/react";
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { BsGraphUp, BsLightningCharge } from 'react-icons/bs';

const About = () => {
  return (
    <VStack 
      spacing={6} 
      align="start" 
      py={10}
      transition="transform 0.2s ease-out, box-shadow 0.2s ease-out"
      _hover={{
          transform: 'translateY(-4px)',
      }} 
    >
      <Heading as="h1" size="md" fontWeight="medium" color="gray.300" >
        Hi, I'm Sai Chaitanya Pachipulusu
      </Heading>
      
      <Text fontSize="md" color="gray.300">
        A Machine Learning Engineer driven by the challenge of transforming complex data into intelligent, real-world applications. I thrive at the intersection of software engineering rigor and cutting-edge ML research, focusing on building systems that not only perform but also scale and adapt.
      </Text>
      
      <Text fontSize="md" color="gray.300">
        My journey involves architecting data pipelines, developing robust models (especially with PyTorch and the Hugging Face ecosystem), and ensuring seamless deployment using tools like Docker. Currently, I'm diving deep into the fascinating world of Large Language Models, specifically exploring:
      </Text>

       <VStack align="start" pl={4} spacing={2} borderLeft="2px solid" borderColor="blue.300">
          <Text fontSize="sm" color="gray.200"> <Icon as={BsGraphUp} mr={2} color="blue.300" /> Building smarter AI assistants using **Graph RAG** techniques (like the one powering the chat on this site!).</Text>
          <Text fontSize="sm" color="gray.200"> <Icon as={BsLightningCharge} mr={2} color="blue.300" /> Optimizing LLMs through **quantization, distillation, and pruning** to make them more accessible and efficient.</Text>
       </VStack>
      
      <Text fontSize="md" color="gray.300">
        Beyond the code, I'm passionate about continuous learning and sharing knowledge within the AI community. Let's connect and build something impactful!
      </Text>
    </VStack>
  );
};

export default About;