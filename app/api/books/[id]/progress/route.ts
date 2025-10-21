import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { pagesRead, notes } = body;

    if (!pagesRead || pagesRead <= 0) {
      return NextResponse.json(
        { error: 'Pages read must be greater than 0' },
        { status: 400 }
      );
    }

    const book = await prisma.book.findUnique({
      where: { id: params.id },
    });

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    if (book.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const newCurrentPage = Math.min(
      book.currentPage + parseInt(pagesRead),
      book.totalPages
    );

    const updatedBook = await prisma.book.update({
      where: { id: params.id },
      data: {
        currentPage: newCurrentPage,
        status: newCurrentPage >= book.totalPages ? 'completed' : book.status,
        completedAt:
          newCurrentPage >= book.totalPages ? new Date() : book.completedAt,
      },
    });

    await prisma.readingSession.create({
      data: {
        bookId: params.id,
        pagesRead: parseInt(pagesRead),
        startPage: book.currentPage,
        endPage: newCurrentPage,
        notes,
      },
    });

    return NextResponse.json(updatedBook);
  } catch (error) {
    console.error('Error updating book progress:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
