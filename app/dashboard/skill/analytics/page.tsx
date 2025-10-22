'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { TrendingUp, BookOpen, Clock, CheckCircle, Flame, Star } from 'lucide-react';
import ProgressCharts from '@/components/skill/ProgressCharts';

interface Analytics {
  overview: {
    totalContent: number;
    totalCompleted: number;
    totalInProgress: number;
    totalTimeSpent: number;
    currentStreak: number;
    bestStreak: number;
  };
  byCategory: {
    books: { total: number; completed: number; timeSpent: number };
    podcasts: { total: number; completed: number; timeSpent: number };
    documentaries: { total: number; completed: number; timeSpent: number };
  };
  topTopics: Array<{ tag: string; count: number }>;
  timeline: Array<{ date: string; completed: number; timeSpent: number }>;
  completionRate: number;
  recentActivity: Array<any>;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('all');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/skill/analytics?period=${period}`);
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!analytics) {
    return <div className="text-center py-12">خطا در بارگذاری آمار</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-green-600" />
            آنالیز پیشرفت
          </h1>
          <p className="text-gray-600 mt-1">
            نمایش جامع پیشرفت و فعالیت‌های یادگیری شما
          </p>
        </div>

        {/* Period Filter */}
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        >
          <option value="week">این هفته</option>
          <option value="month">این ماه</option>
          <option value="year">امسال</option>
          <option value="all">همه</option>
        </select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-6 h-6" />
              <p className="text-sm opacity-90">کل محتوا</p>
            </div>
            <p className="text-3xl font-bold">{analytics.overview.totalContent}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6" />
              <p className="text-sm opacity-90">تکمیل شده</p>
            </div>
            <p className="text-3xl font-bold">{analytics.overview.totalCompleted}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6" />
              <p className="text-sm opacity-90">در حال مطالعه</p>
            </div>
            <p className="text-3xl font-bold">{analytics.overview.totalInProgress}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6" />
              <p className="text-sm opacity-90">ساعات یادگیری</p>
            </div>
            <p className="text-3xl font-bold">
              {Math.round(analytics.overview.totalTimeSpent / 60)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Flame className="w-6 h-6" />
              <p className="text-sm opacity-90">استریک فعلی</p>
            </div>
            <p className="text-3xl font-bold">{analytics.overview.currentStreak}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-6 h-6" />
              <p className="text-sm opacity-90">بهترین استریک</p>
            </div>
            <p className="text-3xl font-bold">{analytics.overview.bestStreak}</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>آمار بر اساس دسته‌بندی</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Books */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">کتاب‌ها</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">کل:</span>
                  <span className="font-semibold">{analytics.byCategory.books.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">تکمیل شده:</span>
                  <span className="font-semibold">{analytics.byCategory.books.completed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">زمان:</span>
                  <span className="font-semibold">
                    {Math.round(analytics.byCategory.books.timeSpent / 60)} ساعت
                  </span>
                </div>
              </div>
            </div>

            {/* Podcasts */}
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-purple-900">پادکست‌ها</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">کل:</span>
                  <span className="font-semibold">{analytics.byCategory.podcasts.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">تکمیل شده:</span>
                  <span className="font-semibold">{analytics.byCategory.podcasts.completed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">زمان:</span>
                  <span className="font-semibold">
                    {Math.round(analytics.byCategory.podcasts.timeSpent / 60)} ساعت
                  </span>
                </div>
              </div>
            </div>

            {/* Documentaries */}
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-red-900">مستندها</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">کل:</span>
                  <span className="font-semibold">{analytics.byCategory.documentaries.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">تکمیل شده:</span>
                  <span className="font-semibold">
                    {analytics.byCategory.documentaries.completed}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">زمان:</span>
                  <span className="font-semibold">
                    {Math.round(analytics.byCategory.documentaries.timeSpent / 60)} ساعت
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Topics */}
      {analytics.topTopics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>موضوعات محبوب</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {analytics.topTopics.map((topic, index) => (
                <div
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-full font-semibold"
                >
                  {topic.tag} ({topic.count})
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion Rate */}
      <Card>
        <CardHeader>
          <CardTitle>نرخ تکمیل</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{analytics.completionRate.toFixed(1)}%</span>
              <span className="text-gray-600">
                {analytics.overview.totalCompleted} از {analytics.overview.totalContent} محتوا
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all"
                style={{ width: `${analytics.completionRate}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <ProgressCharts
        categoryData={analytics.byCategory}
        timelineData={analytics.timeline}
        topicsData={analytics.topTopics}
      />

      {/* Recent Activity */}
      {analytics.recentActivity.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>فعالیت‌های اخیر</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.recentActivity.slice(0, 5).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  {activity.content.coverImage ? (
                    <img
                      src={activity.content.coverImage}
                      alt={activity.content.title}
                      className="w-12 h-12 rounded object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold">{activity.content.title}</p>
                    <p className="text-sm text-gray-600">
                      {activity.status === 'completed' ? 'تکمیل شده' :
                       activity.status === 'in_progress' ? 'در حال مطالعه' :
                       activity.status === 'paused' ? 'متوقف شده' : 'شروع نشده'} •{' '}
                      {activity.progressPercentage}%
                    </p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {new Date(activity.lastAccessedAt).toLocaleDateString('fa-IR')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
