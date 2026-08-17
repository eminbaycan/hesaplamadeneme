import React, { useState } from 'react';
import { ChevronRight, RefreshCw, Copy, Info, AlertCircle, Sparkles, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToolIcon } from '../../components/icons/ToolIcon';
import { AdSlot } from '../../components/ads/AdSlot';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { RelatedTools } from '../../components/tools/RelatedTools';

export default function FaktoriyelHesaplama() {
  const [numInput, setNumInput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateFactorial = (n: number) => {
    if (n < 0) {
      setError("Faktöriyel negatif sayılar için hesaplanamaz.");
      setResult(null);
      return;
    }
    if (n > 170) {
      setError("Performans ve görsel düzen nedeniyle lütfen en fazla 170 giriniz.");
      setResult(null);
      return;
    }

    const start = performance.now();
    let val = 1n;
    for (let i = 2n; i <= BigInt(n); i++) {
      val *= i;
    }
    const end = performance.now();

    // Generate steps string (truncate if too long)
    let stepsArr: string[] = [];
    for (let i = n; i >= 1; i--) {
      stepsArr.push(i.toString());
    }
    let stepsStr = stepsArr.join(' × ');
    if (stepsArr.length > 10) {
      stepsStr = `${stepsArr.slice(0, 5).join(' × ')} × ... × ${stepsArr.slice(-3).join(' × ')}`;
    }
    if (n === 0) stepsStr = "TANIM GEREĞİ = 1";

    const valueStr = val.toString();
    setResult({
      num: n,
      value: valueStr,
      steps: stepsStr,
      digitCount: valueStr.length,
      timeMs: Number((end - start).toFixed(4))
    });
    setError(null);
  };

  const handleCalculate = () => {
    const parsed = parseInt(numInput, 10);
    if (isNaN(parsed)) {
      setError("Lütfen geçerli bir tam sayı girin.");
      setResult(null);
      return;
    }
    calculateFactorial(parsed);
  };

  const setPreset = (preset: number) => {
    setNumInput(preset.toString());
    calculateFactorial(preset);
  };

  const handleClear = () => {
    setNumInput('');
    setResult(null);
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
        <span className="text-slate-800 dark:text-slate-300">Faktöriyel Hesaplama</span>
      </div>

      {/* 2. BAŞLIK VE AÇIKLAMA */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Faktöriyel Hesaplama 2026 - Ücretsiz ve Hızlı Sonuçlar</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Girdiğiniz pozitif tam sayının faktöriyel ($n!$) değerini BigInt altyapısı sayesinde sıfır veri kaybıyla ve basamak analizleriyle hesaplayın.
        </p>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      {/* HESAPLAMA ARACI KAPSAYICISI */}
      <div className="calculator-container mb-8 relative border-4 border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-8 mt-8">
        <div className="absolute -top-4 left-4 sm:left-8 bg-[#eef2f7] dark:bg-slate-950 px-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ToolIcon name="matematik" size={20} className="text-[#0056b3] dark:text-blue-400" />
            Faktöriyel ($n!$) Bulucu
          </h2>
        </div>

        {/* 3. ANA UYGULAMA ALANI */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          
          {/* SOL: Girdi Formu */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-[#0056b3] dark:text-blue-400 flex items-center justify-center">
                  n!
                </span>
                Sayı Girişi
              </h2>
              <button onClick={handleClear} className="text-[12px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1.5 transition-colors">
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
                <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                  Sayı Değeri (n)
                </label>
                <input 
                  type="number" 
                  value={numInput}
                  onChange={(e) => {
                    setNumInput(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
                  placeholder="Örn: 10" 
                  min="0"
                  max="170"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white font-bold text-lg focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all"
                />
                <p className="text-[11px] text-slate-400 mt-1.5">Maksimum hesaplanabilir değer: 170'tir.</p>
              </div>

              {/* Presets */}
              <div>
                <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wider">Hızlı Sayı Seçenekleri</span>
                <div className="grid grid-cols-5 gap-2">
                  {[0, 5, 10, 15, 20, 30, 50, 75, 100, 150].map((val) => (
                    <button
                      key={val}
                      onClick={() => setPreset(val)}
                      className="py-1.5 text-xs font-bold rounded-lg border border-black/5 dark:border-white/5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                    >
                      {val}!
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleCalculate}
                className="w-full bg-[#0056b3] hover:bg-[#004494] text-white font-bold rounded-xl py-3.5 transition-all shadow-sm active:scale-[0.98]"
              >
                Faktöriyel Hesapla
              </button>
            </div>
          </div>

          {/* SAĞ: Sonuç Ekranı */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 flex-1 relative overflow-hidden shadow-lg border border-black/5 dark:border-slate-800 flex flex-col">
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 dark:bg-violet-500/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

              <div className="relative z-10 flex flex-col h-full flex-1">
                <div className="flex items-center justify-between mb-5 border-b border-black/5 dark:border-white/5 pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">HESAPLAMA DETAYLARI</h3>
                </div>

                {result ? (
                  <div className="flex-1 flex flex-col gap-5">
                    {/* Main Result */}
                    <div className="bg-violet-50/50 dark:bg-violet-900/10 border border-violet-100/50 dark:border-violet-900/20 p-5 rounded-2xl">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        {result.num}! Değeri
                      </span>
                      <div className="text-xl sm:text-2xl font-black text-violet-700 dark:text-violet-400 mt-2 break-all max-h-40 overflow-y-auto pr-1 font-mono leading-tight">
                        {result.value}
                      </div>
                    </div>

                    {/* Meta Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Basamak Sayısı</span>
                        <div className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                          {result.digitCount} basamaklı
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Hesaplama Süresi</span>
                        <div className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                          {result.timeMs} ms
                        </div>
                      </div>
                    </div>

                    {/* Step Expansion */}
                    <div>
                      <span className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">Çarpım Açılımı</span>
                      <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg font-mono text-xs text-slate-600 dark:text-slate-300 break-words">
                        {result.steps}
                      </div>
                    </div>

                    {/* Reference Table For First 8 */}
                    <div className="flex-1 min-h-0">
                      <span className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">İlk 8 Faktöriyel Değeri</span>
                      <div className="border border-black/5 dark:border-white/5 rounded-lg overflow-hidden">
                        <table className="w-full text-left text-[11px]">
                          <thead>
                            <tr className="bg-slate-50 dark:bg-slate-850 text-slate-500">
                              <th className="py-1 px-3">n</th>
                              <th className="py-1 px-3">Açılımı</th>
                              <th className="py-1 px-3 text-right">Değeri</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-black/5 dark:divide-white/5 font-mono">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((v) => (
                              <tr key={v} className={result.num === v ? 'bg-violet-50/20 dark:bg-violet-900/5 font-bold' : ''}>
                                <td className="py-1 px-3">{v}!</td>
                                <td className="py-1 px-3 text-slate-400">{Array.from({length: v}, (_, i) => v - i).join('×')}</td>
                                <td className="py-1 px-3 text-right text-slate-800 dark:text-slate-200">
                                  {Array.from({length: v}, (_, i) => i + 1).reduce((acc, curr) => acc * curr, 1).toLocaleString('tr-TR')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col justify-center items-center py-12 text-slate-400 dark:text-slate-500">
                    <p className="text-sm font-semibold">Bir sayı girip hesaplayın</p>
                  </div>
                )}

                {result && (
                  <button 
                    type="button"
                    onClick={() => {
                      if (result) {
                        navigator.clipboard.writeText(`${result.num}! = ${result.value}`);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }
                    }}
                    className="w-full mt-4 bg-slate-50 hover:bg-slate-100 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white border border-black/5 dark:border-transparent font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all backdrop-blur-sm active:scale-[0.98] text-sm"
                  >
                    {copied ? <Check size={16} className="text-emerald-500 transition-transform scale-110" /> : <Copy size={16} />}
                    {copied ? 'Sonuç Kopyalandı!' : 'Sonucu Kopyala'}
                  </button>
                )}
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
          Faktöriyel Nedir ve Nasıl Hesaplanır?
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Faktöriyel Tanımı</h4>
            <p>
              Matematikte <strong>faktöriyel</strong>, pozitif bir tam sayının kendisinden başlayarak 1'e kadar olan tüm ardışık pozitif tam sayılarla çarpılması sonucu elde edilen sayıdır. Faktöriyel kavramı ünlem işareti ($!$) ile simgelenir.
            </p>
            <p>
              Örneğin $5!$ ifadesi "5 faktöriyel" olarak okunur ve şu şekilde hesaplanır:
            </p>
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl font-mono text-center text-sm text-[#0056b3] dark:text-blue-400">
              5! = 5 × 4 × 3 × 2 × 1 = 120
            </div>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Faktöriyel Sıfır ($0!$) Neden 1'e Eşittir?</h4>
            <p>
              Matematikte tanımsal tutarlılıkları korumak, özellikle permütasyon ve kombinasyon formüllerinin $n=r$ durumlarında kusursuz çalışabilmesi adına <strong>$0!$ değeri 1 olarak kabul edilir</strong>. Bu durum boş bir kümenin sıralama sayısının 1 olmasından da kaynaklanan matematiksel bir kuraldır.
            </p>
          </section>

          <div className="pt-2">
            <div className="space-y-6 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Genel Faktöriyel Formülü:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  n! = n × (n - 1) × (n - 2) × ... × 3 × 2 × 1
                </div>
              </div>
            </div>
          </div>
          
          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular (FAQ)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Faktöriyel negatif sayılar için hesaplanabilir mi?</h5>
                <p>Hayır, klasik faktöriyel fonksiyonu yalnızca negatif olmayan tam sayılar (doğal sayılar) için tanımlıdır. Karmaşık sayılar ve negatif tam sayı dışı değerler için faktöriyel, "Gama Fonksiyonu" yardımıyla genelleştirilir.</p>
              </div>
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Büyük faktöriyel sayılarının sonundaki sıfırların sayısı nasıl bulunur?</h5>
                <p>Bir faktöriyel sayısının sonundaki sıfırların sayısı, çarpanlarındaki 5 ve 2 sayısına bağlıdır (her 2×5 bir adet 10 yani sıfır üretir). Faktöriyel tabanında 2 çarpanı her zaman 5 çarpanından fazla olduğu için sayıyı sürekli 5'e bölüp bölümleri toplayarak sonundaki toplam sıfır sayısını hızlıca bulabilirsiniz.</p>
              </div>
            </div>
          </section>
          
        </div>
      </div>

      {/* 5. DİĞER ARAÇLAR */}
      
      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Faktöriyel Hesaplama Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              Faktöriyel Hesaplama aracını kullanmak son derece basit ve kullanıcı dostudur. İlgili form alanlarına elinizdeki verileri eksiksiz ve doğru bir şekilde girdiğinizden emin olun. Tüm alanları doldurduktan sonra "Hesapla" butonuna tıklayarak sonuçları anında görüntüleyebilirsiniz. Aracımız, girdiğiniz değerleri anlık olarak işler ve herhangi bir sayfaya yönlendirme yapmadan, bulunduğunuz ekran üzerinde size en net ve kesin verileri sunar. İhtiyaç duyduğunuz her an bu aracı tamamen ücretsiz olarak kullanabilir, dilerseniz sonuçları kopyalayarak farklı platformlarda kolayca paylaşabilirsiniz. Zaman kaybetmeden, en karmaşık hesaplamaları bile saniyeler içinde tamamlamanın ayrıcalığını yaşayın.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Faktöriyel Hesaplama Nedir ve Nasıl Hesaplanır?</h4>
            <p>
              Faktöriyel Hesaplama, kullanıcıların günlük hayatta veya profesyonel iş süreçlerinde sıklıkla ihtiyaç duyduğu matematiksel veya istatistiksel hesaplamaları pratik bir şekilde çözmek amacıyla geliştirilmiş kapsamlı bir dijital araçtır. Geleneksel yöntemlerle yapıldığında hata payı yüksek olan ve uzun zaman alan bu tür işlemler, gelişmiş altyapımız sayesinde otomatik olarak hatasız bir biçimde gerçekleştirilir. 
            </p>
            <p className="mt-4">
              Hesaplama arka planda, genel kabul görmüş evrensel formüller, en güncel yasal mevzuatlar veya resmi olarak açıklanmış standart oranlar kullanılarak yapılmaktadır. Veriler sisteme girildiği anda, algoritma bu güncel parametreleri referans alarak verilerinizi analiz eder ve sonuçları net bir şekilde ekranınıza yansıtır. Finansal, istatistiksel veya gündelik hesaplamalar fark etmeksizin her daim doğru ve güvenilir bilgiye ulaşmanız hedeflenmektedir. Bu aracı kullanarak iş akışınızı hızlandırabilir ve hata payını sıfıra indirebilirsiniz.
            </p>
          </section>

          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular (SSS)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Faktöriyel Hesaplama aracı ücretli midir?</h5>
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
      <RelatedTools category="matematik" currentToolId="faktoriyel-hesaplama" />

      {/* 6. SORUMLULUK REDDİ */}
      <Disclaimer category="matematik" />
    </div>
  );
}
