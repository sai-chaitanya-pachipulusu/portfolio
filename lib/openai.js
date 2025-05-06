import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { OpenAI } from 'langchain/llms/openai';

export function getOpenAIEmbeddings() {
  return new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
}

export function getOpenAILLM() {
  return new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.7,
  });
}