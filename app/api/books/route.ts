import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const books = await prisma.book.findMany({
      where: {
        userId: session.user.id,
        ...(status && { status }),
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        readingSessions: {
          orderBy: {
            sessionDate: 'desc',
          },
          take: 5,
        },
      },
    });

    return NextResponse.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      author,
      totalPages,
      currentPage,
      status,
      coverImage,
      genre,
      notes,
      rating,
    } = body;

    if (!title || !author || !totalPages) {
      return NextResponse.json(
        { error: 'Title, author, and total pages are required' },
        { status: 400 }
      );
    }

    const book = await prisma.book.create({
      data: {
        userId: session.user.id,
        title,
        author,
        totalPages: parseInt(totalPages),
        currentPage: currentPage ? parseInt(currentPage) : 0,
        status: status || 'reading',
        coverImage,
        genre,
        notes,
        rating: rating ? parseInt(rating) : null,
      },
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
