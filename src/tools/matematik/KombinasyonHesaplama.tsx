import React, { useState, useEffect } from 'react';
import { ChevronRight, RefreshCw, Copy, Info, AlertCircle, Sparkles, Shuffle, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToolIcon } from '../../components/icons/ToolIcon';
import { AdSlot } from '../../components/ads/AdSlot';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { RelatedTools } from '../../components/tools/RelatedTools';

export default function KombinasyonHesaplama() {
  const [nInput, setNInput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [rInput, setRInput] = useState<string>('');
  const [isWithReplacement, setIsWithReplacement] = useState<boolean>(false); // Tekrarlı kombinasyon

  const [result, setResult] = useState<{
    n: number;
    r: number;
    combination: string;
    permutation: string;
    stepFormula: string;
    stepExplanation: string;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);

  // BigInt faktöriyel
  const factorialBigInt = (num: number): bigint => {
    let res = 1n;
    for (let i = 2n; i <= BigInt(num); i++) {
      res *= i;
    }
    return res;
  };

  const calculateCombination = () => {
    const n = parseInt(nInput, 10);
    const r = parseInt(rInput, 10);

    if (isNaN(n) || isNaN(r)) {
      setError("Lütfen geçerli tam sayılar giriniz.");
      setResult(null);
      return;
    }

    if (n < 0 || r < 0) {
      setError("Eleman ve seçim sayıları negatif olamaz.");
      setResult(null);
      return;
    }

    if (!isWithReplacement && r > n) {
      setError("Tekrarsız kombinasyonda seçim sayısı (r), eleman sayısından (n) büyük olamaz.");
      setResult(null);
      return;
    }

    if (n > 100 || r > 100) {
      setError("Performans ve görsel düzen nedeniyle lütfen en fazla 100 giriniz.");
      setResult(null);
      return;
    }

    setError(null);

    let combVal = 0n;
    let permVal = 0n;
    let stepFormula = '';
    let stepExplanation = '';

    if (isWithReplacement) {
      // Tekrarlı Kombinasyon: C(n + r - 1, r)
      const top = n + r - 1;
      const nFact = factorialBigInt(top);
      const rFact = factorialBigInt(r);
      const diffFact = factorialBigInt(top - r);
      combVal = nFact / (rFact * diffFact);

      stepFormula = `C'(${n}, ${r}) = C(${n} + ${r} - 1, ${r}) = C(${top}, ${r})`;
      stepExplanation = `Tekrarlı kombinasyon formülü: C(${top}, ${r}) = ${top}! / (${r}! × ${top - r}!) = ${combVal.toString()}`;
    } else {
      // Standart Tekrarsız Kombinasyon: C(n, r) = n! / (r! * (n - r)!)
      const nFact = factorialBigInt(n);
      const rFact = factorialBigInt(r);
      const diffFact = factorialBigInt(n - r);
      combVal = nFact / (rFact * diffFact);
      permVal = nFact / diffFact;

      // Adım adım sadeleştirilmiş açılım
      const topFactors: number[] = [];
      const bottomFactors: number[] = [];
      for (let i = 0; i < r; i++) {
        topFactors.push(n - i);
        bottomFactors.push(r - i);
      }

      stepFormula = `C(${n}, ${r}) = ${n}! / (${r}! × (${n} - ${r})!)`;
      if (r > 0 && r < n) {
        stepExplanation = `Sadeleştirilmiş Çarpım: (${topFactors.join(' × ')}) / (${bottomFactors.join(' × ')}) = ${combVal.toString()}`;
      } else {
        stepExplanation = `Sonuç: ${combVal.toString()}`;
      }
    }

    setResult({
      n,
      r,
      combination: combVal.toString(),
      permutation: permVal ? permVal.toString() : '-',
      stepFormula,
      stepExplanation
    });
  };

  useEffect(() => {
    calculateCombination();
  }, [nInput, rInput, isWithReplacement]);

  const handleClear = () => {
    setNInput('8');
    setRInput('3');
    setIsWithReplacement(false);
    setError(null);
  };

  const applyPreset = (nVal: number, rVal: number, title?: string) => {
    setNInput(nVal.toString());
    setRInput(rVal.toString());
    setIsWithReplacement(false);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* 1. BREADCRUMB */}
      <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <Link to="/" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Ana Sayfa</Link>
        <ChevronRight size={14} />
        <Link to="/kategori/matematik" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors capitalize">Matematik</Link>
        <ChevronRight size={14} />
        <span className="text-slate-800 dark:text-slate-300">Kombinasyon Hesaplama</span>
      </div>

      {/* 2. BAŞLIK VE AÇIKLAMA */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Kombinasyon Hesaplama [C(n, r)] 2026 - Ücretsiz ve Hızlı Sonuçlar</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Bir kümenin elemanları arasından sırasız seçim yapma (kombinasyon) sayısını hesaplayın. Permütasyon karşılaştırması ve sadeleştirilmiş adım adım çözüm adımlarıyla inceleyin.
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
            Kombinasyon & Permütasyon Bulucu
          </h2>
        </div>

        {/* 3. ANA UYGULAMA ALANI */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          
          {/* SOL: Girdi Formu */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Shuffle size={18} className="text-[#0056b3] dark:text-blue-400" />
                Eleman ve Seçim Sayısı
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
              {/* n Input */}
              <div>
                <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  Toplam Eleman Sayısı (n)
                </label>
                <input
                  type="number"
                  value={nInput}
                  onChange={(e) => setNInput(e.target.value)}
                  placeholder="Örn: 8"
                  min="0"
                  max="100"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 focus:border-[#0056b3]"
                />
              </div>

              {/* r Input */}
              <div>
                <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  Seçilecek Eleman Sayısı (r)
                </label>
                <input
                  type="number"
                  value={rInput}
                  onChange={(e) => setRInput(e.target.value)}
                  placeholder="Örn: 3"
                  min="0"
                  max="100"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 focus:border-[#0056b3]"
                />
              </div>

              {/* Tekrarlı Seçim Switch */}
              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-black/5 dark:border-white/5">
                  <input
                    type="checkbox"
                    checked={isWithReplacement}
                    onChange={(e) => setIsWithReplacement(e.target.checked)}
                    className="w-4 h-4 text-[#0056b3] rounded border-slate-300 focus:ring-[#0056b3]"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Tekrarlı Kombinasyon
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      Aynı elemanın birden fazla kez seçilmesine izin verir
                    </span>
                  </div>
                </label>
              </div>

              {/* Hızlı Örnekler */}
              <div className="pt-2">
                <span className="block text-[11px] font-bold text-slate-400 uppercase mb-2">Örnek Senaryolar</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => applyPreset(10, 3)}
                    className="p-2 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-left border border-black/5 dark:border-white/5"
                  >
                    10 Kişiden 3 Kişi Seçme
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset(49, 6)}
                    className="p-2 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-left border border-black/5 dark:border-white/5"
                  >
                    Sayısal Loto (49'dan 6)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset(52, 5)}
                    className="p-2 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-left border border-black/5 dark:border-white/5"
                  >
                    Poker Eli (52'den 5)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset(5, 2)}
                    className="p-2 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-left border border-black/5 dark:border-white/5"
                  >
                    5 Noktadan Doğru (C(5,2))
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* SAĞ: Sonuç Ekranı */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 flex-1 relative overflow-hidden shadow-lg border border-black/5 dark:border-slate-800 flex flex-col">
              <div className="flex items-center justify-between mb-4 border-b border-black/5 dark:border-white/5 pb-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">HESAPLAMA ÇIKTISI</h3>
              </div>

              {result ? (
                <div className="space-y-4 flex-1 flex flex-col">
                  {/* Kombinasyon Sonucu */}
                  <div className="bg-emerald-50/60 dark:bg-emerald-900/10 border border-emerald-100/60 dark:border-emerald-900/20 p-5 rounded-2xl">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      {isWithReplacement ? `Tekrarlı Kombinasyon C'(${result.n}, ${result.r})` : `Kombinasyon C(${result.n}, ${result.r}) veya (${result.n} / ${result.r})`}
                    </span>
                    <div className="text-3xl sm:text-4xl font-black text-emerald-700 dark:text-emerald-400 mt-1 break-all font-mono">
                      {result.combination}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      {result.n} elemanlı kümeden {result.r} eleman <strong>sıra gözetilmeksizin</strong> {result.combination} farklı şekilde seçilebilir.
                    </div>
                  </div>

                  {/* Permütasyon Karşılaştırması (Tekrarsız ise) */}
                  {!isWithReplacement && (
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-black/5 dark:border-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase block">
                          Sıralı Durum (Permütasyon - P(n, r))
                        </span>
                        <div className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-0.5 font-mono">
                          {result.permutation}
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 text-right">
                        Sıralama önemli <br />olduğunda
                      </span>
                    </div>
                  )}

                  {/* Formül & Çözüm Adımı */}
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-black/5 dark:border-white/5 space-y-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Kullanılan Formül</span>
                      <div className="font-mono text-xs font-bold text-[#0056b3] dark:text-blue-400 mt-0.5">
                        {result.stepFormula}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Açılım</span>
                      <div className="font-mono text-xs text-slate-700 dark:text-slate-300 mt-0.5 break-all">
                        {result.stepExplanation}
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (result) {
                          navigator.clipboard.writeText(`C(${result.n}, ${result.r}) = ${result.combination}\n${result.stepFormula}\n${result.stepExplanation}`);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }
                      }}
                      className="w-full mt-4 bg-slate-50 hover:bg-slate-100 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white border border-black/5 dark:border-transparent font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all backdrop-blur-sm active:scale-[0.98] text-sm"
                    >
                      {copied ? <Check size={16} className="text-emerald-500 transition-transform scale-110" /> : <Copy size={16} />}
                      {copied ? 'Sonuç Kopyalandı!' : 'Sonucu Kopyala'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400">
                  Lütfen geçerli değerler giriniz.
                </div>
              )}
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
          Kombinasyon Nedir ve Nasıl Hesaplanır?
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Kombinasyon Tanımı</h4>
            <p>
              Matematikte <strong>kombinasyon</strong>, bir nesne topluluğu veya küme içerisinden sıra gözetilmeksizin yapılan seçim işlemidir. Kombinasyonda seçilen elemanların hangi sırada seçildiği önemli değildir; önemli olan yalnızca grubun içinde hangi elemanların yer aldığıdır.
            </p>
            <p>
              Örneğin {`{A, B, C}`} kümesinden 2 eleman seçtiğimizde {`{A, B}`} ile {`{B, A}`} aynı kombinasyonu temsil eder.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Kombinasyon Formülü</h4>
            <p>
              n elemanlı bir kümenin r elemanlı alt kümelerinin (kombinasyonlarının) sayısı C(n, r) şeklinde gösterilir ve şu formülle hesaplanır:
            </p>
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl font-mono text-center text-sm text-[#0056b3] dark:text-blue-400">
              C(n, r) = n! / [ r! × (n - r)! ]
            </div>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Kombinasyon ile Permütasyon Arasındaki Fark</h4>
            <ul className="space-y-2 list-disc pl-5">
              <li><strong>Kombinasyon (Seçim):</strong> Sıralama önemsizdir. Bir sınıftan 3 temsilci seçmek veya loto kuponu doldurmak bir kombinasyon örneğidir.</li>
              <li><strong>Permütasyon (Sıralama):</strong> Sıralama önemlidir. Seçilen kişilerin başkan, başkan yardımcısı ve sekreter olarak görevlendirilmesi ya da bir şifre kombinasyonu oluşturulması permütasyondur.</li>
            </ul>
          </section>

          
          <div className="pt-2">
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Kullanılan Formüller:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  Kombinasyon (C) Formülü: C(n, r) = n! / [r! × (n - r)!]
                </div>
              </div>
            </div>
          </div>
          
          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular (FAQ)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">C(n, 0) ve C(n, n) kaça eşittir?</h5>
                <p>Herhangi bir $n$ sayısı için $C(n, 0) = 1$ ve $C(n, n) = 1$ değerini alır. Boş küme seçmenin 1 yolu ve tüm elemanları seçmenin de tek 1 yolu vardır.</p>
              </div>
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Kombinasyonda simetri kuralı nedir?</h5>
                <p>Kombinasyon hesaplamalarında $C(n, r) = C(n, n - r)$ eşitliği geçerlidir. Örneğin $C(10, 8) = C(10, 2) = 45$ olur. Bu kural büyük sayılarda hesaplamayı oldukça hızlandırır.</p>
              </div>
            </div>
          </section>
          
        </div>
      </div>

      {/* 5. DİĞER ARAÇLAR */}
      
      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Kombinasyon Hesaplama [C(n, r)] Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              Kombinasyon Hesaplama [C(n, r)] aracını kullanmak son derece basit ve kullanıcı dostudur. İlgili form alanlarına elinizdeki verileri eksiksiz ve doğru bir şekilde girdiğinizden emin olun. Tüm alanları doldurduktan sonra "Hesapla" butonuna tıklayarak sonuçları anında görüntüleyebilirsiniz. Aracımız, girdiğiniz değerleri anlık olarak işler ve herhangi bir sayfaya yönlendirme yapmadan, bulunduğunuz ekran üzerinde size en net ve kesin verileri sunar. İhtiyaç duyduğunuz her an bu aracı tamamen ücretsiz olarak kullanabilir, dilerseniz sonuçları kopyalayarak farklı platformlarda kolayca paylaşabilirsiniz. Zaman kaybetmeden, en karmaşık hesaplamaları bile saniyeler içinde tamamlamanın ayrıcalığını yaşayın.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Kombinasyon Hesaplama [C(n, r)] Nedir ve Nasıl Hesaplanır?</h4>
            <p>
              Kombinasyon Hesaplama [C(n, r)], kullanıcıların günlük hayatta veya profesyonel iş süreçlerinde sıklıkla ihtiyaç duyduğu matematiksel veya istatistiksel hesaplamaları pratik bir şekilde çözmek amacıyla geliştirilmiş kapsamlı bir dijital araçtır. Geleneksel yöntemlerle yapıldığında hata payı yüksek olan ve uzun zaman alan bu tür işlemler, gelişmiş altyapımız sayesinde otomatik olarak hatasız bir biçimde gerçekleştirilir. 
            </p>
            <p className="mt-4">
              Hesaplama arka planda, genel kabul görmüş evrensel formüller, en güncel yasal mevzuatlar veya resmi olarak açıklanmış standart oranlar kullanılarak yapılmaktadır. Veriler sisteme girildiği anda, algoritma bu güncel parametreleri referans alarak verilerinizi analiz eder ve sonuçları net bir şekilde ekranınıza yansıtır. Finansal, istatistiksel veya gündelik hesaplamalar fark etmeksizin her daim doğru ve güvenilir bilgiye ulaşmanız hedeflenmektedir. Bu aracı kullanarak iş akışınızı hızlandırabilir ve hata payını sıfıra indirebilirsiniz.
            </p>
          </section>

          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular (SSS)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Kombinasyon Hesaplama [C(n, r)] aracı ücretli midir?</h5>
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
      <RelatedTools category="matematik" currentToolId="kombinasyon-hesaplama" />

      {/* 6. SORUMLULUK REDDİ */}
      <Disclaimer category="matematik" />
    </div>
  );
}
