'use client';

import { useState, useEffect } from 'react';
import { Plus, BookOpen } from 'lucide-react';
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

export default function BooksPage() {
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
        category: 'book',
        ...(status !== 'all' && { status }),
        ...(difficulty !== 'all' && { difficulty }),
      });

      const res = await fetch(`/api/skill/content?${params}`);
      const data = await res.json();
      setContents(data.contents || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter by search
  const filteredContents = contents.filter((content) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      content.title.toLowerCase().includes(searchLower) ||
      content.author?.toLowerCase().includes(searchLower)
    );
  });

  // Separate system and user content
  const systemBooks = filteredContents.filter((c) => c.isSystemContent);
  const userBooks = filteredContents.filter((c) => !c.isSystemContent);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-green-600" />
            کتابخانه توسعه فردی
          </h1>
          <p className="text-gray-600 mt-1">
            مسیر رشد و یادگیری خود را با کتاب‌های ارزشمند دنبال کنید
          </p>
        </div>
        <button
          onClick={() => {/* TODO: Open add modal */}}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <Plus className="w-5 h-5" />
          <span>افزودن کتاب</span>
        </button>
      </div>

      {/* Filters */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg">
          <p className="text-sm opacity-90">کل کتاب‌ها</p>
          <p className="text-3xl font-bold mt-1">{contents.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg">
          <p className="text-sm opacity-90">در حال خواندن</p>
          <p className="text-3xl font-bold mt-1">
            {contents.filter((c) => c.progress[0]?.status === 'in_progress').length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-lg">
          <p className="text-sm opacity-90">تکمیل شده</p>
          <p className="text-3xl font-bold mt-1">
            {contents.filter((c) => c.progress[0]?.status === 'completed').length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-4 rounded-lg">
          <p className="text-sm opacity-90">کتاب‌های سیستم</p>
          <p className="text-3xl font-bold mt-1">{systemBooks.length}</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری کتاب‌ها...</p>
        </div>
      ) : (
        <>
          {/* User Books */}
          {userBooks.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">کتاب‌های من</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {userBooks.map((content) => (
                  <ContentCard
                    key={content.id}
                    id={content.id}
                    category={content.category as any}
                    title={content.title}
                    author={content.author}
                    coverImage={content.coverImage || undefined}
                    tags={content.tags}
                    difficulty={content.difficulty}
                    isPinned={content.isPinned}
                    rating={content.rating || undefined}
                    audioSummaryUrl={content.audioSummaryUrl || undefined}
                    videoClipUrl={content.videoClipUrl || undefined}
                    progress={content.progress[0]}
                    totalSections={content._count.sections}
                  />
                ))}
              </div>
            </div>
          )}

          {/* System Books */}
          {systemBooks.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">
                {userBooks.length > 0 ? 'پیشنهادات سیستم' : 'کتاب‌های پیشنهادی'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {systemBooks.map((content) => (
                  <ContentCard
                    key={content.id}
                    id={content.id}
                    category={content.category as any}
                    title={content.title}
                    author={content.author}
                    coverImage={content.coverImage || undefined}
                    tags={content.tags}
                    difficulty={content.difficulty}
                    isPinned={content.isPinned}
                    rating={content.rating || undefined}
                    audioSummaryUrl={content.audioSummaryUrl || undefined}
                    videoClipUrl={content.videoClipUrl || undefined}
                    progress={content.progress[0]}
                    totalSections={content._count.sections}
                  />
                ))}
              </div>
            </div>
          )}

          {filteredContents.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                {search ? 'کتابی با این مشخصات یافت نشد' : 'هنوز کتابی اضافه نشده است'}
              </p>
              <p className="text-gray-500 mt-2">
                کتاب اول خود را اضافه کنید و سفر یادگیری را شروع کنید!
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
