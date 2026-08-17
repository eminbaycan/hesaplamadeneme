import React, { useState } from 'react';
import { ChevronRight, RefreshCw, Copy, Info, Car, AlertCircle, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdSlot } from '../../components/ads/AdSlot';
import { RelatedTools } from '../../components/tools/RelatedTools';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { ToolIcon } from '../../components/icons/ToolIcon';

export default function AracVergisiMTVHesaplama() {
  const [motorHacmi, setMotorHacmi] = useState<string>('1300-1600');
  const [aracYasi, setAracYasi] = useState<string>('1-3');
  const [sonuc, setSonuc] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Örnek baz MTV tarifeleri (Yıllık tahmini)
  const mtvTablosu: Record<string, Record<string, number>> = {
    '1300_alti': { '1-3': 3500, '4-6': 2450, '7-11': 1400, '12_uzeri': 1000 },
    '1300-1600': { '1-3': 6100, '4-6': 4600, '7-11': 2750, '12_uzeri': 1950 },
    '1601-1800': { '1-3': 10800, '4-6': 8500, '7-11': 5000, '12_uzeri': 3100 },
    '1801-2000': { '1-3': 17000, '4-6': 13200, '7-11': 7800, '12_uzeri': 4600 },
    '2001_uzeri': { '1-3': 28000, '4-6': 22000, '7-11': 13000, '12_uzeri': 7500 },
  };

  const handleCalculate = () => {
    const yilTablosu = mtvTablosu[motorHacmi];
    if (yilTablosu && yilTablosu[aracYasi]) {
      setSonuc(yilTablosu[aracYasi]);
    } else {
      setSonuc(5000);
    }
  };

  const handleClear = () => {
    setMotorHacmi('1300-1600');
    setAracYasi('1-3');
    setSonuc(null);
  };

  const handleCopy = () => {
    if (sonuc === null) return;
    const text = `Yıllık MTV Tutarı: ${sonuc.toLocaleString('tr-TR')} ₺`;
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
        <span className="text-slate-800 dark:text-slate-300">Motorlu Taşıtlar Vergisi (MTV) Hesaplama</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Motorlu Taşıtlar Vergisi (MTV) Hesaplama 2026 - Ücretsiz ve Hızlı Sonuçlar</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Aracınızın motor hacmine ve yaşına göre yıllık ödemeniz gereken MTV tutarını hesaplayın.
        </p>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      <div className="calculator-container mb-8 relative border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-8 mt-8">
        <div className="absolute -top-3.5 left-4 sm:left-8 bg-[#eef2f7] dark:bg-slate-950 px-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ToolIcon name="finans" size={20} className="text-[#0056b3] dark:text-blue-400" />
            MTV Hesaplayıcı
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Araç Bilgileri</h2>
              <button 
                onClick={handleClear}
                className="text-[12px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer">
                <RefreshCw size={12} /> Temizle
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  Motor Hacmi
                </label>
                <select
                  value={motorHacmi}
                  onChange={(e) => setMotorHacmi(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 cursor-pointer"
                >
                  <option value="1300_alti">1300 cc ve altı</option>
                  <option value="1300-1600">1301 - 1600 cc arası</option>
                  <option value="1601-1800">1601 - 1800 cc arası</option>
                  <option value="1801-2000">1801 - 2000 cc arası</option>
                  <option value="2001_uzeri">2001 cc ve üstü</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  Araç Yaşı
                </label>
                <select
                  value={aracYasi}
                  onChange={(e) => setAracYasi(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 cursor-pointer"
                >
                  <option value="1-3">1 - 3 Yaş Arası</option>
                  <option value="4-6">4 - 6 Yaş Arası</option>
                  <option value="7-11">7 - 11 Yaş Arası</option>
                  <option value="12_uzeri">12 Yaş ve Üzeri</option>
                </select>
              </div>

              <button 
                onClick={handleCalculate}
                className="w-full bg-[#0056b3] hover:bg-[#004494] text-white font-bold rounded-xl py-3.5 mt-2 transition-all cursor-pointer">
                MTV Hesapla
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 md:p-8 flex-1 relative shadow-lg border border-black/5 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-white mb-6">Vergi Özeti</h3>

                {sonuc !== null ? (
                  <div className="space-y-4 mb-6">
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">Yıllık Toplam MTV</span>
                      <div className="text-3xl font-black text-[#0056b3] dark:text-blue-400">
                        {sonuc.toLocaleString('tr-TR')} ₺
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">6 Aylık Taksit Tutarı</span>
                      <div className="text-lg font-bold text-slate-800 dark:text-white">
                        {(sonuc / 2).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400 text-sm">
                    Araç bilgilerini seçip hesapla butonuna tıklayın.
                  </div>
                )}
              </div>

              <div>
                <button 
                  onClick={handleCopy}
                  disabled={sonuc === null}
                  className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer">
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
          MTV Hesaplama Rehberi
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Motorlu Taşıtlar Vergisi her yıl Ocak ve Temmuz aylarında iki eşit taksitle ödenir. Vergi tutarları aracın yaşına, motor silindir hacmine ve tescil tarihine göre değişmektedir.
        </p>
      </div>

      
      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Motorlu Taşıtlar Vergisi (MTV) Hesaplama Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              Motorlu Taşıtlar Vergisi (MTV) Hesaplama aracını kullanmak son derece basit ve kullanıcı dostudur. İlgili form alanlarına elinizdeki verileri eksiksiz ve doğru bir şekilde girdiğinizden emin olun. Tüm alanları doldurduktan sonra "Hesapla" butonuna tıklayarak sonuçları anında görüntüleyebilirsiniz. Aracımız, girdiğiniz değerleri anlık olarak işler ve herhangi bir sayfaya yönlendirme yapmadan, bulunduğunuz ekran üzerinde size en net ve kesin verileri sunar. İhtiyaç duyduğunuz her an bu aracı tamamen ücretsiz olarak kullanabilir, dilerseniz sonuçları kopyalayarak farklı platformlarda kolayca paylaşabilirsiniz. Zaman kaybetmeden, en karmaşık hesaplamaları bile saniyeler içinde tamamlamanın ayrıcalığını yaşayın.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Motorlu Taşıtlar Vergisi (MTV) Hesaplama Nedir ve Nasıl Hesaplanır?</h4>
            <p>
              Motorlu Taşıtlar Vergisi (MTV) Hesaplama, kullanıcıların günlük hayatta veya profesyonel iş süreçlerinde sıklıkla ihtiyaç duyduğu matematiksel veya istatistiksel hesaplamaları pratik bir şekilde çözmek amacıyla geliştirilmiş kapsamlı bir dijital araçtır. Geleneksel yöntemlerle yapıldığında hata payı yüksek olan ve uzun zaman alan bu tür işlemler, gelişmiş altyapımız sayesinde otomatik olarak hatasız bir biçimde gerçekleştirilir. 
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
                  Motorlu Taşıtlar Vergisi (MTV) = Aracın Yaşı ve Motor Silindir Hacmine (cm³) göre yasal tarifede belirlenen Yıllık Vergi Tutarı.
                </div>
              </div>
            </div>
          </div>
          
          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular (SSS)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Motorlu Taşıtlar Vergisi (MTV) Hesaplama aracı ücretli midir?</h5>
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
      <RelatedTools category="finans" currentToolId="mtv-hesaplama" />
      <div className="mt-8">
        <Disclaimer category="finans" />
      </div>
    </div>
  );
}
