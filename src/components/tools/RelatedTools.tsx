import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { tools } from '../../data/tools';
import { ToolIcon } from '../icons/ToolIcon';
import { ArrowRight, Grid } from 'lucide-react';

interface RelatedToolsProps {
  category: string;
  currentToolId: string;
}

export function RelatedTools({ category, currentToolId }: RelatedToolsProps) {
  const relatedTools = useMemo(() => {
    // Tüm araçlar havuzundan (kendisi hariç) filtrele
    const filtered = tools.filter(
      (tool) => tool.id !== currentToolId
    );
    // Rastgele sırala
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    // İlk 3'ünü al
    return shuffled.slice(0, 3);
  }, [currentToolId]);

  if (relatedTools.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Grid className="text-[#0056b3] dark:text-blue-400" size={24} />
          İlginizi Çekebilecek Diğer Araçlar
        </h3>
        <Link 
          to="/tum-araclar"
          className="hidden sm:flex text-sm font-semibold text-[#0056b3] dark:text-blue-400 hover:text-[#004494] dark:hover:text-blue-300 items-center gap-1 transition-colors"
        >
          Tümünü Gör <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {relatedTools.map((tool) => (
          <Link 
            key={tool.id}
            to={tool.path}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-[#0056b3]/30 dark:hover:border-blue-500/30 hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-[#0056b3] dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ToolIcon name={tool.icon} size={24} />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-[#0056b3] dark:group-hover:text-blue-400 transition-colors">
              {tool.title}
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
      
      <Link 
        to="/tum-araclar"
        className="mt-6 sm:hidden w-full py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 flex justify-center items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        Tümünü Gör <ArrowRight size={16} />
      </Link>
    </div>
  );
}
