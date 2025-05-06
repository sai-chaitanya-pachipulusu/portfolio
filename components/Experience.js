import { Box, Heading, Text, VStack, Link, UnorderedList, ListItem } from "@chakra-ui/react";

const Experience = () => (
  <Box>
    <Heading as="h2" size="lg" mb={4} textTransform="lowercase" fontWeight="semibold">Experience</Heading>
    <VStack align="start" spacing={6} textTransform="lowercase">
      <Box width="100%">
        <Link href="https://test-dreams.dreamhosters.com/" fontWeight="semibold">Community Dreams Foundation</Link>
        <Text fontSize="sm" color="gray.500">Machine Learning Engineer | July 2024 - Present</Text>
        <UnorderedList mt={2} spacing={1} pl={4}>
          <ListItem>Architected an HR tool using BERT, RoBERTa, and Sentence-BERT embeddings to match resumes with job descriptions, cutting manual screening by 90% from 10 hours to 1 hour per job and speeding up hiring by 40%</ListItem>
          <ListItem>Built an end-to-end cloud-native pipeline with Python, FastAPI, and Kubeflow on Kubernetes for automated interview scheduling, achieving 92% candidate selection precision measured in pilot with 50 companies</ListItem>
          <ListItem>Automated rejection emails with sentiment-aware templates with VADER score above 0.6, handling 200+ weekly communications and reducing admin work by 90% from 15 hours/week to 1.5 hours/week</ListItem>
          <ListItem>Developed a fine-tuned BERT model and Flask microservice for personalized rejection communications, processing 200+ weekly applicants with 94% positive feedback rate</ListItem>
          <ListItem>Designed a RAG chatbot with Mistral, PyTorch on AWS SageMaker, achieving 90% response relevance and reducing ticket escalations by 25%, saving 200+ hours annually</ListItem>
        </UnorderedList>
      </Box>

      <Box width="100%">
        <Link href="https://www.cgi.com/en" fontWeight="semibold">CGI Information Systems and Management Consultants Pvt. Ltd</Link>
        <Text fontSize="sm" color="gray.500">Data Engineer/Associate Software Engineer | Sep 2020 - Jun 2022</Text>
        <UnorderedList mt={2} spacing={1} pl={4}>
          <ListItem>Developed a real-time ingest layer using Kafka Connect to capture 8 sensor data streams (400 events/second) from factory equipment, reducing data availability lag from overnight batch to less than 5 minutes</ListItem>
          <ListItem>Wrote and maintained 15+ Python ETL scripts to process daily Shell refinery data files into a centralized SQL data warehouse, enabling dashboard KPIs previously unavailable to operating teams</ListItem>
          <ListItem>Led migration of 52 legacy servers to AWS EC2 using Terraform, reducing monthly costs by $18k and ensuring 99.9% uptime over 6-month period</ListItem>
          <ListItem>Optimized Databricks medallion architecture with schema validation and incremental processing, reducing data pipeline failures by 75% per week and cutting recovery time from 4 hours to 45 minutes</ListItem>
          <ListItem>Awarded Best Employee for Q4 2021 for exceptional contributions to project efficiency and collaboration with interdisciplinary teams</ListItem>
        </UnorderedList>
      </Box>

      <Box width="100%">
        <Link href="https://www.linkedin.com/company/imbuedesk/?originalSubdomain=in" fontWeight="semibold">Imbuedesk Pvt. Ltd</Link>
        <Text fontSize="sm" color="gray.500">Machine Learning Engineer | May 2018 - Aug 2020</Text>
        <UnorderedList mt={2} spacing={1} pl={4}>
          <ListItem>Achieved 97% accuracy on FER2013 dataset by developing facial expression recognition system using OpenCV and TensorFlow</ListItem>
          <ListItem>Processed 50K vehicle plates daily by designing an image processing pipeline with Tesseract OCR orchestrated with Kubernetes</ListItem>
          <ListItem>Reduced equipment downtime by 28% through implementation of predictive maintenance dashboards with AWS Beanstalk</ListItem>
          <ListItem>Decreased image processing latency by 66% by building a Kafka-based pipeline handling 35MB/hour with a 3-node consumer topology</ListItem>
          <ListItem>Implemented back-pressure handling for peak traffic periods when processing volume increased by 300%</ListItem>
        </UnorderedList>
      </Box>
    </VStack>
  </Box>
);

export default Experience;
