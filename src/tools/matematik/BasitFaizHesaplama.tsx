import React, { useState } from 'react';
import { ChevronRight, RefreshCw, Copy, Info, AlertCircle, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToolIcon } from '../../components/icons/ToolIcon';
import { AdSlot } from '../../components/ads/AdSlot';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { RelatedTools } from '../../components/tools/RelatedTools';

export default function BasitFaizHesaplama() {
  const [para, setPara] = useState<number | ''>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [oran, setOran] = useState<number | ''>('');
  const [sure, setSure] = useState<number | ''>('');
  const [sonuc, setSonuc] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hesapla = () => {
    if (para === '' || oran === '' || sure === '') {
      setError("*Lütfen tüm alanları doldurun.");
      setSonuc(null);
      return;
    }
    setError(null);
    setSonuc((Number(para) * Number(oran) * Number(sure)) / 100);
  };

  const temizle = () => {
    setPara('');
    setOran('');
    setSure('');
    setSonuc(null);
    setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* 1. BREADCRUMB */}
      <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <Link to="/" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Ana Sayfa</Link>
        <ChevronRight size={14} />
        <Link to="/kategori/matematik" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Matematik</Link>
        <ChevronRight size={14} />
        <span className="text-slate-800 dark:text-slate-300">Basit Faiz Hesaplama</span>
      </div>

      {/* 2. BAŞLIK VE AÇIKLAMA */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Basit Faiz Hesaplama 2026 - Ücretsiz ve Hızlı Sonuçlar</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Ücretsiz ve kullanımı kolay <strong className="font-semibold text-slate-800 dark:text-slate-200">Basit Faiz Hesaplama</strong> aracımız ile anaparanızın belirli bir sürede ne kadar faiz getirisini saniyeler içinde, hatasız bir şekilde bulun. Finansal planlamalarınızda zamandan tasarruf etmek ve en doğru sonuçlara anında ulaşmak için bu aracı kullanabilirsiniz.
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
            Basit Faiz Hesaplama
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

            {error && (
              <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl flex items-center gap-3 text-sm font-semibold border border-rose-100 dark:border-rose-800">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  Anapara <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  value={para}
                  onChange={(e) => {
                    setPara(e.target.value === '' ? '' : Number(e.target.value));
                    setError(null);
                  }}
                  placeholder="Örn: 10000" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  Faiz Oranı (%) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  value={oran}
                  onChange={(e) => {
                    setOran(e.target.value === '' ? '' : Number(e.target.value));
                    setError(null);
                  }}
                  placeholder="Örn: 10" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  Süre (Yıl) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  value={sure}
                  onChange={(e) => {
                    setSure(e.target.value === '' ? '' : Number(e.target.value));
                    setError(null);
                  }}
                  placeholder="Örn: 2" 
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
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-1 font-medium">Faiz Getirisi</p>
                  <div className="text-5xl font-black tracking-tighter mb-4 text-slate-900 dark:text-white">
                    {sonuc !== null ? sonuc.toLocaleString('tr-TR', { maximumFractionDigits: 2 }) : '---'}
                  </div>
                  
                  {sonuc !== null && (
                    <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-black/5 dark:border-white/5">
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-sm">Bu sonuç ne anlama gelir?</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Hesaplanan {sonuc.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} birim değer, {para} ana paranızın %{oran} faiz oranıyla {sure} yıl sonunda getireceği toplam basit faiz tutarıdır.
                      </p>
                    </div>
                  )}
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
          Basit Faiz Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-6 leading-relaxed">
          
          <div>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-2">Nasıl Kullanılır?</h4>
            <p className="mb-4">
              Anaparanızı, faiz oranını ve süreyi girerek "Hesapla" butonuna tıklamanız yeterlidir. Sonuçlar anında görüntülenecektir.
            </p>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-2">Basit faiz nedir?</h4>
            <p>
              Basit faiz, sadece ana para üzerinden hesaplanan faiz türüdür. Faiz miktarı her dönem için sabittir ve ana paraya eklenmez.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-2">Basit faiz nasıl hesaplanır?</h4>
              <p>
                Basit faiz formülü: (Anapara x Faiz Oranı x Süre) / 100 şeklindedir.
              </p>
            </div>
            <div>
              <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-2">Neden bu aracı kullanmalıyım?</h4>
              <p>
                Finansal yatırımlarınızın getirisini hızlıca önceden görmek ve basit faiz mantığını anlamak için en hızlı yöntemdir.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Kullanılan Formüller</h4>
            <div className="space-y-6 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Basit Faiz Formülü:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  Faiz Getirisi = (Anapara × Faiz Oranı × Süre) / 100
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* 5. DİĞER ARAÇLAR */}
      <RelatedTools category="matematik" currentToolId="basit-faiz-hesaplama" />

      {/* 6. SORUMLULUK REDDİ */}
      <Disclaimer category="matematik" />
    </div>
  );
}

