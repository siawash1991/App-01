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
    const period = searchParams.get('period') || 'all'; // week, month, year, all
    const category = searchParams.get('category'); // book, podcast, documentary, all

    // Calculate date range based on period
    let dateFilter: Date | undefined;
    const now = new Date();

    switch (period) {
      case 'week':
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        dateFilter = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
    }

    // Fetch all user progress
    const progressWhere: any = {
      userId: session.user.id,
    };

    if (dateFilter) {
      progressWhere.createdAt = {
        gte: dateFilter,
      };
    }

    if (category && category !== 'all') {
      progressWhere.content = {
        category,
      };
    }

    const allProgress = await prisma.userProgress.findMany({
      where: progressWhere,
      include: {
        content: {
          select: {
            category: true,
            tags: true,
            estimatedDuration: true,
          },
        },
      },
    });

    // Calculate overview stats
    const totalContent = allProgress.length;
    const totalCompleted = allProgress.filter((p) => p.status === 'completed').length;
    const totalInProgress = allProgress.filter((p) => p.status === 'in_progress').length;
    const totalTimeSpent = allProgress.reduce((sum, p) => sum + (p.totalTimeSpent || 0), 0);

    // Calculate streak
    const sortedProgress = await prisma.userProgress.findMany({
      where: {
        userId: session.user.id,
        status: 'completed',
      },
      orderBy: {
        completedAt: 'desc',
      },
      select: {
        completedAt: true,
      },
    });

    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    for (const progress of sortedProgress) {
      if (!progress.completedAt) continue;

      const completedDate = new Date(progress.completedAt);
      completedDate.setHours(0, 0, 0, 0);

      if (!lastDate) {
        tempStreak = 1;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

        if (
          completedDate.getTime() === today.getTime() ||
          completedDate.getTime() === yesterday.getTime()
        ) {
          currentStreak = 1;
        }
      } else {
        const dayDiff = Math.floor(
          (lastDate.getTime() - completedDate.getTime()) / (24 * 60 * 60 * 1000)
        );

        if (dayDiff === 1) {
          tempStreak++;
          if (currentStreak > 0) currentStreak++;
        } else {
          if (tempStreak > bestStreak) bestStreak = tempStreak;
          tempStreak = 1;
        }
      }

      lastDate = completedDate;
    }

    if (tempStreak > bestStreak) bestStreak = tempStreak;
    if (currentStreak === 0) currentStreak = 0;

    // Stats by category
    const byCategory = {
      books: {
        total: allProgress.filter((p) => p.content.category === 'book').length,
        completed: allProgress.filter(
          (p) => p.content.category === 'book' && p.status === 'completed'
        ).length,
        timeSpent: allProgress
          .filter((p) => p.content.category === 'book')
          .reduce((sum, p) => sum + (p.totalTimeSpent || 0), 0),
      },
      podcasts: {
        total: allProgress.filter((p) => p.content.category === 'podcast').length,
        completed: allProgress.filter(
          (p) => p.content.category === 'podcast' && p.status === 'completed'
        ).length,
        timeSpent: allProgress
          .filter((p) => p.content.category === 'podcast')
          .reduce((sum, p) => sum + (p.totalTimeSpent || 0), 0),
      },
      documentaries: {
        total: allProgress.filter((p) => p.content.category === 'documentary').length,
        completed: allProgress.filter(
          (p) => p.content.category === 'documentary' && p.status === 'completed'
        ).length,
        timeSpent: allProgress
          .filter((p) => p.content.category === 'documentary')
          .reduce((sum, p) => sum + (p.totalTimeSpent || 0), 0),
      },
    };

    // Top topics (tags)
    const tagCounts: { [key: string]: number } = {};
    allProgress.forEach((progress) => {
      if (progress.content.tags) {
        try {
          const tags = JSON.parse(progress.content.tags);
          tags.forEach((tag: string) => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        } catch (e) {
          // Ignore parse errors
        }
      }
    });

    const topTopics = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Timeline data (last 30 days)
    const timeline: { date: string; completed: number; timeSpent: number }[] = [];
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];

      const dayProgress = allProgress.filter((p) => {
        if (!p.completedAt) return false;
        const completedDate = new Date(p.completedAt).toISOString().split('T')[0];
        return completedDate === dateStr;
      });

      timeline.push({
        date: dateStr,
        completed: dayProgress.length,
        timeSpent: dayProgress.reduce((sum, p) => sum + (p.totalTimeSpent || 0), 0),
      });
    }

    // Completion rate
    const completionRate = totalContent > 0 ? (totalCompleted / totalContent) * 100 : 0;

    // Recent activity
    const recentActivity = await prisma.userProgress.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        content: {
          select: {
            title: true,
            category: true,
            coverImage: true,
          },
        },
      },
      orderBy: {
        lastAccessedAt: 'desc',
      },
      take: 10,
    });

    return NextResponse.json({
      overview: {
        totalContent,
        totalCompleted,
        totalInProgress,
        totalTimeSpent,
        currentStreak,
        bestStreak,
      },
      byCategory,
      topTopics,
      timeline,
      completionRate,
      recentActivity,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
