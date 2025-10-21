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
    const category = searchParams.get('category'); // book | podcast | documentary | all
    const status = searchParams.get('status'); // not_started | in_progress | completed | paused
    const isSystemContent = searchParams.get('isSystemContent');
    const search = searchParams.get('search');
    const tags = searchParams.get('tags');
    const difficulty = searchParams.get('difficulty');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const where: any = {
      OR: [
        { userId: session.user.id },
        { isSystemContent: true },
      ],
    };

    if (category && category !== 'all') {
      where.category = category;
    }

    if (isSystemContent !== null) {
      where.isSystemContent = isSystemContent === 'true';
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { author: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (difficulty && difficulty !== 'all') {
      where.difficulty = difficulty;
    }

    // Fetch content with user progress
    const contents = await prisma.skillContent.findMany({
      where,
      orderBy: [
        { isPinned: 'desc' },
        { updatedAt: 'desc' },
      ],
      take: limit,
      skip: offset,
      include: {
        progress: {
          where: {
            userId: session.user.id,
          },
        },
        reviews: {
          where: {
            userId: session.user.id,
          },
        },
        _count: {
          select: {
            sections: true,
            reviews: true,
          },
        },
      },
    });

    // Filter by status if provided
    let filteredContents = contents;
    if (status) {
      filteredContents = contents.filter((content) => {
        const userProgress = content.progress[0];
        return userProgress?.status === status;
      });
    }

    // Filter by tags if provided
    if (tags) {
      const tagArray = tags.split(',').map((t) => t.trim());
      filteredContents = filteredContents.filter((content) => {
        if (!content.tags) return false;
        const contentTags = JSON.parse(content.tags);
        return tagArray.some((tag) => contentTags.includes(tag));
      });
    }

    const total = filteredContents.length;
    const hasMore = offset + limit < total;

    return NextResponse.json({
      contents: filteredContents,
      total,
      hasMore,
    });
  } catch (error) {
    console.error('Error fetching skill content:', error);
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
      category,
      title,
      author,
      description,
      coverImage,
      tags,
      difficulty,
      estimatedDuration,
      audioSummaryUrl,
      videoClipUrl,
      youtubeEmbedId,
      externalLink,
      isPinned,
    } = body;

    if (!category || !title) {
      return NextResponse.json(
        { error: 'Category and title are required' },
        { status: 400 }
      );
    }

    if (!['book', 'podcast', 'documentary'].includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    const content = await prisma.skillContent.create({
      data: {
        userId: session.user.id,
        category,
        title,
        author,
        description,
        coverImage,
        tags: tags ? JSON.stringify(tags) : null,
        difficulty: difficulty || 'intermediate',
        estimatedDuration: estimatedDuration ? parseInt(estimatedDuration) : null,
        audioSummaryUrl,
        videoClipUrl,
        youtubeEmbedId,
        externalLink,
        isSystemContent: false,
        isPinned: isPinned || false,
      },
      include: {
        _count: {
          select: {
            sections: true,
          },
        },
      },
    });

    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    console.error('Error creating skill content:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
