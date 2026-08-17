import React from 'react';

interface AdSlotProps {
  className?: string;
  format?: 'horizontal' | 'vertical' | 'square';
}

export function AdSlot({ className = '', format = 'horizontal' }: AdSlotProps) {
  let formatClasses = 'w-full h-[90px]'; // default horizontal leaderboard (728x90)
  
  if (format === 'vertical') {
    formatClasses = 'w-[300px] h-[600px] mx-auto'; // half page / skyscraper
  } else if (format === 'square') {
    formatClasses = 'w-[250px] h-[250px] mx-auto'; // square
  }

  return (
    <div className={`bg-slate-100 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center rounded-xl overflow-hidden ${formatClasses} ${className}`}>
      <span className="text-slate-400 dark:text-slate-500 font-bold text-sm tracking-widest uppercase">
        Google Ads
      </span>
      <span className="text-slate-300 dark:text-slate-600 text-xs mt-1">
        Reklam Alanı
      </span>
    </div>
  );
}
