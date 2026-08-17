import React, { useState, useEffect } from 'react';
import { ChevronRight, RefreshCw, Copy, Info, AlertCircle, Sparkles, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdSlot } from '../../components/ads/AdSlot';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { RelatedTools } from '../../components/tools/RelatedTools';

export default function UsluSayiHesaplama() {
  const [baseInput, setBaseInput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [exponentInput, setExponentInput] = useState<string>('');

  const [result, setResult] = useState<{
    base: number;
    exponent: number;
    value: string;
    steps: string;
    isLarge: boolean;
    explanation: string;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);

  const calculatePower = () => {
    setError(null);
    const base = parseFloat(baseInput);
    const exponent = parseInt(exponentInput, 10);

    if (isNaN(base) || isNaN(exponent)) {
      setError('Lütfen geçerli sayılar giriniz.');
      setResult(null);
      return;
    }

    if (!Number.isInteger(exponent)) {
      setError('Üs değeri bir tam sayı olmalıdır.');
      setResult(null);
      return;
    }

    if (base === 0 && exponent < 0) {
      setError('Sıfır tabanında üs negatif olamaz (tanımsızlık oluşur).');
      setResult(null);
      return;
    }

    if (base === 0 && exponent === 0) {
      setError('0 üzeri 0 belirsiz bir durumdur.');
      setResult(null);
      return;
    }

    if (Math.abs(exponent) > 1000) {
      setError('Sistem kararlılığı için üs değeri en fazla 1000 veya -1000 olabilir.');
      setResult(null);
      return;
    }

    // Calculation
    let valueStr = '';
    let stepsStr = '';
    let isLarge = false;
    let explanationStr = '';

    // If both integers and not ridiculously big, try BigInt for perfect accuracy
    const isBaseInt = Number.isInteger(base);
    if (isBaseInt && exponent >= 0 && base >= 0 && exponent <= 100 && base <= 1000000) {
      const biBase = BigInt(base);
      const biVal = biBase ** BigInt(exponent);
      valueStr = biVal.toString();
    } else {
      // General floating point
      const val = Math.pow(base, exponent);
      if (Math.abs(val) > Number.MAX_SAFE_INTEGER || Math.abs(val) < 0.00001) {
        valueStr = val.toExponential(10);
        isLarge = true;
      } else {
        valueStr = val.toString();
      }
    }

    // Step representation
    if (exponent === 0) {
      stepsStr = '1';
      explanationStr = 'Sıfır hariç herhangi bir sayının 0. kuvveti her zaman 1\'dir.';
    } else if (exponent === 1) {
      stepsStr = base.toString();
      explanationStr = 'Her sayının 1. kuvveti kendisine eşittir.';
    } else if (exponent < 0) {
      const absExp = Math.abs(exponent);
      const parts = Array(absExp).fill(base);
      if (absExp <= 8) {
        stepsStr = `1 / (${parts.join(' × ')})`;
      } else {
        stepsStr = `1 / (${base}^${absExp})`;
      }
      explanationStr = `Negatif üs, tabanın çarpmaya göre tersinin (${base === 0 ? 'Tanımsız' : `1/${base}`}) alınmasıyla hesaplanır.`;
    } else {
      const parts = Array(exponent).fill(base);
      if (exponent <= 8) {
        stepsStr = parts.join(' × ');
      } else {
        stepsStr = `${base} × ${base} × ... (${exponent} kez)`;
      }

      if (base < 0) {
        const isEven = exponent % 2 === 0;
        explanationStr = `Taban negatif bir sayıdır. Üs ${isEven ? 'çift' : 'tek'} olduğu için sonuç ${isEven ? 'pozitiftir (+)' : 'negatiftir (-)'}.`;
      } else {
        explanationStr = `${base} sayısının kendisiyle ${exponent} kez çarpımıdır.`;
      }
    }

    setResult({
      base,
      exponent,
      value: valueStr,
      steps: stepsStr,
      isLarge,
      explanation: explanationStr
    });
  };

  useEffect(() => {
    calculatePower();
  }, [baseInput, exponentInput]);

  const handleClear = () => {
    setBaseInput('2');
    setExponentInput('8');
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
        <span className="text-slate-800 dark:text-slate-300">Üslü Sayı Hesaplama</span>
      </div>

      {/* 2. BAŞLIK VE AÇIKLAMA */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 font-black">Üslü Sayı Hesaplama 2026 - Ücretsiz ve Hızlı Sonuçlar</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Bir sayının üssünü (kuvvetini) hızlıca hesaplayın. Negatif ve ondalık tabanlar, negatif üsler, adım adım açılım ve işaret kuralları ile tam çözüme ulaşın.
        </p>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      {/* HESAPLAMA KAPSAYICISI */}
      <div className="calculator-container mb-8 relative border-4 border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-8 mt-8">
        <div className="absolute -top-4 left-4 sm:left-8 bg-[#eef2f7] dark:bg-slate-950 px-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-bold">
            <span>x<sup>y</sup></span>
            Kuvvet Alıcı (Üs Bulucu)
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          {/* SOL PANEL */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase">
                Girdiler
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
              {/* Taban */}
              <div>
                <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                  Taban Değeri (x)
                </label>
                <input
                  type="number"
                  value={baseInput}
                  onChange={(e) => setBaseInput(e.target.value)}
                  step="any"
                  placeholder="Örn: 2 veya -5"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 focus:border-[#0056b3]"
                />
              </div>

              {/* Üs */}
              <div>
                <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                  Üs / Kuvvet (y)
                </label>
                <input
                  type="number"
                  value={exponentInput}
                  onChange={(e) => setExponentInput(e.target.value)}
                  step="1"
                  placeholder="Örn: 8"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 focus:border-[#0056b3]"
                />
              </div>

              {/* Hızlı Şablonlar */}
              <div className="pt-2">
                <span className="block text-[11px] font-bold text-slate-400 uppercase mb-2">Popüler Üsler</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => { setBaseInput('2'); setExponentInput('10'); }}
                    className="p-2 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border text-center"
                  >
                    2<sup>10</sup> (KB)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setBaseInput('10'); setExponentInput('6'); }}
                    className="p-2 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border text-center"
                  >
                    10<sup>6</sup> (Milyon)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setBaseInput('3'); setExponentInput('-2'); }}
                    className="p-2 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border text-center"
                  >
                    3<sup>-2</sup> (Rasyonel)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SAĞ PANEL */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 flex-1 relative overflow-hidden shadow-lg border border-black/5 dark:border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4 border-b border-black/5 dark:border-white/5 pb-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">İŞLEM ÇIKTISI</h3>
              </div>

              {result ? (
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  {/* Ana Sonuç */}
                  <div className="bg-emerald-50/60 dark:bg-emerald-900/10 border border-emerald-100/60 dark:border-emerald-900/20 p-5 rounded-2xl">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                      Sonuç ({result.base}<sup>{result.exponent}</sup>)
                    </span>
                    <div className="text-3xl sm:text-4xl font-black text-emerald-700 dark:text-emerald-400 mt-1 break-all font-mono">
                      {result.value}
                    </div>
                  </div>

                  {/* Adım Adım Açılım */}
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border space-y-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Çarpım Açılımı</span>
                      <div className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5 break-all">
                        {result.steps}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Açıklama ve İşaret Kuralı</span>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {result.explanation}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (result) {
                        navigator.clipboard.writeText(`${result.base}^${result.exponent} = ${result.value}`);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }
                    }}
                    className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white border border-black/5 dark:border-transparent font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all backdrop-blur-sm active:scale-[0.98] text-sm"
                  >
                    {copied ? <Check size={16} className="text-emerald-500 transition-transform scale-110" /> : <Copy size={16} />}
                    {copied ? 'Sonuç Kopyalandı!' : 'İşlemi Kopyala'}
                  </button>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 flex-1 flex items-center justify-center">
                  Sayı değerlerini girerek sonucu görün.
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
          Üslü Sayı Kuralları ve Özellikleri
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3 font-semibold">Temel Kurallar</h4>
            <ul className="space-y-3 pl-4 list-disc">
              <li><strong>Sıfırıncı Kuvvet:</strong> Sıfır hariç, her sayının sıfırıncı kuvveti 1'e eşittir. (a<sup>0</sup> = 1)</li>
              <li><strong>Birinci Kuvvet:</strong> Her sayının birinci kuvveti sayının kendisine eşittir. (a<sup>1</sup> = a)</li>
              <li><strong>Negatif Üs:</strong> Üssün önündeki eksi işareti, sayıyı ters çevirir (çarpmaya göre tersi). (a<sup>-n</sup> = 1 / a<sup>n</sup>)</li>
            </ul>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3 font-semibold">Negatif Sayılarda Tek ve Çift Kuvvetler</h4>
            <p>
              Negatif bir tabanın üssü <strong>çift sayı</strong> ise sonuç her zaman <strong>pozitif</strong> olur. Örn: (-2)<sup>4</sup> = 16.
              Ancak üs <strong>tek sayı</strong> ise sonuç her zaman <strong>negatif</strong> kalır. Örn: (-2)<sup>3</sup> = -8.
            </p>
            <p className="mt-2 text-xs text-rose-500 font-bold">
              Dikkat: Parantez kullanımı çok önemlidir! -2<sup>4</sup> = -16 iken (-2)<sup>4</sup> = 16 sonucunu verir. Bu araçta girilen taban, parantezli taban şeklinde [ (taban)<sup>üs</sup> ] işleme alınır.
            </p>
          </section>

          
          <div className="pt-2">
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Kullanılan Formüller:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  Üslü Sayı (a^n) = a × a × a × ... (Taban olan a sayısının, üs olan n kere kendisiyle çarpımı)
                </div>
              </div>
            </div>
          </div>
          
          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4 font-semibold">Sıkça Sorulan Sorular (FAQ)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2 font-semibold">0 üzeri 0 neden belirsizdir?</h5>
                <p>Matematikte tabanın 0 olması durumunda üs arttıkça sonuç sıfıra yaklaşır. Öte yandan bir sayının sıfırıncı kuvveti her zaman 1'dir. Bu iki kural 0<sup>0</sup> durumunda çeliştiği için belirsiz olarak kabul edilir.</p>
              </div>
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2 font-semibold">Ondalık tabanlarda üs nasıl alınır?</h5>
                <p>Ondalık tabanlar rasyonel kesire çevrilerek üssü alınır. Örneğin 0.5<sup>2</sup> = (1/2)<sup>2</sup> = 1/4 = 0.25 şeklinde hesaplanır.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* 5. DİĞER ARAÇLAR */}
      
      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Üslü Sayı Hesaplama Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              Üslü Sayı Hesaplama aracını kullanmak son derece basit ve kullanıcı dostudur. İlgili form alanlarına elinizdeki verileri eksiksiz ve doğru bir şekilde girdiğinizden emin olun. Tüm alanları doldurduktan sonra "Hesapla" butonuna tıklayarak sonuçları anında görüntüleyebilirsiniz. Aracımız, girdiğiniz değerleri anlık olarak işler ve herhangi bir sayfaya yönlendirme yapmadan, bulunduğunuz ekran üzerinde size en net ve kesin verileri sunar. İhtiyaç duyduğunuz her an bu aracı tamamen ücretsiz olarak kullanabilir, dilerseniz sonuçları kopyalayarak farklı platformlarda kolayca paylaşabilirsiniz. Zaman kaybetmeden, en karmaşık hesaplamaları bile saniyeler içinde tamamlamanın ayrıcalığını yaşayın.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Üslü Sayı Hesaplama Nedir ve Nasıl Hesaplanır?</h4>
            <p>
              Üslü Sayı Hesaplama, kullanıcıların günlük hayatta veya profesyonel iş süreçlerinde sıklıkla ihtiyaç duyduğu matematiksel veya istatistiksel hesaplamaları pratik bir şekilde çözmek amacıyla geliştirilmiş kapsamlı bir dijital araçtır. Geleneksel yöntemlerle yapıldığında hata payı yüksek olan ve uzun zaman alan bu tür işlemler, gelişmiş altyapımız sayesinde otomatik olarak hatasız bir biçimde gerçekleştirilir. 
            </p>
            <p className="mt-4">
              Hesaplama arka planda, genel kabul görmüş evrensel formüller, en güncel yasal mevzuatlar veya resmi olarak açıklanmış standart oranlar kullanılarak yapılmaktadır. Veriler sisteme girildiği anda, algoritma bu güncel parametreleri referans alarak verilerinizi analiz eder ve sonuçları net bir şekilde ekranınıza yansıtır. Finansal, istatistiksel veya gündelik hesaplamalar fark etmeksizin her daim doğru ve güvenilir bilgiye ulaşmanız hedeflenmektedir. Bu aracı kullanarak iş akışınızı hızlandırabilir ve hata payını sıfıra indirebilirsiniz.
            </p>
          </section>

          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular (SSS)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Üslü Sayı Hesaplama aracı ücretli midir?</h5>
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
      <RelatedTools category="matematik" currentToolId="uslu-sayi-hesaplama" />

      {/* 6. SORUMLULUK REDDİ */}
      <Disclaimer category="matematik" />
    </div>
  );
}
