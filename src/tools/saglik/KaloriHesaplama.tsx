import React, { useState } from 'react';
import { ChevronRight, RefreshCw, Copy, Check, Info, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToolIcon } from '../../components/icons/ToolIcon';
import { AdSlot } from '../../components/ads/AdSlot';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { RelatedTools } from '../../components/tools/RelatedTools';

export default function KaloriHesaplama() {
  const [cinsiyet, setCinsiyet] = useState<'kadin' | 'erkek'>('erkek');
  const [yas, setYas] = useState<number | ''>('');
  const [boy, setBoy] = useState<number | ''>('');
  const [kilo, setKilo] = useState<number | ''>('');
  const [aktivite, setAktivite] = useState<number>(1.2);
  const [copied, setCopied] = useState<boolean>(false);
  
  const [sonuc, setSonuc] = useState<{
    bmr: number;
    gunluk: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hesapla = () => {
    if (yas === '' || boy === '' || kilo === '') {
      setError("*Lütfen yaş, boy ve kilo bilgilerinizi doldurun.");
      setSonuc(null);
      return;
    }
    if (yas <= 0 || boy <= 0 || kilo <= 0) {
      setError("*Değerler 0'dan büyük olmalıdır.");
      setSonuc(null);
      return;
    }
    
    setError(null);
    
    // Mifflin-St Jeor Formülü
    // Erkek: (10 x kilo) + (6.25 x boy) - (5 x yaş) + 5
    // Kadın: (10 x kilo) + (6.25 x boy) - (5 x yaş) - 161
    
    const weight = Number(kilo);
    const height = Number(boy);
    const age = Number(yas);
    
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    
    if (cinsiyet === 'erkek') {
      bmr += 5;
    } else {
      bmr -= 161;
    }
    
    const gunluk = bmr * aktivite;

    setSonuc({
      bmr,
      gunluk
    });
  };

  const temizle = () => {
    setCinsiyet('erkek');
    setYas('');
    setBoy('');
    setKilo('');
    setAktivite(1.2);
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
        <span className="text-slate-800 dark:text-slate-300">Kalori Hesaplama</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Günlük Kalori İhtiyacı Hesaplama 2026 - Ücretsiz ve Hızlı Sonuçlar</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Kilonuzu korumak, kilo vermek veya almak için almanız gereken günlük kalori miktarını hesaplayın.
        </p>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      <div className="calculator-container mb-8 relative border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-8 mt-8">
        <div className="absolute -top-3.5 left-4 sm:left-8 bg-[#eef2f7] dark:bg-slate-950 px-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ToolIcon name="saglik" size={20} className="text-[#0056b3] dark:text-blue-400" />
            Kalori Hesaplayıcı
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                Bilgileriniz
              </h2>
              <button onClick={temizle} className="text-[12px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1.5 transition-colors">
                <RefreshCw size={12} /> Temizle
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mb-6">
              <button 
                onClick={() => setCinsiyet('erkek')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors border ${cinsiyet === 'erkek' ? 'bg-[#0056b3] text-white border-[#0056b3]' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-black/10 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >
                Erkek
              </button>
              <button 
                onClick={() => setCinsiyet('kadin')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors border ${cinsiyet === 'kadin' ? 'bg-[#0056b3] text-white border-[#0056b3]' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-black/10 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >
                Kadın
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl flex items-center gap-3 text-sm font-semibold border border-rose-100 dark:border-rose-800">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div className="flex flex-wrap sm:flex-nowrap gap-4">
                <div className="flex-1 w-full sm:w-auto">
                  <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                    Yaşınız <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="number" 
                    value={yas}
                    onChange={(e) => {
                      setYas(e.target.value === '' ? '' : Number(e.target.value));
                      setError(null);
                    }}
                    placeholder="Örn: 25" 
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all"
                  />
                </div>
                <div className="flex-1 w-full sm:w-auto">
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

              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  Hareket Seviyeniz <span className="text-red-500">*</span>
                </label>
                <select
                  value={aktivite}
                  onChange={(e) => setAktivite(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all"
                >
                  <option value={1.2}>Masa başı (Çok az veya hiç egzersiz)</option>
                  <option value={1.375}>Hafif aktif (Haftada 1-3 gün egzersiz)</option>
                  <option value={1.55}>Orta aktif (Haftada 3-5 gün egzersiz)</option>
                  <option value={1.725}>Çok aktif (Haftada 6-7 gün ağır egzersiz)</option>
                  <option value={1.9}>Ekstra aktif (Çok ağır fiziksel iş/çift idman)</option>
                </select>
              </div>
              
              <button onClick={hesapla} className="w-full bg-[#0056b3] hover:bg-[#004494] text-white font-bold rounded-xl py-3.5 mt-2 transition-all shadow-sm active:scale-[0.98]">
                Hesapla
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 md:p-8 flex-1 relative overflow-hidden shadow-lg border border-black/5 dark:border-slate-800">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 dark:bg-orange-500/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8 opacity-90">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-white">Sonuçlar</h3>
                </div>

                <div className="flex-1 flex flex-col justify-center gap-6">
                  {sonuc !== null ? (
                    <>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs mb-1 font-bold uppercase">Bazal Metabolizma Hızı (BMR)</p>
                        <div className="text-2xl font-black tracking-tighter text-slate-800 dark:text-white">
                          {sonuc.bmr.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} <span className="text-lg text-slate-500">kcal/gün</span>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-black/10 dark:border-white/10">
                        <p className="text-slate-500 dark:text-slate-400 text-xs mb-1 font-bold uppercase">Korumak İçin Günlük İhtiyacınız</p>
                        <div className="text-4xl font-black tracking-tighter text-[#0056b3] dark:text-blue-400">
                          {sonuc.gunluk.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} <span className="text-2xl text-slate-500">kcal</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10 space-y-2">
                         <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Kilo vermek için (-500)</span>
                            <span className="font-bold">{(sonuc.gunluk - 500).toLocaleString('tr-TR', { maximumFractionDigits: 0 })} kcal</span>
                         </div>
                         <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">Kilo almak için (+500)</span>
                            <span className="font-bold">{(sonuc.gunluk + 500).toLocaleString('tr-TR', { maximumFractionDigits: 0 })} kcal</span>
                         </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-slate-400">Bilgilerinizi girerek kalori ihtiyacınızı öğrenin.</div>
                  )}
                </div>

                {sonuc !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`Günlük Kalori İhtiyacı: ${Math.round(sonuc.gunluk)} kcal (BMR: ${Math.round(sonuc.bmr)} kcal)`);
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
          Kalori Hesaplama Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              Cinsiyet, yaş, boy, kilo ve günlük aktivite seviyenizi seçtikten sonra "Hesapla" düğmesine basın. Araç, kilonuzu korumanız için gereken kalori miktarını, ayrıca kilo vermek veya almak için uygulamanız gereken ortalama kalori hedeflerini size gösterecektir.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Günlük Kalori İhtiyacı Nedir?</h4>
            <p>
              Günlük kalori ihtiyacı, vücudunuzun temel yaşamsal fonksiyonlarını sürdürmesi için gereken enerji (BMR) ile gün içerisindeki fiziksel aktivitelerinizde harcadığınız enerjinin toplamıdır.
            </p>
          </section>

          <div className="pt-2">
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Kullanılan Formüller (Mifflin-St Jeor):</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  Erkek BMR = (10 x Ağırlık) + (6.25 x Boy) - (5 x Yaş) + 5<br/>
                  Kadın BMR = (10 x Ağırlık) + (6.25 x Boy) - (5 x Yaş) - 161<br/>
                  Günlük İhtiyaç = BMR x Aktivite Katsayısı
                </div>
              </div>
            </div>
          </div>
          
          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Sağlıklı kilo vermek için günde kaç kalori açığı yaratmalıyım?</h5>
                <p>Genellikle haftada 0.5 kg verebilmek için günlük kalori ihtiyacınızdan ortalama 500 kcal kesmeniz önerilir. Daha hızlı kilo vermek için kalori açığı çok büyütülürse kas kaybı yaşanabilir, uzman görüşü alınması önerilir.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <RelatedTools category="saglik" currentToolId="kalori-hesaplama" />
      <Disclaimer category="saglik" />
    </div>
  );
}
