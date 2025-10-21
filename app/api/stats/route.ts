import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [
      totalExercises,
      totalBooks,
      completedBooks,
      totalPosts,
      exercisesThisWeek,
    ] = await Promise.all([
      prisma.exercise.count({
        where: { userId: session.user.id },
      }),
      prisma.book.count({
        where: { userId: session.user.id },
      }),
      prisma.book.count({
        where: {
          userId: session.user.id,
          status: 'completed',
        },
      }),
      prisma.post.count({
        where: { userId: session.user.id },
      }),
      prisma.exercise.count({
        where: {
          userId: session.user.id,
          completedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    const totalCalories = await prisma.exercise.aggregate({
      where: {
        userId: session.user.id,
        calories: { not: null },
      },
      _sum: {
        calories: true,
      },
    });

    const totalPages = await prisma.readingSession.aggregate({
      where: {
        book: {
          userId: session.user.id,
        },
      },
      _sum: {
        pagesRead: true,
      },
    });

    return NextResponse.json({
      totalExercises,
      totalBooks,
      completedBooks,
      totalPosts,
      exercisesThisWeek,
      totalCalories: totalCalories._sum.calories || 0,
      totalPagesRead: totalPages._sum.pagesRead || 0,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
