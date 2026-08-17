import React, { useState } from 'react';
import { ChevronRight, RefreshCw, Copy, Check, Info, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToolIcon } from '../../components/icons/ToolIcon';
import { AdSlot } from '../../components/ads/AdSlot';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { RelatedTools } from '../../components/tools/RelatedTools';

export default function YksHesaplama() {
  const [tytTurkce, setTytTurkce] = useState<number | ''>('');
  const [tytMat, setTytMat] = useState<number | ''>('');
  const [obp, setObp] = useState<number | ''>('');
  const [copied, setCopied] = useState<boolean>(false);
  
  const [sonuc, setSonuc] = useState<{
    tytPuan: number;
    yerlestirmePuan: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hesapla = () => {
    if (tytTurkce === '' || tytMat === '' || obp === '') {
      setError("*Lütfen Türkçe, Matematik netlerini ve OBP alanını doldurun.");
      setSonuc(null);
      return;
    }
    
    // Basitleştirilmiş TYT Katsayıları (ÖSYM standartlarında yaklaşık değerler)
    // Türkçe: ~3.3, Mat: ~3.3, Temel Puan: 100
    const turkcePuan = Number(tytTurkce) * 3.3;
    const matPuan = Number(tytMat) * 3.3;
    
    const tytHamPuan = 100 + turkcePuan + matPuan;
    const yerlestirmePuan = tytHamPuan + (Number(obp) * 0.6); // OBP'nin %60'ı eklenir
    
    setError(null);
    setSonuc({
      tytPuan: tytHamPuan,
      yerlestirmePuan: yerlestirmePuan
    });
  };

  const temizle = () => {
    setTytTurkce('');
    setTytMat('');
    setObp('');
    setSonuc(null);
    setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <Link to="/" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Ana Sayfa</Link>
        <ChevronRight size={14} />
        <Link to="/kategori/egitim" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors capitalize">Eğitim</Link>
        <ChevronRight size={14} />
        <span className="text-slate-800 dark:text-slate-300">YKS Puan Hesaplama</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">YKS (TYT) Puan Hesaplama 2026 - Ücretsiz ve Hızlı Sonuçlar</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Temel Yetenek Testi (TYT) netlerinizi ve Ortaöğretim Başarı Puanınızı (OBP) girerek tahmini YKS yerleştirme puanınızı hesaplayın.
        </p>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      <div className="calculator-container mb-8 relative border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-8 mt-8">
        <div className="absolute -top-3.5 left-4 sm:left-8 bg-[#eef2f7] dark:bg-slate-950 px-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ToolIcon name="mezuniyet" size={20} className="text-[#0056b3] dark:text-blue-400" />
            YKS TYT Puanı
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                Sınav Bilgileri
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
                  TYT Türkçe Neti <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  value={tytTurkce}
                  onChange={(e) => {
                    setTytTurkce(e.target.value === '' ? '' : Number(e.target.value));
                    setError(null);
                  }}
                  placeholder="Örn: 30" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  TYT Matematik Neti <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  value={tytMat}
                  onChange={(e) => {
                    setTytMat(e.target.value === '' ? '' : Number(e.target.value));
                    setError(null);
                  }}
                  placeholder="Örn: 25" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  Ortaöğretim Başarı Puanı (OBP 50-100 Arası) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  value={obp}
                  onChange={(e) => {
                    setObp(e.target.value === '' ? '' : Number(e.target.value));
                    setError(null);
                  }}
                  placeholder="Örn: 85" 
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
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8 opacity-90">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-white">Sınav Puanınız</h3>
                </div>

                <div className="flex-1 flex flex-col justify-center gap-6">
                  {sonuc !== null ? (
                    <>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs mb-1 font-bold uppercase">TYT Ham Puanı (Tahmini)</p>
                        <div className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white">
                          {sonuc.tytPuan.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-black/10 dark:border-white/10">
                        <p className="text-slate-500 dark:text-slate-400 text-xs mb-1 font-bold uppercase">Y-TYT Yerleştirme Puanı (OBP Dahil)</p>
                        <div className="text-4xl font-black tracking-tighter text-[#0056b3] dark:text-blue-400">
                          {sonuc.yerlestirmePuan.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-slate-400">Netlerinizi girerek tahmini puanınızı görün.</div>
                  )}
                </div>

                {sonuc !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`Y-TYT Yerleştirme Puanı: ${sonuc.yerlestirmePuan.toFixed(2)} (TYT Ham: ${sonuc.tytPuan.toFixed(2)})`);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="w-full mt-4 bg-slate-50 hover:bg-slate-100 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white border border-black/5 dark:border-transparent font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all backdrop-blur-sm active:scale-[0.98] text-sm"
                  >
                    {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                    {copied ? 'Sonuç Kopyalandı!' : 'Sonucu Kopyala'}
                  </button>
                )}
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
          YKS Puan Hesaplama Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              YKS'nin ilk oturumu olan TYT sınavında yaptığınız Türkçe ve Matematik netlerinizi, ayrıca lise diploma notunuzu (OBP) girerek tahmini puanınızı hesaplayabilirsiniz.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">YKS Puanı Nedir?</h4>
            <p>
              Yükseköğretim Kurumları Sınavı (YKS), Türkiye'de üniversiteye giriş için düzenlenen ve ÖSYM tarafından yapılan merkezi bir sınavdır. TYT (Temel Yeterlilik Testi) tüm adaylar için zorunlu ilk aşamadır.
            </p>
          </section>

          <div className="pt-2">
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Kullanılan Formüller:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  Ham Puan = Taban Puan (100) + (Net x Katsayı)<br/>
                  Yerleştirme Puanı = Ham Puan + (OBP x 0.6)
                </div>
                <p className="text-xs text-slate-500 mt-2">Not: Bu hesaplama standart sapma değerleri hesaba katılmadan, temel katsayılarla yapılmış tahmini bir hesaplamadır.</p>
              </div>
            </div>
          </div>
          
          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">OBP (Ortaöğretim Başarı Puanı) nedir?</h5>
                <p>OBP, lise mezuniyet notunuzun (diploma notunuzun) 5 ile çarpılarak oluşturulan ve 250 ile 500 arasında değişen puandır. Bu puanın %12'si (veya 0.6 katsayısı) sınav puanına eklenir.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <RelatedTools category="egitim" currentToolId="yks-puan-hesaplama" />
      <Disclaimer category="egitim" />
    </div>
  );
}
