import React, { useState } from 'react';
import { ChevronRight, RefreshCw, Copy, Share2, Info, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RelatedTools } from '../../components/tools/RelatedTools';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { ToolIcon } from '../../components/icons/ToolIcon';
import { AdSlot } from '../../components/ads/AdSlot';

export default function CikarmaHesaplama() {
  const [s1, setS1] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [s2, setS2] = useState<string>('');
  const [sonuc, setSonuc] = useState<number | null>(null);

  const hesapla = () => {
    const n1 = parseFloat(s1);
    const n2 = parseFloat(s2);
    if (!isNaN(n1) && !isNaN(n2)) {
      setSonuc(n1 - n2);
    }
  };

  const temizle = () => {
    setS1('');
    setS2('');
    setSonuc(null);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* 1. BREADCRUMB */}
      <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <Link to="/" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Ana Sayfa</Link>
        <ChevronRight size={14} />
        <Link to="/kategori/matematik" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Matematik</Link>
        <ChevronRight size={14} />
        <span className="text-slate-800 dark:text-slate-300">Çıkarma Hesaplama</span>
      </div>

      {/* 2. BAŞLIK VE AÇIKLAMA */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Çıkarma Hesaplama 2026 - Ücretsiz ve Hızlı Sonuçlar</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Ücretsiz ve hızlı <strong className="font-semibold text-slate-800 dark:text-slate-200">Çıkarma Hesaplama</strong> aracımız ile sayıları saniyeler içinde birbirinden çıkarın. Karmaşık işlemlerde hatasız sonuç almak ve zamandan tasarruf etmek için geliştirdiğimiz bu araç, hem günlük matematiksel ihtiyaçlarınız hem de akademik çalışmalarınız için idealdir. Hızlı işlem yapmak için sayıları girin ve hesaplayın.
        </p>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      {/* HESAPLAMA ARACI KAPSAYICISI */}
      <div className="calculator-container mb-8 relative border-4 border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-8 mt-8">
        <div className="absolute -top-4 left-4 sm:left-8 bg-[#eef2f7] dark:bg-slate-950 px-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ToolIcon name="hesap-makinesi" size={20} className="text-[#0056b3] dark:text-blue-400" />
            Çıkarma Hesaplama
          </h2>
        </div>

        {/* 3. ANA UYGULAMA ALANI */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          
          {/* SOL: Girdi (Input) Formu */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-[#0056b3] dark:text-blue-400 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20v-8m0 0V4m0 8h8m-8 0H4"/></svg>
                </span>
                Değerleri Girin
              </h2>
              <button onClick={temizle} className="text-[12px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1.5 transition-colors">
                <RefreshCw size={12} /> Temizle
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  Sayı 1 (Eksilen)
                </label>
                <input 
                  type="number" 
                  value={s1}
                  onChange={(e) => setS1(e.target.value)}
                  placeholder="Örn: 500" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  Sayı 2 (Çıkan)
                </label>
                <input 
                  type="number" 
                  value={s2}
                  onChange={(e) => setS2(e.target.value)}
                  placeholder="Örn: 200" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all"
                />
              </div>

              <button onClick={hesapla} className="w-full bg-[#0056b3] hover:bg-[#004494] text-white font-bold rounded-xl py-3.5 mt-2 transition-all shadow-sm active:scale-[0.98]">
                Hesapla
              </button>
            </div>
          </div>

          {/* SAĞ: Sonuç (Result) Paneli */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 md:p-8 flex-1 relative overflow-hidden shadow-lg border border-black/5 dark:border-slate-800">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8 opacity-90">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-white">Sonuç</h3>
                  <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 rounded-md transition-colors" title="Paylaş">
                    <Share2 size={16} />
                  </button>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-1 font-medium">Fark</p>
                  <div className="text-5xl font-black tracking-tighter mb-4 text-[#0056b3] dark:text-blue-400">
                    {sonuc !== null ? sonuc.toLocaleString('tr-TR') : '0'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    () => {
                    if (sonuc !== null) navigator.clipboard.writeText(sonuc.toString());
                  ;
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}}
                  className="w-full mt-8 bg-slate-50 hover:bg-slate-100 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white border border-black/5 dark:border-transparent font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all backdrop-blur-sm"
                
                >
                  {copied ? <Check size={16} className="text-emerald-500 transition-transform scale-110" /> : <Copy size={16} />}
                  {copied ? 'Sonuç Kopyalandı!' : 'Sonucu Kopyala'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Google Ads */}
      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      {/* 4. SEO & BİLGİLENDİRME ALANI */}
      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Çıkarma İşlemi Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              Çıkarma hesaplama aracımız ile iki sayı arasındaki farkı saniyeler içerisinde bulabilirsiniz. "Eksilen (1. Sayı)" kısmına ana değerinizi, "Çıkan (2. Sayı)" kısmına ise çıkarmak istediğiniz değeri girin ve hesapla butonuna basın.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Çıkarma İşlemi Nedir ve Nasıl Hesaplanır?</h4>
            <p>
              Çıkarma işlemi, matematikteki dört temel işlemden biridir. Verilen bir değerden (Eksilen), başka bir değerin (Çıkan) eksiltilmesi sonucunda elde edilen kalan miktarın (Fark) bulunmasını sağlar.
            </p>
          </section>

          <div className="pt-2">
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Kullanılan Formüller:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  Eksilen - Çıkan = Fark
                </div>
              </div>
            </div>
          </div>
          
          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Eksilen sayı, çıkan sayıdan küçük olabilir mi?</h5>
                <p>Evet olabilir, bu durumda işlemin sonucu negatif (eksi değerli) bir sayı çıkacaktır. Aracımız negatif sonuçları da desteklemektedir.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      <RelatedTools category="matematik" currentToolId="cikarma-hesaplama" />
      <Disclaimer category="matematik" />
    </div>
  );
}
