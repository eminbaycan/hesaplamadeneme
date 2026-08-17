import React, { useState } from 'react';
import { ChevronRight, RefreshCw, Copy, Info, AlertCircle, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToolIcon } from '../../components/icons/ToolIcon';
import { AdSlot } from '../../components/ads/AdSlot';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { RelatedTools } from '../../components/tools/RelatedTools';

export default function AltinOranHesaplama() {
  const [deger, setDeger] = useState<number | ''>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [hesapTuru, setHesapTuru] = useState<'kucuk' | 'buyuk'>('buyuk');
  const [sonuc, setSonuc] = useState<{buyuk: number, kucuk: number, tam: number} | null>(null);
  const [error, setError] = useState<string | null>(null);

  const PHI = 1.61803398875;

  const hesapla = () => {
    if (deger === '' || deger <= 0) {
      setError("*Lütfen 0'dan büyük geçerli bir değer girin.");
      setSonuc(null);
      return;
    }
    setError(null);
    
    const d = Number(deger);
    if (hesapTuru === 'buyuk') {
      // Girilen değer büyük parça ise
      const kucuk = d / PHI;
      const tam = d + kucuk;
      setSonuc({ buyuk: d, kucuk, tam });
    } else {
      // Girilen değer küçük parça ise
      const buyuk = d * PHI;
      const tam = d + buyuk;
      setSonuc({ buyuk, kucuk: d, tam });
    }
  };

  const temizle = () => {
    setDeger('');
    setSonuc(null);
    setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* 1. BREADCRUMB */}
      <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <Link to="/" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Ana Sayfa</Link>
        <ChevronRight size={14} />
        <Link to="/kategori/matematik" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors capitalize">Matematik</Link>
        <ChevronRight size={14} />
        <span className="text-slate-800 dark:text-slate-300">Altın Oran Hesaplama</span>
      </div>

      {/* 2. BAŞLIK VE AÇIKLAMA */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Altın Oran Hesaplama 2026 - Ücretsiz ve Hızlı Sonuçlar</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Tasarımda, sanatta ve mimaride kusursuz uyumu yakalamak için altın oran hesaplayın. Bir ölçüyü girerek, altın orana (1.618) uygun diğer boyutları bulun.
        </p>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      {/* HESAPLAMA ARACI KAPSAYICISI */}
      <div className="calculator-container mb-8 relative border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-8 mt-8">
        <div className="absolute -top-3.5 left-4 sm:left-8 bg-[#eef2f7] dark:bg-slate-950 px-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ToolIcon name="hesap-makinesi" size={20} className="text-[#0056b3] dark:text-blue-400" />
            Altın Oran Hesaplama
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

            <div className="flex flex-col sm:flex-row gap-2 mb-6">
              <button 
                onClick={() => { setHesapTuru('buyuk'); setSonuc(null); }}
                className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors border ${hesapTuru === 'buyuk' ? 'bg-[#0056b3] text-white border-[#0056b3]' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-black/10 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >
                Girdiğim Değer Büyük Parça
              </button>
              <button 
                onClick={() => { setHesapTuru('kucuk'); setSonuc(null); }}
                className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors border ${hesapTuru === 'kucuk' ? 'bg-[#0056b3] text-white border-[#0056b3]' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-black/10 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >
                Girdiğim Değer Küçük Parça
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
                  Uzunluk Değeri <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  value={deger}
                  onChange={(e) => {
                    setDeger(e.target.value === '' ? '' : Number(e.target.value));
                    setError(null);
                  }}
                  placeholder="Örn: 100" 
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
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-white">Sonuç (Altın Oran: 1.618)</h3>
                </div>

                <div className="flex-1 flex flex-col justify-center gap-6">
                  {sonuc !== null ? (
                    <>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs mb-1 font-bold uppercase">Küçük Parça (A)</p>
                        <div className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
                          {sonuc.kucuk.toLocaleString('tr-TR', { maximumFractionDigits: 4 })}
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs mb-1 font-bold uppercase">Büyük Parça (B)</p>
                        <div className="text-3xl font-black tracking-tighter text-[#0056b3] dark:text-blue-400">
                          {sonuc.buyuk.toLocaleString('tr-TR', { maximumFractionDigits: 4 })}
                        </div>
                      </div>
                      <div className="pt-4 border-t border-black/10 dark:border-white/10">
                        <p className="text-slate-500 dark:text-slate-400 text-xs mb-1 font-bold uppercase">Toplam Uzunluk (A + B)</p>
                        <div className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white">
                          {sonuc.tam.toLocaleString('tr-TR', { maximumFractionDigits: 4 })}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-slate-400">Sonuçları görmek için değer girin</div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (sonuc !== null) {
                      navigator.clipboard.writeText(`Küçük: ${sonuc.kucuk.toFixed(4)}, Büyük: ${sonuc.buyuk.toFixed(4)}, Toplam: ${sonuc.tam.toFixed(4)}`);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }
                  }}
                  className="w-full mt-8 bg-slate-50 hover:bg-slate-100 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white border border-black/5 dark:border-transparent font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all backdrop-blur-sm active:scale-[0.98]"
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
          Altın Oran Nedir ve Nasıl Hesaplanır? Hakkında Her Şey
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              Altın oran aracımızı kullanarak bir ölçünün altın oranını bulabilirsiniz. Mevcut bir ölçünüz varsa, bu ölçünün "Büyük Parça" mı yoksa "Küçük Parça" mı olduğunu seçin. Ardından ölçü değerini girin ve hesapla butonuna basın. Diğer parçaların boyutları anında hesaplanacaktır.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Altın Oran Nedir?</h4>
            <p>
              Altın oran, matematikte ve sanatta, bir bütünün parçaları arasında gözlemlenen ve uyum açısından en yetkin boyutları verdiği sanılan geometrik ve sayısal bir oran bağıntısıdır. Phi (Φ) harfiyle gösterilir ve yaklaşık değeri 1.618'dir.
            </p>
          </section>

          <div className="pt-2">
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Kullanılan Formüller:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  A (Küçük) = B (Büyük) / 1.618033<br/>
                  B (Büyük) = A (Küçük) * 1.618033
                </div>
              </div>
            </div>
          </div>
          
          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Altın oran nerelerde kullanılır?</h5>
                <p>Mimaride, logolarda, sanat eserlerinde (Mona Lisa gibi), web tasarımında ve fotoğrafçılıkta kusursuz estetiği yakalamak için sıklıkla kullanılır.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <RelatedTools category="matematik" currentToolId="altin-oran-hesaplama" />
      <Disclaimer category="matematik" />
    </div>
  );
}
