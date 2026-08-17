import React, { useState } from 'react';
import { ChevronRight, RefreshCw, AlertCircle, Copy, Check, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToolIcon } from '../../components/icons/ToolIcon';
import { AdSlot } from '../../components/ads/AdSlot';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { RelatedTools } from '../../components/tools/RelatedTools';

export default function YuzdeyiKesireDonusturme() {
  const [val1, setVal1] = useState<string>('');
  const [val2, setVal2] = useState<string>('');
  const [val3, setVal3] = useState<string>('');
  const [sonuc, setSonuc] = useState<string | null>(null);
  const [detay, setDetay] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const hesapla = () => {
    if (!val1.trim()) {
      setError('*Lütfen gerekli alanları doldurun.');
      setSonuc(null);
      return;
    }
    setError(null);
    
      const y = parseFloat(val1) || 0;
      const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
      const top = Math.round(y * 100);
      const bot = 10000;
      const d = gcd(top, bot);
      setSonuc(`${top / d} / ${bot / d}`);
      setDetay(`%${y} = ${top / d}/${bot / d} (Ondalık: ${(y / 100).toFixed(4)})`);
  };

  const temizle = () => {
    setVal1('');
    setVal2('');
    setVal3('');
    setSonuc(null);
    setDetay(null);
    setError(null);
  };

  const handleCopy = () => {
    if (sonuc !== null) {
      navigator.clipboard.writeText(sonuc.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* 1. BREADCRUMB */}
      <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <Link to="/" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Ana Sayfa</Link>
        <ChevronRight size={14} />
        <Link to="/kategori/matematik" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors capitalize">Matematik</Link>
        <ChevronRight size={14} />
        <span className="text-slate-800 dark:text-slate-300">Yüzdeyi Kesire Dönüştürme</span>
      </div>

      {/* 2. BAŞLIK VE AÇIKLAMA */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Yüzdeyi Kesire Dönüştürme 2026 - Ücretsiz ve Hızlı Sonuçlar</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Herhangi bir yüzde değerini (%25, %12.5 vb.) en sade haline getirilmiş kesir ve ondalık sayı formatına dönüştürün.
        </p>
      </div>

      <div className="mb-8"><AdSlot format="horizontal" /></div>

      {/* HESAPLAMA ARACI KAPSAYICISI */}
      <div className="calculator-container mb-8 relative border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-8 mt-8">
        <div className="absolute -top-3.5 left-4 sm:left-8 bg-[#eef2f7] dark:bg-slate-950 px-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ToolIcon name="yuzde" size={20} className="text-[#0056b3] dark:text-blue-400" />
            Yüzdeyi Kesire Dönüştürme
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          {/* SOL: Girdiler */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">Yüzde Değeri (%)</label>
                <input
                  type="number"
                  value={val1}
                  onChange={(e) => { setVal1(e.target.value); setError(null); }}
                  placeholder="Örn: 75"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 transition-all"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={hesapla}
                  className="flex-1 bg-[#0056b3] hover:bg-[#004494] text-white font-bold py-3.5 rounded-xl transition-all shadow-sm active:scale-[0.98] text-sm"
                >
                  Hesapla
                </button>
                <button
                  type="button"
                  onClick={temizle}
                  className="px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-sm font-semibold flex items-center gap-1.5"
                >
                  <RefreshCw size={16} /> Temizle
                </button>
              </div>
            </div>
          </div>

          {/* SAĞ: Sonuç Paneli */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 md:p-8 flex-1 relative overflow-hidden shadow-lg border border-black/5 dark:border-slate-800 flex flex-col justify-between">
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-white">Sonuç</h3>
                  
                </div>

                <div className="flex-1 flex flex-col justify-center my-4">
                  <p className="text-slate-500 dark:text-slate-400 text-xs mb-1 font-medium">Hesaplanan Değer</p>
                  <div className="text-3xl sm:text-4xl font-black tracking-tight mb-2 text-slate-900 dark:text-white break-all">
                    {sonuc !== null ? sonuc : '---'}
                  </div>
                  
                  {detay && (
                    <div className="text-xs text-slate-600 dark:text-slate-300 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 font-mono mt-2">
                      {detay}
                    </div>
                  )}

                  {sonuc !== null && (
                    <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-black/5 dark:border-white/5">
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-xs">Bu sonuç ne anlama gelir?</h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        Yüzde oranının en sade pay ve payda oranına dönüştürülmüş rasyonel karşılığıdır.
                      </p>
                    </div>
                  )}
                </div>

                {/* SONUCU KOPYALA BUTONU */}
                <button
                  type="button"
                  onClick={handleCopy}
                  className="w-full mt-4 bg-slate-50 hover:bg-slate-100 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white border border-black/5 dark:border-transparent font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all backdrop-blur-sm active:scale-[0.98] text-sm"
                >
                  {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                  {copied ? 'Sonuç Kopyalandı!' : 'Sonucu Kopyala'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO VE AÇIKLAMA BÖLÜMÜ */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} />
          Sıkça Sorulan Sorular ve Bilgiler
        </h3>

        <div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">Yüzdeyi Kesire Dönüştürme Nedir ve Nasıl Hesaplanır?</h4>
          <p className="text-sm">
            Yüzdeyi Kesire Dönüştürme, matematik ve geometri alanında sıkça başvurulan temel hesaplama disiplinlerinden biridir. Herhangi bir yüzde değerini (%25, %12.5 vb.) en sade haline getirilmiş kesir ve ondalık sayı formatına dönüştürün. Hesaplama aracımız girilen tüm sayısal parametreleri analiz ederek kurallara uygun biçimde sonuçlandırır.
          </p>
        </div>

        <div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">Kullanılan Formüller ve Matematiksel Mantık</h4>
          <p className="text-sm mb-3">
            Hesaplama sürecinde kullanılan standart matematiksel bağıntı ve kurallar aşağıda özetlenmiştir:
          </p>
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl font-mono text-sm border border-slate-200 dark:border-slate-700">
            {"%x = x / 100"}
          </div>
        </div>

        <div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white mb-3">Sıkça Sorulan Sorular</h4>
          <div className="space-y-3 text-sm">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h5 className="font-bold text-slate-900 dark:text-white mb-1">Yüzde nasıl kesre dönüştürülür?</h5>
              <p>Yüzde değeri paya, 100 sayısı paydaya yazılır ve en büyük ortak bölen ile sadeleştirilir.</p>
            </div>
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h5 className="font-bold text-slate-900 dark:text-white mb-1">Ondalık yüzde değerleri kesre çevrilebilir mi?</h5>
              <p>Evet, pay ve payda 10 veya 100 ile genişletilerek tam sayılı kesre çevrilip sadeleştirilir.</p>
            </div>
          </div>
        </div>
      </div>

            <div className="mt-8"><RelatedTools currentToolId="yuzdeyi-kesire-donusturme" category="matematik" /></div>
<Disclaimer />
    </div>
  );
}
