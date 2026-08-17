import React, { useState } from 'react';
import { ChevronRight, RefreshCw, Copy, Check, Info, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToolIcon } from '../../components/icons/ToolIcon';
import { AdSlot } from '../../components/ads/AdSlot';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { RelatedTools } from '../../components/tools/RelatedTools';

export default function VkiHesaplama() {
  const [boy, setBoy] = useState<number | ''>('');
  const [kilo, setKilo] = useState<number | ''>('');
  const [copied, setCopied] = useState<boolean>(false);
  
  const [sonuc, setSonuc] = useState<{
    vki: number;
    kategori: string;
    renk: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hesapla = () => {
    if (boy === '' || kilo === '') {
      setError("*Lütfen boy ve kilo bilgilerinizi doldurun.");
      setSonuc(null);
      return;
    }
    if (boy <= 0 || kilo <= 0) {
      setError("*Değerler 0'dan büyük olmalıdır.");
      setSonuc(null);
      return;
    }
    
    setError(null);
    const boyMetre = Number(boy) / 100;
    const vki = Number(kilo) / (boyMetre * boyMetre);
    
    let kategori = "";
    let renk = "";
    
    if (vki < 18.5) {
      kategori = "Zayıf";
      renk = "text-sky-500";
    } else if (vki >= 18.5 && vki < 24.9) {
      kategori = "Normal Kilolu";
      renk = "text-emerald-500";
    } else if (vki >= 25 && vki < 29.9) {
      kategori = "Fazla Kilolu";
      renk = "text-amber-500";
    } else if (vki >= 30 && vki < 34.9) {
      kategori = "Obez (1. Derece)";
      renk = "text-orange-500";
    } else if (vki >= 35 && vki < 39.9) {
      kategori = "Aşırı Obez (2. Derece)";
      renk = "text-rose-500";
    } else {
      kategori = "Morbid Obez (3. Derece)";
      renk = "text-red-600";
    }

    setSonuc({
      vki,
      kategori,
      renk
    });
  };

  const temizle = () => {
    setBoy('');
    setKilo('');
    setSonuc(null);
    setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <Link to="/" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Ana Sayfa</Link>
        <ChevronRight size={14} />
        <Link to="/kategori/saglik" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors capitalize">Sağlık</Link>
        <ChevronRight size={14} />
        <span className="text-slate-800 dark:text-slate-300">VKİ Hesaplama</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Vücut Kitle İndeksi (VKİ) Hesaplama 2026 - Ücretsiz ve Hızlı Sonuçlar</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Boy ve kilo oranınıza göre ideal kilonuzda olup olmadığınızı öğrenin.
        </p>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      <div className="calculator-container mb-8 relative border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-8 mt-8">
        <div className="absolute -top-3.5 left-4 sm:left-8 bg-[#eef2f7] dark:bg-slate-950 px-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ToolIcon name="saglik" size={20} className="text-[#0056b3] dark:text-blue-400" />
            VKİ Hesaplayıcı
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                Fiziksel Bilgileriniz
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
                  Boyunuz (cm) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  value={boy}
                  onChange={(e) => {
                    setBoy(e.target.value === '' ? '' : Number(e.target.value));
                    setError(null);
                  }}
                  placeholder="Örn: 175" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  Kilonuz (kg) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  value={kilo}
                  onChange={(e) => {
                    setKilo(e.target.value === '' ? '' : Number(e.target.value));
                    setError(null);
                  }}
                  placeholder="Örn: 70" 
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
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 dark:bg-emerald-500/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8 opacity-90">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-white">VKİ Sonucunuz</h3>
                </div>

                <div className="flex-1 flex flex-col justify-center gap-6 text-center">
                  {sonuc !== null ? (
                    <>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase mb-2">Vücut Kitle İndeksiniz</p>
                        <div className={`text-6xl font-black tracking-tighter ${sonuc.renk}`}>
                          {sonuc.vki.toLocaleString('tr-TR', { maximumFractionDigits: 1 })}
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-black/10 dark:border-white/10">
                        <p className="text-slate-500 dark:text-slate-400 text-xs mb-1 font-bold uppercase">Durum</p>
                        <div className={`text-2xl font-bold ${sonuc.renk}`}>
                          {sonuc.kategori}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-slate-400">Boy ve kilonuzu girerek ideal kilo aralığınızı hesaplayın.</div>
                  )}
                </div>

                {sonuc !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`VKİ: ${sonuc.vki.toFixed(1)} - Durum: ${sonuc.kategori}`);
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
          VKİ Hesaplama Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              Vücut kitle indeksinizi hesaplamak için santimetre cinsinden boyunuzu ve kilogram cinsinden vücut ağırlığınızı girin. Ardından hesapla butonuna basarak kilonuzun boyunuza oranla hangi kategoride olduğunu anında görebilirsiniz.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">VKİ Nedir?</h4>
            <p>
              Vücut Kitle İndeksi (VKİ), yetişkin bir insanın kilosunun boyuna göre normal olup olmadığını gösteren bir parametredir. Dünya Sağlık Örgütü (WHO) tarafından obezite sınıflandırması için kullanılan standart bir yöntemdir.
            </p>
          </section>

          <div className="pt-2">
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Kullanılan Formüller:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  VKİ = Kilo (kg) / [Boy (m) x Boy (m)]
                </div>
              </div>
            </div>
          </div>
          
          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">VKİ her yaş için geçerli midir?</h5>
                <p>Yetişkinler (18 yaş ve üzeri) için standart formül geçerlidir. Hamile kadınlar, çocuklar ve yoğun kas kütlesine sahip sporcular için bu formül yanıltıcı olabilir.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <RelatedTools category="saglik" currentToolId="vki-hesaplama" />
      <Disclaimer category="saglik" />
    </div>
  );
}
