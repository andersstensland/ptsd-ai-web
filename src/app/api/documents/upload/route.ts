import { NextRequest } from 'next/server';
import { processDocument, chunkText } from '@/lib/document-processor';
import { vectorService } from '@/lib/vector-service';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Process the document
    const processed = await processDocument(file);
    
    // Chunk the text for better retrieval
    const chunks = chunkText(processed.content);
    
    // Add to database with embeddings
    const documentId = await vectorService.addDocument({
      title: processed.title,
      originalTitle: processed.title,
      content: processed.content,
      type: processed.type,
      size: processed.size,
    }, chunks);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully processed and indexed ${chunks.length} chunks from ${processed.title}`,
        chunksCreated: chunks.length,
        title: processed.title,
        documentId,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Document upload error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to process document' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
