import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search, Calculator, Sparkles, ArrowRight, TrendingUp, DollarSign, Heart, Clock, BookOpen } from 'lucide-react';
import { tools } from '../data/tools';
import { cn } from '../lib/utils';

export function NotFound() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Rastgele 8 popüler / önerilen araç
  const popularTools = useMemo(() => {
    const shuffled = [...tools].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 8);
  }, []);

  // Arama sonuçları
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return tools.filter(t => 
      t.title.toLowerCase().includes(q) || 
      t.description.toLowerCase().includes(q) ||
      t.keywords?.some(k => k.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [query]);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-12 max-w-4xl mx-auto">
      {/* 404 Başlık ve İllüstrasyon */}
      <div className="relative text-center mb-8">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-500/10 dark:bg-blue-400/10 rounded-full blur-2xl -z-10 pointer-events-none"></div>
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-950/40 text-[#0056b3] dark:text-blue-400 mb-4 shadow-sm border border-blue-100 dark:border-blue-900/50">
          <Calculator size={36} strokeWidth={2.2} />
        </div>
        <div className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          404
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-3">
          Aradığınız Sayfa veya Hesaplama Aracı Bulunamadı
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
          Ulaşmaya çalıştığınız adres değişmiş, kaldırılmış veya yanlış yazılmış olabilir. Aşağıdaki akıllı arama çubuğunu kullanarak yüzlerce hesaplama aracı arasından anında aradığınızı bulabilirsiniz.
        </p>
      </div>

      {/* İnteraktif Arama Çubuğu */}
      <div className="w-full max-w-xl mb-10 relative">
        <div className="relative flex items-center shadow-lg shadow-black/5 dark:shadow-white/5 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 focus-within:border-[#0056b3] dark:focus-within:border-blue-500 transition-all bg-white dark:bg-slate-900">
          <div className="pl-4 text-slate-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Örn: Maaş, Zekat, Kredi, KDV, YKS Puanı..."
            className="w-full py-4 px-3 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm md:text-base focus:outline-none font-medium"
            autoFocus
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="pr-4 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              Temizle
            </button>
          )}
        </div>

        {/* Canlı Arama Sonuçları */}
        {query.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden z-50 max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {searchResults.length > 0 ? (
              searchResults.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => navigate(tool.path)}
                  className="w-full text-left px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-[#0056b3] dark:group-hover:text-blue-400 transition-colors">
                      {tool.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {tool.description}
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-slate-400 group-hover:text-[#0056b3] dark:group-hover:text-blue-400 shrink-0 transform group-hover:translate-x-1 transition-all" />
                </button>
              ))
            ) : (
              <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                Aradığınız kritere uygun hesaplama aracı bulunamadı. Lütfen farklı anahtar kelimeler deneyin.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Popüler Araçlar / Öneriler */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          <Sparkles size={14} className="text-amber-500" />
          <span>Sık Kullanılan Popüler Araçlar</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {popularTools.map((tool) => (
            <Link
              key={tool.id}
              to={tool.path}
              className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 hover:border-[#0056b3]/40 dark:hover:border-blue-500/40 rounded-xl p-3 text-left transition-all shadow-sm hover:shadow group flex flex-col justify-between"
            >
              <span className="font-bold text-slate-800 dark:text-slate-200 text-xs line-clamp-2 group-hover:text-[#0056b3] dark:group-hover:text-blue-400 transition-colors">
                {tool.title}
              </span>
              <span className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                Git <ArrowRight size={10} />
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Ana Eylem Butonları */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md justify-center">
        <Link 
          to="/" 
          className="bg-[#0056b3] hover:bg-[#004494] text-white font-bold rounded-xl px-6 py-3.5 flex items-center justify-center gap-2 transition-all shadow-md w-full sm:w-auto"
        >
          <Home size={18} />
          Ana Sayfaya Dön
        </Link>
        <button 
          onClick={() => window.history.back()}
          className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-black/10 dark:border-white/10 font-bold rounded-xl px-6 py-3.5 flex items-center justify-center gap-2 transition-all w-full sm:w-auto shadow-sm"
        >
          Önceki Sayfaya Dön
        </button>
      </div>
    </div>
  );
}
