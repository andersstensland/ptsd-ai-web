import { NextRequest, NextResponse } from 'next/server';
import { vectorService } from '@/lib/vector-service';

export async function DELETE(request: NextRequest) {
  try {
    const { title } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: 'Document title is required' },
        { status: 400 }
      );
    }

    // Delete document from vector store
    const success = await vectorService.deleteDocumentByTitle(title);

    if (success) {
      return NextResponse.json({
        message: 'Document deleted successfully',
        title,
      });
    } else {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Delete document error:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}
