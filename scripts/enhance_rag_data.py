#!/usr/bin/env python3
"""
Enhanced RAG Data Collection Script for Portfolio
Adds comprehensive structured data to improve chatbot knowledge
"""

import json
import os
from datetime import datetime
from pathlib import Path

def create_enhanced_portfolio_data():
    """Create comprehensive data structure for Graph RAG system"""
    
    # Enhanced project data with detailed context from updated resume
    projects = [
        {
            "id": "hr-matching-platform",
            "title": "HR Matching Platform - Community Dreams Foundation",
            "timeline": "July 2024 - Present",
            "status": "production",
            "technologies": ["E5-large embeddings", "DeBERTa-v3", "LambdaMART", "Kubernetes", "KServe", "Phi-3-vision", "Phi-3-mini", "LoRA", "Llama-3-8B-Instruct", "BM25", "Weaviate", "AWS SageMaker"],
            "category": "HR Technology / GenAI",
            "description": "Enterprise-scale HR matching platform with AI-powered candidate screening and personalized communications",
            "problem": "Manual candidate screening taking 8+ hours per requisition, inefficient hiring processes, data security concerns",
            "solution": "Vector-based similarity search with neural reranking, contextual ranking algorithms, and on-premise model distillation",
            "technical_details": {
                "architecture": [
                    "E5-large embeddings with DeBERTa-v3 cross-encoders for candidate matching",
                    "LambdaMART contextual ranking algorithms for candidate-job fit optimization", 
                    "Kubernetes/KServe architecture with blue-green deployment",
                    "Model distillation pipeline (Phi-3-vision to Phi-3-mini) with INT8/QLoRA quantization",
                    "RAG architecture with Llama-3-8B-Instruct and hybrid search (BM25+vector)",
                    "Fine-tuned Phi-3-mini with task-specific LoRA adapters for communications"
                ],
                "innovations": [
                    "Neural reranking improving qualified candidate identification by 18%",
                    "Lightweight on-premise solution maintaining 97% accuracy",
                    "Human-in-the-loop preference learning for personalized messaging",
                    "Hybrid search architecture achieving 92% RAGAS-evaluated query resolution"
                ],
                "challenges": [
                    "Meeting strict data sovereignty requirements across 50+ HR departments",
                    "Handling 3x traffic spikes while maintaining resource efficiency",
                    "Reducing candidate frustration with automated communications",
                    "Balancing model accuracy with deployment constraints"
                ],
                "learnings": [
                    "Model distillation critical for on-premise deployments",
                    "Human-in-the-loop training significantly improves user satisfaction", 
                    "Blue-green deployment essential for high-availability ML systems",
                    "Hybrid search outperforms pure vector or keyword approaches"
                ]
            },
            "metrics": {
                "screening_efficiency": "Candidate screening time reduced from 8 to 3 hours per requisition",
                "hiring_speed": "40% reduction in time-to-hire",
                "accuracy": "18% improvement in qualified candidate identification across 15,000+ monthly applications",
                "cost_savings": "$45K annual savings in infrastructure costs through 70% resource efficiency",
                "contracts": "$1.2M in new contracts unlocked through data sovereignty compliance",
                "satisfaction": "96% positive reception on automated communications, 42% reduction in negative reviews",
                "support_reduction": "35% reduction in HR support workload",
                "resolution_rate": "92% RAGAS-evaluated query resolution on first attempt"
            },
            "business_impact": "Revolutionized hiring process for 50+ HR departments, enabling scalable candidate processing while maintaining compliance",
            "company": "Community Dreams Foundation"
        },
        {
            "id": "shell-data-pipeline",
            "title": "Real-time Industrial Data Pipeline - Shell Corporation",
            "timeline": "Sep 2020 - Jun 2022",
            "status": "completed",
            "technologies": ["Kafka Connect", "Spark Streaming", "Python", "BigQuery", "Azure ML", "Docker", "Kubernetes", "AKS", "Databricks", "Terraform", "AWS EC2"],
            "category": "Data Engineering / MLOps",
            "description": "Enterprise-scale real-time data processing for industrial operations with predictive maintenance",
            "problem": "Batch processing delays affecting critical operational decisions, high false alert rates, lengthy deployment cycles",
            "solution": "Real-time streaming architecture with ML-powered anomaly detection and automated deployment pipelines",
            "technical_details": {
                "architecture": [
                    "Kafka Connect and Spark Streaming for 8 sensor streams (400 events/sec)",
                    "Python envelope/spectral analysis processing in Spark", 
                    "BigQuery data warehouse with real-time landing",
                    "Azure ML for experiment tracking and endpoint creation",
                    "Docker containerization with Kubernetes (AKS) orchestration",
                    "Databricks Medallion architecture with schema validation"
                ],
                "innovations": [
                    "Real-time processing replacing overnight batch operations",
                    "ML-powered anomaly detection reducing false alerts by 30%",
                    "50% reduction in model deployment time through containerization",
                    "Incremental processing with robust schema validation"
                ],
                "challenges": [
                    "Zero-downtime migration of 52 legacy servers",
                    "Handling high-velocity sensor data with spectral analysis",
                    "Maintaining 99.9% uptime during migration",
                    "Optimizing costs while scaling infrastructure"
                ],
                "learnings": [
                    "Real-time architectures require careful envelope analysis for anomaly detection",
                    "Infrastructure as code (Terraform) essential for reliable deployments",
                    "Medallion architecture provides robust data quality guarantees",
                    "Containerization dramatically improves deployment reliability"
                ]
            },
            "metrics": {
                "latency": "Data availability lag reduced from overnight batch to <5 minutes",
                "cost_savings": "$8k monthly operational cost reduction",
                "reliability": "99.9% uptime over 6-month period",
                "efficiency": "75% reduction in pipeline failures (12 to 3 weekly)",
                "recovery_time": "Data recovery time cut from 4 hours to 45 minutes",
                "false_alerts": "30% reduction in false anomaly alerts",
                "deployment_speed": "50% reduction in model deployment time"
            },
            "business_impact": "Enabled real-time operational decisions for Shell refinery operations, awarded Best Employee Q4 2021",
            "company": "CGI (Client: Shell Corporation)",
            "recognition": "Best Employee Q4 2021, led 30% of overall data migration effort"
        },
        {
            "id": "computer-vision-systems",
            "title": "Computer Vision & Predictive Maintenance Systems",
            "timeline": "May 2018 - Aug 2020", 
            "status": "completed",
            "technologies": ["ResNet-50", "VGG-16", "TensorFlow", "AWS EC2", "SageMaker", "Tesseract OCR", "OpenCV", "Kubernetes", "Flask", "Dash", "PySpark", "Apache Airflow", "Kafka", "OpenAI Gym"],
            "category": "Computer Vision / Predictive Analytics",
            "description": "High-performance computer vision systems for facial recognition, OCR, and predictive maintenance",
            "problem": "Manual vehicle identification processes, equipment downtime prediction, scalable image processing needs",
            "solution": "Fine-tuned deep learning models with robust ETL pipelines and real-time processing architecture",
            "technical_details": {
                "architecture": [
                    "Fine-tuned ResNet-50 & custom VGG-16 on AWS (EC2 GPUs, SageMaker)",
                    "Tesseract OCR and OpenCV pipeline deployed on Kubernetes",
                    "Multi-modal sensor data processing with PySpark and Apache Airflow",
                    "Kafka-based pipeline for high-frequency LiDAR streams",
                    "Flask/Dash dashboards on AWS Elastic Beanstalk"
                ],
                "innovations": [
                    "97% accuracy on FER2013 facial expression recognition dataset",
                    "2x training speed improvement using mixed-precision training",
                    "12% better model generalization through systematic data augmentation",
                    "Sub-100ms latency Kafka ingestion pipeline",
                    "Reinforcement Learning for dynamic resource allocation"
                ],
                "challenges": [
                    "Processing 5k vehicle plates daily with high accuracy",
                    "Handling 300% peak load spikes in real-time processing", 
                    "Maintaining 99.9% reliability for ML model training data",
                    "Optimizing model training speed and generalization"
                ],
                "learnings": [
                    "Mixed-precision training provides significant speedup without accuracy loss",
                    "Systematic data augmentation crucial for computer vision generalization",
                    "Kubernetes orchestration essential for scalable image processing",
                    "Reinforcement Learning shows promise for dynamic resource optimization"
                ]
            },
            "metrics": {
                "accuracy": "97% accuracy on FER2013 dataset",
                "training_speed": "2x faster training with mixed-precision",
                "generalization": "12% improvement in model generalization",
                "throughput": "5k vehicle plates processed daily",
                "downtime_reduction": "28% reduction in equipment downtime",
                "reliability": "99.9% ETL workflow reliability",
                "latency": "Sub-100ms Kafka ingestion latency",
                "load_handling": "300% peak load spike capability",
                "potential_gains": "20% potential throughput gains with RL optimization"
            },
            "business_impact": "Automated vehicle identification and reduced maintenance costs through predictive analytics",
            "company": "Imbuedesk Pvt. Ltd"
        },
        {
            "id": "career-roadmap-generator",
            "title": "Career Roadmap Generator",
            "timeline": "2024",
            "status": "completed",
            "technologies": ["GPT-3.5", "GPT-4o", "ChromaDB", "Streamlit", "Python", "RAG", "LangChain"],
            "category": "Generative AI / Career Tech",
            "description": "AI-powered career transition recommendation system using RAG architecture",
            "problem": "Job seekers need personalized career guidance based on their background and target roles",
            "solution": "Integrated GPT models with ChromaDB for context-aware job transition recommendations",
            "technical_details": {
                "architecture": [
                    "ChromaDB for vector storage and similarity search",
                    "GPT-3.5 and GPT-4o models for intelligent recommendation generation",
                    "Streamlit interface for user interaction",
                    "Async processing pipeline for concurrent user support"
                ],
                "innovations": [
                    "Context-aware job transition recommendations",
                    "Performance optimization for concurrent users",
                    "Evaluation framework with hit@5 scoring methodology"
                ],
                "challenges": [
                    "Handling diverse career backgrounds across industries",
                    "Maintaining recommendation quality across different experience levels",
                    "Optimizing API latency for real-time user experience"
                ],
                "learnings": [
                    "Async processing critical for multi-user applications",
                    "Context-aware retrieval significantly improves recommendation relevance",
                    "Proper evaluation metrics essential for measuring system performance"
                ]
            },
            "metrics": {
                "accuracy": "0.87 hit@5 score on evaluation set of 200 anonymized job transitions",
                "performance": "API latency reduced from 12s to 4s through async implementation",
                "scalability": "10+ concurrent users supported effectively"
            },
            "business_impact": "Provides personalized career guidance for tech professionals transitioning between roles",
            "links": {
                "platform": "Available on Hugging Face",
                "github": "Available on request"
            }
        },
        {
            "id": "sidebuilds-platform",
            "title": "SideBuilds.space - Project Showcase Platform",
            "timeline": "2024",
            "status": "production",
            "technologies": ["React", "Node.js", "CockroachDB", "Vercel", "Render", "Stripe API"],
            "category": "Full-Stack Web Platform",
            "description": "Public platform for showcasing and monetizing side projects with integrated portfolio demos",
            "problem": "Developers need a platform to showcase side projects, get feedback, and potentially monetize their work",
            "solution": "Full-stack platform with project hosting, portfolio integration, and e-commerce capabilities",
            "technical_details": {
                "architecture": [
                    "React frontend deployed on Vercel for fast global CDN",
                    "Node.js backend API deployed on Render for scalability",
                    "CockroachDB for distributed, resilient data storage",
                    "Stripe API integration for payment processing and commission handling"
                ],
                "innovations": [
                    "Embedded portfolio demos within project listings",
                    "Integrated marketplace for selling AI-powered apps and RAG prototypes",
                    "Commission-based monetization model for creators"
                ],
                "challenges": [
                    "Building scalable architecture for project hosting",
                    "Implementing secure payment processing with commission splits",
                    "Creating intuitive project showcase and discovery interface"
                ],
                "learnings": [
                    "Vercel provides excellent developer experience for React deployments",
                    "CockroachDB offers strong consistency for distributed applications",
                    "Stripe API simplifies complex payment and commission workflows"
                ]
            },
            "metrics": {
                "platform": "Live production platform",
                "hosting": "Supports hosting of AI-powered apps and RAG prototypes",
                "monetization": "Commission-based sales platform for side projects"
            },
            "business_impact": "Enables developers to showcase, iterate, and monetize their side projects",
            "links": {
                "live_site": "https://www.sidebuilds.space/",
                "status": "Production platform"
            }
        },
        {
            "id": "saas-chatbot",
            "title": "SaaS Support Chatbot with Fine-tuned LLM",
            "timeline": "2024",
            "status": "completed", 
            "technologies": ["Llama-2-7B", "LangChain", "PEFT/LoRA", "Streamlit", "Python", "A10 GPU"],
            "category": "Fine-tuned LLM / Customer Support",
            "description": "Cost-effective alternative to API-based chatbot solutions using fine-tuned open-source models",
            "problem": "High costs of API-based chatbot solutions for customer support, need for specialized domain knowledge",
            "solution": "Fine-tuned Llama-2-7B using parameter-efficient techniques for specialized support conversations",
            "technical_details": {
                "architecture": [
                    "Parameter-efficient fine-tuning using LoRA techniques",
                    "5k support conversation dataset for domain-specific training",
                    "A10 GPU deployment for cost-effective inference",
                    "Streamlit interface for user interaction and testing"
                ],
                "innovations": [
                    "Cost-effective alternative to hosted API solutions",
                    "Maintained quality while significantly reducing infrastructure costs",
                    "PEFT techniques enabling efficient specialization without full model retraining"
                ],
                "challenges": [
                    "Balancing model size vs performance trade-offs",
                    "Optimizing inference for production deployment constraints",
                    "Ensuring response quality across diverse support scenarios"
                ],
                "learnings": [
                    "PEFT techniques enable efficient model specialization",
                    "Proper dataset curation critical for fine-tuning performance",
                    "Single GPU deployment viable for many production use cases"
                ]
            },
            "metrics": {
                "accuracy": "84% accuracy on support conversation evaluation",
                "cost_savings": "65% cost reduction compared to hosted API solutions",
                "deployment": "Efficient single A10 GPU deployment"
            },
            "business_impact": "Significant cost savings while maintaining customer support quality for SaaS companies"
        }
    ]

    # Technical philosophy and approach (updated with more specific insights)
    philosophy = {
        "core_beliefs": [
            "Data quality and proper preprocessing trump model complexity every time",
            "Start simple with proven architectures, add complexity only when needed", 
            "Observability, monitoring, and evaluation frameworks are non-negotiable",
            "Open source provides better control and cost efficiency for specialized domains",
            "User experience and business metrics should drive all technical decisions",
            "Infrastructure as code and containerization essential for reliable ML deployments"
        ],
        "problem_solving_methodology": [
            "Understand the business problem deeply before selecting any technology stack",
            "Prototype quickly with existing tools (LangChain, Streamlit, Kubernetes)",
            "Establish baselines and proper evaluation metrics before optimization",
            "Optimize for the constraint that matters most (cost, latency, accuracy, compliance)",
            "Build for scale from day one but deploy incrementally with blue-green strategies",
            "Implement human-in-the-loop validation for critical decision systems"
        ],
        "technology_preferences": {
            "ChromaDB_Weaviate": "ChromaDB for rapid prototyping, Weaviate for production vector search",
            "Mistral_Llama": "Mistral and Llama models for cost-efficiency and local deployment control", 
            "PEFT_LoRA": "Parameter-efficient fine-tuning essential for cost-effective specialization",
            "Kubernetes_Docker": "Container orchestration critical for production ML workloads",
            "FastAPI_Streamlit": "FastAPI for robust APIs, Streamlit for rapid prototyping interfaces",
            "Terraform_IaC": "Infrastructure as code non-negotiable for reliable deployments"
        }
    }

    # Comprehensive skills and expertise
    skills = {
        "programming_languages": {
            "primary": ["Python", "SQL"],
            "working_knowledge": ["Java", "C++", "R", "Shell Scripting", "Scala"]
        },
        "machine_learning": {
            "core_ml": ["Supervised/unsupervised learning", "Computer vision", "NLP/NER", "Recommender systems"],
            "deep_learning": ["Neural networks", "CNNs", "RNNs", "LSTMs", "Transformers", "GANs", "VAEs"],
            "explainable_ai": ["SHAP", "LIME", "Model interpretability"],
            "computer_vision": ["Image classification", "Object detection (YOLO, Faster R-CNN)", "OCR", "Facial recognition"],
            "specialized": ["Self-supervised learning", "Transfer learning", "Reinforcement Learning", "Few-shot learning"]
        },
        "generative_ai": {
            "llms": ["Fine-tuning", "PEFT/LoRA", "Model distillation", "Quantization (INT8/FP16)", "RLHF"],
            "rag_systems": ["Vector databases", "Hybrid search (BM25+vector)", "Knowledge graphs", "Embedding models"],
            "frameworks": ["LangChain", "LlamaIndex", "Transformers", "RAGAS evaluation"],
            "vector_dbs": ["Weaviate", "Pinecone", "ChromaDB", "FAISS"],
            "multimodal": ["Vision-language models (CLIP, BLIP)", "Document understanding", "OCR integration"]
        },
        "mlops_devops": {
            "ml_platforms": ["MLflow", "Kubeflow", "Weights & Biases", "Azure ML", "Vertex AI"],
            "containers": ["Docker", "Kubernetes", "KServe", "Blue-green deployment"],
            "ci_cd": ["GitHub Actions", "GitLab CI", "Bitbucket Pipelines"],
            "infrastructure": ["Terraform", "AWS", "GCP", "Azure"],
            "monitoring": ["Prometheus", "Grafana", "Model drift detection", "Custom metrics"]
        },
        "data_engineering": {
            "streaming": ["Apache Kafka", "Spark Streaming", "Real-time processing"],
            "batch_processing": ["Apache Spark", "PySpark", "Apache Airflow", "ETL pipelines"], 
            "databases": ["PostgreSQL", "MySQL", "MongoDB", "BigQuery", "CockroachDB"],
            "data_platforms": ["Databricks", "Snowflake", "Hadoop ecosystem"]
        },
        "cloud_platforms": {
            "aws": ["S3", "EC2", "Lambda", "SageMaker", "Bedrock", "Elastic Beanstalk"],
            "gcp": ["Vertex AI", "BigQuery", "Cloud Storage", "STT/TTS", "Natural Language API"],
            "azure": ["Azure ML", "AKS", "Container Instances"],
            "deployment": ["Serverless", "Container orchestration", "Auto-scaling"]
        }
    }

    # Industry insights and opinions (expanded with recent experience)
    insights = {
        "hot_takes": [
            "Fine-tuning smaller open-source LLMs with PEFT often beats using giant API models for specialized domains",
            "Most RAG implementations are overengineered - start with hybrid search (BM25+vector) before complex architectures",
            "Vector databases + knowledge graphs combination is underexplored but highly effective", 
            "Model distillation and quantization can reduce ML infrastructure costs by 60-70% while maintaining performance",
            "Human-in-the-loop validation is crucial for AI systems making important decisions",
            "Blue-green deployment strategies are essential for high-availability ML systems"
        ],
        "current_tech_stack": {
            "development": "Python + FastAPI + Streamlit for rapid prototyping and production APIs",
            "ml_frameworks": "PyTorch for flexibility, HuggingFace Transformers for pre-trained models",
            "vector_storage": "ChromaDB for development, Weaviate/Pinecone for production scale",
            "llms": "Llama-3, Phi-3, Mistral for cost-efficiency; GPT-4o for complex reasoning when needed",
            "deployment": "Kubernetes + Docker + Terraform for reliable, scalable infrastructure",
            "monitoring": "Custom metrics + Prometheus/Grafana + RAGAS for ML evaluation"
        },
        "future_predictions": [
            "Hybrid retrieval systems (vector + graph + traditional search) will become standard",
            "Specialized, smaller models will increasingly outperform general large models",
            "Model distillation and edge deployment will drive next wave of AI adoption",
            "Better tooling for AI observability and debugging will be critical for production adoption",
            "Regulatory compliance and data sovereignty will drive on-premise AI solutions"
        ]
    }

    # Career goals and aspirations (updated with current trajectory)
    career_goals = {
        "short_term_1_2_years": [
            "Lead technical teams building production-scale AI systems",
            "Contribute significantly to open-source AI infrastructure and evaluation frameworks",
            "Establish expertise in multimodal AI and document understanding applications", 
            "Publish research on Graph RAG optimization and hybrid search architectures",
            "Complete AWS Certified Machine Learning - Specialty certification"
        ],
        "long_term_3_5_years": [
            "Found or join early-stage AI startup focused on enterprise AI solutions",
            "Develop novel approaches to knowledge representation and retrieval in AI systems",
            "Bridge the gap between cutting-edge research and practical business implementation",
            "Mentor next generation of ML engineers and contribute to AI education",
            "Establish thought leadership in cost-effective, scalable AI deployment strategies"
        ],
        "technical_interests": [
            "Experimenting with new AI models and optimization techniques",
            "Building side projects for personal productivity and learning", 
            "Contributing to AI safety and responsible AI development discussions",
            "Exploring intersection of AI with other domains (healthcare, finance, scientific research)",
            "Developing better evaluation frameworks for AI systems"
        ]
    }

    # Quantified achievements and metrics (comprehensive from resume)
    achievements = {
        "cost_optimization": [
            {"metric": "$45K annual infrastructure cost savings", "project": "HR Matching Platform", "method": "70% resource efficiency through Kubernetes optimization"},
            {"metric": "$8K monthly operational cost reduction", "project": "Shell data pipeline", "method": "AWS EC2 migration with Terraform"},
            {"metric": "65% cost reduction vs API solutions", "project": "SaaS Chatbot", "method": "Fine-tuned Llama-2-7B deployment"},
            {"metric": "$1.2M in new contracts unlocked", "project": "HR Platform", "method": "Data sovereignty compliance through model distillation"}
        ],
        "performance_improvements": [
            {"metric": "Screening time reduced from 8 to 3 hours per requisition", "context": "HR matching platform"},
            {"metric": "40% reduction in time-to-hire", "context": "AI-powered candidate ranking"},
            {"metric": "18% improvement in qualified candidate identification", "context": "Neural reranking across 15,000+ applications"},
            {"metric": "35% reduction in HR support workload", "context": "RAG-powered support system"},
            {"metric": "30% reduction in false anomaly alerts", "context": "ML-powered sensor data analysis"},
            {"metric": "50% reduction in model deployment time", "context": "Containerization with Kubernetes"},
            {"metric": "28% reduction in equipment downtime", "context": "Predictive maintenance dashboards"}
        ],
        "accuracy_and_quality": [
            {"metric": "97% accuracy maintained with model distillation", "context": "On-premise Phi-3 deployment"},
            {"metric": "92% RAGAS-evaluated query resolution", "context": "RAG system first-attempt success"},
            {"metric": "96% positive reception on automated communications", "context": "AI-generated personalized messages"},
            {"metric": "97% accuracy on FER2013 dataset", "context": "Facial expression recognition system"},
            {"metric": "0.87 hit@5 score", "context": "Career transition recommendations"},
            {"metric": "84% accuracy with 65% cost reduction", "context": "Fine-tuned chatbot vs API solutions"}
        ],
        "scale_achievements": [
            {"metric": "15,000+ monthly applications processed", "context": "HR matching platform"},
            {"metric": "400 events/second real-time processing", "context": "Industrial sensor data streams"},
            {"metric": "5k vehicle plates processed daily", "context": "Computer vision OCR pipeline"},
            {"metric": "200+ weekly communications automated", "context": "HR email automation"},
            {"metric": "99.9% uptime over 6-month period", "context": "Production data pipeline"},
            {"metric": "10+ concurrent users supported", "context": "Career roadmap generator"},
            {"metric": "3x traffic spike handling capability", "context": "Kubernetes auto-scaling"}
        ],
        "recognition_and_impact": [
            "Best Employee Q4 2021 at CGI for leading 30% of data migration effort",
            "Stevens Institute of Technology MS in Machine Learning, CGPA: 3.9",
            "50+ HR departments using production AI matching platform",
            "Active contributor on Hugging Face forums and GitHub repositories",
            "Speaking engagements at ML/AI meetups and technical conferences",
            "Medium articles reaching AI practitioner community",
            "Open source contributions to LangChain and ChromaDB improvements"
        ]
    }

    # Learning and development (updated with current focus)
    learning = {
        "recent_focus_areas": [
            "Multimodal AI applications and vision-language models (CLIP, BLIP)",
            "Knowledge Graph integration with vector search for hybrid RAG systems", 
            "Production MLOps best practices and model monitoring at scale",
            "Advanced prompt engineering and evaluation frameworks (RAGAS)",
            "Model distillation, quantization, and edge deployment optimization",
            "Regulatory compliance and data sovereignty in AI systems"
        ],
        "knowledge_sharing": [
            "Medium articles on practical AI implementation and cost optimization",
            "Twitter threads sharing insights on ML engineering and deployment",
            "Speaking at technical conferences and ML/AI meetups",
            "Active participation in Hugging Face forums and GitHub community",
            "Open source contributions to LangChain, ChromaDB, and evaluation frameworks",
            "Mentoring junior engineers on ML system design and implementation"
        ],
        "certifications_completed": [
            "Machine Learning Specialization (Coursera)",
            "SPSS certified professional in Data mining and Warehousing",
            "Multiple cloud platform certifications for ML deployment"
        ],
        "current_learning": [
            "AWS Certified Machine Learning – Specialty (in progress)",
            "Advanced graph neural networks for knowledge representation",
            "Retrieval-augmented generation optimization and evaluation",
            "Large-scale vector database management and optimization",
            "Regulatory frameworks for AI deployment in enterprise environments"
        ]
    }

    # Comprehensive Q&A database for better chatbot responses
    qa_database = [
        {
            "question": "What's your experience with production RAG systems?",
            "answer": "I have extensive production RAG experience. At Community Dreams Foundation, I built a RAG system using Llama-3-8B-Instruct with hybrid search (BM25+vector) that achieved 92% RAGAS-evaluated query resolution and reduced HR support workload by 35%. I've also implemented Graph RAG systems and career recommendation engines with ChromaDB. My focus is on practical, cost-effective implementations that scale reliably in production.",
            "context": "rag_production_experience",
            "related_projects": ["hr-matching-platform", "career-roadmap-generator"]
        },
        {
            "question": "How do you approach LLM fine-tuning and optimization?",
            "answer": "I'm a strong advocate for parameter-efficient fine-tuning using LoRA/PEFT techniques. I've fine-tuned models from Llama-2-7B to Phi-3-mini, achieving 84% accuracy while reducing costs by 65% compared to API solutions. I also use model distillation (Phi-3-vision to Phi-3-mini) with quantization (INT8/QLoRA) for on-premise deployments. Key is proper dataset curation, evaluation frameworks, and avoiding catastrophic forgetting.",
            "context": "llm_optimization",
            "related_projects": ["saas-chatbot", "hr-matching-platform"]
        },
        {
            "question": "What's your experience with production ML infrastructure?",
            "answer": "I've built ML systems handling significant scale - from 400 events/second sensor data pipelines at Shell to 15,000+ monthly applications on the HR platform. I use Kubernetes/KServe with blue-green deployment, achieving 3x traffic spike capability with 70% resource efficiency. I emphasize Infrastructure as Code (Terraform), containerization (Docker), and comprehensive monitoring (Prometheus/Grafana). Recent work saved $45K annually through optimization.",
            "context": "ml_infrastructure",
            "related_projects": ["hr-matching-platform", "shell-data-pipeline"]
        },
        {
            "question": "How do you handle AI bias and fairness?",
            "answer": "Bias mitigation is critical, especially in HR applications. In my resume matching platform, I implemented bias detection across diverse roles and backgrounds, ensuring fairness for 50+ HR departments. I use diverse training data, regular bias audits, and fairness metrics. For automated communications, I include sentiment analysis and human-in-the-loop preference learning, achieving 96% positive reception while reducing negative reviews by 42%.",
            "context": "ai_fairness",
            "related_projects": ["hr-matching-platform"]
        },
        {
            "question": "What's your experience with computer vision and multimodal AI?",
            "answer": "I have strong computer vision experience - achieved 97% accuracy on FER2013 facial recognition, processed 5k vehicle plates daily with Tesseract OCR, and built predictive maintenance systems reducing equipment downtime by 28%. I've worked with ResNet-50, VGG-16, and currently exploring vision-language models (CLIP, BLIP) for document understanding. I use mixed-precision training for 2x speedup and systematic data augmentation for 12% better generalization.",
            "context": "computer_vision",
            "related_projects": ["computer-vision-systems"]
        },
        {
            "question": "How do you approach cost optimization in ML systems?",
            "answer": "Cost optimization is crucial for production ML. I've achieved significant savings: $45K annually through Kubernetes resource efficiency, 65% reduction using fine-tuned models vs APIs, and $8K monthly through cloud migration. Key strategies include model distillation/quantization, efficient deployment architectures, proper caching, and choosing the right model size for the task. I always optimize for the constraint that matters most - cost, latency, or accuracy.",
            "context": "cost_optimization",
            "related_projects": ["hr-matching-platform", "saas-chatbot", "shell-data-pipeline"]
        },
        {
            "question": "What's your tech stack preference and why?",
            "answer": "I choose technology based on problem constraints and production requirements. Core stack: Python + FastAPI + Streamlit for development; PyTorch + HuggingFace for ML; Kubernetes + Docker + Terraform for deployment. For LLMs: Llama-3, Phi-3, Mistral for cost-efficiency; GPT-4o when needed. Vector storage: ChromaDB for prototyping, Weaviate/Pinecone for production. I prefer open-source solutions for better control and cost optimization.",
            "context": "tech_preferences",
            "related_projects": ["hr-matching-platform", "career-roadmap-generator", "sidebuilds-platform"]
        },
        {
            "question": "How do you evaluate and monitor ML systems in production?",
            "answer": "I implement comprehensive evaluation frameworks from day one. For RAG systems, I use RAGAS evaluation achieving 92% query resolution. I track custom business metrics (screening time, cost savings, user satisfaction) alongside technical metrics (latency, accuracy, resource usage). I use Prometheus/Grafana for monitoring and implement drift detection. Human-in-the-loop validation is crucial for critical decisions, as demonstrated in my HR platform work.",
            "context": "ml_evaluation",
            "related_projects": ["hr-matching-platform", "career-roadmap-generator"]
        }
    ]

    return {
        "projects": projects,
        "philosophy": philosophy,
        "skills": skills,
        "insights": insights,
        "career_goals": career_goals,
        "achievements": achievements,
        "learning": learning,
        "qa_database": qa_database,
        "metadata": {
            "created": datetime.now().isoformat(),
            "version": "2.0",
            "description": "Comprehensive enhanced portfolio data for Graph RAG system with detailed resume information"
        }
    }

def save_enhanced_data():
    """Save the enhanced data structure"""
    data = create_enhanced_portfolio_data()
    
    # Create data directory if it doesn't exist
    data_dir = Path("data")
    data_dir.mkdir(exist_ok=True)
    
    # Save comprehensive data
    with open(data_dir / "enhanced_portfolio_data.json", "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    # Create individual files for each category
    categories = ["projects", "philosophy", "skills", "insights", "career_goals", "achievements", "learning", "qa_database"]
    
    for category in categories:
        with open(data_dir / f"{category}.json", "w") as f:
            json.dump(data[category], f, indent=2, ensure_ascii=False)
    
    print("✅ Enhanced portfolio data saved successfully!")
    print(f"📁 Main file: data/enhanced_portfolio_data.json")
    print(f"📂 Category files: {', '.join([f'data/{cat}.json' for cat in categories])}")

def create_rag_sources_from_enhanced_data():
    """Convert enhanced data into RAG-compatible source format"""
    data = create_enhanced_portfolio_data()
    sources = []
    
    # Convert projects to detailed sources
    for project in data["projects"]:
        content = f"""
Project: {project['title']}
Timeline: {project['timeline']}
Status: {project['status']}
Technologies: {', '.join(project['technologies'])}
Category: {project['category']}

Problem Statement: {project['problem']}
Solution Approach: {project['solution']}

Technical Architecture:
{chr(10).join(['• ' + arch for arch in project['technical_details']['architecture']])}

Key Innovations:
{chr(10).join(['• ' + innovation for innovation in project['technical_details']['innovations']])}

Technical Challenges:
{chr(10).join(['• ' + challenge for challenge in project['technical_details']['challenges']])}

Key Learnings:
{chr(10).join(['• ' + learning for learning in project['technical_details']['learnings']])}

Metrics and Results:
{chr(10).join([f"• {k}: {v}" for k, v in project['metrics'].items()])}

Business Impact: {project['business_impact']}

{f"Company: {project.get('company', 'Personal Project')}" if project.get('company') else ''}
{f"Recognition: {project.get('recognition', '')}" if project.get('recognition') else ''}
"""
        sources.append({
            "id": f"project-{project['id']}",
            "content": content.strip(),
            "metadata": {
                "sourceType": "project",
                "projectId": project['id'],
                "technologies": project['technologies'],
                "category": project['category'],
                "timeline": project['timeline']
            }
        })
    
    # Convert skills to sources
    skills = data["skills"]
    for skill_category, skill_data in skills.items():
        if isinstance(skill_data, dict):
            content = f"""
Skill Category: {skill_category.replace('_', ' ').title()}

{chr(10).join([f"{subcategory.replace('_', ' ').title()}: {', '.join(skills_list) if isinstance(skills_list, list) else skills_list}" for subcategory, skills_list in skill_data.items()])}
"""
        else:
            content = f"""
Skill Category: {skill_category.replace('_', ' ').title()}
Skills: {', '.join(skill_data) if isinstance(skill_data, list) else skill_data}
"""
        
        sources.append({
            "id": f"skills-{skill_category}",
            "content": content.strip(),
            "metadata": {
                "sourceType": "skills",
                "category": skill_category
            }
        })
    
    # Convert Q&A database to sources
    for i, qa in enumerate(data["qa_database"]):
        content = f"""
Question: {qa['question']}
Answer: {qa['answer']}

Context: {qa['context']}
Related Projects: {', '.join(qa.get('related_projects', []))}
"""
        sources.append({
            "id": f"qa-{i}",
            "content": content.strip(),
            "metadata": {
                "sourceType": "qa",
                "context": qa['context'],
                "related_projects": qa.get('related_projects', [])
            }
        })
    
    # Convert achievements to sources
    achievements = data["achievements"]
    for achievement_category, achievement_list in achievements.items():
        if achievement_category == "recognition_and_impact":
            content = f"""
Recognition and Professional Impact:
{chr(10).join(['• ' + item for item in achievement_list])}
"""
        else:
            content = f"""
{achievement_category.replace('_', ' ').title()}:
{chr(10).join([f"• {item.get('metric', item)}" + (f" ({item.get('context', item.get('project', ''))})" if item.get('context') or item.get('project') else '') + (f" - Method: {item.get('method', '')}" if item.get('method') else '') for item in achievement_list])}
"""
        
        sources.append({
            "id": f"achievements-{achievement_category}",
            "content": content.strip(),
            "metadata": {
                "sourceType": "achievements",
                "category": achievement_category
            }
        })
    
    # Convert philosophy to sources
    philosophy_content = f"""
Technical Philosophy and Problem-Solving Approach

Core Beliefs:
{chr(10).join(['• ' + belief for belief in data['philosophy']['core_beliefs']])}

Problem-Solving Methodology:
{chr(10).join([f"{i+1}. {step}" for i, step in enumerate(data['philosophy']['problem_solving_methodology'])])}

Technology Preferences and Rationale:
{chr(10).join([f"• {tech.replace('_', '/')}: {reason}" for tech, reason in data['philosophy']['technology_preferences'].items()])}
"""
    sources.append({
        "id": "philosophy",
        "content": philosophy_content.strip(),
        "metadata": {
            "sourceType": "philosophy"
        }
    })
    
    # Convert industry insights to sources
    insights_content = f"""
Industry Insights and Technical Opinions

Key Industry Perspectives:
{chr(10).join(['• ' + take for take in data['insights']['hot_takes']])}

Current Technology Stack:
{chr(10).join([f"• {category.replace('_', ' ').title()}: {tech}" for category, tech in data['insights']['current_tech_stack'].items()])}

Future Predictions:
{chr(10).join(['• ' + prediction for prediction in data['insights']['future_predictions']])}
"""
    sources.append({
        "id": "insights",
        "content": insights_content.strip(),
        "metadata": {
            "sourceType": "insights"
        }
    })
    
    # Save RAG sources
    with open("data/enhanced_rag_sources.json", "w") as f:
        json.dump(sources, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Created {len(sources)} RAG sources from enhanced data")
    print("📁 Saved to: data/enhanced_rag_sources.json")
    
    return sources

if __name__ == "__main__":
    print("🚀 Creating comprehensive enhanced portfolio data for Graph RAG system...")
    save_enhanced_data()
    create_rag_sources_from_enhanced_data()
    print("\n📋 Next steps:")
    print("1. Review the generated data files in the /data directory")
    print("2. Run the RAG initialization with the new enhanced data sources")
    print("3. Test the chatbot with detailed questions about:")
    print("   • Specific project implementations and metrics")
    print("   • Technical decisions and trade-offs")
    print("   • Cost optimization strategies")
    print("   • ML infrastructure and deployment approaches")
    print("   • Industry insights and technology preferences")
    print("4. The chatbot should now provide much more detailed and specific responses!") 