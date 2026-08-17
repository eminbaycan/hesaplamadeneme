import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { categories } from '../data/categories';
import { tools } from '../data/tools';
import { ChevronRight } from 'lucide-react';
import { AdSlot } from '../components/ads/AdSlot';
import { ToolGrid } from '../components/tools/ToolGrid';

export function CategoryView() {
  const { id } = useParams<{ id: string }>();
  
  const category = categories.find(c => c.id === id);
  
  if (!category) {
    return <Navigate to="/" replace />;
  }

  const categoryTools = tools.filter(t => t.categoryId === id);

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Ana Sayfa</Link>
        <ChevronRight size={14} />
        <span className="text-slate-800 dark:text-slate-300">{category.title}</span>
      </div>

      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0056b3] dark:text-blue-400 mb-2">{category.title} Araçları</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl">
            {category.title} kategorisine ait tüm hesaplama ve analiz araçları bu sayfada listelenmektedir.
          </p>
        </div>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      {categoryTools.length > 0 ? (
        <ToolGrid tools={categoryTools} variant="compact" />
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 p-12 rounded-3xl text-center">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-500">
            {/* Boş icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>
          </div>
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-1">Henüz araç eklenmedi</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Bu kategori için hesaplama araçları çok yakında aktif olacak.</p>
        </div>
      )}

      {categoryTools.length > 5 && (
        <div className="mt-8">
          <AdSlot format="horizontal" />
        </div>
      )}
    </div>
  );
}
