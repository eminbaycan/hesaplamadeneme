import React, { useState } from 'react';
import { ChevronRight, RefreshCw, Copy, Info, AlertCircle, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToolIcon } from '../../components/icons/ToolIcon';
import { AdSlot } from '../../components/ads/AdSlot';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { RelatedTools } from '../../components/tools/RelatedTools';

export default function ToplamaHesaplama() {
  const [deger1, setDeger1] = useState<number | ''>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [deger2, setDeger2] = useState<number | ''>('');
  const [sonuc, setSonuc] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hesapla = () => {
    if (deger1 === '' || deger2 === '') {
      setError("*Lütfen tüm alanları doldurun.");
      setSonuc(null);
      return;
    }
    setError(null);
    
    setSonuc(Number(deger1) + Number(deger2));
  };

  const temizle = () => {
    setDeger1('');
    setDeger2('');
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
        <span className="text-slate-800 dark:text-slate-300">Toplama Hesaplama</span>
      </div>

      {/* 2. BAŞLIK VE AÇIKLAMA */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Toplama Hesaplama 2026 - Ücretsiz ve Hızlı Sonuçlar</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          İki veya daha fazla sayıyı hızlı, hatasız ve pratik bir şekilde toplamak için bu aracı kullanabilirsiniz.
        </p>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      {/* HESAPLAMA ARACI KAPSAYICISI */}
      <div className="calculator-container mb-8 relative border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-8 mt-8">
        <div className="absolute -top-3.5 left-4 sm:left-8 bg-[#eef2f7] dark:bg-slate-950 px-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ToolIcon name="toplama" size={20} className="text-[#0056b3] dark:text-blue-400" />
            Toplama Hesaplama
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
                  1. Sayı <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  value={deger1}
                  onChange={(e) => {
                    setDeger1(e.target.value === '' ? '' : Number(e.target.value));
                    setError(null);
                  }}
                  placeholder="Örn: 150" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  2. Sayı <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  value={deger2}
                  onChange={(e) => {
                    setDeger2(e.target.value === '' ? '' : Number(e.target.value));
                    setError(null);
                  }}
                  placeholder="Örn: 350" 
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
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-1 font-medium">Toplam Sonuç</p>
                  <div className="text-5xl font-black tracking-tighter mb-4 text-slate-900 dark:text-white">
                    {sonuc !== null ? sonuc.toLocaleString('tr-TR', { maximumFractionDigits: 4 }) : '---'}
                  </div>
                  
                  {sonuc !== null && (
                    <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-black/5 dark:border-white/5">
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-sm">Bu sonuç ne anlama gelir?</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Girdiğiniz iki sayının (değerin) birbirine eklenmesiyle elde edilen matematiksel büyüklüğü ifade eder. Günlük hayatta harcamaların birleştirilmesi veya puanların toplanması mantığıyla aynıdır.
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

      {/* 4. SEO & BİLGİLENDİRME ALANI (MİNİMUM 300-500 KELİME) */}
      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Toplama İşlemi Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          
          {/* NASIL KULLANILIR - 75-100 KELİME */}
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              Toplama hesaplama aracını kullanmak oldukça basittir. Aracın girdi paneline toplamak istediğiniz birinci sayıyı ve ikinci sayıyı ilgili kutucuklara yazın. Ardından "Hesapla" butonuna basın. Araç anında girdiğiniz değerleri işleyecek ve sonucu sağ taraftaki veya alt kısımdaki sonuç panelinde gösterecektir. İhtiyaç duymanız halinde çıkan sonucu tek tıkla panoya kopyalayabilir ve farklı işlemlerde kullanabilirsiniz. Yeni bir işlem yapmak için "Temizle" butonunu kullanabilirsiniz.
            </p>
          </section>

          {/* NEDİR VE NASIL HESAPLANIR - 150-200 KELİME */}
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Toplama İşlemi Nedir ve Nasıl Hesaplanır?</h4>
            <p>
              Toplama işlemi, matematikteki en temel dört aritmetik işlemden (toplama, çıkarma, çarpma, bölme) biridir. İki veya daha fazla sayının (niceliğin) birbirine eklenerek, toplam veya bütün olan yeni bir değerin elde edilmesi sürecidir. Günlük yaşantımızda nesneleri sayarken, market alışverişinde tutarları hesaplarken, finansal verileri veya zaman dilimlerini birleştirirken toplama işlemini kullanırız. 
              <br/><br/>
              Matematiksel olarak "artı" (+) sembolü ile ifade edilir. Toplanan sayılara "toplanan", elde edilen sonuca ise "toplam" denir. Sayıların toplanma sırasının değişmesi, çıkan sonucu değiştirmez (değişme özelliği). Örneğin, 5 ile 3'ü toplamak (5 + 3 = 8) ile 3 ile 5'i toplamak (3 + 5 = 8) aynı sonucu verir. Aracımız bu temel mantığı kullanarak, büyük haneli sayılar veya ondalıklı (virgüllü) sayılar dahil olmak üzere tüm değerleri milisaniyeler içerisinde birleştirip sıfır hata payı ile size sunar.
            </p>
          </section>

          {/* KULLANILAN FORMÜLLER (Opsiyonel) */}
          <div className="pt-2">
            <div className="space-y-6 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Toplama Formülü:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  Toplam = Sayı 1 + Sayı 2
                </div>
              </div>
            </div>
          </div>
          
          {/* SSS - 100-150 KELİME */}
          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Toplama işleminde virgüllü (ondalıklı) sayıları kullanabilir miyim?</h5>
                <p>Evet, hesaplama aracımız ondalıklı (virgüllü) sayıları da desteklemektedir. Örnek olarak 15.5 ile 20.2 değerlerini girdiğinizde sistem bunu kusursuz bir şekilde toplayarak 35.7 sonucunu verecektir.</p>
              </div>
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Toplama işleminde eksi (negatif) sayılar toplanır mı?</h5>
                <p>Elbette. Negatif sayıları da araca girebilirsiniz. Sistem matematiksel kurallara uygun olarak hareket eder. Örneğin, -5 ve 10 sayılarını topladığınızda sonuç +5 çıkacaktır; negatif iki sayı toplanırsa sonuç yine negatif çıkacaktır.</p>
              </div>
            </div>
          </section>
          
        </div>
      </div>

      {/* 5. DİĞER ARAÇLAR */}
      <RelatedTools category="matematik" currentToolId="toplama-hesaplama" />

      {/* 6. SORUMLULUK REDDİ */}
      <Disclaimer category="matematik" />
    </div>
  );
}
