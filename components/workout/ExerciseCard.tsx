'use client';

import { Card } from '@/components/ui/Card';
import Image from 'next/image';

interface ExerciseCardProps {
  exerciseType: 'pushup' | 'pullup' | 'squat' | 'situp';
  completedReps: number;
  targetReps: number;
  status: 'pending' | 'completed' | 'skipped';
  onClick: () => void;
}

const exerciseConfig = {
  pushup: {
    name: 'Push-up',
    nameFa: 'شنا',
    image: '/images/exercises/pushup-main.jpg',
    color: 'blue',
  },
  pullup: {
    name: 'Pull-up',
    nameFa: 'بارفیکس',
    image: '/images/exercises/pullup-main.jpg',
    color: 'green',
  },
  squat: {
    name: 'Squat',
    nameFa: 'اسکوات',
    image: '/images/exercises/squat-main.jpg',
    color: 'purple',
  },
  situp: {
    name: 'Sit-up',
    nameFa: 'دراز و نشست',
    image: '/images/exercises/situp-main.jpg',
    color: 'orange',
  },
};

const statusConfig = {
  pending: {
    label: 'در انتظار',
    color: 'bg-gray-100 text-gray-700',
  },
  completed: {
    label: 'تکمیل شده',
    color: 'bg-green-100 text-green-700',
  },
  skipped: {
    label: 'رد شده',
    color: 'bg-red-100 text-red-700',
  },
};

export default function ExerciseCard({
  exerciseType,
  completedReps,
  targetReps,
  status,
  onClick,
}: ExerciseCardProps) {
  const config = exerciseConfig[exerciseType];
  const statusInfo = statusConfig[status];
  const progress = Math.min((completedReps / targetReps) * 100, 100);

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-48 w-full bg-gray-200">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
          <span className="text-6xl text-gray-400">
            {exerciseType === 'pushup' && '💪'}
            {exerciseType === 'pullup' && '🏋️'}
            {exerciseType === 'squat' && '🦵'}
            {exerciseType === 'situp' && '🧘'}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{config.name}</h3>
            <p className="text-sm text-gray-600">{config.nameFa}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">پیشرفت</span>
            <span className="font-medium">
              {completedReps} / {targetReps}
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all duration-300 bg-${config.color}-600`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-xs text-gray-500 text-center">
            {progress.toFixed(0)}% تکمیل شده
          </p>
        </div>

        <button
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            status === 'completed'
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          {status === 'completed' ? 'مشاهده جزئیات' : completedReps > 0 ? 'ادامه' : 'شروع'}
        </button>
      </div>
    </Card>
  );
}
