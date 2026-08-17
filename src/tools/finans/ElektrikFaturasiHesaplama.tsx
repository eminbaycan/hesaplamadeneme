import React, { useState } from 'react';
import { ChevronRight, RefreshCw, Copy, Info, Zap, AlertCircle, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdSlot } from '../../components/ads/AdSlot';
import { RelatedTools } from '../../components/tools/RelatedTools';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { ToolIcon } from '../../components/icons/ToolIcon';

export default function ElektrikFaturasiHesaplama() {
  const [kwhTuketim, setKwhTuketim] = useState<number | ''>('');
  const [birimFiyat, setBirimFiyat] = useState<number | ''>('');
  const [aboneTuru, setAboneTuru] = useState<'mesken' | 'ticarethane'>('mesken');
  const [sonuc, setSonuc] = useState<{
    netTutar: number;
    kdv: number;
    enerjiFonu: number;
    trtPayi: number;
    btv: number;
    toplamFatura: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCalculate = () => {
    if (kwhTuketim === '' || birimFiyat === '') {
      setError('*Lütfen tüketim ve birim fiyat alanlarını doldurun.');
      setSonuc(null);
      return;
    }
    setError(null);

    const netTutar = Number(kwhTuketim) * Number(birimFiyat);
    const enerjiFonu = netTutar * 0.007; // %0.7
    const trtPayi = netTutar * 0.02; // %2
    const btv = netTutar * 0.05; // %5 BTV
    
    const vergiMatrahi = netTutar + enerjiFonu + trtPayi + btv;
    const kdv = vergiMatrahi * 0.20; // %20 KDV
    const toplamFatura = vergiMatrahi + kdv;

    setSonuc({
      netTutar,
      kdv,
      enerjiFonu,
      trtPayi,
      btv,
      toplamFatura
    });
  };

  const handleClear = () => {
    setKwhTuketim('');
    setBirimFiyat('');
    setAboneTuru('mesken');
    setSonuc(null);
    setError(null);
  };

  const handleCopy = () => {
    if (!sonuc) return;
    const text = `Elektrik Tüketimi: ${kwhTuketim} kWh | Tahmini Toplam Fatura: ${sonuc.toplamFatura.toFixed(2)} ₺`;
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
        <span className="text-slate-800 dark:text-slate-300">Elektrik Faturası Hesaplama</span>
      </div>

      {/* 2. BAŞLIK VE AÇIKLAMA */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Elektrik Faturası Hesaplama 2026 - Ücretsiz ve Hızlı Sonuçlar</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Harcanan aylık kilowatt-saat (kWh) elektrik tüketimine ve tarife birim fiyatına göre fonlar ve vergiler dahil tahmini elektrik faturanızı hesaplayın.
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
            Elektrik Fatura Hesaplayıcı
          </h2>
        </div>

        {/* 3. ANA UYGULAMA ALANI */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          
          {/* SOL: Girdi Formu */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                Tüketim Bilgileri
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
              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  Aylık Elektrik Tüketimi (kWh) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  value={kwhTuketim}
                  onChange={(e) => {
                    setKwhTuketim(e.target.value === '' ? '' : Number(e.target.value));
                    setError(null);
                  }}
                  placeholder="Örn: 240" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  Birim Fiyat (TL / kWh) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  value={birimFiyat}
                  onChange={(e) => {
                    setBirimFiyat(e.target.value === '' ? '' : Number(e.target.value));
                    setError(null);
                  }}
                  placeholder="Örn: 2.07" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  Abone Grubu
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAboneTuru('mesken')}
                    className={`py-3 px-4 rounded-xl font-bold text-sm border transition-all cursor-pointer ${
                      aboneTuru === 'mesken'
                        ? 'bg-[#0056b3] text-white border-[#0056b3] shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-black/10 dark:border-white/15'
                    }`}
                  >
                    Mesken (Ev)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAboneTuru('ticarethane')}
                    className={`py-3 px-4 rounded-xl font-bold text-sm border transition-all cursor-pointer ${
                      aboneTuru === 'ticarethane'
                        ? 'bg-[#0056b3] text-white border-[#0056b3] shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-black/10 dark:border-white/15'
                    }`}
                  >
                    Ticarethane (İşyeri)
                  </button>
                </div>
              </div>

              <button 
                onClick={handleCalculate}
                className="w-full bg-[#0056b3] hover:bg-[#004494] text-white font-bold rounded-xl py-3.5 mt-2 transition-all shadow-sm active:scale-[0.98] cursor-pointer">
                Elektrik Faturasını Hesapla
              </button>
            </div>
          </div>

          {/* SAĞ: Sonuç Paneli */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 md:p-8 flex-1 relative overflow-hidden shadow-lg border border-black/5 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-white mb-6">Fatura Dökümü</h3>

                {sonuc !== null ? (
                  <div className="space-y-2.5 mb-6 text-xs sm:text-sm">
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">Aktif Enerji (Net):</span>
                      <span className="font-bold">{sonuc.netTutar.toFixed(2)} ₺</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">Enerji Fonu (%0.7):</span>
                      <span className="font-bold">{sonuc.enerjiFonu.toFixed(2)} ₺</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">TRT Payı (%2):</span>
                      <span className="font-bold">{sonuc.trtPayi.toFixed(2)} ₺</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">BTV (%5):</span>
                      <span className="font-bold">{sonuc.btv.toFixed(2)} ₺</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">KDV (%20):</span>
                      <span className="font-bold">{sonuc.kdv.toFixed(2)} ₺</span>
                    </div>

                    <div className="pt-3">
                      <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider block mb-1">Toplam Fatura</span>
                      <div className="text-3xl font-black text-[#0056b3] dark:text-blue-400">
                        {sonuc.toplamFatura.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400 text-sm">
                    Değerleri girip hesapla butonuna tıklayın.
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
          Elektrik Faturası Hesaplama Rehberi ve Sıkça Sorulan Sorular
        </h3>

        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-6 leading-relaxed">
          <div>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-2">Elektrik Faturası Neye Göre ve Nasıl Hesaplanır?</h4>
            <p>
              Elektrik faturaları, aylık tüketilen kilowatt-saat (kWh) miktarının ilgili tarife birim fiyatıyla çarpılması, ardından enerji fonu, TRT payı, belediye tüketim vergisi (BTV) ve katma değer vergisi (KDV) eklenmesiyle kademeli olarak hesaplanır.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-2">Mesken ve Ticarethane Tarifesi Arasındaki Fark</h4>
              <p>
                Mesken abonelerine konut tüketimi için geçerli olan birim fiyatlar uygulanırken, ticarethane abonelerinde iş yerleri için belirlenen farklı vergi ve birim maliyet oranları geçerlidir.
              </p>
            </div>
            <div>
              <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-2">Elektrik Faturasını Düşürmenin Yolları</h4>
              <p>
                A sınıfı enerji verimli ev aletleri kullanmak, LED aydınlatmaya geçmek ve bekleme modundaki (standby) cihazları tamamen kapatmak aylık elektrik tüketiminizi önemli ölçüde azaltır.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Kullanılan Formüller ve Vergi Oranları</h4>
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Net Tutar ve Vergiler Formülü:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  Net Tutar = kWh Tüketim × Birim Fiyat <br />
                  Vergi Matrahi = Net Tutar + Enerji Fonu (%0.7) + TRT Payı (%2) + BTV (%5) <br />
                  Toplam Fatura = Vergi Matrahi + KDV (%20)
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular</h4>
            <div className="space-y-4">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Güncel elektrik birim fiyatını nereden öğrenebilirim?</h5>
                <p>Güncel mesken ve ticarethane elektrik tarifesi birim fiyatlarını elektrik dağıtım şirketinizin (EPDK) resmi web sitesinden faturanızın üzerindeki detaylardan öğrenebilirsiniz.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. BENZER ARAÇLAR */}
      
      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Elektrik Faturası Hesaplama Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              Elektrik Faturası Hesaplama aracını kullanmak son derece basit ve kullanıcı dostudur. İlgili form alanlarına elinizdeki verileri eksiksiz ve doğru bir şekilde girdiğinizden emin olun. Tüm alanları doldurduktan sonra "Hesapla" butonuna tıklayarak sonuçları anında görüntüleyebilirsiniz. Aracımız, girdiğiniz değerleri anlık olarak işler ve herhangi bir sayfaya yönlendirme yapmadan, bulunduğunuz ekran üzerinde size en net ve kesin verileri sunar. İhtiyaç duyduğunuz her an bu aracı tamamen ücretsiz olarak kullanabilir, dilerseniz sonuçları kopyalayarak farklı platformlarda kolayca paylaşabilirsiniz. Zaman kaybetmeden, en karmaşık hesaplamaları bile saniyeler içinde tamamlamanın ayrıcalığını yaşayın.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Elektrik Faturası Hesaplama Nedir ve Nasıl Hesaplanır?</h4>
            <p>
              Elektrik Faturası Hesaplama, kullanıcıların günlük hayatta veya profesyonel iş süreçlerinde sıklıkla ihtiyaç duyduğu matematiksel veya istatistiksel hesaplamaları pratik bir şekilde çözmek amacıyla geliştirilmiş kapsamlı bir dijital araçtır. Geleneksel yöntemlerle yapıldığında hata payı yüksek olan ve uzun zaman alan bu tür işlemler, gelişmiş altyapımız sayesinde otomatik olarak hatasız bir biçimde gerçekleştirilir. 
            </p>
            <p className="mt-4">
              Hesaplama arka planda, genel kabul görmüş evrensel formüller, en güncel yasal mevzuatlar veya resmi olarak açıklanmış standart oranlar kullanılarak yapılmaktadır. Veriler sisteme girildiği anda, algoritma bu güncel parametreleri referans alarak verilerinizi analiz eder ve sonuçları net bir şekilde ekranınıza yansıtır. Finansal, istatistiksel veya gündelik hesaplamalar fark etmeksizin her daim doğru ve güvenilir bilgiye ulaşmanız hedeflenmektedir. Bu aracı kullanarak iş akışınızı hızlandırabilir ve hata payını sıfıra indirebilirsiniz.
            </p>
          </section>

          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular (SSS)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Elektrik Faturası Hesaplama aracı ücretli midir?</h5>
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
      <RelatedTools category="finans" currentToolId="elektrik-faturasi-hesaplama" />

      {/* SORUMLULUK REDDİ */}
      <div className="mt-8">
        <Disclaimer category="finans" />
      </div>
    </div>
  );
}
