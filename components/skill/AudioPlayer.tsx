'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  title?: string;
  onClose?: () => void;
}

export default function AudioPlayer({ audioUrl, title, onClose }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = parseFloat(e.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const skipTime = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
  };

  const changePlaybackRate = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];

    audio.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Title */}
      {title && (
        <div className="mb-4">
          <h3 className="font-semibold text-lg truncate">{title}</h3>
          <p className="text-sm text-purple-100">خلاصه صوتی</p>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-purple-300 rounded-lg appearance-none cursor-pointer accent-white"
        />
        <div className="flex justify-between text-sm mt-2 text-purple-100">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        {/* Skip Backward */}
        <button
          onClick={() => skipTime(-10)}
          className="p-2 hover:bg-purple-400/30 rounded-full transition"
          title="10 ثانیه قبل"
        >
          <SkipBack className="w-5 h-5" />
        </button>

        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          className="p-4 bg-white text-purple-600 rounded-full hover:bg-purple-50 transition shadow-lg"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" fill="currentColor" />
          ) : (
            <Play className="w-6 h-6" fill="currentColor" />
          )}
        </button>

        {/* Skip Forward */}
        <button
          onClick={() => skipTime(10)}
          className="p-2 hover:bg-purple-400/30 rounded-full transition"
          title="10 ثانیه بعد"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-between gap-4">
        {/* Volume */}
        <div className="flex items-center gap-2 flex-1">
          <button
            onClick={toggleMute}
            className="p-2 hover:bg-purple-400/30 rounded-full transition"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="flex-1 h-1 bg-purple-300 rounded-lg appearance-none cursor-pointer accent-white"
          />
        </div>

        {/* Playback Speed */}
        <button
          onClick={changePlaybackRate}
          className="px-3 py-1 bg-purple-400/30 hover:bg-purple-400/50 rounded-full text-sm font-semibold transition"
          title="سرعت پخش"
        >
          {playbackRate}x
        </button>

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="px-3 py-1 bg-purple-400/30 hover:bg-purple-400/50 rounded-full text-sm font-semibold transition"
          >
            بستن
          </button>
        )}
      </div>
    </div>
  );
}
