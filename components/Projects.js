import { Box, Heading, Text, Link, VStack, Flex, Spacer, Tag, Button, Icon } from "@chakra-ui/react";
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { FaExternalLinkAlt, FaDownload } from 'react-icons/fa';

const Projects = () => (
  <Box>
    <Heading as="h2" size="lg" mb={6} textTransform="lowercase" fontWeight="semibold" color="white">Projects</Heading>
    <VStack spacing={6} align="stretch">

      <Box 
          width="100%" 
          bg="rgba(255, 255, 255, 0.03)" 
          borderRadius="lg" 
          boxShadow="md"
          //border="2px solid rgba(74, 158, 255, 0.3)"
          transition="transform 0.2s ease-out, box-shadow 0.2s ease-out"
          _hover={{
              transform: 'translateY(-4px)', 
              boxShadow: 'md',
              //borderColor: 'rgba(74, 158, 255, 0.5)'
          }}
          overflow="hidden"
      >
          <Flex alignItems="center" mb={3} px={5} pt={5}>
              <Heading as="h3" size="md" fontWeight="semibold" color="white">Sidebuilds</Heading>
              <Spacer />
              <Flex gap={3}>
                  <Link href="https://www.sidebuilds.space/" isExternal>
                      <Flex align="center" gap={1}>
                          <Text color="blue.300" fontSize="sm">Live Site</Text>
                          <Icon as={FaExternalLinkAlt} color="blue.300" boxSize={3} />
                      </Flex>
                  </Link>
              </Flex>
          </Flex>
          <VStack align="start" spacing={2} px={5} pb={5}>
              <Text fontSize="md" color="whiteAlpha.800">Problem: Developers and creators struggle to discover and showcase innovative side projects, limiting collaboration and inspiration within the tech community.</Text>
              <Text fontSize="md" color="white">Solution: Built a curated platform for discovering and sharing side projects, featuring modern UI/UX design, project categorization, and community-driven discovery mechanisms.</Text>
              <Text fontSize="md" color="white">Impact/Learning: Created a hub for developer creativity and collaboration. Gained experience in full-stack development, community platform design, and user engagement strategies.</Text>
              <Box pt={2}>
                  {["Next.js", "React", "Modern UI/UX", "Community Platform", "Full-Stack", "Curation"].map((t, index) => (
                      <Tag key={index} size="sm" variant="subtle" colorScheme="blue" mr={2} mb={1}>{t}</Tag>
                  ))}
              </Box>
          </VStack>
      </Box>

      <Box 
          width="100%" 
          bg="rgba(255, 255, 255, 0.03)" 
          borderRadius="lg" 
          boxShadow="sm"
          transition="transform 0.2s ease-out, box-shadow 0.2s ease-out"
          _hover={{
              transform: 'translateY(-4px)', 
              boxShadow: 'md' 
          }}
          overflow="hidden"
      >
          <Flex alignItems="center" mb={3} px={5} pt={5}>
              <Heading as="h3" size="md" fontWeight="semibold" color="white">Career Guidance Agent</Heading>
              <Spacer />
              <Link href="https://github.com/sai-chaitanya-pachipulusu/Career-Guidance-Agent" isExternal>
                  <Flex align="center" gap={1}>
                      <Text color="blue.300" fontSize="sm">View on GitHub</Text>
                      <Icon as={FaExternalLinkAlt} color="blue.300" boxSize={3} />
                  </Flex>
              </Link>
          </Flex>
          <VStack align="start" spacing={2} px={5} pb={5}>
              <Text fontSize="md" color="whiteAlpha.800">Problem: Navigating career paths is complex; job seekers need tailored guidance beyond generic advice.</Text>
              <Text fontSize="md" color="white">Solution: Developed an AI agent leveraging GPT-3.5/4 to analyze job descriptions and generate personalized, context-aware career roadmaps via a conversational interface.</Text>
              <Text fontSize="md" color="white">Impact/Learning: Provided users with actionable, step-by-step career plans. Gained expertise in advanced chatbot architecture, stateful memory management, and asynchronous execution using Langchain.</Text>
              <Box pt={2}>
                  {["LLMs (GPT-3.5/4)", "Langchain", "Streamlit", "Asyncio", "API Design"].map((t, index) => (
                      <Tag key={index} size="sm" variant="subtle" colorScheme="cyan" mr={2} mb={1}>{t}</Tag>
                  ))}
              </Box>
          </VStack>
      </Box>

      <Box 
          width="100%" 
          bg="rgba(255, 255, 255, 0.03)" 
          borderRadius="lg" 
          boxShadow="sm"
          transition="transform 0.2s ease-out, box-shadow 0.2s ease-out"
          _hover={{
              transform: 'translateY(-4px)', 
              boxShadow: 'md' 
          }}
          overflow="hidden"
      >
          <Flex alignItems="center" mb={3} px={5} pt={5}>
              <Heading as="h3" size="md" fontWeight="semibold" color="white">SaaS Information Chatbot</Heading>
              <Spacer />
               <Text color="gray.500" fontSize="sm">Private Repository</Text>
           </Flex>
          <VStack align="start" spacing={2} px={5} pb={5}>
              <Text fontSize="md" color="whiteAlpha.800">Problem: Accessing specific, accurate information about SaaS products often requires navigating complex documentation or generic FAQs.</Text>
              <Text fontSize="md" color="white">Solution: Engineered a specialized RAG chatbot by fine-tuning a Mixtral 8x7b MoE model on SaaS-specific data, coupled with a Weaviate vector database pipeline for efficient knowledge retrieval.</Text>
              <Text fontSize="md" color="white">Impact/Learning: Enabled users to quickly find precise SaaS answers. Acquired hands-on experience fine-tuning large Mixture-of-Experts models and architecting scalable RAG systems.</Text>
              <Box pt={2}>
                  {["Fine-tuning", "Mixtral 8x7b", "RAG", "Weaviate", "Langchain", "Python"].map((t, index) => (
                      <Tag key={index} size="sm" variant="subtle" colorScheme="cyan" mr={2} mb={1}>{t}</Tag>
                  ))}
              </Box>
          </VStack>
      </Box>

      <Box 
          width="100%" 
          bg="rgba(255, 255, 255, 0.03)" 
          borderRadius="lg" 
          boxShadow="sm"
          transition="transform 0.2s ease-out, box-shadow 0.2s ease-out"
          _hover={{
              transform: 'translateY(-4px)', 
              boxShadow: 'md' 
          }}
          overflow="hidden"
      >
          <Flex alignItems="center" mb={3} px={5} pt={5}>
              <Heading as="h3" size="md" fontWeight="semibold" color="white">AI vs Human Text Detection</Heading>
              <Spacer />
              <Link href="https://github.com/chaitanyasaip/AIvs.Human" isExternal color="blue.300" fontSize="sm">
                   GitHub <ExternalLinkIcon mx="2px" />
              </Link>
          </Flex>
          <VStack align="start" spacing={2} px={5} pb={5}>
              <Text fontSize="md" color="whiteAlpha.800">Problem: The rise of sophisticated AI text generation makes distinguishing AI from human writing increasingly difficult and important for content authenticity.</Text>
              <Text fontSize="md" color="white">Solution: Built and trained a classification model using SVMs on sentence embeddings to differentiate between human-authored and ChatGPT-generated text with high fidelity.</Text>
              <Text fontSize="md" color="white">Impact/Learning: Achieved 90% accuracy and 89% F1-score, providing a reliable method for text source identification. Gained insights into linguistic markers of AI generation.</Text>
              <Box pt={2}>
                  {["SVM", "SentenceTransformers", "Scikit-learn", "NLP", "Classification", "Python"].map((t, index) => (
                      <Tag key={index} size="sm" variant="subtle" colorScheme="cyan" mr={2} mb={1}>{t}</Tag>
                  ))}
              </Box>
          </VStack>
      </Box>
      
      <Box 
          width="100%" 
          bg="rgba(255, 255, 255, 0.03)" 
          borderRadius="lg" 
          boxShadow="sm"
          transition="transform 0.2s ease-out, box-shadow 0.2s ease-out"
          _hover={{
              transform: 'translateY(-4px)', 
              boxShadow: 'md' 
          }}
          overflow="hidden"
      >
          <Flex alignItems="center" mb={3} px={5} pt={5}>
              <Heading as="h3" size="md" fontWeight="semibold" color="white">Toxic Spans Detection</Heading>
              <Spacer />
              <Link href="https://github.com/chaitanyasaip/Toxic-Span-Detection" isExternal color="blue.300" fontSize="sm">
                   GitHub <ExternalLinkIcon mx="2px" />
              </Link>
          </Flex>
          <VStack align="start" spacing={2} px={5} pb={5}>
              <Text fontSize="md" color="whiteAlpha.800">Problem: Online platforms require automated tools to precisely identify and moderate harmful or toxic segments within user-generated content.</Text>
              <Text fontSize="md" color="white">Solution: Implemented and fine-tuned a BERT-based classifier using PyTorch specifically for sequence labeling, accurately identifying the start and end points of toxic text spans.</Text>
              <Text fontSize="md" color="white">Impact/Learning: Developed a model achieving an 84% F1-score for precise toxicity detection. Deepened expertise in fine-tuning Transformer models (BERT) for token-level tasks in PyTorch.</Text>
              <Box pt={2}>
                  {["BERT", "PyTorch", "NLP", "Sequence Labeling", "Transformers", "Python"].map((t, index) => (
                      <Tag key={index} size="sm" variant="subtle" colorScheme="cyan" mr={2} mb={1}>{t}</Tag>
                  ))}
              </Box>
          </VStack>
      </Box>

      <Box 
          width="100%" 
          bg="rgba(255, 255, 255, 0.03)" 
          borderRadius="lg" 
          boxShadow="sm"
          transition="transform 0.2s ease-out, box-shadow 0.2s ease-out"
          _hover={{
              transform: 'translateY(-4px)', 
              boxShadow: 'md' 
          }}
          overflow="hidden"
      >
          <Flex alignItems="center" mb={3} px={5} pt={5}>
              <Heading as="h3" size="md" fontWeight="semibold" color="white">University Recommendation System</Heading>
              <Spacer />
              <Link href="https://github.com/chaitanyasaip/University-Recommendation-System" isExternal color="blue.300" fontSize="sm">
                   GitHub <ExternalLinkIcon mx="2px" />
              </Link>
          </Flex>
          <VStack align="start" spacing={2} px={5} pb={5}>
              <Text fontSize="md" color="whiteAlpha.800">Problem: Prospective students often struggle to gauge their admission chances at US universities, and available data is frequently inconsistent or inaccurate.</Text>
              <Text fontSize="md" color="white">Solution: Designed a system leveraging clustering algorithms to predict admission likelihood to Tier-A/B universities, preceded by rigorous EDA and data cleansing that corrected 40% of the initial dataset.</Text>
              <Text fontSize="md" color="white">Impact/Learning: Created a data-driven tool to aid university applicants. Demonstrated critical data preprocessing skills and applied machine learning for a practical recommendation task.</Text>
              <Box pt={2}>
                  {["Scikit-learn", "Clustering", "EDA", "Data Cleansing", "Pandas", "Python"].map((t, index) => (
                      <Tag key={index} size="sm" variant="subtle" colorScheme="cyan" mr={2} mb={1}>{t}</Tag>
                  ))}
              </Box>
          </VStack>
      </Box>

    </VStack>
  </Box>
);

export default Projects;