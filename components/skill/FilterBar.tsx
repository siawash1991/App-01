'use client';

import { Search } from 'lucide-react';

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  difficulty: string;
  onDifficultyChange: (value: string) => void;
  showStatus?: boolean;
}

export default function FilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  difficulty,
  onDifficultyChange,
  showStatus = true,
}: FilterBarProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="جستجو در محتوا..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        {showStatus && (
          <div>
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="not_started">شروع نشده</option>
              <option value="in_progress">در حال مطالعه</option>
              <option value="completed">تکمیل شده</option>
              <option value="paused">متوقف شده</option>
            </select>
          </div>
        )}

        {/* Difficulty Filter */}
        <div>
          <select
            value={difficulty}
            onChange={(e) => onDifficultyChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">همه سطوح</option>
            <option value="beginner">مبتدی</option>
            <option value="intermediate">متوسط</option>
            <option value="advanced">پیشرفته</option>
          </select>
        </div>
      </div>
    </div>
  );
}
