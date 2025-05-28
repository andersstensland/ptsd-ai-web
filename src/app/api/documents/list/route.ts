import { vectorService } from '@/lib/vector-service';

export async function GET() {
  try {
    const documents = await vectorService.listDocuments();
    const counts = await vectorService.getDocumentCount();
    
    return new Response(
      JSON.stringify({ 
        documents,
        totalDocuments: counts.totalDocuments,
        totalChunks: counts.totalChunks,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error listing documents:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to list documents' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
