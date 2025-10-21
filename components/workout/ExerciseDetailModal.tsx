'use client';

import { useState, useEffect } from 'react';
import { X, Trash2, CheckCircle } from 'lucide-react';
import Timer from './Timer';
import ProgressBar from './ProgressBar';

interface ExerciseSet {
  id: string;
  setNumber: number;
  reps: number;
  restTime: number | null;
  createdAt: string;
}

interface DailyExercise {
  id: string;
  exerciseType: string;
  targetReps: number;
  completedReps: number;
  status: string;
  notes: string | null;
  sets: ExerciseSet[];
}

interface ExerciseDetailModalProps {
  exercise: DailyExercise;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const exerciseNames = {
  pushup: { en: 'Push-up', fa: 'شنا' },
  pullup: { en: 'Pull-up', fa: 'بارفیکس' },
  squat: { en: 'Squat', fa: 'اسکوات' },
  situp: { en: 'Sit-up', fa: 'دراز و نشست' },
};

export default function ExerciseDetailModal({
  exercise,
  isOpen,
  onClose,
  onRefresh,
}: ExerciseDetailModalProps) {
  const [reps, setReps] = useState('');
  const [restTime, setRestTime] = useState('60');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const exerciseName = exerciseNames[exercise.exerciseType as keyof typeof exerciseNames];
  const remaining = exercise.targetReps - exercise.completedReps;
  const isCompleted = exercise.completedReps >= exercise.targetReps;

  const handleAddSet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reps || parseInt(reps) < 1) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/workout/exercise/${exercise.id}/set`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reps: parseInt(reps),
          restTime: restTime ? parseInt(restTime) : null,
        }),
      });

      if (res.ok) {
        setReps('');
        setRestTime('60');
        onRefresh();
      }
    } catch (error) {
      console.error('Error adding set:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSet = async (setId: string) => {
    if (!confirm('آیا از حذف این ست مطمئن هستید؟')) return;

    try {
      const res = await fetch(`/api/workout/set/${setId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting set:', error);
    }
  };

  const handleComplete = async () => {
    try {
      await fetch(`/api/workout/exercise/${exercise.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      });
      onRefresh();
      onClose();
    } catch (error) {
      console.error('Error completing exercise:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{exerciseName.en}</h2>
            <p className="text-gray-600">{exerciseName.fa}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Target Info */}
          <div className="bg-blue-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">هدف:</span>
              <span className="font-bold text-lg">{exercise.targetReps} عدد</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">انجام شده:</span>
              <span className="font-bold text-lg text-blue-600">
                {exercise.completedReps} عدد
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">باقیمانده:</span>
              <span className="font-bold text-lg text-orange-600">{remaining} عدد</span>
            </div>
            <ProgressBar
              current={exercise.completedReps}
              target={exercise.targetReps}
              color="blue"
              size="lg"
            />
          </div>

          {/* Timer */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">تایمر تمرین</h3>
            <Timer />
          </div>

          {/* Add Set Form */}
          {!isCompleted && (
            <form onSubmit={handleAddSet} className="border border-gray-200 rounded-lg p-4 space-y-4">
              <h3 className="font-semibold">ثبت ست جدید</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تعداد تکرار *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={remaining}
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    placeholder="مثلا 15"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    زمان استراحت (ثانیه)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={restTime}
                    onChange={(e) => setRestTime(e.target.value)}
                    placeholder="60"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'در حال ثبت...' : 'ثبت ست'}
              </button>
            </form>
          )}

          {/* Completion Message */}
          {isCompleted && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center space-y-3">
              <CheckCircle size={48} className="mx-auto text-green-600" />
              <h3 className="text-lg font-bold text-green-800">
                تبریک! تمرین تکمیل شد
              </h3>
              <p className="text-green-700">
                شما به هدف {exercise.targetReps} تکرار رسیدید!
              </p>
              <button
                onClick={handleComplete}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                تایید و بستن
              </button>
            </div>
          )}

          {/* Sets History */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-4">
              تاریخچه ست‌ها ({exercise.sets.length})
            </h3>

            {exercise.sets.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                هنوز ستی ثبت نشده است
              </p>
            ) : (
              <div className="space-y-2">
                {exercise.sets.map((set) => (
                  <div
                    key={set.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <span className="font-bold text-lg text-blue-600">
                        #{set.setNumber}
                      </span>
                      <div>
                        <p className="font-medium">{set.reps} تکرار</p>
                        {set.restTime && (
                          <p className="text-sm text-gray-600">
                            استراحت: {set.restTime} ثانیه
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteSet(set.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="حذف ست"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
