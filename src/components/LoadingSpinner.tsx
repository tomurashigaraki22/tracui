import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-16 h-16">
        {/* Outer ring */}
        <div className="absolute w-full h-full border-4 border-[#00FFD1]/20 rounded-full"></div>
        {/* Spinning ring */}
        <div className="absolute w-full h-full border-4 border-[#00FFD1] rounded-full animate-spin border-t-transparent"></div>
      </div>
      <p className="text-[#00FFD1] font-semibold animate-pulse">Connecting to Sui Network...</p>
    </div>
  );
};

export default LoadingSpinner; 