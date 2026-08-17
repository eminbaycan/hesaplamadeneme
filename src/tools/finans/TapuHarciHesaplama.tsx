import React, { useState } from 'react';
import { ChevronRight, RefreshCw, Copy, Info, Home, AlertCircle, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdSlot } from '../../components/ads/AdSlot';
import { RelatedTools } from '../../components/tools/RelatedTools';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { ToolIcon } from '../../components/icons/ToolIcon';

export default function TapuHarciHesaplama() {
  const [gayrimenkulBedeli, setGayrimenkulBedeli] = useState<number | ''>('');
  const [tarafOrani, setTarafOrani] = useState<string>('yari-yariya'); // %2 alıcı + %2 satıcı = %4 toplam
  const [sonuc, setSonuc] = useState<{
    toplamHarci: number;
    aliciOdemesi: number;
    saticiOdemesi: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCalculate = () => {
    if (gayrimenkulBedeli === '') {
      setError('*Lütfen gayrimenkul satış bedelini doldurun.');
      setSonuc(null);
      return;
    }
    setError(null);

    const bedel = Number(gayrimenkulBedeli);
    // Toplam tapu harcı %4 (Yasal oran: %2 alıcı, %2 satıcı)
    const toplamHarci = bedel * 0.04;

    let aliciOdemesi = toplamHarci / 2;
    let saticiOdemesi = toplamHarci / 2;

    if (tarafOrani === 'tamamini-alici') {
      aliciOdemesi = toplamHarci;
      saticiOdemesi = 0;
    } else if (tarafOrani === 'tamamini-satici') {
      aliciOdemesi = 0;
      saticiOdemesi = toplamHarci;
    }

    setSonuc({
      toplamHarci,
      aliciOdemesi,
      saticiOdemesi
    });
  };

  const handleClear = () => {
    setGayrimenkulBedeli('');
    setTarafOrani('yari-yariya');
    setSonuc(null);
    setError(null);
  };

  const handleCopy = () => {
    if (!sonuc) return;
    const text = `Toplam Tapu Harcı: ${sonuc.toplamHarci.toFixed(2)} ₺ | Alıcı: ${sonuc.aliciOdemesi.toFixed(2)} ₺`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <Link to="/" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Ana Sayfa</Link>
        <ChevronRight size={14} />
        <Link to="/kategori/finans" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors capitalize">Finans</Link>
        <ChevronRight size={14} />
        <span className="text-slate-800 dark:text-slate-300">Tapu Harcı ve Masraf Hesaplama</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Tapu Harcı ve Masraf Hesaplama 2026 - Ücretsiz ve Hızlı Sonuçlar</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Gayrimenkul alım satım işlemlerinde ödenmesi gereken %4'lük yasal tapu harcını alıcı ve satıcı payına göre hesaplayın.
        </p>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      <div className="calculator-container mb-8 relative border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-8 mt-8">
        <div className="absolute -top-3.5 left-4 sm:left-8 bg-[#eef2f7] dark:bg-slate-950 px-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ToolIcon name="finans" size={20} className="text-[#0056b3] dark:text-blue-400" />
            Tapu Hesaplayıcı
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Gayrimenkul Bilgileri</h2>
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
              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  Tapu Beyan Bedeli (TL) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  value={gayrimenkulBedeli}
                  onChange={(e) => {
                    setGayrimenkulBedeli(e.target.value === '' ? '' : Number(e.target.value));
                    setError(null);
                  }}
                  placeholder="Örn: 2500000" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  Harç Ödeme Paylaşımı
                </label>
                <select
                  value={tarafOrani}
                  onChange={(e) => setTarafOrani(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 cursor-pointer"
                >
                  <option value="yari-yariya">Yarı Yarıya (%2 Alıcı + %2 Satıcı)</option>
                  <option value="tamamini-alici">Tamamını Alıcı Öder (%4)</option>
                  <option value="tamamini-satici">Tamamını Satıcı Öder (%4)</option>
                </select>
              </div>

              <button 
                onClick={handleCalculate}
                className="w-full bg-[#0056b3] hover:bg-[#004494] text-white font-bold rounded-xl py-3.5 mt-2 transition-all cursor-pointer">
                Tapu Harcını Hesapla
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 md:p-8 flex-1 relative shadow-lg border border-black/5 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-white mb-6">Harç Özeti</h3>

                {sonuc !== null ? (
                  <div className="space-y-4 mb-6">
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">Toplam Tapu Harcı (%4)</span>
                      <div className="text-xl font-black text-[#0056b3] dark:text-blue-400">
                        {sonuc.toplamHarci.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">Alıcının Ödeyeceği Tutar</span>
                      <div className="text-lg font-bold text-slate-800 dark:text-white">
                        {sonuc.aliciOdemesi.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">Satıcının Ödeyeceği Tutar</span>
                      <div className="text-lg font-bold text-slate-800 dark:text-white">
                        {sonuc.saticiOdemesi.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400 text-sm">
                    Gayrimenkul bedelini girip hesapla butonuna tıklayın.
                  </div>
                )}
              </div>

              <div>
                <button 
                  onClick={handleCopy}
                  disabled={sonuc === null}
                  className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white border border-black/5 dark:border-transparent font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer">
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

      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Tapu Harcı Rehberi
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Tapu harcı, 492 sayılı Harçlar Kanunu'na göre gayrimenkul devir ve iktisaplarında alıcı ve satıcı ayrı ayrı %2 olmak üzere toplam %4 oranında ödenir.
        </p>
      </div>

      
      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Tapu Harcı ve Masraf Hesaplama Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              Tapu Harcı ve Masraf Hesaplama aracını kullanmak son derece basit ve kullanıcı dostudur. İlgili form alanlarına elinizdeki verileri eksiksiz ve doğru bir şekilde girdiğinizden emin olun. Tüm alanları doldurduktan sonra "Hesapla" butonuna tıklayarak sonuçları anında görüntüleyebilirsiniz. Aracımız, girdiğiniz değerleri anlık olarak işler ve herhangi bir sayfaya yönlendirme yapmadan, bulunduğunuz ekran üzerinde size en net ve kesin verileri sunar. İhtiyaç duyduğunuz her an bu aracı tamamen ücretsiz olarak kullanabilir, dilerseniz sonuçları kopyalayarak farklı platformlarda kolayca paylaşabilirsiniz. Zaman kaybetmeden, en karmaşık hesaplamaları bile saniyeler içinde tamamlamanın ayrıcalığını yaşayın.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Tapu Harcı ve Masraf Hesaplama Nedir ve Nasıl Hesaplanır?</h4>
            <p>
              Tapu Harcı ve Masraf Hesaplama, kullanıcıların günlük hayatta veya profesyonel iş süreçlerinde sıklıkla ihtiyaç duyduğu matematiksel veya istatistiksel hesaplamaları pratik bir şekilde çözmek amacıyla geliştirilmiş kapsamlı bir dijital araçtır. Geleneksel yöntemlerle yapıldığında hata payı yüksek olan ve uzun zaman alan bu tür işlemler, gelişmiş altyapımız sayesinde otomatik olarak hatasız bir biçimde gerçekleştirilir. 
            </p>
            <p className="mt-4">
              Hesaplama arka planda, genel kabul görmüş evrensel formüller, en güncel yasal mevzuatlar veya resmi olarak açıklanmış standart oranlar kullanılarak yapılmaktadır. Veriler sisteme girildiği anda, algoritma bu güncel parametreleri referans alarak verilerinizi analiz eder ve sonuçları net bir şekilde ekranınıza yansıtır. Finansal, istatistiksel veya gündelik hesaplamalar fark etmeksizin her daim doğru ve güvenilir bilgiye ulaşmanız hedeflenmektedir. Bu aracı kullanarak iş akışınızı hızlandırabilir ve hata payını sıfıra indirebilirsiniz.
            </p>
          </section>

          
          <div className="pt-2">
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Kullanılan Formüller:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  Alıcı Tapu Harcı = Satış Bedeli × %2 | Satıcı Tapu Harcı = Satış Bedeli × %2 | Toplam Harç = Satış Bedeli × %4
                </div>
              </div>
            </div>
          </div>
          
          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular (SSS)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Tapu Harcı ve Masraf Hesaplama aracı ücretli midir?</h5>
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
      <RelatedTools category="finans" currentToolId="tapu-harci-hesaplama" />
      <div className="mt-8">
        <Disclaimer category="finans" />
      </div>
    </div>
  );
}
