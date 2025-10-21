import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// DELETE /api/workout/set/[id] - Delete a set
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get set with exercise and workout plan for ownership check
    const set = await prisma.exerciseSet.findUnique({
      where: { id: params.id },
      include: {
        dailyExercise: {
          include: {
            workoutPlan: true,
          },
        },
      },
    });

    if (!set || set.dailyExercise.workoutPlan.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Delete set and update exercise in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Delete the set
      await tx.exerciseSet.delete({
        where: { id: params.id },
      });

      // Recalculate completed reps
      const remainingSets = await tx.exerciseSet.findMany({
        where: {
          dailyExerciseId: set.dailyExerciseId,
        },
      });

      const newCompletedReps = remainingSets.reduce(
        (sum, s) => sum + s.reps,
        0
      );

      // Update exercise
      const updatedExercise = await tx.dailyExercise.update({
        where: { id: set.dailyExerciseId },
        data: {
          completedReps: newCompletedReps,
          status: newCompletedReps >= set.dailyExercise.targetReps ? 'completed' : 'pending',
        },
        include: {
          sets: {
            orderBy: {
              setNumber: 'asc',
            },
          },
        },
      });

      return updatedExercise;
    });

    return NextResponse.json({
      deleted: true,
      updatedExercise: result,
    });
  } catch (error) {
    console.error('Error deleting set:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
