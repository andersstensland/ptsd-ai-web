import { NextRequest, NextResponse } from 'next/server';
import { sequentialGenerationService, type SequentialGenerationOptions } from '@/lib/sequential-generation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      message,
      conversationHistory = [],
      model = 'meta-llama/Meta-Llama-3.1-8B-Instruct',
      temperature = 0.7,
      maxTokens = 1000,
      topP = 0.9,
      rounds = 3,
      useRag = true
    } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const options: SequentialGenerationOptions = {
      model,
      temperature,
      maxTokens,
      topP,
      rounds: Math.min(Math.max(rounds, 1), 5), // Limit to 1-5 rounds
      useRag
    };

    console.log(`Starting sequential generation with ${rounds} rounds for model: ${model}`);

    const result = await sequentialGenerationService.generateSequential(
      message,
      options,
      conversationHistory
    );

    // Create a detailed response with all round information
    const response = {
      success: true,
      result: {
        finalResponse: result.finalResponse,
        totalTime: result.totalTime,
        rounds: result.rounds.map(round => ({
          round: round.round,
          response: round.response,
          timestamp: round.timestamp,
          responseLength: round.response.length
        })),
        ragContext: result.ragContext ? {
          hasContext: true,
          contextLength: result.ragContext.length
        } : { hasContext: false },
        metadata: {
          model,
          rounds: rounds,
          useRag,
          generatedAt: new Date().toISOString()
        }
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Sequential generation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate sequential response',
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
