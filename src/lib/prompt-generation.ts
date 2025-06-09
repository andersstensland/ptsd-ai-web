import { generateObject, generateText } from 'ai';
import { deepinfra } from '@/lib/ai-config';
import { z } from 'zod';

// Schema for sequential prompts
const SequentialPromptsSchema = z.object({
  originalQuery: z.string().describe('The original user query'),
  primaryFocus: z.string().describe('The main research focus or topic'),
  sequentialPrompts: z.array(
    z.object({
      step: z.number().describe('Step number in the sequence'),
      prompt: z.string().describe('The specific prompt for this step'),
      purpose: z.string().describe('What this prompt aims to achieve'),
      expectedOutput: z.string().describe('What kind of response is expected')
    })
  ).describe('A sequence of 3-5 prompts that build on each other'),
  researchStrategy: z.string().describe('Overall strategy for this research inquiry'),
  expectedOutcome: z.string().describe('What the final comprehensive answer should achieve')
});

export type SequentialPrompts = z.infer<typeof SequentialPromptsSchema>;

export interface PromptGenerationOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  numberOfPrompts?: number;
}

/**
 * Generate sequential prompts for a research query using AI
 */
export async function generateSequentialPrompts(
  userQuery: string,
  options: PromptGenerationOptions = {}
): Promise<SequentialPrompts> {
  const {
    model = 'meta-llama/Meta-Llama-3.1-8B-Instruct',
    temperature = 0.3, // Lower temperature for more structured output
    maxTokens = 1500,
    numberOfPrompts = 4
  } = options;

  try {
    // Try structured output first
    const result = await generateObject({
      model: deepinfra(model),
      temperature,
      maxTokens,
      schema: SequentialPromptsSchema,
      prompt: `You are an expert research strategist specializing in PTSD and mental health research. 

Your task is to analyze the user's query and create a sequence of ${numberOfPrompts} strategic prompts that will lead to a comprehensive, well-researched response.

USER QUERY: "${userQuery}"

Create a research strategy with ${numberOfPrompts} sequential prompts that:

1. **Build progressively** - Each prompt should build on the previous one
2. **Cover different aspects** - Address various dimensions of the topic
3. **Increase depth** - Move from general to specific
4. **Ensure comprehensiveness** - Cover theoretical, practical, and evidence-based aspects

Guidelines for each prompt:
- Make them specific and actionable
- Ensure they're relevant to PTSD/mental health research
- Design them to elicit detailed, evidence-based responses
- Include requests for citations and sources
- Consider trauma-informed approaches

Focus areas to consider:
- Theoretical foundations and research
- Clinical applications and treatments
- Evidence-based practices
- Practical implementation
- Current research trends
- Cultural considerations
- Ethical implications

Generate sequential prompts that will result in a thorough, professional, and evidence-based final response.`,
    });

    return result.object;
  } catch (error) {
    console.error('Structured output failed, falling back to text generation:', error);
    
    // Fallback to text generation with JSON parsing
    try {
      const textResult = await generateText({
        model: deepinfra(model),
        temperature,
        maxTokens,
        prompt: `You are an expert research strategist specializing in PTSD and mental health research. 

Your task is to analyze the user's query and create a sequence of ${numberOfPrompts} strategic prompts that will lead to a comprehensive, well-researched response.

USER QUERY: "${userQuery}"

Create a research strategy with ${numberOfPrompts} sequential prompts. You must respond with a valid JSON object that follows this exact structure:

{
  "originalQuery": "the original user query",
  "primaryFocus": "the main research focus or topic",
  "sequentialPrompts": [
    {
      "step": 1,
      "prompt": "specific prompt for this step",
      "purpose": "what this prompt aims to achieve",
      "expectedOutput": "what kind of response is expected"
    }
    // ... more prompts
  ],
  "researchStrategy": "overall strategy for this research inquiry",
  "expectedOutcome": "what the final comprehensive answer should achieve"
}

Guidelines for each prompt:
- Make them specific and actionable
- Ensure they're relevant to PTSD/mental health research
- Design them to elicit detailed, evidence-based responses
- Include requests for citations and sources
- Consider trauma-informed approaches

Respond ONLY with the JSON object, no other text.`
      });

      const parsedResult = JSON.parse(textResult.text);
      const validatedResult = SequentialPromptsSchema.parse(parsedResult);
      return validatedResult;
    } catch (fallbackError) {
      console.error('Both structured and text generation failed:', fallbackError);
      
      // Final fallback - return a default structure
      return createDefaultPrompts(userQuery, numberOfPrompts);
    }
  }
}

/**
 * Generate context message for sequential prompts
 */
export function createSequentialPromptsMessage(prompts: SequentialPrompts): string {
  const promptsList = prompts.sequentialPrompts
    .map((p) => 
      `**Step ${p.step}: ${p.purpose}**\n` +
      `Prompt: ${p.prompt}\n` +
      `Expected: ${p.expectedOutput}`
    )
    .join('\n\n');

  return `# Sequential Research Strategy

**Original Query:** ${prompts.originalQuery}

**Primary Focus:** ${prompts.primaryFocus}

**Research Strategy:** ${prompts.researchStrategy}

## Sequential Prompts

${promptsList}

**Expected Final Outcome:** ${prompts.expectedOutcome}

---

*This strategy will guide a comprehensive multi-round research response to ensure thorough coverage of the topic.*`;
}

/**
 * Extract individual prompts for execution
 */
export function extractPromptsForExecution(prompts: SequentialPrompts): string[] {
  return prompts.sequentialPrompts.map(p => p.prompt);
}

/**
 * Create default prompts as a fallback when AI generation fails
 */
function createDefaultPrompts(userQuery: string, numberOfPrompts: number): SequentialPrompts {
  const defaultPrompts = [
    {
      step: 1,
      prompt: `Provide an overview of current research on: ${userQuery}. Include recent studies, key findings, and established theoretical frameworks. Please cite relevant sources.`,
      purpose: "Establish foundational knowledge and current research landscape",
      expectedOutput: "Comprehensive overview with recent research citations and theoretical background"
    },
    {
      step: 2,
      prompt: `Based on the research overview, what are the most evidence-based treatments or interventions for the topic discussed? Focus on clinical effectiveness and implementation considerations.`,
      purpose: "Identify evidence-based treatments and interventions",
      expectedOutput: "Detailed analysis of effective treatments with supporting evidence"
    },
    {
      step: 3,
      prompt: `What are the current challenges and limitations in research and practice related to this topic? Include gaps in knowledge and barriers to implementation.`,
      purpose: "Identify current challenges and research gaps",
      expectedOutput: "Critical analysis of limitations and areas needing further research"
    },
    {
      step: 4,
      prompt: `Provide practical recommendations for clinicians, researchers, or practitioners working in this area. Include trauma-informed approaches and ethical considerations.`,
      purpose: "Offer actionable recommendations and best practices",
      expectedOutput: "Practical guidelines with trauma-informed and ethical considerations"
    }
  ];

  // Adjust number of prompts based on request
  const selectedPrompts = defaultPrompts.slice(0, numberOfPrompts);

  return {
    originalQuery: userQuery,
    primaryFocus: `Research and practice related to: ${userQuery}`,
    sequentialPrompts: selectedPrompts,
    researchStrategy: "Progressive exploration from foundational research to practical application, ensuring comprehensive coverage of theoretical, evidence-based, and practical aspects.",
    expectedOutcome: "A thorough, evidence-based response that covers current research, effective interventions, existing challenges, and practical recommendations for implementation."
  };
}
