import { Box, Heading, Text, VStack, Link, UnorderedList, ListItem } from "@chakra-ui/react";

const Experience = () => (
  <Box>
    <Heading as="h2" size="lg" mb={6} textTransform="lowercase" fontWeight="semibold" color="white">Experience</Heading>
    <VStack spacing={6} align="stretch">
      <Box width="100%">
        <Link href="https://test-dreams.dreamhosters.com/" fontWeight="semibold">Community Dreams Foundation</Link>
        <Text fontSize="md" color="white">Machine Learning Engineer | July 2024 - Present</Text>
        <UnorderedList mt={2} spacing={1} pl={4}>
          <ListItem>Led development of HR matching platform utilizing E5-large embeddings and DeBERTa-v3 cross-encoders that slashed candidate screening time from 8 to 3 hours per requisition; implemented vector-based similarity search with neural reranking that improved qualified candidate identification by 18% across 15,000+ monthly applications</ListItem>
          <ListItem>Delivered 40% reduction in time-to-hire by designing LambdaMART contextual ranking algorithms prioritizing candidate-job fit; implemented Kubernetes/KServe architecture with blue-green deployment supporting 3x traffic spikes with 70% resource efficiency, saving $45K annually in infrastructure costs</ListItem>
          <ListItem>Solved critical data security roadblock through model distillation (Phi-3-vision to Phi-3-mini) with quantization techniques (INT8/QLoRA); created lightweight on-premise solution maintaining 97% accuracy while meeting strict data sovereignty requirements across 50+ HR departments, unlocking $1.2M in new contracts</ListItem>
          <ListItem>Eliminated candidate frustration point with NLP-powered communications using fine-tuned Phi-3-mini models and task-specific LoRA adapters; implemented human-in-the-loop preference learning generating personalized messages with 96% positive reception, reducing negative reviews by 42%</ListItem>
          <ListItem>Reduced HR support workload by 35% through RAG architecture built on Llama-3-8B-Instruct, hybrid search (BM25+vector), E5-large embeddings and Weaviate on AWS SageMaker; achieved 92% RAGAS-evaluated query resolution on first attempt, freeing HR staff for high-value candidate interactions</ListItem>

        </UnorderedList>
      </Box>

      <Box width="100%">
        <Link href="https://www.cgi.com/en" fontWeight="semibold">CGI Information Systems and Management Consultants Pvt. Ltd</Link>
        <Text fontSize="md" color="white">Data Engineer/Associate Software Engineer | Sep 2020 - Jun 2022</Text>
        <UnorderedList mt={2} spacing={1} pl={4}>
          <ListItem>Engineered real-time sensor data pipelines (Kafka Connect, Spark Streaming) for 8 critical streams (400 events/sec), processing with Python (envelope/spectral analysis) in Spark, landing in BigQuery; reduced data availability lag from batch to less than 5 mins & cut false anomaly alerts by 30%</ListItem>
          <ListItem>Deployed regression and transfer-learning models for predictive maintenance using Azure ML for experiment tracking & endpoint creation; reduced model deployment time by 50% through containerization (Docker) and Kubernetes (AKS) orchestration</ListItem>
          <ListItem>Engineered 15+ Python ETL scripts to process daily Shell refinery data files (CSV, JSON) into a centralized SQL data warehouse, enabling critical dashboard KPIs previously unavailable to operating teams</ListItem>
          <ListItem>Led migration of 52 legacy servers to AWS EC2 (t3.xlarge) using Terraform for IaC; reduced monthly operational costs by $8k and ensured 99.9% uptime over a 6-month period</ListItem>
          <ListItem>Optimized Databricks Medallion architecture with robust schema validation and incremental processing; decreased data pipeline failures by 75% (12 to 3 weekly) and cut data recovery time from 4 hours to 45 minutes</ListItem>
          <ListItem>Awarded `Best Employee of the Quarter’ (Q4 2021) for leading 30% of the data migration effort, enhancing project efficiency, and fostering cross-functional team collaboration</ListItem>

        </UnorderedList>
      </Box>

      <Box width="100%">
        <Link href="https://www.linkedin.com/company/imbuedesk/?originalSubdomain=in" fontWeight="semibold">Imbuedesk Pvt. Ltd</Link>
        <Text fontSize="md" color="white">Machine Learning Engineer | May 2018 - Aug 2020</Text>
        <UnorderedList mt={2} spacing={1} pl={4}>
          <ListItem>Fine-tuned ResNet-50 & custom VGG-16 (Tensorflow) on AWS (EC2 GPUs, SageMaker) for facial expression recognition (97% FER2013 accuracy) & OCR tasks; gained 2x training speed (mixed-precision) & 12% better model generalization (data augmentation)</ListItem>
          <ListItem>Engineered a high-volume (5k plates/day) vehicle ID recognition pipeline using Tesseract OCR and OpenCV, deployed on Kubernetes for scalable orchestration</ListItem>
          <ListItem>Developed and deployed predictive maintenance dashboards (Python, Flask/Dash, AWS Elastic Beanstalk) from multi-modal sensor data, reducing equipment downtime by an estimated 28%</ListItem>
          <ListItem>Built robust ETL workflows (PySpark, Apache Airflow) to process multi-modal sensor datasets (more than 5k records/day) with 99.9% reliability for ML model training</ListItem>
          <ListItem>Implemented a low-latency (sub-100ms) Kafka data ingestion pipeline for high-frequency LiDAR streams (Python consumers), handling 300% peak load spikes</ListItem>
          <ListItem>Improved model generalization by 12% through systematic image data preprocessing & augmentation (normalization, cropping, rotation, color jitter) for robust computer vision model training</ListItem>
          <ListItem>Experimented with Reinforcement Learning (Q-learning/Policy Gradients) using OpenAI Gym & Tensorflow for dynamic resource allocation in a simulated image-processing cluster, demonstrating potential for 20% throughput gains</ListItem>

        </UnorderedList>
      </Box>
    </VStack>
  </Box>
);

export default Experience;
