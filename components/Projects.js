import { Box, Heading, Text, Link, VStack, Flex, Spacer } from "@chakra-ui/react";

const Projects = () => (
  <Box>
    <Heading as="h2" size="md" mb={4} textTransform="lowercase" fontWeight="semibold">Projects</Heading>
    <VStack align="start" spacing={4} textTransform="lowercase">
      <Box width="100%">
        <Flex alignItems="center">
          <Text fontWeight="semibold">Career Roadmap Generator</Text>
          <Spacer />
          <Link href="https://huggingface.co/SaiChaitanya/Career_Roadmap" color="grey.700" textTransform="lowercase" fontSize="sm">Huggingface</Link>
        </Flex>
        <Text>Integrated GPT 3.5 and GPT-4 models to provide context-aware roadmaps for job descriptions. Implemented scalable chatbot solutions using conversation memory management and asynchronous execution with asyncio design principles.</Text>
        <Text fontSize="sm" color="gray.500">Technologies: Generative AI Chatbot, API, Langchain, Streamlit, ChromaDB</Text>
      </Box>

      <Box width="100%">
        <Flex alignItems="center">
          <Text fontWeight="semibold">SaaS Chatbot</Text>
          <Spacer/>
          <Link href="#" color="grey.700" textTransform="lowercase" fontSize="sm">didn't upload anywhere</Link>
        </Flex>
        <Text>Developed an end-to-end chatbot application by fine-tuning the Mixtral 8x7b MoE model on SaaS-related data. Designed a scalable RAG pipeline integrating Weaviate vector database for efficient information retrieval.</Text>
        <Text fontSize="sm" color="gray.500">Technologies: Large Language Model, Mixtral 8x7b MoE, Langchain, Streamlit, Python</Text>
      </Box>

      <Box width="100%">
        <Flex alignItems="center">
          <Text fontWeight="semibold">AI vs Human: Exploring the limits of Machine Intelligence</Text>
          <Spacer />
          <Link href="https://github.com/chaitanyasaip/AIvs.Human" color="grey.700" textTransform="lowercase" fontSize="sm">GitHub</Link>
        </Flex>
        <Text>Created a model to distinguish between human and ChatGPT answers, achieving 90% accuracy and 89% F1 score. Gained insights about AI-generated and human-generated responses.</Text>
        <Text fontSize="sm" color="gray.500">Technologies: Selenium, SentenceTransformers, SVM, Python</Text>
      </Box>

      <Box width="100%">
        <Flex alignItems="center">
          <Text fontWeight="semibold">Toxic Spans Detection</Text>
          <Spacer />
          <Link href="https://github.com/chaitanyasaip/Toxic-Span-Detection" color="grey.700" textTransform="lowercase" fontSize="sm">GitHub</Link>
        </Flex>
        <Text>Implemented a BERT classifier using PyTorch to identify toxic spans, achieving an F1 score of 84%.</Text>
        <Text fontSize="sm" color="gray.500">Technologies: Colab, PyTorch, BERT, Python</Text>
      </Box>

      <Box width="100%">
        <Flex alignItems="center">
          <Text fontWeight="semibold">University Recommendation System</Text>
          <Spacer />
          <Link href="https://github.com/chaitanyasaip/University-Recommendation-System" color="grey.700" textTransform="lowercase" fontSize="sm">GitHub</Link>
        </Flex>
        <Text>Designed a system to predict student admissions to Tier-A and Tier-B US universities. Enhanced dataset quality by correcting 40% of erroneous data through EDA and data cleansing techniques.</Text>
        <Text fontSize="sm" color="gray.500">Technologies: Scikit-learn, Clustering, EDA, Python</Text>
      </Box>
    </VStack>
  </Box>
);

export default Projects;