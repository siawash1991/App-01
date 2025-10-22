import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Activity, BookOpen, FileText, TrendingUp, Flame, BookMarked } from 'lucide-react';
import Link from 'next/link';

async function getStats(userId: string) {
  const [
    totalExercises,
    totalBooks,
    completedBooks,
    totalPosts,
    exercisesThisWeek,
    recentExercises,
    recentBooks,
  ] = await Promise.all([
    prisma.exercise.count({ where: { userId } }),
    prisma.book.count({ where: { userId } }),
    prisma.book.count({ where: { userId, status: 'completed' } }),
    prisma.post.count({ where: { userId } }),
    prisma.exercise.count({
      where: {
        userId,
        completedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
    prisma.exercise.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
      take: 5,
    }),
    prisma.book.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    }),
  ]);

  const totalCalories = await prisma.exercise.aggregate({
    where: { userId, calories: { not: null } },
    _sum: { calories: true },
  });

  const totalPages = await prisma.readingSession.aggregate({
    where: { book: { userId } },
    _sum: { pagesRead: true },
  });

  return {
    totalExercises,
    totalBooks,
    completedBooks,
    totalPosts,
    exercisesThisWeek,
    totalCalories: totalCalories._sum.calories || 0,
    totalPagesRead: totalPages._sum.pagesRead || 0,
    recentExercises,
    recentBooks,
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const stats = await getStats(session!.user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, {session?.user?.name}!</h1>
        <p className="text-gray-600">Here's your productivity overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Exercises</p>
              <p className="text-3xl font-bold">{stats.totalExercises}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Activity className="text-blue-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Books Reading</p>
              <p className="text-3xl font-bold">{stats.totalBooks}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <BookOpen className="text-green-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Posts</p>
              <p className="text-3xl font-bold">{stats.totalPosts}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <FileText className="text-purple-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-3xl font-bold">{stats.exercisesThisWeek}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <TrendingUp className="text-orange-600" size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Calories Burned</p>
              <p className="text-2xl font-bold">{stats.totalCalories.toLocaleString()}</p>
            </div>
            <Flame className="text-red-500" size={32} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pages Read</p>
              <p className="text-2xl font-bold">{stats.totalPagesRead.toLocaleString()}</p>
            </div>
            <BookMarked className="text-indigo-500" size={32} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Exercises</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentExercises.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No exercises yet</p>
            ) : (
              <div className="space-y-3">
                {stats.recentExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">{exercise.title}</p>
                      <p className="text-sm text-gray-600">{exercise.type}</p>
                    </div>
                    <div className="text-right">
                      {exercise.duration && (
                        <p className="text-sm font-medium">{exercise.duration} min</p>
                      )}
                      {exercise.calories && (
                        <p className="text-xs text-gray-600">{exercise.calories} cal</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link
              href="/dashboard/exercises"
              className="block mt-4 text-center text-blue-600 hover:underline"
            >
              View all exercises
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Books</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentBooks.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No books yet</p>
            ) : (
              <div className="space-y-3">
                {stats.recentBooks.map((book) => {
                  const progress = Math.round((book.currentPage / book.totalPages) * 100);
                  return (
                    <div key={book.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">{book.title}</p>
                          <p className="text-sm text-gray-600">{book.author}</p>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {book.status}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {book.currentPage} / {book.totalPages} pages ({progress}%)
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
            <Link
              href="/dashboard/books"
              className="block mt-4 text-center text-blue-600 hover:underline"
            >
              View all books
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
