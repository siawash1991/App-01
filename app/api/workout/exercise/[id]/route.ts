import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/workout/exercise/[id] - Get exercise details
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const exercise = await prisma.dailyExercise.findUnique({
      where: { id: params.id },
      include: {
        sets: {
          orderBy: {
            setNumber: 'asc',
          },
        },
        workoutPlan: true,
      },
    });

    if (!exercise) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Verify ownership through workout plan
    if (exercise.workoutPlan.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const progress = (exercise.completedReps / exercise.targetReps) * 100;

    return NextResponse.json({
      exercise,
      progress: Math.min(progress, 100),
    });
  } catch (error) {
    console.error('Error fetching exercise:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

// PATCH /api/workout/exercise/[id] - Update exercise
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
    const { status, notes } = body;

    // Get exercise with workout plan for ownership check
    const exercise = await prisma.dailyExercise.findUnique({
      where: { id: params.id },
      include: { workoutPlan: true },
    });

    if (!exercise || exercise.workoutPlan.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const updated = await prisma.dailyExercise.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
      },
      include: {
        sets: {
          orderBy: {
            setNumber: 'asc',
          },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating exercise:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
