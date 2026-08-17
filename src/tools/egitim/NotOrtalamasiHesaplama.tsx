import React, { useState } from 'react';
import { ChevronRight, RefreshCw, Copy, Check, Info, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToolIcon } from '../../components/icons/ToolIcon';
import { AdSlot } from '../../components/ads/AdSlot';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { RelatedTools } from '../../components/tools/RelatedTools';

export default function NotOrtalamasiHesaplama() {
  const [dersler, setDersler] = useState([{ id: 1, ad: '', not: '', kredi: '' }]);
  const [copied, setCopied] = useState<boolean>(false);
  
  const [sonuc, setSonuc] = useState<{
    ortalama: number;
    toplamKredi: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dersEkle = () => {
    setDersler([...dersler, { id: Date.now(), ad: '', not: '', kredi: '' }]);
  };

  const dersSil = (id: number) => {
    if (dersler.length > 1) {
      setDersler(dersler.filter(d => d.id !== id));
    }
  };

  const handleChange = (id: number, field: string, value: string) => {
    setDersler(dersler.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const hesapla = () => {
    let toplamAgirlik = 0;
    let toplamKredi = 0;

    for (const ders of dersler) {
      const not = Number(ders.not);
      const kredi = Number(ders.kredi);
      
      if (!ders.not || !ders.kredi) {
        setError("*Lütfen tüm derslerin not ve kredi/saat alanlarını doldurun.");
        setSonuc(null);
        return;
      }
      
      if (not < 0 || not > 100 || kredi <= 0) {
        setError("*Notlar 0-100 arasında, krediler 0'dan büyük olmalıdır.");
        setSonuc(null);
        return;
      }
      
      toplamAgirlik += (not * kredi);
      toplamKredi += kredi;
    }

    setError(null);
    const ortalama = toplamAgirlik / toplamKredi;
    
    setSonuc({
      ortalama,
      toplamKredi
    });
  };

  const temizle = () => {
    setDersler([{ id: 1, ad: '', not: '', kredi: '' }]);
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
        <span className="text-slate-800 dark:text-slate-300">Not Ortalaması Hesaplama</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Ağırlıklı Not Ortalaması Hesaplama 2026 - Ücretsiz ve Hızlı Sonuçlar</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Üniversite veya lise derslerinizin kredi ve not bilgilerini girerek dönem/genel ağırlıklı ortalamanızı hesaplayın.
        </p>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      <div className="calculator-container mb-8 relative border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-8 mt-8">
        <div className="absolute -top-3.5 left-4 sm:left-8 bg-[#eef2f7] dark:bg-slate-950 px-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ToolIcon name="mezuniyet" size={20} className="text-[#0056b3] dark:text-blue-400" />
            Ortalama Hesaplayıcı
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                Dersleriniz
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

            <div className="space-y-4">
              {dersler.map((ders, index) => (
                <div key={ders.id} className="flex flex-wrap sm:flex-nowrap gap-3 items-end">
                  <div className="flex-1 w-full sm:w-auto">
                    {index === 0 && <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Ders Adı</label>}
                    <input 
                      type="text" 
                      value={ders.ad}
                      onChange={(e) => handleChange(ders.id, 'ad', e.target.value)}
                      placeholder={`Ders ${index + 1}`} 
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-700 dark:text-white focus:ring-2 focus:ring-[#0056b3]/20"
                    />
                  </div>
                  <div className="w-1/3 sm:w-24">
                    {index === 0 && <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Not (0-100)</label>}
                    <input 
                      type="number" 
                      value={ders.not}
                      onChange={(e) => handleChange(ders.id, 'not', e.target.value)}
                      placeholder="Örn: 85" 
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-700 dark:text-white focus:ring-2 focus:ring-[#0056b3]/20"
                    />
                  </div>
                  <div className="w-1/3 sm:w-24">
                    {index === 0 && <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Kredi/Saat</label>}
                    <input 
                      type="number" 
                      value={ders.kredi}
                      onChange={(e) => handleChange(ders.id, 'kredi', e.target.value)}
                      placeholder="Örn: 4" 
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-700 dark:text-white focus:ring-2 focus:ring-[#0056b3]/20"
                    />
                  </div>
                  <button 
                    onClick={() => dersSil(ders.id)}
                    className="p-2.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors mb-0"
                    title="Dersi Sil"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              
              <button 
                onClick={dersEkle}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#0056b3] dark:hover:border-blue-500 hover:bg-[#0056b3]/5 dark:hover:bg-blue-500/10 text-slate-500 hover:text-[#0056b3] dark:text-slate-400 dark:hover:text-blue-400 font-bold rounded-xl py-3 mt-4 transition-all"
              >
                <Plus size={18} /> Yeni Ders Ekle
              </button>

              <button onClick={hesapla} className="w-full bg-[#0056b3] hover:bg-[#004494] text-white font-bold rounded-xl py-3.5 mt-2 transition-all shadow-sm active:scale-[0.98]">
                Hesapla
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 md:p-8 flex-1 relative overflow-hidden shadow-lg border border-black/5 dark:border-slate-800">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8 opacity-90">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-white">Sonuç</h3>
                </div>

                <div className="flex-1 flex flex-col justify-center gap-6">
                  {sonuc !== null ? (
                    <>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs mb-1 font-bold uppercase">Ağırlıklı Ortalama</p>
                        <div className="text-4xl font-black tracking-tighter text-[#0056b3] dark:text-blue-400">
                          {sonuc.ortalama.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-slate-500 mt-2">Toplam {sonuc.toplamKredi} kredi üzerinden hesaplanmıştır.</p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-slate-400">Notlarınızı girerek sonucunuzu görün.</div>
                  )}
                </div>

                {sonuc !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`Ağırlıklı Not Ortalaması: ${sonuc.ortalama.toFixed(2)} (Toplam ${sonuc.toplamKredi} kredi)`);
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
          Not Ortalaması Hesaplama Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              Hesaplamak istediğiniz her ders için ders notunuzu (100 üzerinden) ve o dersin kredisini (veya haftalık ders saatini) girin. Araç bu iki değeri çarparak ağırlıklı ortalamanızı hesaplayacaktır. Yeni ders satırları ekleyerek istediğiniz kadar ders girebilirsiniz.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Ağırlıklı Not Ortalaması Nedir?</h4>
            <p>
              Ağırlıklı not ortalaması, aldığınız notların sadece toplanıp derse bölünmesi değil, her dersin kredisinin (zorluk derecesi veya haftalık saati) de hesaba katılarak ortalamaya etki ettiği daha adil ve doğru bir hesaplama sistemidir. Kredisi yüksek olan ders, ortalamayı daha çok etkiler.
            </p>
          </section>

          <div className="pt-2">
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Kullanılan Formüller:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  Ağırlıklı Not = (Ders Notu) x (Kredi)<br/>
                  Ağırlıklı Ortalama = (Tüm Ağırlıklı Notların Toplamı) / (Toplam Kredi)
                </div>
              </div>
            </div>
          </div>
          
          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Harf notu sistemi kullanılıyorsa nasıl hesaplarım?</h5>
                <p>Üniversitenizin yönetmeliğine göre harf notlarının 100 üzerinden veya 4'lük sistem üzerinden karşılıklarını not alanına yazabilirsiniz (Örnek: AA = 4, BA = 3.5 gibi).</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <RelatedTools category="egitim" currentToolId="not-ortalamasi-hesaplama" />
      <Disclaimer category="egitim" />
    </div>
  );
}
