import React from 'react';
import { tools } from '../data/tools';
import { ToolGrid } from '../components/tools/ToolGrid';

export function AllTools() {
  const categories = Array.from(new Set(tools.map(t => t.categoryId)));

  return (
    <div className="max-w-7xl mx-auto pb-12 px-4">
      <div className="mb-12">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Tüm Araçlar</h1>
        <p className="text-slate-600 dark:text-slate-400">İhtiyacınız olan tüm hesaplama araçlarına kategorilerine göre göz atın.</p>
      </div>

      {categories.map(categoryId => (
        <section key={categoryId} className="mb-12 border-b border-slate-200 dark:border-slate-800 pb-12 last:border-0 last:pb-0">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 capitalize">{categoryId} Araçları</h2>
          <ToolGrid tools={tools.filter(t => t.categoryId === categoryId)} variant="compact" />
        </section>
      ))}
    </div>
  );
}
