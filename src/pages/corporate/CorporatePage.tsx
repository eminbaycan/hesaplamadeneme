import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface CorporatePageProps {
  title: string;
}

export function CorporatePage({ title }: CorporatePageProps) {
  return (
    <div className="max-w-4xl mx-auto pb-12 min-h-[50vh]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <Link to="/" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Ana Sayfa</Link>
        <ChevronRight size={14} />
        <Link to="#" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Kurumsal</Link>
        <ChevronRight size={14} />
        <span className="text-slate-800 dark:text-slate-300">{title}</span>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-sm">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight border-b border-black/5 dark:border-white/10 pb-6">
          {title}
        </h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg mb-8">
            Bu sayfanın içeriği en kısa sürede güncellenecektir. Hesaplamalarsitesi.com olarak sizlere en doğru ve güvenilir hizmeti sunmak için çalışmalarımıza devam ediyoruz.
          </p>
          
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-black/5 dark:border-white/5">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">İçerik Hazırlanıyor</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Kurumsal politikalarımız, iletişim bilgilerimiz ve yasal metinlerimiz (KVKK, Gizlilik Politikası vb.) hukuk ekibimiz tarafından incelenerek çok yakında bu sayfada yayına alınacaktır. Anlayışınız için teşekkür ederiz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
