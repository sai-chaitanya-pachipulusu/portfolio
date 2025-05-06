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
      <Heading as="h2" size="md" mb={4} textTransform="lowercase" fontWeight="semibold">{title}</Heading>
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
    <Box py={10}>
      <Heading as="h2" size="lg" mb={4} textTransform="lowercase" fontWeight="semibold">ML Engineering Toolkit</Heading>
      <Text textAlign="left" mb={10} fontSize="md" color="gray.400">
        Focused on building, deploying, and optimizing robust machine learning systems from prototype to production.
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>

        <SkillCategory title="Programming & Development" icon={FaPython}>
          <Text fontSize="sm" mb={3} color="gray.300">Core languages and frameworks for model development and application building.</Text>
          <SkillTag>Python (Proficient)</SkillTag>
          <SkillTag>NumPy</SkillTag>
          <SkillTag>Pandas</SkillTag>
          <SkillTag>Scikit-learn</SkillTag>
          <SkillTag>FastAPI</SkillTag>
          <SkillTag>JavaScript/TypeScript</SkillTag>
          <SkillTag>React</SkillTag>
          <SkillTag>Next.js</SkillTag>
          <SkillTag>SQL</SkillTag>
          <SkillTag>Git & GitHub</SkillTag>
        </SkillCategory>

        <SkillCategory title="Machine Learning & DL" icon={SiPytorch}>
           <Text fontSize="sm" mb={3} color="gray.300">Leveraging frameworks and techniques to build intelligent models.</Text>
          <SkillTag>PyTorch</SkillTag>
          <SkillTag>TensorFlow/Keras</SkillTag>
          <SkillTag>Hugging Face Transformers</SkillTag>
          <SkillTag>NLP Techniques</SkillTag>
          <SkillTag>Embedding Models</SkillTag>
          <SkillTag>Model Evaluation</SkillTag>
           {/* Add Computer Vision, RL etc. if applicable */}
        </SkillCategory>

        <SkillCategory title="MLOps & Deployment" icon={FaDocker}>
          <Text fontSize="sm" mb={3} color="gray.300">Bridging the gap between models and production applications.</Text>
          <SkillTag>Docker</SkillTag>
          <SkillTag>CI/CD Concepts</SkillTag>
          <SkillTag>API Development (FastAPI)</SkillTag>
          <SkillTag>Cloud Platforms (AWS/GCP/Azure Basics)</SkillTag>
          {/* Add Kubernetes, Terraform, Monitoring Tools (Prometheus/Grafana) if applicable */}
        </SkillCategory>

         <SkillCategory title="Data Tools & Databases" icon={FaDatabase}>
          <Text fontSize="sm" mb={3} color="gray.300">Handling and processing data, the foundation of ML.</Text>
          <SkillTag>Vector Databases (ChromaDB)</SkillTag>
          <SkillTag>Graph Databases (Neo4j Basics)</SkillTag>
          <SkillTag>SQL Databases (e.g., PostgreSQL)</SkillTag>
          <SkillTag>NoSQL Databases (e.g., MongoDB Basics)</SkillTag>
          {/* Add Spark, Airflow, Data Warehouses if applicable */}
        </SkillCategory>

        <SkillCategory title="Currently Exploring" icon={BsGraphUp}>
          <Text fontSize="sm" mb={3} color="gray.300">Actively deepening understanding and practical skills in cutting-edge areas.</Text>
          <SkillTag>Advanced RAG Techniques</SkillTag>
          <SkillTag>Knowledge Graphs for ML</SkillTag>
          <SkillTag>AI Agents</SkillTag>
        </SkillCategory>

         <SkillCategory title="LLM Optimization" icon={BsLightningCharge}>
          <Text fontSize="sm" mb={3} color="gray.300">Learning techniques to make large models more efficient.</Text>
          <SkillTag>Quantization (BitsAndBytes, GPTQ)</SkillTag>
          <SkillTag>Model Distillation</SkillTag>
          <SkillTag>Pruning</SkillTag>
        </SkillCategory>

      </SimpleGrid>
    </Box>
  );
};

export default Skills;