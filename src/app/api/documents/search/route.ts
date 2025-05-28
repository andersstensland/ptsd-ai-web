import { NextRequest } from 'next/server';
import { vectorService } from '@/lib/vector-service';

export async function POST(req: NextRequest) {
  try {
    const { query, topK = 5 } = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'No query provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Search for relevant documents using database service
    const results = await vectorService.searchDocuments(query, topK);

    return new Response(
      JSON.stringify({ 
        results,
        query,
        totalResults: results.length,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Document search error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to search documents' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
