import React, { useState, useEffect } from 'react';
import { Sparkles, Search, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { tools, latestTools, isNewTool } from '../data/tools';
import { ToolIcon } from '../components/icons/ToolIcon';
import { getRecentTools, addRecentTool } from '../lib/utils';
import { Tool } from '../types';
import { CategoryGrid } from '../components/tools/CategoryGrid';

export function Home() {
  const navigate = useNavigate();
  const [recentTools, setRecentTools] = useState<Tool[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Tool[]>([]);

  useEffect(() => {
    setRecentTools(getRecentTools());
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
    } else {
      const filtered = tools.filter(tool => 
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setSearchResults(filtered);
    }
  }, [searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Minimalist Hero Section */}
      <div className="py-12 md:py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-6 tracking-tight">Ne hesaplamak istersiniz?</h1>
        <div className="max-w-lg mx-auto relative">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Araçlarda arayın (örn. vki, kdv...)" 
            className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 dark:text-white"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          
          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-20 overflow-hidden">
              {searchResults.slice(0, 5).map(tool => (
                <Link
                  key={tool.id}
                  to={tool.path}
                  onClick={() => { addRecentTool(tool.id); setSearchQuery(''); }}
                  className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-[#0056b3] dark:text-blue-400 flex items-center justify-center shrink-0">
                      <ToolIcon name={tool.icon} size={16} />
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-200">{tool.title}</span>
                    {isNewTool(tool.id) && (
                      <span className="bg-[#e60000] text-white text-[9px] px-1.5 py-0.5 rounded italic font-bold ml-auto">yeni</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <CategoryGrid />

      <div className="mb-8">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
          <Sparkles size={20} className="text-[#0056b3] dark:text-blue-400" /> Yeni Eklenen Araçlar
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {latestTools.map(tool => (
            <Link 
              key={tool.id}
              to={tool.path}
              onClick={() => addRecentTool(tool.id)}
              className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 p-4 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-100 dark:hover:border-slate-700 transition-all cursor-pointer group flex flex-col justify-center gap-3 min-h-[100px]"
            >
              <div className="flex items-center gap-3">
                <div className="shrink-0 w-10 h-10 bg-blue-50 dark:bg-blue-900/30 text-[#0056b3] dark:text-blue-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <ToolIcon name={tool.icon} size={18} strokeWidth={2} />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#0056b3] dark:group-hover:text-blue-400 transition-colors text-xs leading-tight text-left">
                  {tool.title}
                  {isNewTool(tool.id) && (
                    <span className="bg-[#e60000] text-white text-[9px] px-1.5 py-0.5 rounded italic font-bold ml-1.5 inline-block">yeni</span>
                  )}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/90 text-white p-6 rounded-3xl overflow-hidden relative">
          <div className="relative z-10">
            <span className="bg-blue-500 text-[10px] font-bold px-2 py-1 rounded uppercase mb-4 inline-block">Yeni Mimari</span>
            <h2 className="text-xl font-bold mb-2">Modüler Eklenti Altyapısı</h2>
            <p className="text-slate-300 text-xs leading-relaxed max-w-[280px]">
              250'den fazla araç için hazırlanan Client-Side (WASM) tabanlı yüksek performanslı çekirdek sistem devrede.
            </p>
            <button className="mt-4 bg-white text-slate-900 text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors">
              Dökümantasyonu İncele
            </button>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10 text-[140px] font-black italic">WASM</div>
        </div>

        <div className="bg-white/60 backdrop-blur-lg border border-white/60 p-6 rounded-3xl flex flex-col">
          <h3 className="font-bold text-sm text-slate-800 mb-4 flex items-center gap-2">
            <Zap size={18} className="text-amber-500 fill-amber-500" /> Son Kullanılan Araçlar
          </h3>
          <div className="space-y-3 flex-1">
            {recentTools.map(tool => (
              <Link 
                key={tool.id}
                to={tool.path}
                onClick={() => addRecentTool(tool.id)}
                className="flex items-center justify-between p-2 hover:bg-white/40 rounded-xl transition-all cursor-pointer border border-transparent hover:border-black/5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm">
                    <ToolIcon name={tool.icon} size={16} />
                  </div>
                  <span className="text-xs font-medium">{tool.title}</span>
                </div>
              </Link>
            ))}
            {recentTools.length === 0 && <p className="text-xs text-slate-400">Henüz bir araç kullanmadınız.</p>}
          </div>
        </div>
      </div>
      <div className="mt-12 flex justify-center">
        <Link to="/tum-araclar" className="px-8 py-4 bg-[#0056b3] hover:bg-[#004494] text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-95">
            Tüm Araçları Gör
        </Link>
      </div>
    </div>
  );
}
