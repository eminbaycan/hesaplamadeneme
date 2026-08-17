import React, { useState } from 'react';
import { ChevronRight, RefreshCw, Copy, Info, LineChart, AlertCircle, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdSlot } from '../../components/ads/AdSlot';
import { RelatedTools } from '../../components/tools/RelatedTools';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { ToolIcon } from '../../components/icons/ToolIcon';

export default function HisseSenediMaliyetiHesaplama() {
  const [alisFiyati, setAlisFiyati] = useState<number | ''>('');
  const [lotSayisi, setLotSayisi] = useState<number | ''>('');
  const [guncelFiyat, setGuncelFiyat] = useState<number | ''>('');
  const [komisyonOrani, setKomisyonOrani] = useState<number | ''>('');
  const [sonuc, setSonuc] = useState<{
    toplamMaliyet: number;
    guncelDeger: number;
    netKarZarar: number;
    getiriYuzdesi: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCalculate = () => {
    if (alisFiyati === '' || lotSayisi === '' || guncelFiyat === '') {
      setError('*Lütfen alış fiyatı, lot sayısı ve güncel fiyat alanlarını doldurun.');
      setSonuc(null);
      return;
    }
    setError(null);

    const alis = Number(alisFiyati);
    const lot = Number(lotSayisi);
    const guncel = Number(guncelFiyat);
    const komisyon = komisyonOrani === '' ? 0 : Number(komisyonOrani);

    const brutMaliyet = alis * lot;
    const komisyonTutar = (brutMaliyet * (komisyon / 100));
    const toplamMaliyet = brutMaliyet + komisyonTutar;

    const brutDeger = guncel * lot;
    const satisKomisyon = brutDeger * (komisyon / 100);
    const netSatisDegeri = brutDeger - satisKomisyon;

    const netKarZarar = netSatisDegeri - toplamMaliyet;
    const getiriYuzdesi = (netKarZarar / toplamMaliyet) * 100;

    setSonuc({
      toplamMaliyet,
      guncelDeger: netSatisDegeri,
      netKarZarar,
      getiriYuzdesi
    });
  };

  const handleClear = () => {
    setAlisFiyati('');
    setLotSayisi('');
    setGuncelFiyat('');
    setKomisyonOrani('');
    setSonuc(null);
    setError(null);
  };

  const handleCopy = () => {
    if (!sonuc) return;
    const text = `Toplam Maliyet: ${sonuc.toplamMaliyet.toFixed(2)} ₺ | Net Kâr/Zarar: ${sonuc.netKarZarar.toFixed(2)} ₺ (%${sonuc.getiriYuzdesi.toFixed(2)})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* 1. BREADCRUMB */}
      <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <Link to="/" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Ana Sayfa</Link>
        <ChevronRight size={14} />
        <Link to="/kategori/finans" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors capitalize">Finans</Link>
        <ChevronRight size={14} />
        <span className="text-slate-800 dark:text-slate-300">Hisse Senedi Kâr / Zarar Hesaplama</span>
      </div>

      {/* 2. BAŞLIK VE AÇIKLAMA */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Hisse Senedi Kâr / Zarar Hesaplama 2026 - Ücretsiz ve Hızlı Sonuçlar</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Alış fiyatı, lot sayısı, güncel fiyat ve komisyon oranları ile borsa yatırımınızın net kâr ve zarar durumunu hesaplayın.
        </p>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      {/* HESAPLAMA ARACI KAPSAYICISI */}
      <div className="calculator-container mb-8 relative border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-8 mt-8">
        <div className="absolute -top-3.5 left-4 sm:left-8 bg-[#eef2f7] dark:bg-slate-950 px-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ToolIcon name="finans" size={20} className="text-[#0056b3] dark:text-blue-400" />
            Borsa İşlem Hesaplayıcı
          </h2>
        </div>

        {/* 3. ANA UYGULAMA ALANI */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          
          {/* SOL: Girdi Formu */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                İşlem Detayları
              </h2>
              <button 
                onClick={handleClear}
                className="text-[12px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                    Alış Fiyatı (TL) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={alisFiyati}
                    onChange={(e) => {
                      setAlisFiyati(e.target.value === '' ? '' : Number(e.target.value));
                      setError(null);
                    }}
                    placeholder="Örn: 125.50" 
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                    Lot / Adet <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="number" 
                    value={lotSayisi}
                    onChange={(e) => {
                      setLotSayisi(e.target.value === '' ? '' : Number(e.target.value));
                      setError(null);
                    }}
                    placeholder="Örn: 500" 
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                    Güncel / Hedef Fiyat (TL) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={guncelFiyat}
                    onChange={(e) => {
                      setGuncelFiyat(e.target.value === '' ? '' : Number(e.target.value));
                      setError(null);
                    }}
                    placeholder="Örn: 150.00" 
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                    Komisyon Oranı (%)
                  </label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={komisyonOrani}
                    onChange={(e) => {
                      setKomisyonOrani(e.target.value === '' ? '' : Number(e.target.value));
                      setError(null);
                    }}
                    placeholder="Örn: 0.2" 
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <button 
                onClick={handleCalculate}
                className="w-full bg-[#0056b3] hover:bg-[#004494] text-white font-bold rounded-xl py-3.5 mt-2 transition-all shadow-sm active:scale-[0.98] cursor-pointer">
                Kâr / Zarar Hesapla
              </button>
            </div>
          </div>

          {/* SAĞ: Sonuç Paneli */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 md:p-8 flex-1 relative overflow-hidden shadow-lg border border-black/5 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-white mb-6">İşlem Özeti</h3>

                {sonuc !== null ? (
                  <div className="space-y-4 mb-6">
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">Toplam Maliyet (Komisyon Dahil)</span>
                      <div className="text-xl font-bold text-slate-800 dark:text-white">
                        {sonuc.toplamMaliyet.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">Net Satış / Güncel Değer</span>
                      <div className="text-xl font-bold text-slate-800 dark:text-white">
                        {sonuc.guncelDeger.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">Net Kâr / Zarar</span>
                      <div className={`text-2xl font-black ${sonuc.netKarZarar >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {sonuc.netKarZarar >= 0 ? '+' : ''}{sonuc.netKarZarar.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺ 
                        <span className="text-sm ml-2 font-bold">({sonuc.getiriYuzdesi >= 0 ? '+' : ''}%{sonuc.getiriYuzdesi.toFixed(2)})</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400 text-sm">
                    Hisse senedi bilgilerini girip hesapla butonuna tıklayın.
                  </div>
                )}
              </div>

              <div>
                <button 
                  onClick={handleCopy}
                  disabled={sonuc === null}
                  className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white border border-black/5 dark:border-transparent font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all backdrop-blur-sm disabled:opacity-50 cursor-pointer">
                  <Copy size={16} /> {copied ? 'Kopyalandı!' : 'Sonucu Kopyala'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      {/* 4. SEO & BİLGİLENDİRME ALANI (SSS, Açıklama, Formül) */}
      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Hisse Senedi Kâr / Zarar Hesaplama Rehberi ve Sıkça Sorulan Sorular
        </h3>

        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-6 leading-relaxed">
          <div>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-2">Borsa İşlemlerinde Maliyet Nasıl Hesaplanır?</h4>
            <p>
              Hisse senedi yatırımlarında toplam maliyet, satın alınan lot adeti ile alış fiyatının çarpımına aracı kurum komisyon kesintilerinin eklenmesiyle bulunur. Satış aşamasında da komisyon düşülerek net kazanç hesaplanır.
            </p>
          </div>

          <div className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Kullanılan Formül</h4>
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Kâr / Zarar Hesaplama Formülü:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  Toplam Maliyet = (Alış Fiyatı × Lot Sayısı) + Komisyonlar <br />
                  Net Satış = (Güncel Fiyat × Lot Sayısı) - Komisyonlar <br />
                  Net Kâr/Zarar = Net Satış - Toplam Maliyet
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular</h4>
            <div className="space-y-4">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Komisyon oranları getiriyi nasıl etkiler?</h5>
                <p>Yüksek işlem sıklığı (AL-SAT) yapılan durumlarda aracı kurum komisyonları maliyeti artırarak net kâr oranını düşürebilir; bu nedenle düşük komisyonlu aracı kurumlar tercih edilmelidir.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. BENZER ARAÇLAR */}
      
      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Hisse Senedi Kâr / Zarar Hesaplama Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              Hisse Senedi Kâr / Zarar Hesaplama aracını kullanmak son derece basit ve kullanıcı dostudur. İlgili form alanlarına elinizdeki verileri eksiksiz ve doğru bir şekilde girdiğinizden emin olun. Tüm alanları doldurduktan sonra "Hesapla" butonuna tıklayarak sonuçları anında görüntüleyebilirsiniz. Aracımız, girdiğiniz değerleri anlık olarak işler ve herhangi bir sayfaya yönlendirme yapmadan, bulunduğunuz ekran üzerinde size en net ve kesin verileri sunar. İhtiyaç duyduğunuz her an bu aracı tamamen ücretsiz olarak kullanabilir, dilerseniz sonuçları kopyalayarak farklı platformlarda kolayca paylaşabilirsiniz. Zaman kaybetmeden, en karmaşık hesaplamaları bile saniyeler içinde tamamlamanın ayrıcalığını yaşayın.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Hisse Senedi Kâr / Zarar Hesaplama Nedir ve Nasıl Hesaplanır?</h4>
            <p>
              Hisse Senedi Kâr / Zarar Hesaplama, kullanıcıların günlük hayatta veya profesyonel iş süreçlerinde sıklıkla ihtiyaç duyduğu matematiksel veya istatistiksel hesaplamaları pratik bir şekilde çözmek amacıyla geliştirilmiş kapsamlı bir dijital araçtır. Geleneksel yöntemlerle yapıldığında hata payı yüksek olan ve uzun zaman alan bu tür işlemler, gelişmiş altyapımız sayesinde otomatik olarak hatasız bir biçimde gerçekleştirilir. 
            </p>
            <p className="mt-4">
              Hesaplama arka planda, genel kabul görmüş evrensel formüller, en güncel yasal mevzuatlar veya resmi olarak açıklanmış standart oranlar kullanılarak yapılmaktadır. Veriler sisteme girildiği anda, algoritma bu güncel parametreleri referans alarak verilerinizi analiz eder ve sonuçları net bir şekilde ekranınıza yansıtır. Finansal, istatistiksel veya gündelik hesaplamalar fark etmeksizin her daim doğru ve güvenilir bilgiye ulaşmanız hedeflenmektedir. Bu aracı kullanarak iş akışınızı hızlandırabilir ve hata payını sıfıra indirebilirsiniz.
            </p>
          </section>

          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular (SSS)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Hisse Senedi Kâr / Zarar Hesaplama aracı ücretli midir?</h5>
                <p>Hayır, platformumuzda yer alan bu araç dahil tüm hesaplama ve sorgulama araçlarımız tamamen ücretsizdir. Herhangi bir üyelik oluşturmadan veya gizli bir ücret ödemeden dilediğiniz kadar işlem yapabilir, sonuçlarınızı anında görüntüleyebilirsiniz.</p>
              </div>
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Hesaplama sonuçlarına ne kadar güvenebilirim?</h5>
                <p>Aracımız, güncel ve yasal düzenlemelere uygun evrensel formülleri temel alarak çalışır. Dolayısıyla girdiğiniz veriler doğru olduğu sürece, elde ettiğiniz sonuçlar da %100 oranında doğru ve güvenilirdir. Ancak, resmi ve bağlayıcı işlemlerinizde bir uzmana danışmanız her zaman tavsiye edilir.</p>
              </div>
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Girdiğim kişisel veya finansal veriler kaydediliyor mu?</h5>
                <p>Kesinlikle hayır. Gizliliğiniz bizim için en büyük önceliktir. Formlara girdiğiniz hiçbir değer veritabanımızda saklanmaz, sadece tarayıcınızın anlık belleğinde hesaplama yapmak amacıyla kullanılır. Sayfayı yenilediğinizde veya kapattığınızda tüm verileriniz silinir.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <RelatedTools category="finans" currentToolId="hisse-senedi-hesaplama" />

      {/* SORUMLULUK REDDİ */}
      <div className="mt-8">
        <Disclaimer category="finans" />
      </div>
    </div>
  );
}
