import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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
    const existingProgress = await prisma.userProgress.findUnique({
      where: { id: params.id },
    });

    if (!existingProgress) {
      return NextResponse.json({ error: 'Progress not found' }, { status: 404 });
    }

    if (existingProgress.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const {
      status,
      currentSection,
      progressPercentage,
      totalTimeSpent,
      notes,
      rating,
    } = body;

    const updateData: any = {
      lastAccessedAt: new Date(),
    };

    if (status) {
      updateData.status = status;
      if (status === 'completed' && !existingProgress.completedAt) {
        updateData.completedAt = new Date();
      }
    }

    if (currentSection !== undefined) {
      updateData.currentSection = parseInt(currentSection);
    }

    if (progressPercentage !== undefined) {
      updateData.progressPercentage = parseInt(progressPercentage);
    }

    if (totalTimeSpent !== undefined) {
      updateData.totalTimeSpent = parseInt(totalTimeSpent);
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    if (rating !== undefined) {
      updateData.rating = rating ? parseInt(rating) : null;
    }

    const updatedProgress = await prisma.userProgress.update({
      where: { id: params.id },
      data: updateData,
      include: {
        content: true,
      },
    });

    return NextResponse.json(updatedProgress);
  } catch (error) {
    console.error('Error updating progress:', error);
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
    const existingProgress = await prisma.userProgress.findUnique({
      where: { id: params.id },
    });

    if (!existingProgress) {
      return NextResponse.json({ error: 'Progress not found' }, { status: 404 });
    }

    if (existingProgress.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.userProgress.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Progress deleted successfully' });
  } catch (error) {
    console.error('Error deleting progress:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
