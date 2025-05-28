
import React from 'react';
import ModernCard from '@/components/modern/ModernCard';
import SkeletonLoader from '@/components/modern/SkeletonLoader';

const NotasLoadingState: React.FC = () => {
  return (
    <ModernCard className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <SkeletonLoader variant="text" className="h-6 w-48" />
          <SkeletonLoader variant="button" />
        </div>
        
        <div className="space-y-3">
          <SkeletonLoader variant="text" className="h-10 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SkeletonLoader variant="button" />
            <SkeletonLoader variant="button" />
            <SkeletonLoader variant="button" />
          </div>
        </div>
        
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 rounded-lg border border-border/50">
              <SkeletonLoader variant="text" />
              <SkeletonLoader variant="text" />
              <SkeletonLoader variant="text" />
              <SkeletonLoader variant="text" />
              <SkeletonLoader variant="text" />
              <div className="flex space-x-2">
                <SkeletonLoader variant="button" className="w-16 h-8" />
                <SkeletonLoader variant="button" className="w-16 h-8" />
                <SkeletonLoader variant="button" className="w-16 h-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModernCard>
  );
};

export default NotasLoadingState;
