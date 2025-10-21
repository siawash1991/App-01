import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { startOfDay, endOfDay } from 'date-fns';

// GET /api/workout/plan - Get workout plan for a specific date
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get('date');
    const date = dateParam ? new Date(dateParam) : new Date();

    // Find or create today's workout plan
    let workoutPlan = await prisma.workoutPlan.findUnique({
      where: {
        userId_date: {
          userId: session.user.id,
          date: startOfDay(date),
        },
      },
      include: {
        exercises: {
          include: {
            sets: {
              orderBy: {
                setNumber: 'asc',
              },
            },
          },
        },
      },
    });

    // If no plan exists for this date, create one
    if (!workoutPlan) {
      workoutPlan = await prisma.workoutPlan.create({
        data: {
          userId: session.user.id,
          date: startOfDay(date),
          targetReps: 100,
          timeLimit: 60,
          exercises: {
            create: [
              { exerciseType: 'pushup', targetReps: 100 },
              { exerciseType: 'pullup', targetReps: 100 },
              { exerciseType: 'squat', targetReps: 100 },
              { exerciseType: 'situp', targetReps: 100 },
            ],
          },
        },
        include: {
          exercises: {
            include: {
              sets: true,
            },
          },
        },
      });
    }

    return NextResponse.json(workoutPlan);
  } catch (error) {
    console.error('Error fetching workout plan:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

// POST /api/workout/plan - Create a new workout plan
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { date, targetReps = 100, timeLimit = 60 } = body;

    const workoutDate = date ? new Date(date) : new Date();

    // Check if plan already exists
    const existing = await prisma.workoutPlan.findUnique({
      where: {
        userId_date: {
          userId: session.user.id,
          date: startOfDay(workoutDate),
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Workout plan already exists for this date' },
        { status: 400 }
      );
    }

    const workoutPlan = await prisma.workoutPlan.create({
      data: {
        userId: session.user.id,
        date: startOfDay(workoutDate),
        targetReps,
        timeLimit,
        exercises: {
          create: [
            { exerciseType: 'pushup', targetReps },
            { exerciseType: 'pullup', targetReps },
            { exerciseType: 'squat', targetReps },
            { exerciseType: 'situp', targetReps },
          ],
        },
      },
      include: {
        exercises: {
          include: {
            sets: true,
          },
        },
      },
    });

    return NextResponse.json(workoutPlan, { status: 201 });
  } catch (error) {
    console.error('Error creating workout plan:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
