import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/workout/exercise/[id]/set - Add a new set
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { reps, restTime } = body;

    if (!reps || reps < 1) {
      return NextResponse.json(
        { error: 'Reps must be at least 1' },
        { status: 400 }
      );
    }

    // Get exercise with workout plan for ownership check
    const exercise = await prisma.dailyExercise.findUnique({
      where: { id: params.id },
      include: {
        workoutPlan: true,
        sets: true,
      },
    });

    if (!exercise || exercise.workoutPlan.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Calculate next set number
    const setNumber = exercise.sets.length + 1;
    const newCompletedReps = exercise.completedReps + reps;

    // Create the set and update exercise in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const set = await tx.exerciseSet.create({
        data: {
          dailyExerciseId: params.id,
          setNumber,
          reps,
          restTime: restTime || null,
        },
      });

      const updatedExercise = await tx.dailyExercise.update({
        where: { id: params.id },
        data: {
          completedReps: newCompletedReps,
          status: newCompletedReps >= exercise.targetReps ? 'completed' : 'pending',
        },
        include: {
          sets: {
            orderBy: {
              setNumber: 'asc',
            },
          },
        },
      });

      return { set, updatedExercise };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating set:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
