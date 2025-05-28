import { eq, sql } from 'drizzle-orm';
import { createOpenAI } from '@ai-sdk/openai';
import { embed } from 'ai';
import { db } from './db';
import { documents, documentChunks } from './db/schema';
import type { NewDocumentChunk } from './db/schema';

interface DocumentMetadata {
  totalChunks: number;
}

interface ProcessedDocument {
  title: string;
  originalTitle: string;
  content: string;
  type: string;
  size: number;
}

interface SearchResult {
  id: string;
  title: string;
  content: string;
  snippet: string;
  relevanceScore: number;
  metadata: {
    originalTitle: string;
    type: string;
    size: number;
    chunkIndex: number;
    totalChunks: number;
  };
}

interface GroupedDocument {
  title: string;
  chunkCount: number;
  totalChunks: number;
  type: string;
  status: 'complete' | 'partial';
}

class DatabaseVectorService {
  private deepinfra = createOpenAI({
    apiKey: process.env.DEEPINFRA_API_KEY,
    baseURL: 'https://api.deepinfra.com/v1/openai',
  });

  async addDocument(processed: ProcessedDocument, chunks: string[]): Promise<string> {
    try {
      // Insert document metadata
      const [document] = await db.insert(documents).values({
        title: processed.title,
        originalTitle: processed.originalTitle,
        type: processed.type,
        size: processed.size,
        metadata: {
          totalChunks: chunks.length,
        },
      }).returning();

      // Process chunks with embeddings
      const chunkInserts: NewDocumentChunk[] = [];
      
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        
        // Generate embedding
        const { embedding } = await embed({
          model: this.deepinfra.embedding('BAAI/bge-base-en-v1.5'),
          value: chunk,
        });

        chunkInserts.push({
          documentId: document.id,
          content: chunk,
          chunkIndex: i,
          embedding: embedding, // Store as proper vector
        });
      }

      // Insert all chunks
      await db.insert(documentChunks).values(chunkInserts);

      return document.id;
    } catch (error) {
      console.error('Error adding document to database:', error);
      throw error;
    }
  }

  async searchDocuments(query: string, topK: number = 5): Promise<SearchResult[]> {
    try {
      // Generate embedding for the query
      const { embedding: queryEmbedding } = await embed({
        model: this.deepinfra.embedding('BAAI/bge-base-en-v1.5'),
        value: query,
      });

      // Search using SQL with cosine similarity using pgvector
      const chunks = await db
        .select({
          id: documentChunks.id,
          content: documentChunks.content,
          chunkIndex: documentChunks.chunkIndex,
          embedding: documentChunks.embedding,
          title: documents.title,
          originalTitle: documents.originalTitle,
          type: documents.type,
          size: documents.size,
          totalChunks: documents.metadata,
          similarity: sql<number>`1 - (${documentChunks.embedding} <=> ${JSON.stringify(queryEmbedding)}::vector)`,
        })
        .from(documentChunks)
        .innerJoin(documents, eq(documentChunks.documentId, documents.id))
        .orderBy(sql`${documentChunks.embedding} <=> ${JSON.stringify(queryEmbedding)}::vector`)
        .limit(topK);

      // Convert results to SearchResult format
      const results: SearchResult[] = chunks.map((chunk) => ({
        id: chunk.id,
        title: `${chunk.originalTitle} (Part ${chunk.chunkIndex + 1})`,
        content: chunk.content,
        snippet: chunk.content.substring(0, 200) + (chunk.content.length > 200 ? '...' : ''),
        relevanceScore: chunk.similarity || 0,
        metadata: {
          originalTitle: chunk.originalTitle,
          type: chunk.type,
          size: chunk.size,
          chunkIndex: chunk.chunkIndex,
          totalChunks: (chunk.totalChunks as DocumentMetadata)?.totalChunks || 1,
        },
      }));

      return results;
    } catch (error) {
      console.error('Error searching documents:', error);
      return [];
    }
  }

  async listDocuments(): Promise<GroupedDocument[]> {
    try {
      const docs = await db
        .select({
          originalTitle: documents.originalTitle,
          type: documents.type,
          totalChunks: documents.metadata,
          chunkCount: sql<number>`count(${documentChunks.id})`,
        })
        .from(documents)
        .leftJoin(documentChunks, eq(documents.id, documentChunks.documentId))
        .groupBy(documents.id, documents.originalTitle, documents.type, documents.metadata);

      return docs.map((doc) => ({
        title: doc.originalTitle,
        chunkCount: Number(doc.chunkCount),
        totalChunks: (doc.totalChunks as DocumentMetadata)?.totalChunks || 1,
        type: doc.type,
        status: Number(doc.chunkCount) === ((doc.totalChunks as DocumentMetadata)?.totalChunks || 1) ? 'complete' : 'partial',
      }));
    } catch (error) {
      console.error('Error listing documents:', error);
      return [];
    }
  }

  async deleteDocumentByTitle(title: string): Promise<boolean> {
    try {
      const docsToDelete = await db
        .select({ id: documents.id })
        .from(documents)
        .where(eq(documents.originalTitle, title));

      if (docsToDelete.length === 0) {
        return false;
      }

      // Delete chunks first (cascade should handle this, but being explicit)
      for (const doc of docsToDelete) {
        await db.delete(documentChunks).where(eq(documentChunks.documentId, doc.id));
      }

      // Delete documents
      await db.delete(documents).where(eq(documents.originalTitle, title));

      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      return false;
    }
  }

  async getDocumentCount(): Promise<{ totalDocuments: number; totalChunks: number }> {
    try {
      const [docCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(documents);

      const [chunkCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(documentChunks);

      return {
        totalDocuments: Number(docCount.count),
        totalChunks: Number(chunkCount.count),
      };
    } catch (error) {
      console.error('Error getting document count:', error);
      return { totalDocuments: 0, totalChunks: 0 };
    }
  }
}

// Singleton instance
export const vectorService = new DatabaseVectorService();
export type { SearchResult, GroupedDocument, ProcessedDocument };
