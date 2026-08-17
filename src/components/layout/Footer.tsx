import React from 'react';
import { NavLink } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-black/5 dark:border-white/10 pt-10 pb-6 px-4 lg:px-8 shrink-0 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <NavLink to="/" className="inline-flex items-center gap-1.5 mb-3">
            <span className="font-bold text-[18px] tracking-tight text-[#0056b3] dark:text-blue-400">
              hesaplamalar<span className="text-blue-400 dark:text-blue-200">sitesi</span>
            </span>
          </NavLink>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4 pr-4">
            Günlük hayatta ihtiyaç duyduğunuz tüm matematik, finans, sağlık ve eğitim hesaplamalarını 
            tek bir noktadan hızlı ve güvenilir şekilde yapmanızı sağlayan platform.
          </p>
          <div className="flex items-center gap-4 text-[12px] font-medium text-slate-500 dark:text-slate-400">
             <span className="flex items-center gap-1.5">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
               Sistem: Aktif
             </span>
             <span className="flex items-center gap-1.5">
               <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
               Gecikme: 14ms (Lokal)
             </span>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4">Hızlı Bağlantılar</h4>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li><NavLink to="/" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Ana Sayfa</NavLink></li>
            <li><NavLink to="/kategori/kredi" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Kredi Araçları</NavLink></li>
            <li><NavLink to="/kategori/matematik" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Matematik Araçları</NavLink></li>
            <li><NavLink to="/kategori/finans" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Finans Araçları</NavLink></li>
            <li><NavLink to="/kategori/saglik" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Sağlık Araçları</NavLink></li>
            <li className="pt-2">
              <NavLink to="/sablon" className="text-slate-600 dark:text-slate-300 hover:text-[#0056b3] dark:hover:text-blue-400 font-semibold flex items-center gap-1.5 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Örnek Şablon
              </NavLink>
            </li>
            <li className="pt-1">
              <NavLink to="/admin/denetim" className="text-[#0056b3] dark:text-blue-400 hover:underline font-semibold flex items-center gap-1.5 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>Sistem Denetimi (Admin)
              </NavLink>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4">Kurumsal</h4>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li><NavLink to="/kurumsal/hakkimizda" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Hakkımızda</NavLink></li>
            <li><NavLink to="/kurumsal/iletisim" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">İletişim</NavLink></li>
            <li><NavLink to="/kurumsal/gizlilik-politikasi" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Gizlilik Politikası</NavLink></li>
            <li><NavLink to="/kurumsal/kullanim-sartlari" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Kullanım Şartları</NavLink></li>
            <li><NavLink to="/kurumsal/kvkk" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">KVKK Aydınlatma Metni</NavLink></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-black/5 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-500">
        <div className="mb-2 sm:mb-0">
          © {new Date().getFullYear()} hesaplamalarsitesi. Tüm hakları saklıdır.
        </div>
        <div>
          Tasarım & Geliştirme: AI Studio
        </div>
      </div>
    </footer>
  );
}
