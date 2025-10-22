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
    const contentId = searchParams.get('contentId');
    const category = searchParams.get('category');

    const where: any = {
      userId: session.user.id,
    };

    if (contentId) {
      where.contentId = contentId;
    }

    if (category) {
      where.content = {
        category,
      };
    }

    const progress = await prisma.userProgress.findMany({
      where,
      include: {
        content: {
          select: {
            id: true,
            category: true,
            title: true,
            author: true,
            coverImage: true,
            estimatedDuration: true,
            _count: {
              select: {
                sections: true,
              },
            },
          },
        },
      },
      orderBy: {
        lastAccessedAt: 'desc',
      },
    });

    return NextResponse.json({ progress });
  } catch (error) {
    console.error('Error fetching progress:', error);
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
    const { contentId } = body;

    if (!contentId) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      );
    }

    // Check if content exists
    const content = await prisma.skillContent.findUnique({
      where: { id: contentId },
    });

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    // Check if progress already exists
    const existingProgress = await prisma.userProgress.findUnique({
      where: {
        userId_contentId: {
          userId: session.user.id,
          contentId,
        },
      },
    });

    if (existingProgress) {
      return NextResponse.json(
        { error: 'Progress already exists' },
        { status: 400 }
      );
    }

    // Create new progress
    const progress = await prisma.userProgress.create({
      data: {
        userId: session.user.id,
        contentId,
        status: 'in_progress',
        startedAt: new Date(),
      },
      include: {
        content: true,
      },
    });

    return NextResponse.json(progress, { status: 201 });
  } catch (error) {
    console.error('Error creating progress:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
