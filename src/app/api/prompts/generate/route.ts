import { NextRequest, NextResponse } from 'next/server';
import { generateSequentialPrompts, createSequentialPromptsMessage } from '@/lib/prompt-generation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      query,
      model = 'meta-llama/Meta-Llama-3.1-8B-Instruct',
      temperature = 0.3,
      maxTokens = 1500,
      numberOfPrompts = 4
    } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    console.log(`Generating sequential prompts for query: ${query}`);

    const prompts = await generateSequentialPrompts(query, {
      model,
      temperature,
      maxTokens,
      numberOfPrompts
    });

    const contextMessage = createSequentialPromptsMessage(prompts);

    const response = {
      success: true,
      prompts,
      contextMessage,
      metadata: {
        originalQuery: query,
        model,
        numberOfPrompts: prompts.sequentialPrompts.length,
        generatedAt: new Date().toISOString()
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Prompt generation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate sequential prompts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
