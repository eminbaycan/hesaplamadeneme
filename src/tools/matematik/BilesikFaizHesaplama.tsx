import React, { useState } from 'react';
import { ChevronRight, RefreshCw, Copy, Info, AlertCircle, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToolIcon } from '../../components/icons/ToolIcon';
import { AdSlot } from '../../components/ads/AdSlot';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { RelatedTools } from '../../components/tools/RelatedTools';

export default function BilesikFaizHesaplama() {
  const [para, setPara] = useState<number | ''>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [oran, setOran] = useState<number | ''>('');
  const [sure, setSure] = useState<number | ''>('');
  const [sonuc, setSonuc] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hesapla = () => {
    if (para === '' || oran === '' || sure === '') {
      setError("*Lütfen anapara, faiz oranı ve süre alanlarını eksiksiz doldurun.");
      setSonuc(null);
      return;
    }
    if (para <= 0 || oran <= 0 || sure <= 0) {
      setError("*Tüm değerler 0'dan büyük olmalıdır.");
      setSonuc(null);
      return;
    }
    setError(null);
    
    const p = Number(para);
    const o = Number(oran);
    const s = Number(sure);
    
    // Bileşik Faiz Formülü: A = P * (1 + r/n)^(nt)
    // Basit bir yıllık hesaplama varsayımıyla (n=1): P * (1 + o/100)^s
    const miktar = p * Math.pow((1 + o / 100), s);
    setSonuc(miktar);
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
      <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <Link to="/" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Ana Sayfa</Link>
        <ChevronRight size={14} />
        <Link to="/kategori/matematik" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors capitalize">Matematik</Link>
        <ChevronRight size={14} />
        <span className="text-slate-800 dark:text-slate-300">Bileşik Faiz Hesaplama</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Bileşik Faiz Hesaplama 2026 - Ücretsiz ve Hızlı Sonuçlar</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Mevduatlarınızın sadece anapara üzerinden değil, elde ettiği faiz üzerinden de faiz kazanmasıyla oluşan bileşik faiz getirisini saniyeler içerisinde hesaplayın.
        </p>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      <div className="calculator-container mb-8 relative border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-8 mt-8">
        <div className="absolute -top-3.5 left-4 sm:left-8 bg-[#eef2f7] dark:bg-slate-950 px-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ToolIcon name="hesap-makinesi" size={20} className="text-[#0056b3] dark:text-blue-400" />
            Bileşik Faiz Hesaplama
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
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
                  Anapara Tutarı <span className="text-red-500">*</span>
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
                  Yıllık Faiz Oranı (%) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  value={oran}
                  onChange={(e) => {
                    setOran(e.target.value === '' ? '' : Number(e.target.value));
                    setError(null);
                  }}
                  placeholder="Örn: 15" 
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
                  placeholder="Örn: 5" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all"
                />
              </div>
              
              <button onClick={hesapla} className="w-full bg-[#0056b3] hover:bg-[#004494] text-white font-bold rounded-xl py-3.5 mt-2 transition-all shadow-sm active:scale-[0.98]">
                Hesapla
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 md:p-8 flex-1 relative overflow-hidden shadow-lg border border-black/5 dark:border-slate-800">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8 opacity-90">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-white">Sonuç (Toplam Bakiye)</h3>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  {sonuc !== null ? (
                    <div className="text-4xl font-black tracking-tighter text-[#0056b3] dark:text-blue-400">
                      {sonuc.toLocaleString('tr-TR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} <span className="text-2xl text-slate-500">TL</span>
                    </div>
                  ) : (
                    <div className="text-center text-slate-400">Sonuç bekliyor...</div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    () => {
                    if (sonuc !== null) navigator.clipboard.writeText(sonuc.toFixed(2));
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

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Bileşik Faiz Nedir ve Nasıl Hesaplanır? Hakkında Her Şey
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              Anaparanızı, beklentiniz olan yıllık faiz oranını ve paranızı değerlendireceğiniz yıl sayısını girin. Aracımız, bileşik faiz formülünü işleterek size vade sonundaki toplam bakiyenizi sunacaktır.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Bileşik Faiz Nedir?</h4>
            <p>
              Bileşik faiz, basit faizin aksine, anaparanın elde ettiği faiz gelirinin tekrar anaparaya eklenmesi ve sonraki faiz hesaplamalarının bu yeni (ve daha büyük) anapara üzerinden yapılmasıdır. Uzun vadede kartopu etkisi yaratarak paranızın katlanarak büyümesini sağlar.
            </p>
          </section>

          <div className="pt-2">
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Kullanılan Formüller:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  A = P * (1 + r/n)^(n*t) <br/>
                  (A = Toplam Tutar, P = Anapara, r = Yıllık Faiz Oranı, n = Faiz Eklenme Sıklığı, t = Yıl)
                </div>
              </div>
            </div>
          </div>
          
          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Bileşik faiz ile basit faiz arasındaki fark nedir?</h5>
                <p>Basit faizde kazanç sadece anapara üzerinden hesaplanırken, bileşik faizde "faizin de faizi" alınır.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <RelatedTools category="matematik" currentToolId="bilesik-faiz-hesaplama" />
      <Disclaimer category="matematik" />
    </div>
  );
}
