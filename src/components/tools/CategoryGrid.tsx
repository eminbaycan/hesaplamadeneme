import React from 'react';
import { Percent, Coins, Scale, GraduationCap, Stethoscope, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  { id: 'matematik', name: 'Matematik', icon: Percent, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'finans', name: 'Finans', icon: Coins, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'saglik', name: 'Sağlık', icon: Stethoscope, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'egitim', name: 'Eğitim', icon: GraduationCap, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'kredi', name: 'Kredi', icon: Briefcase, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { id: 'sinav', name: 'Sınav', icon: Scale, color: 'text-rose-500', bg: 'bg-rose-50' },
];

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          to={`/kategori/${cat.id}`}
          className="flex flex-col items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-500/30 hover:shadow-md transition-all group"
        >
          <div className={`w-12 h-12 rounded-xl ${cat.bg} flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform`}>
            <cat.icon size={24} />
          </div>
          <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">{cat.name}</span>
        </Link>
      ))}
    </div>
  );
}
