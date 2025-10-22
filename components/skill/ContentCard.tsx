'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { BookOpen, Headphones, Film, Play, Volume2, Star, Pin } from 'lucide-react';
import Link from 'next/link';

interface ContentCardProps {
  id: string;
  category: 'book' | 'podcast' | 'documentary';
  title: string;
  author?: string;
  coverImage?: string;
  tags?: string;
  difficulty: string;
  isPinned?: boolean;
  rating?: number;
  audioSummaryUrl?: string;
  videoClipUrl?: string;
  progress?: {
    status: string;
    progressPercentage: number;
    currentSection: number;
  };
  totalSections?: number;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'book':
      return <BookOpen className="w-5 h-5" />;
    case 'podcast':
      return <Headphones className="w-5 h-5" />;
    case 'documentary':
      return <Film className="w-5 h-5" />;
    default:
      return <BookOpen className="w-5 h-5" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'book':
      return 'bg-blue-100 text-blue-700';
    case 'podcast':
      return 'bg-purple-100 text-purple-700';
    case 'documentary':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-700';
    case 'in_progress':
      return 'bg-blue-100 text-blue-700';
    case 'paused':
      return 'bg-yellow-100 text-yellow-700';
    case 'not_started':
      return 'bg-gray-100 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getDifficultyLabel = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
      return 'مبتدی';
    case 'intermediate':
      return 'متوسط';
    case 'advanced':
      return 'پیشرفته';
    default:
      return difficulty;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'completed':
      return 'تکمیل شده';
    case 'in_progress':
      return 'در حال مطالعه';
    case 'paused':
      return 'متوقف شده';
    case 'not_started':
      return 'شروع نشده';
    default:
      return status;
  }
};

export default function ContentCard({
  id,
  category,
  title,
  author,
  coverImage,
  tags,
  difficulty,
  isPinned,
  rating,
  audioSummaryUrl,
  videoClipUrl,
  progress,
  totalSections,
}: ContentCardProps) {
  const parsedTags = tags ? JSON.parse(tags) : [];
  const progressPercentage = progress?.progressPercentage || 0;
  const status = progress?.status || 'not_started';

  return (
    <Link href={`/dashboard/skill/${category}s/${id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardContent className="p-4">
          {/* Cover Image */}
          <div className="relative mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 aspect-[2/3]">
            {coverImage ? (
              <img
                src={coverImage}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className={`p-6 rounded-full ${getCategoryColor(category)}`}>
                  {getCategoryIcon(category)}
                </div>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-2 right-2 flex flex-col gap-2">
              {isPinned && (
                <div className="bg-yellow-500 text-white p-1.5 rounded-full shadow-lg">
                  <Pin className="w-4 h-4" />
                </div>
              )}
              {status === 'not_started' && (
                <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                  جدید
                </div>
              )}
            </div>

            {/* Media Icons */}
            {(audioSummaryUrl || videoClipUrl) && (
              <div className="absolute bottom-2 left-2 flex gap-2">
                {audioSummaryUrl && (
                  <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
                    <Volume2 className="w-4 h-4 text-purple-600" />
                  </div>
                )}
                {videoClipUrl && (
                  <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
                    <Play className="w-4 h-4 text-red-600" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Content Info */}
          <div className="space-y-3">
            {/* Title & Author */}
            <div>
              <h3 className="font-semibold text-lg line-clamp-2 mb-1">{title}</h3>
              {author && (
                <p className="text-sm text-gray-600 line-clamp-1">{author}</p>
              )}
            </div>

            {/* Tags */}
            {parsedTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {parsedTags.slice(0, 3).map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {parsedTags.length > 3 && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                    +{parsedTags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Difficulty & Rating */}
            <div className="flex items-center justify-between text-xs">
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                {getDifficultyLabel(difficulty)}
              </span>
              {rating && (
                <div className="flex items-center gap-1 text-yellow-600">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-semibold">{rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            {/* Progress */}
            {progress && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className={`px-2 py-1 text-xs rounded ${getStatusColor(status)}`}>
                    {getStatusLabel(status)}
                  </span>
                  <span className="font-semibold text-gray-700">
                    {progressPercentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                {totalSections && (
                  <p className="text-xs text-gray-500 text-center">
                    {progress.currentSection} / {totalSections} {category === 'book' ? 'فصل' : 'بخش'}
                  </p>
                )}
              </div>
            )}

            {/* Action Button */}
            {!progress && (
              <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-sm font-semibold">
                شروع
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
