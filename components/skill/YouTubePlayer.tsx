'use client';

import { useState } from 'react';
import { Play, X } from 'lucide-react';

interface YouTubePlayerProps {
  videoId: string;
  title?: string;
  thumbnail?: string;
  autoplay?: boolean;
}

export default function YouTubePlayer({
  videoId,
  title,
  thumbnail,
  autoplay = false,
}: YouTubePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [showModal, setShowModal] = useState(false);

  const thumbnailUrl = thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  const handlePlayInline = () => {
    setIsPlaying(true);
  };

  const handlePlayModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      {/* Inline Player */}
      <div className="relative w-full bg-black rounded-lg overflow-hidden aspect-video">
        {!isPlaying ? (
          // Thumbnail with Play Button
          <div className="relative w-full h-full group cursor-pointer" onClick={handlePlayInline}>
            <img
              src={thumbnailUrl}
              alt={title || 'YouTube Video'}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to default thumbnail
                e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              }}
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition flex items-center justify-center">
              <div className="bg-red-600 hover:bg-red-700 p-4 rounded-full transition-all group-hover:scale-110 shadow-2xl">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
            </div>
            {title && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-white font-semibold line-clamp-2">{title}</p>
              </div>
            )}
          </div>
        ) : (
          // YouTube Embed
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={title || 'YouTube video player'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}

        {/* Fullscreen Button */}
        {!isPlaying && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePlayModal();
            }}
            className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition backdrop-blur-sm"
          >
            تمام صفحه
          </button>
        )}
      </div>

      {/* Modal Player */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <div className="relative w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute -top-12 right-0 text-white hover:text-red-500 transition"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Video */}
            <div className="relative w-full bg-black rounded-lg overflow-hidden aspect-video shadow-2xl">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={title || 'YouTube video player'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Title */}
            {title && (
              <div className="mt-4 text-white text-center">
                <p className="text-lg font-semibold">{title}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
