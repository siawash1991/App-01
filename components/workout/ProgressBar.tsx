'use client';

interface ProgressBarProps {
  current: number;
  target: number;
  color?: 'blue' | 'green' | 'purple' | 'orange';
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function ProgressBar({
  current,
  target,
  color = 'blue',
  showPercentage = true,
  size = 'md',
}: ProgressBarProps) {
  const progress = Math.min((current / target) * 100, 100);

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
    orange: 'bg-orange-600',
  };

  return (
    <div className="space-y-1">
      {showPercentage && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            {current} / {target}
          </span>
          <span className="font-medium">{progress.toFixed(0)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}>
        <div
          className={`${sizeClasses[size]} rounded-full transition-all duration-300 ${colorClasses[color]}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
