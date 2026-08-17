import React, { useState } from 'react';
import { ChevronRight, RefreshCw, Copy, Info, AlertCircle, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToolIcon } from '../../components/icons/ToolIcon';
import { AdSlot } from '../../components/ads/AdSlot';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { RelatedTools } from '../../components/tools/RelatedTools';

export default function YuzdeHesaplama() {
  const [mode, setMode] = useState<'type1' | 'type2' | 'type3'>('type1');
  const [copied, setCopied] = useState<boolean>(false);
  const [deger1, setDeger1] = useState<number | ''>('');
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
    
    let result = 0;
    if (mode === 'type1') {
      // X sayısının %Y'si kaçtır? (deger1 = X, deger2 = Y)
      result = (Number(deger1) * Number(deger2)) / 100;
    } else if (mode === 'type2') {
      // X sayısı, Y sayısının yüzde kaçıdır? (deger1 = X, deger2 = Y)
      if (Number(deger2) === 0) {
        setError("*Bölen sayı (Y) 0 olamaz.");
        setSonuc(null);
        return;
      }
      result = (Number(deger1) / Number(deger2)) * 100;
    } else if (mode === 'type3') {
      // X'ten Y'ye değişim oranı (deger1 = X, deger2 = Y)
      if (Number(deger1) === 0) {
        setError("*Başlangıç değeri (X) 0 olamaz.");
        setSonuc(null);
        return;
      }
      result = ((Number(deger2) - Number(deger1)) / Number(deger1)) * 100;
    }
    
    setSonuc(result);
  };

  const temizle = () => {
    setDeger1('');
    setDeger2('');
    setSonuc(null);
    setError(null);
  };

  const handleModeChange = (newMode: 'type1' | 'type2' | 'type3') => {
    setMode(newMode);
    temizle();
  };

  const getLabel1 = () => {
    if (mode === 'type1') return "Sayı (X)";
    if (mode === 'type2') return "Kısmi Değer (X)";
    if (mode === 'type3') return "Başlangıç Değeri (X)";
    return "X";
  };

  const getLabel2 = () => {
    if (mode === 'type1') return "Yüzde Oranı (%Y)";
    if (mode === 'type2') return "Bütün / Temel Değer (Y)";
    if (mode === 'type3') return "Bitiş / Yeni Değer (Y)";
    return "Y";
  };

  const getSonucEtiketi = () => {
    if (mode === 'type1') return "Hesaplanan Değer";
    if (mode === 'type2') return "Yüzdelik Oran (%)";
    if (mode === 'type3') return "Değişim Oranı (%)";
    return "Sonuç";
  };

  const getSonucAnlami = () => {
    if (mode === 'type1') return "Girdiğiniz X sayısının, belirttiğiniz %Y kadar olan kısmının tam değeridir. Örneğin 100 liranın %20'si 20 liradır.";
    if (mode === 'type2') return "Girdiğiniz X değerinin, belirlediğiniz Y bütünü içerisindeki oransal yüzdesidir. Çıkan sonuç % (yüzde) cinsinden bir ifade belirtir.";
    if (mode === 'type3') {
      if (sonuc !== null && sonuc > 0) return "Bu sonuç, başlangıç değerinden bitiş değerine ne kadarlık bir YÜZDE ARTIŞ olduğunu gösterir.";
      if (sonuc !== null && sonuc < 0) return "Bu sonuç, başlangıç değerinden bitiş değerine ne kadarlık bir YÜZDE AZALIŞ olduğunu gösterir.";
      return "Başlangıç ve bitiş değerleri eşit olduğu için herhangi bir yüzde değişim olmamıştır (Sıfır Değişim).";
    }
    return "";
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* 1. BREADCRUMB */}
      <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <Link to="/" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Ana Sayfa</Link>
        <ChevronRight size={14} />
        <Link to="/kategori/matematik" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors capitalize">Matematik</Link>
        <ChevronRight size={14} />
        <span className="text-slate-800 dark:text-slate-300">Yüzde Hesaplama</span>
      </div>

      {/* 2. BAŞLIK VE AÇIKLAMA */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Yüzde Hesaplama 2026 - Ücretsiz ve Hızlı Sonuçlar</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Bir sayının yüzde değerini bulma, iki sayı arasındaki yüzde oranını hesaplama veya iki değer arasındaki yüzde değişim miktarını hızlı ve hatasız bir şekilde öğrenmek için bu hesaplama aracını kullanabilirsiniz.
        </p>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      {/* HESAPLAMA ARACI KAPSAYICISI */}
      <div className="calculator-container mb-8 relative border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-8 mt-8">
        <div className="absolute -top-3.5 left-4 sm:left-8 bg-[#eef2f7] dark:bg-slate-950 px-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ToolIcon name="yuzde" size={20} className="text-[#0056b3] dark:text-blue-400" />
            Yüzde Hesaplama
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
                Hesaplama Türü
              </h2>
              <button onClick={temizle} className="text-[12px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1.5 transition-colors">
                <RefreshCw size={12} /> Temizle
              </button>
            </div>

            {/* SEÇENEK BUTONLARI */}
            <div className="flex flex-col sm:flex-row gap-2 mb-6">
              <button 
                onClick={() => handleModeChange('type1')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors border ${mode === 'type1' ? 'bg-[#0056b3] text-white border-[#0056b3]' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-black/10 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >
                X'in %Y'si
              </button>
              <button 
                onClick={() => handleModeChange('type2')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors border ${mode === 'type2' ? 'bg-[#0056b3] text-white border-[#0056b3]' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-black/10 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >
                X, Y'nin % Kaçı?
              </button>
              <button 
                onClick={() => handleModeChange('type3')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors border ${mode === 'type3' ? 'bg-[#0056b3] text-white border-[#0056b3]' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-black/10 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >
                Yüzde Değişim
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
                  {getLabel1()} <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  value={deger1}
                  onChange={(e) => {
                    setDeger1(e.target.value === '' ? '' : Number(e.target.value));
                    setError(null);
                  }}
                  placeholder="Örn: 100" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  {getLabel2()} <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  value={deger2}
                  onChange={(e) => {
                    setDeger2(e.target.value === '' ? '' : Number(e.target.value));
                    setError(null);
                  }}
                  placeholder="Örn: 20" 
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
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-1 font-medium">{getSonucEtiketi()}</p>
                  <div className="text-5xl font-black tracking-tighter mb-4 text-slate-900 dark:text-white flex items-baseline gap-1">
                    {sonuc !== null ? sonuc.toLocaleString('tr-TR', { maximumFractionDigits: 4 }) : '---'}
                    {sonuc !== null && (mode === 'type2' || mode === 'type3') && <span className="text-2xl text-slate-500">%</span>}
                  </div>
                  
                  {sonuc !== null && (
                    <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-black/5 dark:border-white/5">
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-sm">Bu sonuç ne anlama gelir?</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {getSonucAnlami()}
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

      {/* 4. SEO & BİLGİLENDİRME ALANI */}
      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Yüzde Hesaplama Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              Yüzde hesaplama aracımız, finansal işlemlerinizde, okul ödevlerinizde ya da ticari oran hesaplamalarınızda zaman kazanmanız için üç farklı kullanım modülü sunar. Hesaplama yapmak için öncelikle sol üst kısımdan ihtiyacınız olan işlemi seçiniz. Daha sonra sistemin sizden istediği ilgili sayısal değerleri boş kutucuklara giriniz ve "Hesapla" butonuna basınız. Tüm sonuçlar saniyeler içerisinde oluşturularak açıklamasıyla birlikte sağ taraftaki sonuç ekranına yansıyacaktır.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Yüzde Hesaplama Nedir ve Nasıl Hesaplanır?</h4>
            <p>
              "Yüzde", bir bütünü 100 eş parçaya bölerek o parçalardan kaç tanesiyle ilgilendiğimizi belirten çok temel bir matematiksel kavramdır. Hayatımızın birçok alanında; alışverişte yapılan indirimleri anlamada, vergilerin maaşlarımıza yansımasında, bankaların uyguladığı faiz oranlarında karşımıza çıkar. <br /><br />
              Örneğin, bir mağazada 500 TL'lik bir ürüne %20 indirim yapılması demek, ürün fiyatının her 100 biriminde 20 birimlik bir azalma olacağı anlamına gelir. İşlem yaparken (500 x 20) / 100 formülü kullanılır. Benzer şekilde, bir kârın bir önceki yıla göre %30 artması veya bir değerin başka bir değere oranla yüzde kaçlık pay kapladığının bulunması yine yüzdelik dilim formülleri ile ifade edilir.
            </p>
          </section>

          <div className="pt-2">
            <div className="space-y-6 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">X sayısının %Y'si formülü:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  Sonuç = (X * Y) / 100
                </div>
              </div>
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">X, Y'nin yüzde kaçıdır formülü:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  Sonuç = (X / Y) * 100
                </div>
              </div>
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">X'ten Y'ye yüzde değişim oranı:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  Sonuç = ((Y - X) / X) * 100
                </div>
              </div>
            </div>
          </div>
          
          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Kullanılan Formüller</h4>
            <div className="space-y-6 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5 mb-6">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Yüzde Formülü:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  A'nın %B'si = (A x B) / 100
                </div>
              </div>
            </div>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Maaş zam oranımı nasıl hesaplayabilirim?</h5>
                <p>Eski maaşınızı ve zamlı yeni maaşınızı biliyorsanız, "Yüzde Değişim" sekmesini kullanın. Başlangıç değerine eski maaşınızı, bitiş değerine yeni maaşınızı yazın. Çıkan sonuç size tam zam oranınızı verecektir.</p>
              </div>
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">İndirimli ürün fiyatı nasıl hesaplanır?</h5>
                <p>"X'in %Y'sini Bul" hesaplama modülünü kullanmalısınız. X değerine ürünün indirimsiz (gerçek) fiyatını, Y değerine ise mağazanın sunduğu indirim oranını yazın. Çıkan sonuç, indirim miktarını gösterir. Bu rakamı gerçek fiyattan çıkartarak ödeme tutarını bulursunuz.</p>
              </div>
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Yüzde hesaplama işlemi nerelerde kullanılır?</h5>
                <p>Ekonomi, muhasebe, bankacılık, kripto para piyasaları, borsa artış/azalış oranları, anket değerlendirmeleri, öğrenci başarı yüzdeleri ve aklınıza gelebilecek istatistik tutulan neredeyse her sektörde aktif olarak kullanılır.</p>
              </div>
            </div>
          </section>
          
        </div>
      </div>

      <RelatedTools category="matematik" currentToolId="yuzde-hesaplama" />
      <Disclaimer category="matematik" />
    </div>
  );
}
