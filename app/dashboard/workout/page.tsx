'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import ExerciseCard from '@/components/workout/ExerciseCard';
import ExerciseDetailModal from '@/components/workout/ExerciseDetailModal';
import { Calendar, TrendingUp, Flame, Target } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface WorkoutPlan {
  id: string;
  date: string;
  targetReps: number;
  timeLimit: number;
  status: string;
  exercises: DailyExercise[];
}

interface DailyExercise {
  id: string;
  exerciseType: string;
  targetReps: number;
  completedReps: number;
  status: string;
  sets: any[];
}

export default function WorkoutPage() {
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<DailyExercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchWorkoutPlan();
  }, [selectedDate]);

  const fetchWorkoutPlan = async () => {
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const res = await fetch(`/api/workout/plan?date=${dateStr}`);
      const data = await res.json();
      setWorkoutPlan(data);
    } catch (error) {
      console.error('Error fetching workout plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseClick = (exercise: DailyExercise) => {
    setSelectedExercise(exercise);
  };

  const handleCloseModal = () => {
    setSelectedExercise(null);
  };

  const handleRefresh = () => {
    fetchWorkoutPlan();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">در حال بارگذاری...</p>
      </div>
    );
  }

  if (!workoutPlan) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">برنامه تمرینی یافت نشد</p>
      </div>
    );
  }

  const totalCompleted = workoutPlan.exercises.reduce(
    (sum, ex) => sum + ex.completedReps,
    0
  );
  const totalTarget = workoutPlan.exercises.reduce(
    (sum, ex) => sum + ex.targetReps,
    0
  );
  const completedExercises = workoutPlan.exercises.filter(
    (ex) => ex.status === 'completed'
  ).length;
  const progressPercentage = (totalCompleted / totalTarget) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">تمرین روزانه</h1>
          <p className="text-gray-600">برنامه تمرین bodyweight شما</p>
        </div>

        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <input
            type="date"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <Link
            href="/dashboard/workout/analytics"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center space-x-2 rtl:space-x-reverse"
          >
            <TrendingUp size={20} />
            <span>آنالیز</span>
          </Link>
        </div>
      </div>

      {/* Daily Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">پیشرفت کل</p>
                <p className="text-2xl font-bold">
                  {progressPercentage.toFixed(0)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="p-3 bg-green-100 rounded-lg">
                <Flame size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">تکرار انجام شده</p>
                <p className="text-2xl font-bold">{totalCompleted}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">تمرینات تکمیل شده</p>
                <p className="text-2xl font-bold">
                  {completedExercises} / 4
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calendar size={24} className="text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">محدودیت زمان</p>
                <p className="text-2xl font-bold">{workoutPlan.timeLimit} دقیقه</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exercise Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {workoutPlan.exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exerciseType={exercise.exerciseType as any}
            completedReps={exercise.completedReps}
            targetReps={exercise.targetReps}
            status={exercise.status as any}
            onClick={() => handleExerciseClick(exercise)}
          />
        ))}
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>نکات تمرین</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="font-semibold text-blue-900 mb-1">گرم کردن</p>
              <p className="text-blue-700">
                قبل از شروع حتماً 5-10 دقیقه گرم کردن انجام دهید
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="font-semibold text-green-900 mb-1">فرم صحیح</p>
              <p className="text-green-700">
                تمرکز روی فرم صحیح مهم‌تر از تعداد تکرار است
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="font-semibold text-purple-900 mb-1">استراحت</p>
              <p className="text-purple-700">
                بین ست‌ها 60-90 ثانیه استراحت داشته باشید
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <ExerciseDetailModal
          exercise={selectedExercise}
          isOpen={!!selectedExercise}
          onClose={handleCloseModal}
          onRefresh={handleRefresh}
        />
      )}
    </div>
  );
}
