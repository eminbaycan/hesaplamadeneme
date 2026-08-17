import React, { useState, useEffect } from 'react';
import { ChevronRight, RefreshCw, Copy, Info, AlertCircle, Sparkles, Shuffle, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToolIcon } from '../../components/icons/ToolIcon';
import { AdSlot } from '../../components/ads/AdSlot';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { RelatedTools } from '../../components/tools/RelatedTools';

export default function PermutasyonHesaplama() {
  const [nInput, setNInput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [rInput, setRInput] = useState<string>('');
  const [permType, setPermType] = useState<'standard' | 'repeating' | 'circular'>('standard');

  const [result, setResult] = useState<{
    n: number;
    r: number;
    permutation: string;
    combination: string;
    stepFormula: string;
    stepExplanation: string;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);

  const factorialBigInt = (num: number): bigint => {
    let res = 1n;
    for (let i = 2n; i <= BigInt(num); i++) {
      res *= i;
    }
    return res;
  };

  const calculatePermutation = () => {
    const n = parseInt(nInput, 10);
    const r = parseInt(rInput, 10);

    if (isNaN(n) || (permType !== 'circular' && isNaN(r))) {
      setError("Lütfen geçerli tam sayılar giriniz.");
      setResult(null);
      return;
    }

    if (n < 0 || (permType !== 'circular' && r < 0)) {
      setError("Eleman ve seçim sayıları negatif olamaz.");
      setResult(null);
      return;
    }

    if (permType === 'standard' && r > n) {
      setError("Standart permütasyonda seçim sayısı (r), eleman sayısından (n) büyük olamaz.");
      setResult(null);
      return;
    }

    if (n > 100 || (permType !== 'circular' && r > 100)) {
      setError("Performans ve kararlılık için lütfen en fazla 100 giriniz.");
      setResult(null);
      return;
    }

    setError(null);

    let permVal = 0n;
    let combVal = 0n;
    let stepFormula = '';
    let stepExplanation = '';

    if (permType === 'repeating') {
      // Tekrarlı Permütasyon (n^r)
      permVal = BigInt(n) ** BigInt(r);
      stepFormula = `P_tekrar(${n}, ${r}) = ${n}^${r}`;
      stepExplanation = `${n} sayısının ${r}. kuvveti alınır: ${n} × ... × ${n} = ${permVal.toString()}`;
    } else if (permType === 'circular') {
      // Dairesel/Yuvarlak Masa Permütasyonu: (n-1)!
      if (n === 0) {
        permVal = 1n;
      } else {
        permVal = factorialBigInt(n - 1);
      }
      stepFormula = `P_daire(${n}) = (${n} - 1)! = ${n - 1}!`;
      stepExplanation = `Dairesel sıralamada başlangıç noktası sabitlendiği için n-1 elemanın sıralaması hesaplanır. (${n}-1)! = ${permVal.toString()}`;
    } else {
      // Standart Permütasyon: P(n, r) = n! / (n - r)!
      const nFact = factorialBigInt(n);
      const diffFact = factorialBigInt(n - r);
      permVal = nFact / diffFact;

      // Kombinasyon hesaplaması
      const rFact = factorialBigInt(r);
      combVal = nFact / (rFact * diffFact);

      const topFactors: number[] = [];
      for (let i = 0; i < r; i++) {
        topFactors.push(n - i);
      }

      stepFormula = `P(${n}, ${r}) = ${n}! / (${n} - ${r})!`;
      if (r > 0) {
        stepExplanation = `Sadeleştirilmiş Çarpım: ${topFactors.join(' × ')} = ${permVal.toString()}`;
      } else {
        stepExplanation = `Sonuç: ${permVal.toString()}`;
      }
    }

    setResult({
      n,
      r: isNaN(r) ? 0 : r,
      permutation: permVal.toString(),
      combination: combVal ? combVal.toString() : '-',
      stepFormula,
      stepExplanation
    });
  };

  useEffect(() => {
    calculatePermutation();
  }, [nInput, rInput, permType]);

  const handleClear = () => {
    setNInput('7');
    setRInput('3');
    setPermType('standard');
    setError(null);
  };

  const applyPreset = (nVal: number, rVal: number, type: 'standard' | 'repeating' | 'circular') => {
    setNInput(nVal.toString());
    setRInput(rVal.toString());
    setPermType(type);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* 1. BREADCRUMB */}
      <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <Link to="/" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Ana Sayfa</Link>
        <ChevronRight size={14} />
        <Link to="/kategori/matematik" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors capitalize">Matematik</Link>
        <ChevronRight size={14} />
        <span className="text-slate-800 dark:text-slate-300">Permütasyon Hesaplama</span>
      </div>

      {/* 2. BAŞLIK VE AÇIKLAMA */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Permütasyon Hesaplama [P(n, r)] 2026 - Ücretsiz ve Hızlı Sonuçlar</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Bir kümenin elemanlarının belirli sıralamalarla dizilim sayısını (permütasyon) bulun. Standart, tekrarlı ve yuvarlak masa (dairesel) hesaplama yöntemleriyle adım adım çözün.
        </p>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      {/* HESAPLAMA ARACI KAPSAYICISI */}
      <div className="calculator-container mb-8 relative border-4 border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-8 mt-8">
        <div className="absolute -top-4 left-4 sm:left-8 bg-[#eef2f7] dark:bg-slate-950 px-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shuffle size={20} className="text-[#0056b3] dark:text-blue-400" />
            Permütasyon Dizilim Bulucu
          </h2>
        </div>

        {/* 3. ANA UYGULAMA ALANI */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          {/* SOL: Girdi Formu */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                Parametreler
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
              {/* Tür Seçimi */}
              <div>
                <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                  Hesaplama Türü
                </label>
                <select
                  value={permType}
                  onChange={(e) => setPermType(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 focus:border-[#0056b3]"
                >
                  <option value="standard">Standart Permütasyon - P(n, r)</option>
                  <option value="repeating">Tekrarlı Sıralama - n^r</option>
                  <option value="circular">Dairesel (Yuvarlak Masa) - (n-1)!</option>
                </select>
              </div>

              {/* n Input */}
              <div>
                <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                  Toplam Eleman Sayısı (n)
                </label>
                <input
                  type="number"
                  value={nInput}
                  onChange={(e) => setNInput(e.target.value)}
                  placeholder="Örn: 7"
                  min="0"
                  max="100"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 focus:border-[#0056b3]"
                />
              </div>

              {/* r Input */}
              {permType !== 'circular' && (
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
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
              )}

              {/* Hızlı Örnekler */}
              <div className="pt-2">
                <span className="block text-[11px] font-bold text-slate-400 uppercase mb-2">Örnek Senaryolar</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => applyPreset(5, 3, 'standard')}
                    className="p-2 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-left border"
                  >
                    5 At Yarışında İlk 3 Derece
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset(10, 4, 'repeating')}
                    className="p-2 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-left border"
                  >
                    4 Basamaklı Şifre Sayısı
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset(6, 0, 'circular')}
                    className="p-2 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-left border col-span-2"
                  >
                    6 Kişinin Yuvarlak Masa Etrafında Oturması
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
                  {/* Sonuç Alanı */}
                  <div className="bg-emerald-50/60 dark:bg-emerald-900/10 border border-emerald-100/60 dark:border-emerald-900/20 p-5 rounded-2xl">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                      {permType === 'standard' ? `Permütasyon P(${result.n}, ${result.r})` : permType === 'repeating' ? 'Tekrarlı Sıralama' : 'Dairesel Sıralama'}
                    </span>
                    <div className="text-3xl sm:text-4xl font-black text-emerald-700 dark:text-emerald-400 mt-1 break-all font-mono">
                      {result.permutation}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      {permType === 'circular' ? (
                        <span>{result.n} kişi yuvarlak bir masa etrafına <strong>{result.permutation}</strong> farklı şekilde yerleşebilir.</span>
                      ) : (
                        <span>{result.n} eleman arasından {result.r} eleman <strong>sıra gözetilerek</strong> {result.permutation} farklı şekilde dizilebilir.</span>
                      )}
                    </div>
                  </div>

                  {/* Kombinasyon Karşılaştırması */}
                  {permType === 'standard' && (
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-black/5 dark:border-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase block">
                          Sırasız Durum (Kombinasyon - C(n, r))
                        </span>
                        <div className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-0.5 font-mono">
                          {result.combination}
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 text-right">
                        Yalnızca seçim <br />olduğunda
                      </span>
                    </div>
                  )}

                  {/* Formül ve Adımlar */}
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
                          navigator.clipboard.writeText(`P(${result.n}, ${result.r}) = ${result.permutation}\n${result.stepFormula}\n${result.stepExplanation}`);
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
                  Lütfen parametreleri kontrol edin.
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
          Permütasyon Nedir ve Nasıl Hesaplanır?
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Permütasyon Tanımı</h4>
            <p>
              Matematikte <strong>permütasyon</strong>, bir eleman kümesinden belirli elemanların seçilerek belirli bir <strong>sıraya göre</strong> dizilmesidir. Kombinasyondan en önemli farkı, sıralamanın önemli olmasıdır. Örneğin {`{A, B}`} ve {`{B, A}`} dizilimleri iki farklı permütasyonu temsil eder.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Permütasyon Formülleri</h4>
            <ul className="space-y-3 pl-4 list-disc">
              <li>
                <strong>Standart Permütasyon Formülü:</strong> n elemanlı bir kümeden seçilen r elemanın sıralanma sayısı:
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg font-mono text-center text-[#0056b3] dark:text-blue-400 mt-1">
                  P(n, r) = n! / (n - r)!
                </div>
              </li>
              <li>
                <strong>Tekrarlı Sıralama:</strong> Aynı elemanın tekrar tekrar kullanılabildiği durumlarda (örneğin kilit şifresi) sıralama formülü:
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg font-mono text-center text-[#0056b3] dark:text-blue-400 mt-1">
                  P_tekrar = n^r
                </div>
              </li>
              <li>
                <strong>Dairesel Permütasyon:</strong> Nesnelerin dairesel bir düzen (yuvarlak masa vb.) etrafında sıralanması durumunda:
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg font-mono text-center text-[#0056b3] dark:text-blue-400 mt-1">
                  P_daire = (n - 1)!
                </div>
              </li>
            </ul>
          </section>

          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular (FAQ)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Permütasyon nerede kullanılır?</h5>
                <p>Şifre kombinasyonları oluşturma, yarışmalardaki ilk 3 dereceyi belirleme, spor takımlarının sıralanması, koltuk düzenlemeleri gibi sıralama ve dizilimin önemli olduğu her alanda permütasyon kullanılır.</p>
              </div>
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">P(n, 0) ve P(n, n) neye eşittir?</h5>
                <p>P(n, 0) her zaman 1'e eşittir (hiçbir şey seçmeyerek dizilim yapmanın tek bir yolu vardır). P(n, n) ise n! (n faktöriyel) değerine eşittir.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* 5. DİĞER ARAÇLAR */}
      
      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Permütasyon Hesaplama [P(n, r)] Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              Permütasyon Hesaplama [P(n, r)] aracını kullanmak son derece basit ve kullanıcı dostudur. İlgili form alanlarına elinizdeki verileri eksiksiz ve doğru bir şekilde girdiğinizden emin olun. Tüm alanları doldurduktan sonra "Hesapla" butonuna tıklayarak sonuçları anında görüntüleyebilirsiniz. Aracımız, girdiğiniz değerleri anlık olarak işler ve herhangi bir sayfaya yönlendirme yapmadan, bulunduğunuz ekran üzerinde size en net ve kesin verileri sunar. İhtiyaç duyduğunuz her an bu aracı tamamen ücretsiz olarak kullanabilir, dilerseniz sonuçları kopyalayarak farklı platformlarda kolayca paylaşabilirsiniz. Zaman kaybetmeden, en karmaşık hesaplamaları bile saniyeler içinde tamamlamanın ayrıcalığını yaşayın.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Permütasyon Hesaplama [P(n, r)] Nedir ve Nasıl Hesaplanır?</h4>
            <p>
              Permütasyon Hesaplama [P(n, r)], kullanıcıların günlük hayatta veya profesyonel iş süreçlerinde sıklıkla ihtiyaç duyduğu matematiksel veya istatistiksel hesaplamaları pratik bir şekilde çözmek amacıyla geliştirilmiş kapsamlı bir dijital araçtır. Geleneksel yöntemlerle yapıldığında hata payı yüksek olan ve uzun zaman alan bu tür işlemler, gelişmiş altyapımız sayesinde otomatik olarak hatasız bir biçimde gerçekleştirilir. 
            </p>
            <p className="mt-4">
              Hesaplama arka planda, genel kabul görmüş evrensel formüller, en güncel yasal mevzuatlar veya resmi olarak açıklanmış standart oranlar kullanılarak yapılmaktadır. Veriler sisteme girildiği anda, algoritma bu güncel parametreleri referans alarak verilerinizi analiz eder ve sonuçları net bir şekilde ekranınıza yansıtır. Finansal, istatistiksel veya gündelik hesaplamalar fark etmeksizin her daim doğru ve güvenilir bilgiye ulaşmanız hedeflenmektedir. Bu aracı kullanarak iş akışınızı hızlandırabilir ve hata payını sıfıra indirebilirsiniz.
            </p>
          </section>

          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular (SSS)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Permütasyon Hesaplama [P(n, r)] aracı ücretli midir?</h5>
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
      <RelatedTools category="matematik" currentToolId="permutasyon-hesaplama" />

      {/* 6. SORUMLULUK REDDİ */}
      <Disclaimer category="matematik" />
    </div>
  );
}
