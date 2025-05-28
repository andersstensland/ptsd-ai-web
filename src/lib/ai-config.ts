import { createOpenAI } from '@ai-sdk/openai';

// DeepInfra provider configuration
export const deepinfra = createOpenAI({
  apiKey: process.env.DEEPINFRA_API_KEY,
  baseURL: 'https://api.deepinfra.com/v1/openai',
});

// Ollama provider configuration
export const ollama = createOpenAI({
  baseURL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1',
  apiKey: 'ollama', // Ollama doesn't require an API key
});

// Available models
export const DEEPINFRA_MODELS = [
  'meta-llama/Meta-Llama-3.1-8B-Instruct',
  'meta-llama/Meta-Llama-3.1-70B-Instruct',
  'mistralai/Mistral-7B-Instruct-v0.3',
  'microsoft/WizardLM-2-8x22B',
] as const;

export const OLLAMA_MODELS = [
  'llama3.2',
  'llama3.1',
  'mistral',
  'codellama',
  'phi3',
] as const;

export type DeepInfraModel = typeof DEEPINFRA_MODELS[number];
export type OllamaModel = typeof OLLAMA_MODELS[number];
export type Provider = 'deepinfra' | 'ollama';
export type AIModel = DeepInfraModel | OllamaModel;
