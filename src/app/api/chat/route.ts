import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { vectorService } from '@/lib/vector-service';

// DeepInfra provider configuration
const deepinfra = createOpenAI({
  apiKey: process.env.DEEPINFRA_API_KEY,
  baseURL: 'https://api.deepinfra.com/v1/openai',
});

// Ollama provider configuration
const ollama = createOpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama', // Ollama doesn't require an API key
});

export async function POST(req: Request) {
  try {
    const { 
      messages, 
      provider = 'deepinfra', 
      model = 'meta-llama/Meta-Llama-3.1-8B-Instruct', 
      temperature = 0.7, 
      maxTokens = 1000, 
      topP = 0.9
    } = await req.json();

    let selectedProvider;
    let selectedModel;

    // Choose provider and model based on request
    if (provider === 'ollama') {
      selectedProvider = ollama;
      selectedModel = model || 'llama3.2'; // Default Ollama model
    } else {
      selectedProvider = deepinfra;
      selectedModel = model || 'meta-llama/Meta-Llama-3.1-8B-Instruct'; // Default DeepInfra model
    }

    let augmentedMessages = messages;

    // Always use RAG to search for relevant context
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user') {
        try {
          // Search for relevant documents
          const searchResults = await vectorService.searchDocuments(lastMessage.content, 3);
          
          if (searchResults.length > 0) {
            // Create context from search results
            const context = searchResults
              .map(result => `Source: ${result.title}\nContent: ${result.content}`)
              .join('\n\n---\n\n');

            // Create a system message with the context
            const contextMessage = {
              role: 'system' as const,
              content: `You are an AI assistant specialized in PTSD and mental health support. Use the following context from the knowledge base to provide more informed and accurate responses. If the context is relevant to the user's question, incorporate it into your answer. If the context is not relevant, you may ignore it and provide a general response.

CONTEXT FROM KNOWLEDGE BASE:
${context}

Please provide helpful, empathetic, and evidence-based responses while being clear about the limitations of AI assistance for mental health matters.`
            };

            // Insert the context message at the beginning, or replace existing system message
            const hasSystemMessage = messages[0]?.role === 'system';
            if (hasSystemMessage) {
              augmentedMessages = [contextMessage, ...messages.slice(1)];
            } else {
              augmentedMessages = [contextMessage, ...messages];
            }
          }
        } catch (error) {
          console.error('RAG search error:', error);
          // Continue without RAG if search fails
        }
      }
    }

    const result = await streamText({
      model: selectedProvider(selectedModel),
      messages: augmentedMessages,
      temperature,
      maxTokens,
      topP,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate response' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
