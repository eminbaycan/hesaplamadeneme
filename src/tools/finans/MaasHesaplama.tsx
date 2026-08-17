import React, { useState } from 'react';
import { ChevronRight, RefreshCw, Copy, Check, Info, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToolIcon } from '../../components/icons/ToolIcon';
import { AdSlot } from '../../components/ads/AdSlot';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { RelatedTools } from '../../components/tools/RelatedTools';
import { getSavedTaxRates } from '../../data/marketData';

export default function MaasHesaplama() {
  const [tutar, setTutar] = useState<number | ''>('');
  const [hesapTuru, setHesapTuru] = useState<'brutten-nete' | 'netten-brute'>('brutten-nete');
  const [copied, setCopied] = useState<boolean>(false);
  
  const [sonuc, setSonuc] = useState<{
    brut: number;
    net: number;
    sgk: number;
    issizlik: number;
    gelirVergisi: number;
    damgaVergisi: number;
    toplamKesinti: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hesapla = () => {
    if (tutar === '') {
      setError("*Lütfen tutar giriniz.");
      setSonuc(null);
      return;
    }
    if (tutar <= 0) {
      setError("*Tutar 0'dan büyük olmalıdır.");
      setSonuc(null);
      return;
    }
    setError(null);
    
    const rates = getSavedTaxRates();
    const sgkOrani = rates.sgkCalisan;
    const issizlikOrani = rates.issizlikCalisan;
    const gelirVergisiOrani = rates.gelirVergisi; // 1. Dilim baz alınmıştır
    const damgaVergisiOrani = rates.damgaVergisi;

    let brut = 0;
    
    if (hesapTuru === 'brutten-nete') {
      brut = Number(tutar);
    } else {
      // Netten Brüte (Basitleştirilmiş)
      const oran = 1 - sgkOrani - issizlikOrani - (1 - gelirVergisiOrani) * gelirVergisiOrani - damgaVergisiOrani;
      brut = Number(tutar) / oran;
    }

    const sgk = brut * sgkOrani;
    const issizlik = brut * issizlikOrani;
    
    // Gelir vergisi matrahı = Brüt - SGK - İşsizlik
    const gelirVergisiMatrahi = brut - sgk - issizlik;
    const gelirVergisi = gelirVergisiMatrahi * gelirVergisiOrani;
    const damgaVergisi = brut * damgaVergisiOrani;
    
    const toplamKesinti = sgk + issizlik + gelirVergisi + damgaVergisi;
    const net = brut - toplamKesinti;
    
    setSonuc({
      brut,
      net,
      sgk,
      issizlik,
      gelirVergisi,
      damgaVergisi,
      toplamKesinti
    });
  };

  const temizle = () => {
    setTutar('');
    setHesapTuru('brutten-nete');
    setSonuc(null);
    setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <Link to="/" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Ana Sayfa</Link>
        <ChevronRight size={14} />
        <Link to="/kategori/finans" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors capitalize">Finans</Link>
        <ChevronRight size={14} />
        <span className="text-slate-800 dark:text-slate-300">Maaş Hesaplama</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Maaş Hesaplama (Brüt ➔ Net) 2026 - Ücretsiz ve Hızlı Sonuçlar</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Brütten nete veya netten brüte maaşınızı, SGK, İşsizlik, Gelir ve Damga vergisi kesintilerini tahmini olarak hesaplayın.
        </p>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      <div className="calculator-container mb-8 relative border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-8 mt-8">
        <div className="absolute -top-3.5 left-4 sm:left-8 bg-[#eef2f7] dark:bg-slate-950 px-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ToolIcon name="hesap-makinesi" size={20} className="text-[#0056b3] dark:text-blue-400" />
            Maaş Kesinti Analizi
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                Maaş Bilgileri
              </h2>
              <button onClick={temizle} className="text-[12px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1.5 transition-colors">
                <RefreshCw size={12} /> Temizle
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mb-6">
              <button 
                onClick={() => { setHesapTuru('brutten-nete'); setSonuc(null); }}
                className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors border ${hesapTuru === 'brutten-nete' ? 'bg-[#0056b3] text-white border-[#0056b3]' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-black/10 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >
                Brütten Nete
              </button>
              <button 
                onClick={() => { setHesapTuru('netten-brute'); setSonuc(null); }}
                className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors border ${hesapTuru === 'netten-brute' ? 'bg-[#0056b3] text-white border-[#0056b3]' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-black/10 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >
                Netten Brüte
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
                  {hesapTuru === 'brutten-nete' ? 'Brüt Maaş Tutarı (TL)' : 'Net Maaş Tutarı (TL)'} <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  value={tutar}
                  onChange={(e) => {
                    setTutar(e.target.value === '' ? '' : Number(e.target.value));
                    setError(null);
                  }}
                  placeholder="Örn: 50000" 
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
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-white">Bordro Özeti</h3>
                </div>

                <div className="flex-1 flex flex-col gap-4">
                  {sonuc !== null ? (
                    <>
                      <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-2">
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Brüt Maaş</p>
                        <div className="text-lg font-bold text-slate-900 dark:text-white">
                          {sonuc.brut.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <p className="text-slate-500 dark:text-slate-400">SGK Primi (%14)</p>
                        <div className="text-slate-700 dark:text-slate-300">
                          - {sonuc.sgk.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <p className="text-slate-500 dark:text-slate-400">İşsizlik Sig. (%1)</p>
                        <div className="text-slate-700 dark:text-slate-300">
                          - {sonuc.issizlik.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <p className="text-slate-500 dark:text-slate-400">Gelir Vergisi (%15)*</p>
                        <div className="text-slate-700 dark:text-slate-300">
                          - {sonuc.gelirVergisi.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm border-b border-black/5 dark:border-white/5 pb-4">
                        <p className="text-slate-500 dark:text-slate-400">Damga Vergisi (%0.759)</p>
                        <div className="text-slate-700 dark:text-slate-300">
                          - {sonuc.damgaVergisi.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺
                        </div>
                      </div>

                      <div className="pt-2">
                        <p className="text-slate-500 dark:text-slate-400 text-xs mb-1 font-bold uppercase">Ele Geçen Net Maaş</p>
                        <div className="text-3xl font-black tracking-tighter text-[#0056b3] dark:text-blue-400">
                          {sonuc.net.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} <span className="text-2xl text-slate-500">₺</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2">*Gelir vergisi dilimi 1. dilim (%15) ve asgari ücret istisnası hariç hesaplanmıştır. Temsili sonuçtur.</p>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-center text-slate-400">Değerleri girerek hesaplayın.</div>
                  )}
                </div>

                {sonuc !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`Net Maaş: ${sonuc.net.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺ (Brüt: ${sonuc.brut.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺)`);
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
          Maaş Hesaplama Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              Brüt maaşınızı (sözleşmede yazılı olan ve kesintiler yapılmadan önceki tutar) sisteme girerek "Hesapla" butonuna basın. Araç, maaşınızdan kesilecek sigorta primleri ve vergileri tahmini olarak düşüp elinize geçecek net maaşı gösterecektir.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Brüt ve Net Maaş Nedir?</h4>
            <p>
              <strong>Brüt Maaş:</strong> İşvereninizle anlaştığınız, sigorta primleri, vergiler ve diğer kesintiler yapılmadan önceki ham maaş tutarıdır.<br/>
              <strong>Net Maaş:</strong> Tüm yasal kesintiler (SGK, Gelir Vergisi vb.) yapıldıktan sonra banka hesabınıza yatırılan, elinize geçen gerçek tutardır.
            </p>
          </section>

          <div className="pt-2">
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Kullanılan Formüller / Kesintiler (Genel Oranlar):</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  SGK İşçi Primi = Brüt x %14<br/>
                  İşsizlik Primi = Brüt x %1<br/>
                  Gelir Vergisi Matrahı = Brüt - (SGK + İşsizlik)<br/>
                  Gelir Vergisi = Matrah x %15 (1. Dilim)<br/>
                  Damga Vergisi = Brüt x binde 7,59
                </div>
              </div>
            </div>
          </div>
          
          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Net maaşım yıl içinde neden düşüyor?</h5>
                <p>Türkiye'deki artan oranlı vergi dilimi sistemi nedeniyle, kümülatif vergi matrahınız yıl içerisinde üst dilimlere ulaştığında kesilen gelir vergisi oranı (%15'ten %20, %27 vb.) artar. Bu durum ele geçen net maaşın azalmasına neden olur.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <RelatedTools category="finans" currentToolId="maas-hesaplama" />
      <Disclaimer category="finans" />
    </div>
  );
}
