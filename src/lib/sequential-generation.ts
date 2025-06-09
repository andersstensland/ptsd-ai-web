import { generateText } from 'ai';
import { deepinfra } from '@/lib/ai-config';
import { vectorService } from '@/lib/vector-service';
import type { Message } from 'ai';
import { generateSequentialPrompts, extractPromptsForExecution, type SequentialPrompts } from './prompt-generation';

export interface SequentialGenerationOptions {
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  rounds: number;
  useRag: boolean;
}

export interface GenerationRound {
  round: number;
  prompt: string;
  response: string;
  timestamp: Date;
  improvements?: string;
}

export interface SequentialGenerationResult {
  finalResponse: string;
  rounds: GenerationRound[];
  totalTime: number;
  ragContext?: string;
}

/**
 * Sequential Generation Service
 * 
 * This service performs multiple rounds of AI generation to improve response quality.
 * Each round builds upon the previous one with refinement prompts.
 */
export class SequentialGenerationService {
  private static instance: SequentialGenerationService;

  public static getInstance(): SequentialGenerationService {
    if (!SequentialGenerationService.instance) {
      SequentialGenerationService.instance = new SequentialGenerationService();
    }
    return SequentialGenerationService.instance;
  }

  /**
   * Generate a response using sequential rounds of generation
   */
  async generateSequential(
    userMessage: string,
    options: SequentialGenerationOptions,
    conversationHistory: Array<Omit<Message, 'id'>> = []
  ): Promise<SequentialGenerationResult> {
    const startTime = Date.now();
    const rounds: GenerationRound[] = [];
    let ragContext: string | undefined;

    // Step 1: Get RAG context if enabled
    if (options.useRag) {
      try {
        const searchResults = await vectorService.searchDocuments(userMessage, 5);
        if (searchResults.length > 0) {
          ragContext = searchResults
            .map(result => `Source: ${result.title}\nContent: ${result.content}`)
            .join('\n\n---\n\n');
        }
      } catch (error) {
        console.error('RAG search error:', error);
      }
    }

    // Step 2: First generation - Initial response
    const firstRound = await this.generateRound({
      round: 1,
      userMessage,
      conversationHistory,
      ragContext,
      options,
      prompt: this.createInitialPrompt(userMessage, ragContext)
    });
    rounds.push(firstRound);

    let currentResponse = firstRound.response;

    // Step 3: Subsequent rounds - Refinement
    for (let round = 2; round <= options.rounds; round++) {
      const refinementPrompt = this.createRefinementPrompt(
        userMessage,
        currentResponse,
        round,
        ragContext
      );

      const refinementRound = await this.generateRound({
        round,
        userMessage,
        conversationHistory,
        ragContext,
        options,
        prompt: refinementPrompt,
        previousResponse: currentResponse
      });

      rounds.push(refinementRound);
      currentResponse = refinementRound.response;
    }

    const totalTime = Date.now() - startTime;

    return {
      finalResponse: currentResponse,
      rounds,
      totalTime,
      ragContext
    };
  }

  /**
   * Generate a single round of text
   */
  private async generateRound(params: {
    round: number;
    userMessage: string;
    conversationHistory: Array<Omit<Message, 'id'>>;
    ragContext?: string;
    options: SequentialGenerationOptions;
    prompt: string;
    previousResponse?: string;
  }): Promise<GenerationRound> {
    const { round, prompt, options } = params;
    
    try {
      const result = await generateText({
        model: deepinfra(options.model),
        messages: [
          {
            role: 'system' as const,
            content: prompt
          },
          ...params.conversationHistory.map(msg => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content
          })),
          {
            role: 'user' as const,
            content: params.userMessage
          }
        ],
        temperature: options.temperature * (1 - (round - 1) * 0.1), // Slightly reduce temperature each round
        maxTokens: options.maxTokens,
        topP: options.topP,
      });

      return {
        round,
        prompt,
        response: result.text,
        timestamp: new Date()
      };
    } catch (error) {
      console.error(`Error in generation round ${round}:`, error);
      throw new Error(`Failed to generate round ${round}: ${error}`);
    }
  }

  /**
   * Create the initial prompt for the first generation
   */
  private createInitialPrompt(userMessage: string, ragContext?: string): string {
    let prompt = `You are an AI Research assistant specialized in PTSD and mental health. Your task is to provide a comprehensive, well-researched, and evidence-based response to the user's question.

This is the FIRST ROUND of generation. Focus on:
1. Understanding the question thoroughly
2. Providing accurate, evidence-based information
3. Being comprehensive but clear
4. Using professional, empathetic language
5. Citing sources when making claims

Important guidelines:
- Always provide citations for any claims made
- Be clear about the limitations of AI assistance for mental health matters
- Use trauma-informed language and approaches
- Provide practical, actionable information when appropriate`;

    if (ragContext) {
      prompt += `\n\nYou have access to the following context from the knowledge base. Use this information to provide more informed and accurate responses:\n\nCONTEXT FROM KNOWLEDGE BASE:\n${ragContext}`;
    }

    return prompt;
  }

  /**
   * Create refinement prompts for subsequent rounds
   */
  private createRefinementPrompt(
    userMessage: string,
    previousResponse: string,
    round: number,
    ragContext?: string
  ): string {
    const refinementFocus = this.getRefinementFocus(round);

    let prompt = `You are an AI Research assistant specialized in PTSD and mental health. This is ROUND ${round} of a sequential generation process.

Your task is to IMPROVE the previous response by focusing on: ${refinementFocus}

PREVIOUS RESPONSE:
${previousResponse}

ORIGINAL USER QUESTION:
${userMessage}

Instructions for this round:
1. Analyze the previous response critically
2. Identify areas for improvement based on the focus area
3. Generate an IMPROVED version that addresses these issues
4. Maintain the same core information but enhance quality
5. Ensure evidence-based claims with proper citations
6. Keep the response length similar to the previous version

Key improvements to make:
- Better organization and structure
- More precise language and terminology
- Enhanced evidence and citations
- Improved practical recommendations
- Better trauma-informed approach`;

    if (ragContext) {
      prompt += `\n\nCONTEXT FROM KNOWLEDGE BASE:\n${ragContext}`;
    }

    return prompt;
  }

  /**
   * Get the specific focus for each refinement round
   */
  private getRefinementFocus(round: number): string {
    const focuses = {
      2: "accuracy, evidence quality, and proper citations",
      3: "clarity, organization, and practical applicability",
      4: "comprehensiveness, nuance, and professional language",
      5: "trauma-informed approach and empathetic communication"
    };

    return focuses[round as keyof typeof focuses] || "overall quality and coherence";
  }

  /**
   * Create a comparison between rounds for analysis
   */
  createRoundComparison(rounds: GenerationRound[]): string {
    if (rounds.length < 2) return "Only one round available for comparison.";

    let comparison = "# Sequential Generation Analysis\n\n";
    
    rounds.forEach((round, index) => {
      comparison += `## Round ${round.round}\n`;
      comparison += `**Focus**: ${index === 0 ? 'Initial comprehensive response' : this.getRefinementFocus(round.round)}\n`;
      comparison += `**Length**: ${round.response.length} characters\n`;
      comparison += `**Generated**: ${round.timestamp.toLocaleTimeString()}\n\n`;
      
      if (index > 0) {
        const improvement = this.analyzeImprovement(rounds[index - 1].response, round.response);
        comparison += `**Key Improvements**: ${improvement}\n\n`;
      }
    });

    return comparison;
  }

  /**
   * Analyze improvements between two responses
   */
  private analyzeImprovement(previous: string, current: string): string {
    const improvements = [];
    
    if (current.length > previous.length * 1.1) {
      improvements.push("More comprehensive content");
    }
    if (current.split('\n').length > previous.split('\n').length) {
      improvements.push("Better organization");
    }
    if ((current.match(/\d+\./g) || []).length > (previous.match(/\d+\./g) || []).length) {
      improvements.push("More structured points");
    }
    if ((current.match(/\([^)]+\)/g) || []).length > (previous.match(/\([^)]+\)/g) || []).length) {
      improvements.push("Enhanced citations");
    }
    
    return improvements.length > 0 ? improvements.join(", ") : "Refined language and clarity";
  }

  /**
   * Generate a response using dynamically generated prompts
   */
  async generateWithPrompts(
    userMessage: string,
    options: PromptBasedGenerationOptions,
    conversationHistory: Array<Omit<Message, 'id'>> = []
  ): Promise<PromptBasedGenerationResult> {
    const startTime = Date.now();
    let ragContext: string | undefined;

    // Step 1: Get RAG context if enabled
    if (options.useRag) {
      try {
        const searchResults = await vectorService.searchDocuments(userMessage, 5);
        if (searchResults.length > 0) {
          ragContext = searchResults
            .map(result => `Source: ${result.title}\nContent: ${result.content}`)
            .join('\n\n---\n\n');
        }
      } catch (error) {
        console.error('RAG search error:', error);
      }
    }

    // Step 2: Generate sequential prompts
    const generatedPrompts = await generateSequentialPrompts(userMessage, {
      model: options.promptGenerationModel || options.model,
      temperature: 0.3,
      numberOfPrompts: options.rounds
    });

    const prompts = extractPromptsForExecution(generatedPrompts);
    const rounds: GenerationRound[] = [];
    let currentResponse = '';

    // Step 3: Execute each generated prompt
    for (let i = 0; i < prompts.length; i++) {
      const roundNumber = i + 1;
      const prompt = prompts[i];
      
      // Create contextual prompt for this round
      let contextualPrompt = `You are an AI Research assistant specialized in PTSD and mental health.

RESEARCH STRATEGY: ${generatedPrompts.researchStrategy}

CURRENT STEP (${roundNumber}/${prompts.length}): ${generatedPrompts.sequentialPrompts[i].purpose}

SPECIFIC INSTRUCTION: ${prompt}

ORIGINAL USER QUERY: ${userMessage}`;

      if (i > 0) {
        contextualPrompt += `\n\nPREVIOUS RESEARCH FINDINGS:\n${currentResponse}\n\nBuild upon these findings while focusing on: ${generatedPrompts.sequentialPrompts[i].purpose}`;
      }

      if (ragContext) {
        contextualPrompt += `\n\nCONTEXT FROM KNOWLEDGE BASE:\n${ragContext}`;
      }

      const round = await this.generateRound({
        round: roundNumber,
        userMessage,
        conversationHistory,
        ragContext,
        options,
        prompt: contextualPrompt,
        previousResponse: currentResponse
      });

      rounds.push(round);
      currentResponse = round.response;
    }

    const totalTime = Date.now() - startTime;

    return {
      finalResponse: currentResponse,
      rounds,
      totalTime,
      ragContext,
      generatedPrompts,
      promptStrategy: generatedPrompts.researchStrategy
    };
  }
}

export const sequentialGenerationService = SequentialGenerationService.getInstance();

export interface PromptBasedGenerationOptions extends SequentialGenerationOptions {
  usePromptGeneration?: boolean;
  promptGenerationModel?: string;
}

export interface PromptBasedGenerationResult extends SequentialGenerationResult {
  generatedPrompts?: SequentialPrompts;
  promptStrategy?: string;
}
