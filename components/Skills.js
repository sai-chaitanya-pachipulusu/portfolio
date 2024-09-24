import { Box, Heading, Text, VStack, SimpleGrid } from "@chakra-ui/react";
/*
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
*/
const SkillCategory = ({ title, skills }) => (
  <Box>
    <Text fontWeight="semibold" mb={2}>{title}</Text>
    <Text>{skills.join(", ")}</Text>
  </Box>
);

const Skills = () => (
  <Box>
    <Heading as="h2" size="md" mb={4} textTransform="lowercase" fontWeight="semibold">Skills</Heading>
    <SimpleGrid columns={[1, null, 2]} spacing={4} textTransform="lowercase">
      <SkillCategory 
        title="Programming Languages"
        skills={["Python", "C++", "JavaScript", "R", "SQL"]}
      />
      <SkillCategory 
        title="Machine Learning & AI"
        skills={["Machine Learning", "Deep Learning", "NLP", "PyTorch", "TensorFlow", "Keras", "Scikit-learn", "XGBoost", "spaCy", "NLTK", "Reinforcement Learning"]}
      />
      <SkillCategory 
        title="Data Processing & Analysis"
        skills={["NumPy", "Pandas", "Spark", "Data Visualization", "Data Analysis", "Matplotlib", "Seaborn", "Tableau", "PowerBI"]}
      />
      <SkillCategory 
        title="Generative AI"
        skills={["LLMs", "Prompt Engineering", "Amazon Bedrock", "Vector Databases (Weaviate, Pinecone)", "RAG Pipelines", "LangChain", "Llamaindex", "Open Source LLMs"]}
      />
      <SkillCategory 
        title="Web Development"
        skills={["React", "Next.js", "Chakra UI", "HTML", "CSS", "Node.js", "Express.js"]}
      />
      <SkillCategory 
        title="Databases"
        skills={["MySQL", "MariaDB", "PostgreSQL", "MongoDB"]}
      />
      <SkillCategory 
        title="DevOps & Tools"
        skills={["AWS", "Docker", "Git", "Linux/UNIX", "CUDA"]}
      />
      <SkillCategory 
        title="Other Tools"
        skills={["SageMaker", "Databricks", "Jupyter", "Colab", "Selenium", "BeautifulSoup"]}
      />
    </SimpleGrid>
  </Box>
);

export default Skills;
