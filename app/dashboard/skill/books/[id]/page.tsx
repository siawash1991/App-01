'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowRight, Clock, BarChart, Star, Play, Volume2, BookOpen, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface ContentDetail {
  content: {
    id: string;
    title: string;
    author?: string;
    description?: string;
    coverImage?: string;
    tags?: string;
    difficulty: string;
    estimatedDuration?: number;
    rating?: number;
    audioSummaryUrl?: string;
    videoClipUrl?: string;
    youtubeEmbedId?: string;
    sections: Array<{
      id: string;
      sectionNumber: number;
      title: string;
      content?: string;
      duration?: number;
      completions: Array<{
        completed: boolean;
      }>;
    }>;
    _count: {
      sections: number;
    };
  };
  userProgress: {
    id: string;
    status: string;
    progressPercentage: number;
    currentSection: number;
    totalTimeSpent: number;
    notes?: string;
  } | null;
}

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<ContentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchContentDetail();
    }
  }, [params.id]);

  const fetchContentDetail = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/skill/content/${params.id}`);
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartReading = async () => {
    try {
      if (!data?.userProgress) {
        // Create progress
        await fetch('/api/skill/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contentId: params.id }),
        });
        fetchContentDetail();
      }
    } catch (error) {
      console.error('Error starting reading:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">محتوا یافت نشد</p>
      </div>
    );
  }

  const { content, userProgress } = data;
  const parsedTags = content.tags ? JSON.parse(content.tags) : [];
  const progressPercentage = userProgress?.progressPercentage || 0;
  const completedSections = content.sections.filter((s) => s.completions[0]?.completed).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowRight className="w-5 h-5" />
        <span>بازگشت</span>
      </button>

      {/* Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Cover Image */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <div className="rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 aspect-[2/3]">
              {content.coverImage ? (
                <img
                  src={content.coverImage}
                  alt={content.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="w-24 h-24 text-gray-400" />
                </div>
              )}
            </div>

            {/* Media Buttons */}
            {(content.audioSummaryUrl || content.videoClipUrl) && (
              <div className="mt-4 space-y-2">
                {content.audioSummaryUrl && (
                  <button className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition">
                    <Volume2 className="w-5 h-5" />
                    <span>پخش خلاصه صوتی</span>
                  </button>
                )}
                {content.videoClipUrl && (
                  <button className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition">
                    <Play className="w-5 h-5" />
                    <span>تماشای کلیپ</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Author */}
          <div>
            <h1 className="text-4xl font-bold mb-2">{content.title}</h1>
            {content.author && (
              <p className="text-xl text-gray-600">نویسنده: {content.author}</p>
            )}
          </div>

          {/* Tags */}
          {parsedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {parsedTags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Meta Info */}
          <div className="grid grid-cols-3 gap-4">
            {content.estimatedDuration && (
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-5 h-5" />
                <div>
                  <p className="text-xs text-gray-500">مدت زمان تخمینی</p>
                  <p className="font-semibold">{content.estimatedDuration} دقیقه</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-600">
              <BarChart className="w-5 h-5" />
              <div>
                <p className="text-xs text-gray-500">سطح</p>
                <p className="font-semibold">
                  {content.difficulty === 'beginner' ? 'مبتدی' : content.difficulty === 'intermediate' ? 'متوسط' : 'پیشرفته'}
                </p>
              </div>
            </div>
            {content.rating && (
              <div className="flex items-center gap-2 text-yellow-600">
                <Star className="w-5 h-5 fill-current" />
                <div>
                  <p className="text-xs text-gray-500">امتیاز</p>
                  <p className="font-semibold">{content.rating.toFixed(1)} / 5</p>
                </div>
              </div>
            )}
          </div>

          {/* Progress Section */}
          {userProgress ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">پیشرفت شما</h3>
                  <span className="text-2xl font-bold text-green-600">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">فصل فعلی</p>
                    <p className="font-semibold">{userProgress.currentSection} / {content._count.sections}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">زمان سپری شده</p>
                    <p className="font-semibold">{userProgress.totalTimeSpent} دقیقه</p>
                  </div>
                  <div>
                    <p className="text-gray-500">فصل‌های تکمیل شده</p>
                    <p className="font-semibold">{completedSections} / {content._count.sections}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">وضعیت</p>
                    <p className="font-semibold">
                      {userProgress.status === 'in_progress' ? 'در حال خواندن' :
                       userProgress.status === 'completed' ? 'تکمیل شده' :
                       userProgress.status === 'paused' ? 'متوقف شده' : 'شروع نشده'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <button
              onClick={handleStartReading}
              className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition text-lg font-semibold"
            >
              شروع خواندن
            </button>
          )}

          {/* Description */}
          {content.description && (
            <Card>
              <CardHeader>
                <CardTitle>درباره کتاب</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                  {content.description}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Sections */}
      {content.sections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>فصل‌ها ({content.sections.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {content.sections.map((section) => (
                <div
                  key={section.id}
                  className={`p-4 border rounded-lg cursor-pointer transition ${
                    activeSection === section.id
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {section.completions[0]?.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                      )}
                      <div>
                        <p className="font-semibold">
                          فصل {section.sectionNumber}: {section.title}
                        </p>
                        {section.duration && (
                          <p className="text-sm text-gray-500">{section.duration} دقیقه</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {activeSection === section.id && section.content && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                        {section.content}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
