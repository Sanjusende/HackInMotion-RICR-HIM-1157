import React from 'react';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div
      className={`animate-spin rounded-full border-t-primary border-r-transparent border-b-primary border-l-transparent ${sizeClasses[size]} ${className}`}
      style={{ borderColor: 'var(--color-primary) transparent var(--color-primary) transparent' }}
    />
  );
};

export const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-bg-custom z-50 flex flex-col items-center justify-center space-y-4">
      <Spinner size="lg" />
      <p className="text-secondary-text font-semibold animate-pulse">Loading KrishiMitra...</p>
    </div>
  );
};

export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-shimmer rounded bg-gray-200 ${className}`}
      {...props}
    />
  );
};

export const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-card border border-border-custom p-6 space-y-4 shadow-small">
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="pt-4 flex justify-between items-center">
        <Skeleton className="h-10 w-24 rounded-btn" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  );
};

export const SkeletonInput = () => {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-12 w-full rounded-input" />
    </div>
  );
};

export const SkeletonList = ({ items = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 border border-border-custom rounded-card bg-white">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};
