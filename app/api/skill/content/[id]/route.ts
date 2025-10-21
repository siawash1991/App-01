import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const content = await prisma.skillContent.findUnique({
      where: { id: params.id },
      include: {
        sections: {
          orderBy: {
            sectionNumber: 'asc',
          },
          include: {
            completions: {
              where: {
                userId: session.user.id,
              },
            },
          },
        },
        progress: {
          where: {
            userId: session.user.id,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
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

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    // Check access: user's own content or system content
    if (content.userId !== session.user.id && !content.isSystemContent) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({
      content,
      userProgress: content.progress[0] || null,
    });
  } catch (error) {
    console.error('Error fetching content details:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // Check ownership
    const existingContent = await prisma.skillContent.findUnique({
      where: { id: params.id },
    });

    if (!existingContent) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    if (existingContent.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const {
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
      rating,
    } = body;

    const updatedContent = await prisma.skillContent.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(author !== undefined && { author }),
        ...(description !== undefined && { description }),
        ...(coverImage !== undefined && { coverImage }),
        ...(tags && { tags: JSON.stringify(tags) }),
        ...(difficulty && { difficulty }),
        ...(estimatedDuration !== undefined && {
          estimatedDuration: estimatedDuration ? parseInt(estimatedDuration) : null,
        }),
        ...(audioSummaryUrl !== undefined && { audioSummaryUrl }),
        ...(videoClipUrl !== undefined && { videoClipUrl }),
        ...(youtubeEmbedId !== undefined && { youtubeEmbedId }),
        ...(externalLink !== undefined && { externalLink }),
        ...(isPinned !== undefined && { isPinned }),
        ...(rating !== undefined && { rating: rating ? parseFloat(rating) : null }),
      },
    });

    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check ownership
    const existingContent = await prisma.skillContent.findUnique({
      where: { id: params.id },
    });

    if (!existingContent) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    if (existingContent.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.skillContent.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
