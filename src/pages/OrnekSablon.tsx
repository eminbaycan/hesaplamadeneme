import React, { useState } from 'react';
import { ChevronRight, RefreshCw, Copy, Check, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdSlot } from '../components/ads/AdSlot';
import { RelatedTools } from '../components/tools/RelatedTools';

export function OrnekSablon() {
  const [val1, setVal1] = useState<number | ''>('');
  const [val2, setVal2] = useState<number | ''>('');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCalculate = () => {
    if (val1 === '' || val2 === '') {
      setError("*Lütfen tüm alanları doldurun.");
      setResult(null);
      return;
    }
    setError(null);
    setResult(Number(val1) + Number(val2));
  };

  const handleClear = () => {
    setVal1('');
    setVal2('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* 1. BREADCRUMB (Navigasyon Yolu) */}
      <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <Link to="/" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Ana Sayfa</Link>
        <ChevronRight size={14} />
        <Link to="/kategori/matematik" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Matematik</Link>
        <ChevronRight size={14} />
        <span className="text-slate-800 dark:text-slate-300">İşlem Testi</span>
      </div>

      {/* 2. BAŞLIK VE AÇIKLAMA */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">İşlem Testi Aracı</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Bu araç ile temel toplama işlemi yapabilir, negatif değerler ile testlerinizi gerçekleştirebilir ve sonuçları temizleyebilirsiniz.
        </p>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      {/* HESAPLAMA ARACI KAPSAYICISI */}
      <div className="calculator-container mb-8 relative border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-8 mt-8">
        <div className="absolute -top-3.5 left-4 sm:left-8 bg-[#eef2f7] dark:bg-slate-950 px-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">İşlem Testi</h2>
        </div>

        {/* 3. ANA UYGULAMA ALANI */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* SOL: Girdi (Input) Formu */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                Değerleri Girin
              </h2>
              <button 
                onClick={handleClear}
                className="text-[12px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1.5 transition-colors">
                <RefreshCw size={12} /> Temizle
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  Birinci Değer <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  value={val1}
                  onChange={(e) => {
                    setVal1(e.target.value === '' ? '' : Number(e.target.value));
                    setError(null);
                  }}
                  placeholder="Örn: 1500 veya -500" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  İkinci Değer <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  value={val2}
                  onChange={(e) => {
                    setVal2(e.target.value === '' ? '' : Number(e.target.value));
                    setError(null);
                  }}
                  placeholder="Örn: 200 veya -50" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 transition-all"
                />
              </div>

              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

              <button 
                onClick={handleCalculate}
                className="w-full bg-[#0056b3] hover:bg-[#004494] text-white font-bold rounded-xl py-3.5 mt-2 transition-all shadow-sm active:scale-[0.98]">
                Hesapla
              </button>
            </div>
          </div>

          {/* SAĞ: Sonuç (Result) Paneli */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 md:p-8 flex-1 relative overflow-hidden shadow-lg border border-black/5 dark:border-slate-800">
              <div className="relative z-10 flex flex-col h-full">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-white mb-8">Sonuç</h3>

                <div className="flex-1 flex flex-col justify-center">
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-1 font-medium">Toplam</p>
                  <div className="text-5xl font-black tracking-tighter mb-4 text-slate-900 dark:text-white">
                    {result !== null ? result : "---"}
                  </div>
                </div>

                {result !== null && (
                  <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-black/5 dark:border-white/5">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-sm">Bu sonuç ne anlama gelir?</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Bu değer, girdiğiniz {val1} ve {val2} sayılarının toplamıdır.
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (result !== null) {
                      navigator.clipboard.writeText(result.toString());
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }
                  }}
                  className="w-full mt-8 bg-slate-50 hover:bg-slate-100 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white border border-black/5 dark:border-transparent font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all backdrop-blur-sm active:scale-[0.98] text-sm"
                >
                  {copied ? <Check size={16} className="text-emerald-500 transition-transform scale-110" /> : <Copy size={16} />}
                  {copied ? 'Sonuç Kopyalandı!' : 'Sonucu Kopyala'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Google Ads (Sıkça Sorulan Sorular Öncesi) */}
      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      {/* 4. SEO & BİLGİLENDİRME ALANI (AdSense ve İçerik için uygun) */}
      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Sıkça Sorulan Sorular ve Bilgiler
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-6 leading-relaxed">
          
          <div>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-2">Katma değer vergisi nedir?</h4>
            <p>
              Türkiye'de 1984 yılında kabul edilen 3065 sayılı kanuna göre uygulanan, yapılan mal ve hizmet teslimlerinde alıcının satıcıya ödediği tüketim vergisi niteliğinde olan bir vergidir. Böylece malın ilk üretiminden nihai tüketimine kadar geçen süre içerisinde her aşamadaki katma değeri vergileyen bir dolaylı vergidir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-2">KDV beyannamesi ne zaman verilir?</h4>
              <p>
                Aylık beyanname verenler herhangi bir ayın beyannamesini bu ayı takip eden ayın en geç 28. günü akşamına kadar vermelidir.
              </p>
            </div>
            <div>
              <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-2">Ne zaman ödenir?</h4>
              <p>
                Beyanname verilen ayın en geç 28. günü akşamına kadar ödenmelidir. Tüketiciler ise mal ya da hizmet satın alırken bu vergiyi gerçek yüklenici olarak malın fiyatıyla birlikte ilgili fatura kanalıyla ödemektedirler.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Kullanılan Formüller</h4>
            <p className="mb-4">Bu aracın hesaplamalarında aşağıdaki formüller temel alınmıştır:</p>
            
            <div className="space-y-6 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              
              {/* Formül 1 */}
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Örnek Formül 1 (KDV Dahil):</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  Sonuç = (Net Tutar) × [1 + (Vergi Oranı/100)]
                </div>
                <p className="text-sm">
                  Bu formüle göre 1000 TL + %20 KDV şu şekilde hesaplanır: <br className="md:hidden" />
                  <strong className="text-slate-700 dark:text-slate-300">1000 × (1 + 20/100) = 1000 × 1,20 = 1200 TL</strong>
                </p>
              </div>

              {/* Formül 2 */}
              <div className="pt-4 border-t border-black/5 dark:border-white/5">
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Örnek Formül 2 (KDV Hariç):</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  Sonuç = (Brüt Tutar) / [1 + (Vergi Oranı/100)]
                </div>
                <p className="text-sm">
                  Bu formüle göre %20 KDV dahil edilmiş 1200 TL'nin KDV hariç tutarı: <br className="md:hidden" />
                  <strong className="text-slate-700 dark:text-slate-300">1200 / (1 + 20/100) = 1200 / 1,20 = 1000 TL</strong>
                </p>
              </div>

              {/* Formül 3 */}
              <div className="pt-4 border-t border-black/5 dark:border-white/5">
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Örnek Formül 3 (Sadece Matrah):</div>
                <p className="text-sm mb-2">Vergi tutarı biliniyorsa, matrah aşağıdaki formülle bulunur.</p>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  Matrah = KDV Tutarı / (Vergi Oranı/100)
                </div>
                <p className="text-sm">
                  Bu formüle göre KDV tutarı 200 TL ise matrah şu şekilde hesaplanır: <br className="md:hidden" />
                  <strong className="text-slate-700 dark:text-slate-300">200 / (0,20) = 1000 TL</strong>
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30">
              <h4 className="text-[17px] font-bold text-[#0056b3] dark:text-blue-400 mb-2">Hesaplanan KDV nedir?</h4>
              <p className="text-sm">
                İşletmelerin yaptıkları mal ve hizmet teslimleri için tüketiciden tahsil ettikleri katma değer vergisi tutarlarının toplamına verilen addır.
              </p>
            </div>
            <div className="bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30">
              <h4 className="text-[17px] font-bold text-[#0056b3] dark:text-blue-400 mb-2">İndirilecek KDV nedir?</h4>
              <p className="text-sm">
                İşletmelerin teslim aldıkları mal ve hizmetlerde satıcıya ödedikleri katma değer vergisi tutarlarının toplamına verilen addır.
              </p>
            </div>
          </div>

        </div>
      </div>
      
      {/* 5. BENZER ARAÇLAR */}
      <RelatedTools category="matematik" currentToolId="ornek-sablon" />

      {/* SORUMLULUK REDDİ */}
      <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">Sorumluluk Reddi ve Bilgilendirme</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Bu platformda sunulan hesaplama sonuçları, genel bilgilendirme amacıyla otomatik matematiksel motorlar tarafından üretilir. Karmaşık veya profesyonel işlemler için, ilgili alanın uzmanına (örneğin matematiksel analizler için bir uzman, finansal işlemler için bir mali müşavir vb.) danışılması önemle tavsiye edilir. Sonuçların teyidi kullanıcının sorumluluğundadır.
        </p>
      </div>
    </div>
  );
}
