'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Calendar, TrendingUp, Activity, Flame, Award } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface Analytics {
  overview: {
    totalWorkouts: number;
    totalReps: number;
    averageRepsPerDay: number;
    currentStreak: number;
    bestStreak: number;
  };
  byExercise: {
    [key: string]: {
      totalReps: number;
      totalSets: number;
      avgRepsPerSet: number;
      bestSet: number;
      lastWorkout: string | null;
    };
  };
  timeline: Array<{
    date: string;
    pushup: number;
    pullup: number;
    squat: number;
    situp: number;
    total: number;
  }>;
  streakCalendar: Array<{
    date: string;
    completed: boolean;
  }>;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`/api/workout/analytics?period=${period}`);
      const data = await res.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">در حال بارگذاری...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">داده‌ای یافت نشد</p>
      </div>
    );
  }

  const exerciseNames = {
    pushup: 'شنا',
    pullup: 'بارفیکس',
    squat: 'اسکوات',
    situp: 'دراز و نشست',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">آنالیز عملکرد</h1>
          <p className="text-gray-600">بررسی پیشرفت و آمار تمرینات</p>
        </div>

        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">هفته گذشته</option>
            <option value="month">ماه گذشته</option>
            <option value="year">سال گذشته</option>
            <option value="all">همه زمان‌ها</option>
          </select>
          <Link
            href="/dashboard/workout"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            بازگشت به تمرین
          </Link>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Calendar size={32} className="mx-auto text-blue-600 mb-2" />
              <p className="text-sm text-gray-600">کل تمرینات</p>
              <p className="text-3xl font-bold">{analytics.overview.totalWorkouts}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <TrendingUp size={32} className="mx-auto text-green-600 mb-2" />
              <p className="text-sm text-gray-600">کل تکرارها</p>
              <p className="text-3xl font-bold">{analytics.overview.totalReps}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Activity size={32} className="mx-auto text-purple-600 mb-2" />
              <p className="text-sm text-gray-600">میانگین روزانه</p>
              <p className="text-3xl font-bold">{analytics.overview.averageRepsPerDay}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Flame size={32} className="mx-auto text-orange-600 mb-2" />
              <p className="text-sm text-gray-600">استریک فعلی</p>
              <p className="text-3xl font-bold">{analytics.overview.currentStreak}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Award size={32} className="mx-auto text-yellow-600 mb-2" />
              <p className="text-sm text-gray-600">بهترین استریک</p>
              <p className="text-3xl font-bold">{analytics.overview.bestStreak}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle>روند پیشرفت</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.timeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => format(new Date(value), 'MM/dd')}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => format(new Date(value), 'yyyy/MM/dd')}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="pushup"
                stroke="#3b82f6"
                name="شنا"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="pullup"
                stroke="#10b981"
                name="بارفیکس"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="squat"
                stroke="#8b5cf6"
                name="اسکوات"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="situp"
                stroke="#f59e0b"
                name="دراز و نشست"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>مقایسه ورزش‌ها</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                {
                  name: 'شنا',
                  تکرار: analytics.byExercise.pushup?.totalReps || 0,
                },
                {
                  name: 'بارفیکس',
                  تکرار: analytics.byExercise.pullup?.totalReps || 0,
                },
                {
                  name: 'اسکوات',
                  تکرار: analytics.byExercise.squat?.totalReps || 0,
                },
                {
                  name: 'دراز و نشست',
                  تکرار: analytics.byExercise.situp?.totalReps || 0,
                },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="تکرار" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Exercise Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(analytics.byExercise).map(([type, stats]) => (
          <Card key={type}>
            <CardHeader>
              <CardTitle>
                {exerciseNames[type as keyof typeof exerciseNames]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">کل تکرارها:</span>
                  <span className="font-bold">{stats.totalReps}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">کل ست‌ها:</span>
                  <span className="font-bold">{stats.totalSets}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">میانگین تکرار در ست:</span>
                  <span className="font-bold">{stats.avgRepsPerSet}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">بهترین رکورد:</span>
                  <span className="font-bold text-green-600">{stats.bestSet}</span>
                </div>
                {stats.lastWorkout && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">آخرین تمرین:</span>
                    <span className="font-medium">
                      {format(new Date(stats.lastWorkout), 'yyyy/MM/dd')}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Streak Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>تقویم تمرینات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {analytics.streakCalendar.slice(0, 35).map((day, index) => (
              <div
                key={index}
                className={`aspect-square rounded-lg flex items-center justify-center text-xs ${
                  day.completed
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
                title={format(new Date(day.date), 'yyyy/MM/dd')}
              >
                {format(new Date(day.date), 'd')}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">
            سبز: تمرین انجام شده | خاکستری: تمرین انجام نشده
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
