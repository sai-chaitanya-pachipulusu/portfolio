// components/Skills.js
import { Box, Heading, SimpleGrid, Text, Tag, VStack, Icon, Flex } from "@chakra-ui/react";
// Import relevant icons if desired, e.g., from react-icons
import { FaPython, FaDocker, FaReact, FaAws, FaDatabase } from 'react-icons/fa';
import { SiPytorch, SiTensorflow, SiKubernetes, SiApachespark, SiFastapi, SiNeo4j } from 'react-icons/si';
import { VscTools } from "react-icons/vsc"; // Generic tools icon
import { BsGraphUp, BsLightningCharge } from "react-icons/bs"; // Icons for Graph/Optimization

const SkillCategory = ({ title, icon, children }) => (
  <VStack spacing={3} align="stretch" p={5} bg="rgba(255, 255, 255, 0.05)" borderRadius="lg" boxShadow="sm">
    <Flex align="center" mb={2}>
      <Icon as={icon} w={4} h={4} mr={3} color="blue.300" />
      <Heading as="h2" size="md" mb={4} textTransform="lowercase" fontWeight="semibold" color="white">
        {title}
      </Heading>
    </Flex>
    <Box pl={7}> {/* Indent content under icon/title */}
      {children}
    </Box>
  </VStack>
);

const SkillTag = ({ children }) => (
  <Tag 
    size="sm" 
    variant="subtle" 
    colorScheme="blue" 
    mr={2} 
    mb={2}
    transition="transform 0.2s ease-out, box-shadow 0.2s ease-out"
    _hover={{
        transform: 'scale(1.05)',
        boxShadow: 'md',
        cursor: 'default'
    }}
  >
    {children}
  </Tag>
);

const Skills = () => {
  return (
    <Box>
      <Heading as="h2" size="lg" mb={6} textTransform="lowercase" fontWeight="semibold" color="white">
        Skills
      </Heading>
      
      <SimpleGrid columns={[1, 1, 2]} spacing={6}>
        <SkillCategory title="Machine Learning & AI" icon={BsGraphUp}>
          <VStack align="start" spacing={2}>
            <Text fontSize="sm" color="white">
              <strong>Frameworks:</strong> PyTorch, TensorFlow, Hugging Face Transformers, Langchain
            </Text>
            <Text fontSize="sm" color="whiteAlpha.900">
              <strong>Specializations:</strong> Graph RAG, LLMs, NLP, Computer Vision, MLOps
            </Text>
            <Text fontSize="sm" color="whiteAlpha.900">
              <strong>Model Optimization:</strong> Quantization, Distillation, Pruning, Fine-tuning
            </Text>
          </VStack>
        </SkillCategory>

        <SkillCategory title="Backend & Infrastructure" icon={VscTools}>
          <VStack align="start" spacing={2}>
            <Text fontSize="sm" color="white">
              <strong>Languages:</strong> Python, JavaScript, SQL
            </Text>
            <Text fontSize="sm" color="whiteAlpha.900">
              <strong>Frameworks:</strong> FastAPI, Node.js, Express.js
            </Text>
            <Text fontSize="sm" color="whiteAlpha.900">
              <strong>DevOps:</strong> Docker, Kubernetes, AWS, CI/CD
            </Text>
          </VStack>
        </SkillCategory>

        <SkillCategory title="Data Engineering" icon={FaDatabase}>
          <VStack align="start" spacing={2}>
            <Text fontSize="sm" color="white">
              <strong>Databases:</strong> PostgreSQL, MongoDB, Neo4j, Weaviate
            </Text>
            <Text fontSize="sm" color="whiteAlpha.900">
              <strong>Processing:</strong> Apache Spark, Pandas, Numpy
            </Text>
            <Text fontSize="sm" color="whiteAlpha.900">
              <strong>Vector DBs:</strong> Pinecone, Chroma, FAISS
            </Text>
          </VStack>
        </SkillCategory>

        <SkillCategory title="Frontend Development" icon={FaReact}>
          <VStack align="start" spacing={2}>
            <Text fontSize="sm" color="white">
              <strong>Frameworks:</strong> React.js, Next.js, Chakra UI
            </Text>
            <Text fontSize="sm" color="whiteAlpha.900">
              <strong>Languages:</strong> TypeScript, JavaScript, HTML/CSS
            </Text>
            <Text fontSize="sm" color="whiteAlpha.900">
              <strong>Tools:</strong> Tailwind CSS, Framer Motion
            </Text>
          </VStack>
        </SkillCategory>
      </SimpleGrid>
    </Box>
  );
};

export default Skills;