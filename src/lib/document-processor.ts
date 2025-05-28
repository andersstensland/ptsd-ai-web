import * as mammoth from 'mammoth';

export interface ProcessedDocument {
  title: string;
  content: string;
  type: string;
  size: number;
}

export async function processDocument(file: File): Promise<ProcessedDocument> {
  console.log('Processing document:', file.name, 'Type:', file.type, 'Size:', file.size);
  
  const buffer = await file.arrayBuffer();
  console.log('Buffer size:', buffer.byteLength);

  let content = '';
  const title = file.name.replace(/\.[^/.]+$/, ''); // Remove extension

  switch (file.type) {
    case 'application/pdf':
      try {
        console.log('Starting PDF processing with pdf-parse...');
        console.log('File buffer type:', typeof buffer);
        console.log('File buffer byteLength:', buffer.byteLength);
        
        // Dynamic import to avoid build-time issues
        const { default: pdfParse } = await import('pdf-parse');
        console.log('pdf-parse imported successfully');
        
        // Convert ArrayBuffer to Buffer for pdf-parse
        const nodeBuffer = Buffer.from(buffer);
        console.log('Buffer created, size:', nodeBuffer.length);
        
        const pdfData = await pdfParse(nodeBuffer);
        console.log('PDF parsed successfully, text length:', pdfData.text.length);
        content = pdfData.text;
      } catch (error) {
        console.error('Error processing PDF:', error);
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
        throw new Error(`Failed to process PDF file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      break;

    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      try {
        console.log('Starting DOCX processing...');
        const nodeBuffer = Buffer.from(buffer);
        const result = await mammoth.extractRawText({ buffer: nodeBuffer });
        content = result.value;
        console.log('DOCX processed successfully, text length:', content.length);
      } catch (error) {
        console.error('Error processing Word document:', error);
        throw new Error(`Failed to process Word document: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      break;

    case 'text/plain':
      try {
        console.log('Starting TXT processing...');
        const uint8Array = new Uint8Array(buffer);
        content = new TextDecoder().decode(uint8Array);
        console.log('TXT processed successfully, text length:', content.length);
      } catch (error) {
        console.error('Error processing text file:', error);
        throw new Error(`Failed to process text file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      break;

    default:
      throw new Error(`Unsupported file type: ${file.type}`);
  }

  if (!content.trim()) {
    throw new Error('No text content found in the document');
  }

  return {
    title,
    content: content.trim(),
    type: file.type,
    size: file.size,
  };
}

export function chunkText(text: string, maxChunkSize: number = 1000, overlap: number = 100): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  let currentChunk = '';
  
  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    if (currentChunk.length + trimmedSentence.length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      
      // Create overlap by including the last part of the previous chunk
      const words = currentChunk.split(' ');
      const overlapWords = words.slice(-Math.floor(overlap / 10)); // Rough estimate of words for overlap
      currentChunk = overlapWords.join(' ') + ' ' + trimmedSentence;
    } else {
      currentChunk += (currentChunk ? ' ' : '') + trimmedSentence;
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks.filter(chunk => chunk.length > 20); // Filter out very small chunks
}