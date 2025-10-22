'use client';

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface CategoryData {
  books: { total: number; completed: number; timeSpent: number };
  podcasts: { total: number; completed: number; timeSpent: number };
  documentaries: { total: number; completed: number; timeSpent: number };
}

interface TimelineData {
  date: string;
  completed: number;
  timeSpent: number;
}

interface TopicData {
  tag: string;
  count: number;
}

interface ProgressChartsProps {
  categoryData: CategoryData;
  timelineData: TimelineData[];
  topicsData: TopicData[];
}

const COLORS = {
  books: '#3b82f6',
  podcasts: '#a855f7',
  documentaries: '#ef4444',
  completed: '#10b981',
  timeSpent: '#f59e0b',
};

export default function ProgressCharts({
  categoryData,
  timelineData,
  topicsData,
}: ProgressChartsProps) {
  // Pie Chart Data
  const pieData = [
    { name: 'کتاب‌ها', value: categoryData.books.total, color: COLORS.books },
    { name: 'پادکست‌ها', value: categoryData.podcasts.total, color: COLORS.podcasts },
    { name: 'مستندها', value: categoryData.documentaries.total, color: COLORS.documentaries },
  ];

  // Bar Chart Data (Top Topics)
  const topTopicsData = topicsData.slice(0, 10);

  // Line Chart Data (Timeline)
  const formattedTimeline = timelineData.map((item) => ({
    date: new Date(item.date).toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' }),
    تکمیل_شده: item.completed,
    زمان: Math.round(item.timeSpent / 60), // Convert to hours
  }));

  // Completion Bar Chart Data
  const completionData = [
    {
      name: 'کتاب‌ها',
      تکمیل_شده: categoryData.books.completed,
      کل: categoryData.books.total,
    },
    {
      name: 'پادکست‌ها',
      تکمیل_شده: categoryData.podcasts.completed,
      کل: categoryData.podcasts.total,
    },
    {
      name: 'مستندها',
      تکمیل_شده: categoryData.documentaries.completed,
      کل: categoryData.documentaries.total,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Pie Chart - Category Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">توزیع محتوا بر اساس دسته‌بندی</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart - Completion Rate */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">نرخ تکمیل بر اساس دسته‌بندی</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={completionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="تکمیل_شده" fill={COLORS.completed} />
            <Bar dataKey="کل" fill="#d1d5db" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart - Timeline */}
      {formattedTimeline.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">روند 30 روز گذشته</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={formattedTimeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="تکمیل_شده"
                stroke={COLORS.completed}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="زمان"
                stroke={COLORS.timeSpent}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Bar Chart - Top Topics */}
      {topTopicsData.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">محبوب‌ترین موضوعات</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topTopicsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="tag" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="count" fill={COLORS.books} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
