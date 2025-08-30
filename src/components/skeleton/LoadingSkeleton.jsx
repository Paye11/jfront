import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="p-6 space-y-4 max-w-md w-full mx-auto">
      {/* Avatar Circle */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
        </div>
      </div>

      {/* Content Blocks */}
      <div className="space-y-3">
        <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded animate-pulse w-5/6"></div>
      </div>

      {/* Large Block */}
      <div className="h-32 bg-gray-300 rounded animate-pulse"></div>
    </div>
  );
};

export default LoadingSkeleton;
