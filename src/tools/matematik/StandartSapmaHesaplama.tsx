import React, { useState, useEffect } from 'react';
import { ChevronRight, RefreshCw, Copy, Info, AlertCircle, Sparkles, Sigma, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdSlot } from '../../components/ads/AdSlot';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { RelatedTools } from '../../components/tools/RelatedTools';

export default function StandartSapmaHesaplama() {
  const [numbersInput, setNumbersInput] = useState<string>('12, 15, 18, 22, 25, 30');
  const [copied, setCopied] = useState<boolean>(false);
  const [stats, setStats] = useState<{
    count: number;
    sum: number;
    mean: number;
    min: number;
    max: number;
    range: number;
    sampleVariance: number;
    populationVariance: number;
    sampleStdDev: number;
    populationStdDev: number;
    stdError: number;
    steps: {
      val: number;
      diff: number;
      diffSquared: number;
    }[];
    sumDiffSquared: number;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);

  const calculateStats = () => {
    setError(null);
    const cleaned = numbersInput
      .replace(/[\n\r;]/g, ',') // Change lines, semicolons to commas
      .split(',')
      .map(v => v.trim())
      .filter(v => v !== '');

    const parsedNumbers = cleaned.map(v => parseFloat(v));

    if (parsedNumbers.some(isNaN)) {
      setError('Lütfen sadece sayısal değerler giriniz (örneğin virgülle ayrılmış: 10, 20, 30).');
      setStats(null);
      return;
    }

    if (parsedNumbers.length < 2) {
      setError('Standart sapma hesaplamak için en az 2 adet sayı girmelisiniz.');
      setStats(null);
      return;
    }

    const count = parsedNumbers.length;
    const sum = parsedNumbers.reduce((acc, curr) => acc + curr, 0);
    const mean = sum / count;

    const min = Math.min(...parsedNumbers);
    const max = Math.max(...parsedNumbers);
    const range = max - min;

    // Calculate sum of squared differences
    let sumDiffSquared = 0;
    const steps = parsedNumbers.map(val => {
      const diff = val - mean;
      const diffSquared = diff * diff;
      sumDiffSquared += diffSquared;
      return {
        val,
        diff,
        diffSquared
      };
    });

    const sampleVariance = sumDiffSquared / (count - 1);
    const populationVariance = sumDiffSquared / count;

    const sampleStdDev = Math.sqrt(sampleVariance);
    const populationStdDev = Math.sqrt(populationVariance);

    const stdError = sampleStdDev / Math.sqrt(count);

    setStats({
      count,
      sum,
      mean,
      min,
      max,
      range,
      sampleVariance,
      populationVariance,
      sampleStdDev,
      populationStdDev,
      stdError,
      steps,
      sumDiffSquared
    });
  };

  useEffect(() => {
    calculateStats();
  }, [numbersInput]);

  const handleClear = () => {
    setNumbersInput('');
    setStats(null);
    setError(null);
  };

  const applyPreset = (preset: string) => {
    setNumbersInput(preset);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* 1. BREADCRUMB */}
      <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <Link to="/" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Ana Sayfa</Link>
        <ChevronRight size={14} />
        <Link to="/kategori/matematik" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors capitalize">Matematik</Link>
        <ChevronRight size={14} />
        <span className="text-slate-800 dark:text-slate-300">Standart Sapma Hesaplama</span>
      </div>

      {/* 2. BAŞLIK VE AÇIKLAMA */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 font-black">Standart Sapma Hesaplama 2026 - Ücretsiz ve Hızlı Sonuçlar</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Veri grubunuzun yayılımını ve değişkenliğini ölçün. Örneklem ve popülasyon standart sapması, varyans, aritmetik ortalama ve standart hata sonuçlarını adım adım hesaplayın.
        </p>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      {/* HESAPLAMA KAPSAYICISI */}
      <div className="calculator-container mb-8 relative border-4 border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-8 mt-8">
        <div className="absolute -top-4 left-4 sm:left-8 bg-[#eef2f7] dark:bg-slate-950 px-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-bold">
            <Sigma size={20} className="text-[#0056b3] dark:text-blue-400" />
            İstatistiksel Analiz Aracı
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          {/* SOL: Veri Girişi */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase">
                Veri Seti
              </h3>
              <button onClick={handleClear} className="text-[12px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1.5 transition-colors">
                <RefreshCw size={12} /> Sıfırla
              </button>
            </div>

            {error && (
              <div className="mb-5 p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl flex items-center gap-3 text-sm font-semibold border border-rose-100 dark:border-rose-800">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                  Sayıları Girin (Virgül, boşluk veya satırla ayırın)
                </label>
                <textarea
                  value={numbersInput}
                  onChange={(e) => setNumbersInput(e.target.value)}
                  placeholder="Örn: 10, 20, 30, 40"
                  rows={5}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white font-mono font-bold text-base focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 focus:border-[#0056b3]"
                />
              </div>

              {/* Hızlı Örnekler */}
              <div>
                <span className="block text-[11px] font-bold text-slate-400 uppercase mb-2">Örnek Şablonlar</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => applyPreset('5, 10, 15, 20, 25')}
                    className="p-2 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-left border"
                  >
                    Homojen Dağılım
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('1, 100, 2, 98, 5, 95')}
                    className="p-2 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-left border"
                  >
                    Yüksek Sapmalı Dağılım
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SAĞ: Sonuç Ekranı */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 flex-1 relative overflow-hidden shadow-lg border border-black/5 dark:border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4 border-b border-black/5 dark:border-white/5 pb-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">ANALİZ SONUÇLARI</h3>
              </div>

              {stats ? (
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  {/* Birincil Ölçümler */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-emerald-50/60 dark:bg-emerald-900/10 border border-emerald-100/60 dark:border-emerald-900/20 p-4 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block">
                        Örneklem Standart Sapması (s)
                      </span>
                      <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1 font-mono">
                        {stats.sampleStdDev.toFixed(5).replace(/\.?0+$/, '')}
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">Genelde tercih edilen</span>
                    </div>

                    <div className="bg-blue-50/60 dark:bg-blue-900/10 border border-blue-100/60 dark:border-blue-900/20 p-4 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block">
                        Popülasyon Standart Sapması (σ)
                      </span>
                      <div className="text-2xl font-black text-blue-700 dark:text-blue-400 mt-1 font-mono">
                        {stats.populationStdDev.toFixed(5).replace(/\.?0+$/, '')}
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">Tüm veri kümesi için</span>
                    </div>
                  </div>

                  {/* İkincil Ölçümler */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Ortalama (x̄)</span>
                      <div className="text-sm font-bold font-mono mt-0.5">{stats.mean.toFixed(4).replace(/\.?0+$/, '')}</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Varyans (s²)</span>
                      <div className="text-sm font-bold font-mono mt-0.5">{stats.sampleVariance.toFixed(4).replace(/\.?0+$/, '')}</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Eleman (N)</span>
                      <div className="text-sm font-bold font-mono mt-0.5">{stats.count}</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Açıklık (R)</span>
                      <div className="text-sm font-bold font-mono mt-0.5">{stats.range}</div>
                    </div>
                  </div>

                  {/* Adım Adım Tablosu */}
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Hesaplama Adımları</h4>
                    <div className="max-h-[160px] overflow-y-auto text-xs font-mono space-y-1.5 pr-2">
                      <div className="grid grid-cols-3 text-[10px] text-slate-400 font-bold border-b pb-1.5 mb-1.5 uppercase">
                        <div>Veri (x)</div>
                        <div>Fark (x - x̄)</div>
                        <div>Kare (x - x̄)²</div>
                      </div>
                      {stats.steps.map((step, idx) => (
                        <div key={idx} className="grid grid-cols-3 border-b border-black/5 dark:border-white/5 py-1">
                          <div>{step.val}</div>
                          <div className={step.diff >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                            {step.diff >= 0 ? '+' : ''}{step.diff.toFixed(2)}
                          </div>
                          <div>{step.diffSquared.toFixed(2)}</div>
                        </div>
                      ))}
                      <div className="grid grid-cols-3 pt-2 font-bold text-slate-800 dark:text-slate-200">
                        <div>Toplam: {stats.sum}</div>
                        <div>-</div>
                        <div>Σ = {stats.sumDiffSquared.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(`Ortalama: ${stats.mean}, Standart Sapma (Örneklem): ${stats.sampleStdDev}`);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white border border-black/5 dark:border-transparent font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all backdrop-blur-sm active:scale-[0.98] text-sm"
                    >
                      {copied ? <Check size={16} className="text-emerald-500 transition-transform scale-110" /> : <Copy size={16} />}
                      {copied ? 'Sonuç Kopyalandı!' : 'Özet Sonuçları Kopyala'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 flex-1 flex items-center justify-center">
                  Lütfen veri girişini kontrol edin.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      {/* 4. SEO & BİLGİLENDİRME ALANI */}
      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Standart Sapma Nedir ve Nasıl Hesaplanır?
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3 font-semibold">Standart Sapma Tanımı</h4>
            <p>
              İstatistikte <strong>standart sapma</strong>, bir veri setindeki sayıların aritmetik ortalamaya olan uzaklıklarının genel bir ölçüsüdür. Standart sapmanın küçük olması, verilerin ortalamaya yakın bir kümelenme gösterdiğini (düşük risk, homojen yapı); büyük olması ise verilerin geniş bir aralığa dağıldığını (yüksek risk, heterojen yapı) gösterir.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3 font-semibold">Örneklem vs. Popülasyon</h4>
            <p>
              Standart sapma hesaplanırken iki ana senaryo temel alınır:
            </p>
            <ul className="space-y-3 pl-4 list-disc">
              <li>
                <strong>Örneklem Standart Sapması (s):</strong> Çalışılan veri grubu, daha geniş bir evrenin (popülasyonun) yalnızca bir kısmını temsil ediyorsa kullanılır. Formülde kareler toplamı <code>N-1</code> sayısına bölünür (Bessel düzeltmesi).
              </li>
              <li>
                <strong>Popülasyon Standart Sapması (σ):</strong> Veriler, araştırılmak istenen bütünün tamamını kapsıyorsa kullanılır. Kareler toplamı doğrudan veri sayısına <code>N</code> bölünür.
              </li>
            </ul>
          </section>

          
          <div className="pt-2">
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Kullanılan Formüller:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  Örneklem Standart Sapması (σ) = √ [ ∑(x_i - μ)² / (N - 1) ] (Her değerin ortalamadan farkının karesinin toplamı / Eleman sayısı eksi 1)
                </div>
              </div>
            </div>
          </div>
          
          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4 font-semibold">Sıkça Sorulan Sorular (FAQ)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2 font-semibold">Standart sapma neden negatif olamaz?</h5>
                <p>Standart sapma formülü, sayıların ortalamayla olan farklarının karelerini içerir. Farkların karesi alındığından dolayı tüm değerler pozitifleşir ve sonuç olarak karekökten her zaman sıfır veya pozitif bir sayı olarak çıkar.</p>
              </div>
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2 font-semibold">Varyans ile farkı nedir?</h5>
                <p>Varyans, verilerin ortalamaya olan kare farklarının ortalamasıdır. Standart sapma ise varyansın kareköküdür. Varyans verinin biriminin karesini (örneğin metre²) verirken, standart sapma verinin orijinal birimiyle (örneğin metre) aynı ölçektir.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* 5. DİĞER ARAÇLAR */}
      
      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Standart Sapma Hesaplama Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              Standart Sapma Hesaplama aracını kullanmak son derece basit ve kullanıcı dostudur. İlgili form alanlarına elinizdeki verileri eksiksiz ve doğru bir şekilde girdiğinizden emin olun. Tüm alanları doldurduktan sonra "Hesapla" butonuna tıklayarak sonuçları anında görüntüleyebilirsiniz. Aracımız, girdiğiniz değerleri anlık olarak işler ve herhangi bir sayfaya yönlendirme yapmadan, bulunduğunuz ekran üzerinde size en net ve kesin verileri sunar. İhtiyaç duyduğunuz her an bu aracı tamamen ücretsiz olarak kullanabilir, dilerseniz sonuçları kopyalayarak farklı platformlarda kolayca paylaşabilirsiniz. Zaman kaybetmeden, en karmaşık hesaplamaları bile saniyeler içinde tamamlamanın ayrıcalığını yaşayın.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Standart Sapma Hesaplama Nedir ve Nasıl Hesaplanır?</h4>
            <p>
              Standart Sapma Hesaplama, kullanıcıların günlük hayatta veya profesyonel iş süreçlerinde sıklıkla ihtiyaç duyduğu matematiksel veya istatistiksel hesaplamaları pratik bir şekilde çözmek amacıyla geliştirilmiş kapsamlı bir dijital araçtır. Geleneksel yöntemlerle yapıldığında hata payı yüksek olan ve uzun zaman alan bu tür işlemler, gelişmiş altyapımız sayesinde otomatik olarak hatasız bir biçimde gerçekleştirilir. 
            </p>
            <p className="mt-4">
              Hesaplama arka planda, genel kabul görmüş evrensel formüller, en güncel yasal mevzuatlar veya resmi olarak açıklanmış standart oranlar kullanılarak yapılmaktadır. Veriler sisteme girildiği anda, algoritma bu güncel parametreleri referans alarak verilerinizi analiz eder ve sonuçları net bir şekilde ekranınıza yansıtır. Finansal, istatistiksel veya gündelik hesaplamalar fark etmeksizin her daim doğru ve güvenilir bilgiye ulaşmanız hedeflenmektedir. Bu aracı kullanarak iş akışınızı hızlandırabilir ve hata payını sıfıra indirebilirsiniz.
            </p>
          </section>

          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular (SSS)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Standart Sapma Hesaplama aracı ücretli midir?</h5>
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
      <RelatedTools category="matematik" currentToolId="standart-sapma-hesaplama" />

      {/* 6. SORUMLULUK REDDİ */}
      <Disclaimer category="matematik" />
    </div>
  );
}
