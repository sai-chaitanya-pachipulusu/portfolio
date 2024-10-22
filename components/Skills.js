/*
import { Box, Heading, Text, VStack, SimpleGrid } from "@chakra-ui/react";
import { IconCloud } from "react-icon-cloud";
import {
  SiPython,
  SiCplusplus,
  SiJavascript,
  SiR,
  SiPytorch,
  SiTensorflow,
  SiKeras,
  SiScikitlearn,
  SiSpacy,
  SiNumpy,
  SiPandas,
  SiMysql,
  SiMariadb,
  SiPostgresql,
  SiMongodb,
  SiJupyter,
  SiSelenium,
} from "react-icons/si";
import { FaAws, FaDocker, FaGit, FaLinux } from "react-icons/fa";
import { DiDocker, DiGithub, DiHeroku, DiLinux, DiSpark, DiUbuntu} from "react-icons/di";
const skillIcons = [
  <SiPython title="Python" />,
  <SiCplusplus title="C++" />,
  <SiJavascript title="JavaScript" />,
  <SiR title="R" />,
  //<SiSql title="SQL" />,
  <SiPytorch title="PyTorch" />,
  <SiTensorflow title="TensorFlow" />,
  <SiKeras title="Keras" />,
  <SiScikitlearn title="Scikit-learn" />,
  //<SiXgboost title="XGBoost" />,
  <SiSpacy title="spaCy" />,
  <SiNumpy title="NumPy" />,
  <SiPandas title="Pandas" />,
  //<SiReact title="React" />,
  //<SiNextdotjs title="Next.js" />,
  //<SiChakraui title="Chakra UI" />,
  //<SiHtml5 title="HTML5" />,
  //<SiCss3 title="CSS3" />,
  //<SiNodedotjs title="Node.js" />,
  //<SiExpress title="Express.js" />,
  <SiMysql title="MySQL" />,
  <SiMariadb title="MariaDB" />,
  <SiPostgresql title="PostgreSQL" />,
  <SiMongodb title="MongoDB" />,
  <FaAws title="AWS" />,
  <FaDocker title="Docker" />,
  <FaGit title="Git" />,
  <FaLinux title="Linux" />,
  <SiJupyter title="Jupyter" />,
  <SiSelenium title="Selenium" />,
  <DiSpark title="Spark" />,
  <DiUbuntu title="Ubuntu" />,
  <DiDocker title="Docker" />,
  <DiGithub title="GitHub" />,
  <DiHeroku title="Heroku" />,
  //<SiBeautifulsoup title="BeautifulSoup" />,
  // Add other icons as needed
];
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
/*
const SkillCategory = ({ title, skills }) => (
  <Box>
    <Text fontWeight="semibold" mb={2}>{title}</Text>
    <Text>{skills.join(", ")}</Text>
  </Box>
);
const Skills = () => (
  <Box>
    <Heading
      as="h2"
      size="md"
      mb={4}
      textTransform="lowercase"
      fontWeight="semibold"
    >
      Skills
    </Heading>
    <Box mt={4}>
      <IconCloud
        minSpeed={0.05}
        maxSpeed={0.2}
        iconSize={50}
        icons={skillIcons}
      />
    </Box>
    <SimpleGrid
      columns={[1, null, 2]}
      spacing={4}
      textTransform="lowercase"
      mt={8}
    >
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
/*
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
*/
/*
export default Skills;
*/

import { Box, Heading, Text, VStack, SimpleGrid } from "@chakra-ui/react";

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