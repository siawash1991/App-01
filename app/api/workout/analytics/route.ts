import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { subDays, subWeeks, subMonths, startOfDay, differenceInDays } from 'date-fns';

// GET /api/workout/analytics - Get workout analytics
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'month'; // week, month, year, all
    const exerciseType = searchParams.get('exerciseType');

    // Calculate date range
    let startDate: Date;
    const endDate = new Date();

    switch (period) {
      case 'week':
        startDate = subWeeks(endDate, 1);
        break;
      case 'month':
        startDate = subMonths(endDate, 1);
        break;
      case 'year':
        startDate = subMonths(endDate, 12);
        break;
      default:
        startDate = new Date(0); // All time
    }

    // Get all workout plans in the period
    const workoutPlans = await prisma.workoutPlan.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        exercises: {
          where: exerciseType ? { exerciseType } : {},
          include: {
            sets: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Calculate overview stats
    const totalWorkouts = workoutPlans.filter(
      (wp) => wp.status === 'completed'
    ).length;

    let totalReps = 0;
    const exerciseStats: Record<string, any> = {
      pushup: { totalReps: 0, totalSets: 0, avgRepsPerSet: 0, bestSet: 0, lastWorkout: null },
      pullup: { totalReps: 0, totalSets: 0, avgRepsPerSet: 0, bestSet: 0, lastWorkout: null },
      squat: { totalReps: 0, totalSets: 0, avgRepsPerSet: 0, bestSet: 0, lastWorkout: null },
      situp: { totalReps: 0, totalSets: 0, avgRepsPerSet: 0, bestSet: 0, lastWorkout: null },
    };

    // Process each workout plan
    workoutPlans.forEach((plan) => {
      plan.exercises.forEach((exercise) => {
        const type = exercise.exerciseType;
        totalReps += exercise.completedReps;
        exerciseStats[type].totalReps += exercise.completedReps;
        exerciseStats[type].totalSets += exercise.sets.length;

        // Find best set
        exercise.sets.forEach((set) => {
          if (set.reps > exerciseStats[type].bestSet) {
            exerciseStats[type].bestSet = set.reps;
          }
        });

        // Update last workout
        if (!exerciseStats[type].lastWorkout || plan.date > exerciseStats[type].lastWorkout) {
          exerciseStats[type].lastWorkout = plan.date;
        }
      });
    });

    // Calculate average reps per set for each exercise
    Object.keys(exerciseStats).forEach((type) => {
      const stats = exerciseStats[type];
      stats.avgRepsPerSet = stats.totalSets > 0
        ? Math.round(stats.totalReps / stats.totalSets)
        : 0;
    });

    // Calculate average reps per day
    const daysInPeriod = differenceInDays(endDate, startDate) || 1;
    const averageRepsPerDay = Math.round(totalReps / daysInPeriod);

    // Calculate streak
    const allPlans = await prisma.workoutPlan.findMany({
      where: {
        userId: session.user.id,
        status: 'completed',
      },
      orderBy: {
        date: 'desc',
      },
      select: {
        date: true,
      },
    });

    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    allPlans.forEach((plan, index) => {
      if (index === 0) {
        // Check if current streak is ongoing (today or yesterday)
        const today = startOfDay(new Date());
        const planDate = startOfDay(plan.date);
        const daysDiff = differenceInDays(today, planDate);

        if (daysDiff <= 1) {
          currentStreak = 1;
          tempStreak = 1;
          lastDate = planDate;
        }
      } else if (lastDate) {
        const daysDiff = differenceInDays(lastDate, startOfDay(plan.date));

        if (daysDiff === 1) {
          tempStreak++;
          if (index === 0 || (index > 0 && currentStreak > 0)) {
            currentStreak = tempStreak;
          }
        } else {
          if (tempStreak > bestStreak) {
            bestStreak = tempStreak;
          }
          tempStreak = 1;
        }

        lastDate = startOfDay(plan.date);
      }
    });

    if (tempStreak > bestStreak) {
      bestStreak = tempStreak;
    }

    // Create timeline data
    const timeline = workoutPlans.map((plan) => ({
      date: plan.date,
      pushup: plan.exercises.find((e) => e.exerciseType === 'pushup')?.completedReps || 0,
      pullup: plan.exercises.find((e) => e.exerciseType === 'pullup')?.completedReps || 0,
      squat: plan.exercises.find((e) => e.exerciseType === 'squat')?.completedReps || 0,
      situp: plan.exercises.find((e) => e.exerciseType === 'situp')?.completedReps || 0,
      total: plan.exercises.reduce((sum, e) => sum + e.completedReps, 0),
    }));

    // Create streak calendar (for heatmap)
    const streakCalendar = allPlans.map((plan) => ({
      date: plan.date,
      completed: true,
    }));

    return NextResponse.json({
      overview: {
        totalWorkouts,
        totalReps,
        averageRepsPerDay,
        currentStreak,
        bestStreak,
      },
      byExercise: exerciseStats,
      timeline,
      streakCalendar,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
