import React, { useState } from 'react';
import { ChevronRight, RefreshCw, Copy, Info, AlertCircle, Wind, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToolIcon } from '../../components/icons/ToolIcon';
import { AdSlot } from '../../components/ads/AdSlot';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { RelatedTools } from '../../components/tools/RelatedTools';

export default function KlimaBtuHesaplama() {
  const [alan, setAlan] = useState<number | ''>('');
  const [bolgeKatsayisi, setBolgeKatsayisi] = useState<number>(446); // Marmara / İç Anadolu ortalaması
  const [kisiSayisi, setKisiSayisi] = useState<number>(2);
  const [aydinlatmaGucu, setAydinlatmaGucu] = useState<number>(100);
  const [sonuc, setSonuc] = useState<{
    temelBtu: number;
    insanBtu: number;
    cihazBtu: number;
    toplamBtu: number;
    onerilenKlima: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCalculate = () => {
    if (alan === '' || Number(alan) <= 0) {
      setError('*Lütfen geçerli bir oda metrekaresi girin.');
      setSonuc(null);
      return;
    }
    setError(null);

    const m2 = Number(alan);
    // Temel formül: Alan (m2) x Bölge Katsayısı (BTU/m2)
    const temelBtu = m2 * bolgeKatsayisi;
    // Her ek kişi için 600 BTU
    const insanBtu = Math.max(0, kisiSayisi) * 600;
    // Aydınlatma ve elektronik cihazlar için ek BTU
    const cihazBtu = (aydinlatmaGucu * 3.412);
    const toplamBtu = Math.round(temelBtu + insanBtu + cihazBtu);

    let onerilenKlima = '9.000 BTU/h (Inverter)';
    if (toplamBtu > 24000) {
      onerilenKlima = '24.000+ BTU/h veya Çoklu Split (Multi)';
    } else if (toplamBtu > 18000) {
      onerilenKlima = '24.000 BTU/h';
    } else if (toplamBtu > 12000) {
      onerilenKlima = '18.000 BTU/h';
    } else if (toplamBtu > 9000) {
      onerilenKlima = '12.000 BTU/h';
    }

    setSonuc({
      temelBtu: Math.round(temelBtu),
      insanBtu,
      cihazBtu: Math.round(cihazBtu),
      toplamBtu,
      onerilenKlima
    });
  };

  const handleClear = () => {
    setAlan('');
    setBolgeKatsayisi(446);
    setKisiSayisi(2);
    setAydinlatmaGucu(100);
    setSonuc(null);
    setError(null);
    setCopied(false);
  };

  const handleCopy = () => {
    if (!sonuc) return;
    const text = `Klima Kapasite İhtiyacı: ${sonuc.toplamBtu.toLocaleString('tr-TR')} BTU/h | Önerilen Model: ${sonuc.onerilenKlima}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <Link to="/" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Ana Sayfa</Link>
        <ChevronRight size={14} />
        <Link to="/kategori/diger" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors capitalize">Diğer</Link>
        <ChevronRight size={14} />
        <span className="text-slate-800 dark:text-slate-300">Klima BTU Hesaplama</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Klima BTU Hesaplama 2026 - Oda Metrekaresine Göre Kapasite Belirleme</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Eviniz veya iş yeriniz için en uygun klima kapasitesini (BTU/h) oda metrekaresi, coğrafi bölge ve kişi sayısına göre kolayca hesaplayın.
        </p>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      <div className="calculator-container mb-8 relative border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-8 mt-8">
        <div className="absolute -top-3.5 left-4 sm:left-8 bg-[#eef2f7] dark:bg-slate-950 px-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ToolIcon name="diger" size={20} className="text-[#0056b3] dark:text-blue-400" />
            BTU Hesaplayıcı
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                Oda ve Çevre Bilgileri
              </h2>
              <button 
                onClick={handleClear}
                className="text-[12px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
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
              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  Oda Alanı (m²) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number"
                  value={alan}
                  onChange={(e) => {
                    setAlan(e.target.value === '' ? '' : Number(e.target.value));
                    setError(null);
                  }}
                  placeholder="Örn: 25"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  Coğrafi Bölge Katsayısı (BTU/m²)
                </label>
                <select
                  value={bolgeKatsayisi}
                  onChange={(e) => setBolgeKatsayisi(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all"
                >
                  <option value={500}>Akdeniz & Güneydoğu Anadolu (500 BTU/m²)</option>
                  <option value={470}>Ege Bölgesi (470 BTU/m²)</option>
                  <option value={446}>Marmara Bölgesi (446 BTU/m²)</option>
                  <option value={420}>İç Anadolu Bölgesi (420 BTU/m²)</option>
                  <option value={390}>Karadeniz Bölgesi (390 BTU/m²)</option>
                  <option value={360}>Doğu Anadolu Bölgesi (360 BTU/m²)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                    Odadaki Kişi Sayısı
                  </label>
                  <input 
                    type="number"
                    value={kisiSayisi}
                    onChange={(e) => setKisiSayisi(Number(e.target.value))}
                    min="1"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                    Aydınlatma / Cihaz (Watt)
                  </label>
                  <input 
                    type="number"
                    value={aydinlatmaGucu}
                    onChange={(e) => setAydinlatmaGucu(Number(e.target.value))}
                    min="0"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <button 
                onClick={handleCalculate}
                className="w-full bg-[#0056b3] hover:bg-[#004494] text-white font-bold rounded-xl py-3.5 mt-2 transition-all shadow-sm active:scale-[0.98] cursor-pointer"
              >
                Kapasiteyi Hesapla
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 md:p-8 flex-1 relative shadow-lg border border-black/5 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-white mb-6">Hesaplama Sonucu</h3>

                {sonuc !== null ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 text-xs mb-1 font-bold uppercase">Hesaplanan Net Kapasite</p>
                      <div className="text-3xl font-black tracking-tighter text-[#0056b3] dark:text-blue-400">
                        {sonuc.toplamBtu.toLocaleString('tr-TR')} <span className="text-lg font-bold text-slate-500">BTU/h</span>
                      </div>
                    </div>

                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-2xl">
                      <p className="text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase mb-1">Tavsiye Edilen Klima Segmenti</p>
                      <p className="text-lg font-extrabold text-emerald-800 dark:text-emerald-200">{sonuc.onerilenKlima}</p>
                    </div>

                    <div className="space-y-2 pt-2 text-xs text-slate-600 dark:text-slate-400 border-t border-black/5 dark:border-white/5">
                      <div className="flex justify-between">
                        <span>Oda Alanı İhtiyacı:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{sonuc.temelBtu.toLocaleString('tr-TR')} BTU</span>
                      </div>
                      <div className="flex justify-between">
                        <span>İnsan Isı Yükü:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">+{sonuc.insanBtu} BTU</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Aydınlatma & Cihaz Yükü:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">+{sonuc.cihazBtu} BTU</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 text-slate-400 text-sm">
                    Klima kapasite değerini görüntülemek için oda ölçülerinizi girin ve hesaplayın.
                  </div>
                )}
              </div>

              <button 
                onClick={handleCopy}
                disabled={!sonuc}
                className="w-full mt-6 bg-slate-50 hover:bg-slate-100 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                {copied ? 'Sonuç Kopyalandı!' : 'Sonucu Kopyala'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Klima Seçimi ve BTU Rehberi
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Doğru klima seçimi hem elektrik tasarrufu sağlar hem de cihazın ömrünü uzatır. Gereğinden küçük klima sürekli çalışarak fazla elektrik harcar; gereğinden büyük klima ise ortamı aşırı kurutabilir.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Klima BTU Hesaplama Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              Klima BTU Hesaplama aracımızı kullanmak oldukça basittir. İlk olarak klimayı monte edeceğiniz odanın net kullanım alanını metrekare (m²) cinsinden yazınız. Ardından bulunduğunuz coğrafi bölgeyi listeden seçiniz. Eğer odada düzenli olarak birden fazla kişi bulunuyorsa veya yüksek güç tüketen bilgisayar ve aydınlatma armatürleri varsa bu değerleri de ilgili kutucuklara ekleyiniz. "Kapasiteyi Hesapla" butonuna bastığınızda, mekanınızın toplam soğutma ve ısıtma gereksinimi olan BTU/h değeri ve satın almanız gereken ideal klima sınıfı anında listelenecektir.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Klima BTU Hesaplama Nedir ve Nasıl Hesaplanır?</h4>
            <p>
              BTU (British Thermal Unit), bir klimanın bir saat içerisinde ortamdan çekebileceği veya ortama verebileceği ısı miktarını ifade eden uluslararası enerji birimidir. Türkiye iklim koşullarında ortalama bir konut için metrekare başına yaklaşık 360 ile 500 BTU soğutma kapasitesi öngörülmektedir.
            </p>
            <p className="mt-4">
              Hesaplama sırasında alan katsayısının yanı sıra odanın baktığı cephe (güney, batı), pencere alanı, yalıtım kalitesi ve ortamda yaşayan insan sayısı da ısı yükü oluşturur. Formülümüzde her insan için ortalama +600 BTU, elektronik ve aydınlatma cihazlarının yaydığı her 1 Watt güç için yaklaşık +3.412 BTU ısı yükü hesaba katılmaktadır.
            </p>
          </section>

          <div className="pt-2">
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Kullanılan Formüller:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  Temel Kapasite (BTU) = Oda Alanı (m²) × Bölge Isı Katsayısı (BTU/m²) <br />
                  Toplam Kapasite = Temel Kapasite + (Kişi Sayısı × 600 BTU) + (Cihaz Gücü Watt × 3.412 BTU)
                </div>
              </div>
            </div>
          </div>

          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular (SSS)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Standart oda büyüklükleri için hangi klima modelleri uygundur?</h5>
                <p>Genellikle 10-18 m² odalar için 9.000 BTU, 18-28 m² odalar için 12.000 BTU, 28-40 m² salonlar için 18.000 BTU ve 40-55 m² geniş alanlar için 24.000 BTU kapasiteli klimalar tercih edilmektedir.</p>
              </div>
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Inverter klima ne anlama gelir ve avantajı nedir?</h5>
                <p>Inverter klimalar ortam sıcaklığını sabit tutmak için kompresör hızını otomatik olarak ayarlar; dur-kalk yapmadıkları için %30 ila %50 arasında elektrik tasarrufu sağlarlar.</p>
              </div>
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Klima BTU hesaplama aracı ücretsiz midir?</h5>
                <p>Evet, klima BTU kapasite hesaplama aracımız tamamen ücretsizdir ve sınırsız sayıda oda için hesaplama yapabilirsiniz.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <RelatedTools category="diger" currentToolId="klima-btu-hesaplama" />
      <div className="mt-8">
        <Disclaimer category="diger" />
      </div>
    </div>
  );
}
