'use client';

import { useState, useEffect } from 'react';
import { Plus, Film } from 'lucide-react';
import ContentCard from '@/components/skill/ContentCard';
import FilterBar from '@/components/skill/FilterBar';

interface Content {
  id: string;
  category: string;
  title: string;
  author?: string;
  coverImage?: string;
  tags?: string;
  difficulty: string;
  isPinned?: boolean;
  rating?: number;
  audioSummaryUrl?: string;
  videoClipUrl?: string;
  isSystemContent: boolean;
  progress: Array<{
    status: string;
    progressPercentage: number;
    currentSection: number;
  }>;
  _count: {
    sections: number;
  };
}

export default function DocumentariesPage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [difficulty, setDifficulty] = useState('all');

  useEffect(() => {
    fetchContents();
  }, [status, difficulty]);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        category: 'documentary',
        ...(status !== 'all' && { status }),
        ...(difficulty !== 'all' && { difficulty }),
      });

      const res = await fetch(`/api/skill/content?${params}`);
      const data = await res.json();
      setContents(data.contents || []);
    } catch (error) {
      console.error('Error fetching documentaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContents = contents.filter((content) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      content.title.toLowerCase().includes(searchLower) ||
      content.author?.toLowerCase().includes(searchLower)
    );
  });

  const systemDocs = filteredContents.filter((c) => c.isSystemContent);
  const userDocs = filteredContents.filter((c) => !c.isSystemContent);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Film className="w-8 h-8 text-red-600" />
            مستندهای آموزشی
          </h1>
          <p className="text-gray-600 mt-1">
            با مستندهای الهام‌بخش، دیدگاه خود را گسترش دهید
          </p>
        </div>
        <button
          onClick={() => {/* TODO: Open add modal */}}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          <Plus className="w-5 h-5" />
          <span>افزودن مستند</span>
        </button>
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-4 rounded-lg">
          <p className="text-sm opacity-90">کل مستندها</p>
          <p className="text-3xl font-bold mt-1">{contents.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg">
          <p className="text-sm opacity-90">در حال تماشا</p>
          <p className="text-3xl font-bold mt-1">
            {contents.filter((c) => c.progress[0]?.status === 'in_progress').length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg">
          <p className="text-sm opacity-90">تکمیل شده</p>
          <p className="text-3xl font-bold mt-1">
            {contents.filter((c) => c.progress[0]?.status === 'completed').length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-4 rounded-lg">
          <p className="text-sm opacity-90">مستندهای سیستم</p>
          <p className="text-3xl font-bold mt-1">{systemDocs.length}</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری مستندها...</p>
        </div>
      ) : (
        <>
          {userDocs.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">مستندهای من</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {userDocs.map((content) => (
                  <ContentCard key={content.id} {...content} category={content.category as any} />
                ))}
              </div>
            </div>
          )}

          {systemDocs.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">
                {userDocs.length > 0 ? 'پیشنهادات سیستم' : 'مستندهای پیشنهادی'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {systemDocs.map((content) => (
                  <ContentCard key={content.id} {...content} category={content.category as any} />
                ))}
              </div>
            </div>
          )}

          {filteredContents.length === 0 && (
            <div className="text-center py-12">
              <Film className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                {search ? 'مستندی با این مشخصات یافت نشد' : 'هنوز مستندی اضافه نشده است'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
