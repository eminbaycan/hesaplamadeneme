import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Moon, Sun, MoreHorizontal, Activity } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { categories } from '../../data/categories';
import { tools, isNewTool } from '../../data/tools';
import { cn } from '../../lib/utils';
import { ToolIcon } from '../icons/ToolIcon';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<any[] | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setAiSuggestions(null);
      setIsAiLoading(false);
      return;
    }

    setIsAiLoading(true);
    const timer = setTimeout(() => {
      const query = searchQuery.toLowerCase();
      const results = tools.filter(t => 
        t.title.toLowerCase().includes(query) || 
        t.keywords.some(k => k.toLowerCase().includes(query))
      ).slice(0, 5);
      
      setAiSuggestions(results);
      setIsAiLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      // Ekran küçülürken kategorileri tek tek Diğer'in içine aktar
      // En son 5 tane sığabilecek duruma geldiğinde hepsini Diğer'e at
      if (width > 1650) setVisibleCount(11);
      else if (width > 1550) setVisibleCount(9);
      else if (width > 1400) setVisibleCount(8);
      else if (width > 1300) setVisibleCount(7);
      else if (width > 1200) setVisibleCount(6);
      else setVisibleCount(0); // 5 veya daha az kaldığında doğrudan hepsini Diğer klasörüne (Tüm Hesaplamalar) at
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      setIsDark(true);
    }
  };

  let effectiveVisibleCount = visibleCount;
  if (searchQuery.trim().length > 0 && effectiveVisibleCount > 0) {
    effectiveVisibleCount = Math.max(0, effectiveVisibleCount - 2);
  }

  const visibleCategories = categories.slice(0, effectiveVisibleCount);
  const hiddenCategories = categories.slice(effectiveVisibleCount);

  const renderSearch = (isDropdown = false) => (
    <div className={cn("relative flex items-center group", isDropdown ? "w-full flex-col items-stretch" : "hidden lg:flex")}>
      <div className="relative flex items-center w-full">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Yapay zeka ile arayın..."
          className={cn(
            "bg-slate-50 dark:bg-slate-800 dark:text-white border border-black/10 dark:border-white/10 rounded-full py-2 pl-4 text-[13px] lg:text-sm focus:outline-none focus:ring-1 focus:ring-[#0056b3]/30 focus:bg-white dark:focus:bg-slate-900 transition-all",
            isDropdown ? "w-full pr-[50px]" : "w-[220px] lg:w-[260px] xl:w-[320px] pr-[50px]"
          )}
        />
        <div className="absolute right-1.5 flex items-center gap-0.5">
          <div className="flex items-center gap-1 bg-[#0056b3] text-white px-2.5 py-1 rounded-full text-[10px] lg:text-[11px] font-bold transition-colors shadow-sm cursor-default">
            <Sparkles size={12} className={isAiLoading ? "animate-pulse text-blue-200" : ""} />
            <span className={cn(isDropdown ? "inline" : "hidden lg:inline")}>AI</span>
          </div>
        </div>
      </div>

      {/* AI Öneri Popover */}
      {aiSuggestions && (
        <div className={cn(
          "bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-xl p-3 z-50",
          isDropdown ? "mt-2 w-full mb-1 shadow-sm" : "absolute top-[calc(100%+8px)] right-0 lg:-right-2 w-[300px] lg:w-[340px] shadow-xl overflow-hidden"
        )}>
          <div className={cn("flex items-start", !isDropdown && "gap-3")}>
            {!isDropdown && (
              <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 text-[#0056b3] dark:text-blue-400 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-1">
                <Sparkles size={16} />
              </div>
            )}
            <div className="flex-1">
              {!isDropdown && (
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-2">
                  Yapay Zeka Araması
                </h4>
              )}
              {aiSuggestions.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Şu an için bu konuya uygun bir aracımız bulunmuyor.</p>
              ) : (
                <div className="mt-3 flex flex-col gap-2">
                  {aiSuggestions.map((suggestion, idx) => (
                    <div 
                      key={idx}
                      onClick={() => {
                        navigate(suggestion.path);
                        setAiSuggestions(null);
                        setSearchQuery('');
                      }}
                      className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-black/5 dark:border-white/5 p-2 rounded-lg cursor-pointer transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-[#0056b3] dark:text-blue-400 text-sm">{suggestion.title}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{suggestion.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setAiSuggestions(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-full shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-black/5 dark:border-white/10 shrink-0 sticky top-0 z-50 flex items-stretch h-[52px] px-2 lg:px-6 shadow-sm transition-colors">
      {/* Logo */}
      <NavLink to="/" className="flex items-center gap-1.5 mr-4 lg:mr-8 shrink-0">
        <span className="font-bold text-[18px] lg:text-[20px] tracking-tight text-[#0056b3] dark:text-blue-400">
          hesaplamalar<span className="text-blue-400 dark:text-blue-200">sitesi</span>
        </span>
      </NavLink>

      {/* Kategoriler */}
      <nav className="flex-1 flex justify-evenly items-stretch">
        {visibleCategories.map((c) => {
          const catTools = tools.filter(t => t.categoryId === c.id);
          return (
            <div key={c.id} className="relative group shrink-0 flex items-stretch">
              <NavLink 
                to={`/kategori/${c.id}`} 
                className={({ isActive }) => cn(
                  "px-2.5 lg:px-3 text-[14px] lg:text-[15px] font-bold transition-colors whitespace-nowrap flex items-center h-full",
                  isActive ? "text-white bg-[#0056b3]" : "text-[#0056b3] dark:text-blue-300 hover:text-white hover:bg-[#0056b3]"
                )}
              >
                {c.title}
              </NavLink>
              
              {/* Dikey Açılır Menü */}
              {catTools.length > 0 && (
                <div className="absolute top-full right-0 lg:left-0 lg:right-auto min-w-[240px] bg-[#0056b3] shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-0 z-50">
                  <div className="flex flex-col py-1 max-h-[85vh] overflow-y-auto">
                    {catTools.map(t => (
                      <NavLink 
                        key={t.id} 
                        to={t.path} 
                        className="px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#004494] transition-colors flex items-center justify-between whitespace-nowrap"
                      >
                        <div className="flex items-center gap-2">
                          <ToolIcon name={t.icon} size={14} strokeWidth={2.5} className="opacity-70" />
                          <span>{t.title}</span>
                        </div>
                        {isNewTool(t.id) && (
                          <span className="bg-[#e60000] text-white text-[9px] px-1.5 py-0.5 rounded italic font-bold ml-2">yeni</span>
                        )}
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Diğer Kategoriler (Dropdown) */}
        {(hiddenCategories.length > 0 || effectiveVisibleCount < 6) && (
          <div className={cn("relative group shrink-0 flex items-stretch", effectiveVisibleCount === 0 ? "flex-1 w-full" : "")}>
            <button className={cn(
              "px-2.5 lg:px-4 text-[14px] lg:text-[15px] font-bold text-white bg-[#0056b3] hover:bg-[#003d82] transition-colors whitespace-nowrap flex items-center justify-center gap-1",
              effectiveVisibleCount === 0 ? "w-full h-full" : "h-full"
            )}>
              Tüm Hesaplamalar <MoreHorizontal size={14} />
            </button>
            <div className={cn(
              "absolute top-full right-0 bg-[#0056b3] shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-0 z-50",
              effectiveVisibleCount === 0 ? "w-full" : "min-w-[240px]"
            )}>
              <div className="flex flex-col py-1 max-h-[85vh] overflow-y-auto">
                <div className="lg:hidden px-3 py-3 border-b border-blue-400/20">
                  {renderSearch(true)}
                </div>
                {hiddenCategories.map(c => (
                  <NavLink 
                    key={c.id} 
                    to={`/kategori/${c.id}`} 
                    className="px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#004494] transition-colors flex items-center justify-between whitespace-nowrap border-b border-blue-400/20 last:border-0"
                  >
                    {c.title}
                  </NavLink>
                ))}
                <NavLink 
                  to="/tum-araclar" 
                  className="px-4 py-3 text-[13px] font-bold text-white bg-[#004494] hover:bg-[#003d82] transition-colors flex items-center justify-center whitespace-nowrap border-t border-blue-400/20"
                >
                  Tüm Araçları Gör
                </NavLink>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Sağ Kısım: Ara, AI, Tema, Örnek Şablon */}
      <div className="shrink-0 flex items-center ml-2 lg:ml-4 relative gap-2 lg:gap-4">
         {renderSearch(false)}
         
         <button 
           onClick={toggleDarkMode}
           className="p-2 lg:p-2.5 mr-2 lg:mr-4 rounded-full text-slate-400 hover:text-[#0056b3] hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-blue-300 transition-all hidden sm:flex items-center justify-center"
           title="Tema Değiştir"
         >
           {isDark ? <Sun size={22} strokeWidth={2.5} /> : <Moon size={22} strokeWidth={2.5} />}
         </button>
      </div>
    </header>
  );
}
