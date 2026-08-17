import React from 'react';
import { Link } from 'react-router-dom';
import { Tool } from '../../types';
import { ToolIcon } from '../icons/ToolIcon';
import { isNewTool } from '../../data/tools';

interface ToolGridProps {
  tools: Tool[];
  variant?: 'compact' | 'detailed';
}

export function ToolGrid({ tools, variant = 'compact' }: ToolGridProps) {
  if (variant === 'compact') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
        {tools.map(tool => (
          <Link 
            key={tool.id}
            to={tool.path}
            className="relative bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 p-4 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-100 dark:hover:border-slate-700 transition-all cursor-pointer group flex flex-row items-center gap-3 h-full"
          >
            {isNewTool(tool.id) && (
              <span className="absolute -top-2 -right-2 bg-[#e60000] text-white text-[9px] px-1.5 py-0.5 rounded italic font-bold z-10">yeni</span>
            )}
            <div className="shrink-0 w-10 h-10 bg-blue-50 dark:bg-blue-900/30 text-[#0056b3] dark:text-blue-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <ToolIcon name={tool.icon} size={18} strokeWidth={2} />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#0056b3] dark:group-hover:text-blue-400 transition-colors text-sm leading-tight text-left">
              {tool.title}
            </h3>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map(tool => (
        <Link
          key={tool.id}
          to={tool.path}
          className="relative bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 p-6 rounded-3xl shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-slate-700 transition-all group"
        >
          {isNewTool(tool.id) && (
            <span className="absolute -top-2 -right-2 bg-[#e60000] text-white text-[10px] px-2 py-0.5 rounded italic font-bold z-10">yeni</span>
          )}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-[#0056b3] dark:text-blue-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <ToolIcon name={tool.icon} size={24} />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#0056b3] dark:group-hover:text-blue-400 transition-colors">
              {tool.title}
            </h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{tool.description}</p>
        </Link>
      ))}
    </div>
  );
}
