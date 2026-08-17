import React, { useState } from 'react';
import { ChevronRight, RefreshCw, Copy, Info, AlertCircle, Plus, Trash2, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToolIcon } from '../../components/icons/ToolIcon';
import { AdSlot } from '../../components/ads/AdSlot';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { RelatedTools } from '../../components/tools/RelatedTools';

export default function EbobEkokHesaplama() {
  const [numbers, setNumbers] = useState<string[]>(['', '']);
  const [copied, setCopied] = useState<boolean>(false);
  const [result, setResult] = useState<{
    ebob: number;
    ekok: number;
    steps: { prime: number; divisions: number[]; selectedForEbob: boolean }[];
    factorizations: { num: number; factors: string }[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addNumberField = () => {
    if (numbers.length >= 8) {
      setError("En fazla 8 sayı ekleyebilirsiniz.");
      return;
    }
    setNumbers([...numbers, '']);
    setError(null);
  };

  const removeNumberField = (index: number) => {
    if (numbers.length <= 2) {
      setError("En az 2 sayı olmalıdır.");
      return;
    }
    const updated = [...numbers];
    updated.splice(index, 1);
    setNumbers(updated);
    setError(null);
  };

  const handleNumberChange = (index: number, val: string) => {
    const updated = [...numbers];
    updated[index] = val;
    setNumbers(updated);
    setError(null);
  };

  // Helper functions for GCD and LCM
  const getGcd = (a: number, b: number): number => {
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  const getLcm = (a: number, b: number): number => {
    if (a === 0 || b === 0) return 0;
    return Math.abs(a * b) / getGcd(a, b);
  };

  const hesapla = () => {
    const parsedNums = numbers
      .map(n => parseInt(n.trim(), 10))
      .filter(n => !isNaN(n));

    if (parsedNums.length < 2) {
      setError("Lütfen en az 2 geçerli sayı girin.");
      setResult(null);
      return;
    }

    if (parsedNums.some(n => n <= 0)) {
      setError("Sayılar sıfırdan büyük pozitif tam sayılar olmalıdır.");
      setResult(null);
      return;
    }

    if (parsedNums.some(n => n > 100000)) {
      setError("Performans nedeniyle lütfen 100.000'den küçük sayılar girin.");
      setResult(null);
      return;
    }

    setError(null);

    // Calculate EBOB (GCD) of all numbers
    let currentEbob = parsedNums[0];
    for (let i = 1; i < parsedNums.length; i++) {
      currentEbob = getGcd(currentEbob, parsedNums[i]);
    }

    // Calculate EKOK (LCM) of all numbers
    let currentEkok = parsedNums[0];
    for (let i = 1; i < parsedNums.length; i++) {
      currentEkok = getLcm(currentEkok, parsedNums[i]);
    }

    // Generate Step-by-Step Joint Division Table (Ortak Bölen Algoritması)
    const workingNums = [...parsedNums];
    const steps: { prime: number; divisions: number[]; selectedForEbob: boolean }[] = [];
    let divisor = 2;

    while (workingNums.some(n => n > 1)) {
      let dividedAny = false;
      const preDivision = [...workingNums];
      const postDivision: number[] = [];
      let isCommonDivisor = true;

      for (let i = 0; i < workingNums.length; i++) {
        if (workingNums[i] % divisor === 0) {
          workingNums[i] = workingNums[i] / divisor;
          dividedAny = true;
        } else {
          isCommonDivisor = false;
        }
        postDivision.push(workingNums[i]);
      }

      if (dividedAny) {
        steps.push({
          prime: divisor,
          divisions: preDivision,
          selectedForEbob: isCommonDivisor
        });
      } else {
        divisor++;
      }
    }

    // Individual prime factorizations for details
    const factorizations = parsedNums.map(originalNum => {
      let num = originalNum;
      const factors: number[] = [];
      let d = 2;
      while (num > 1) {
        while (num % d === 0) {
          factors.push(d);
          num /= d;
        }
        d++;
      }
      
      // Format as exponents: e.g. 2^3 * 3^1
      const counts: { [key: number]: number } = {};
      factors.forEach(f => { counts[f] = (counts[f] || 0) + 1; });
      const factorString = Object.keys(counts)
        .map(f => `${f}${counts[Number(f)] > 1 ? `<sup>${counts[Number(f)]}</sup>` : ''}`)
        .join(' × ') || '1';

      return { num: originalNum, factors: factorString };
    });

    setResult({
      ebob: currentEbob,
      ekok: currentEkok,
      steps,
      factorizations
    });
  };

  const temizle = () => {
    setNumbers(['', '']);
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
        <span className="text-slate-800 dark:text-slate-300">EBOB EKOK Hesaplama</span>
      </div>

      {/* 2. BAŞLIK VE AÇIKLAMA */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">EBOB EKOK Hesaplama 2026 - Ücretsiz ve Hızlı Sonuçlar</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Girdiğiniz iki veya daha fazla pozitif tam sayının En Büyük Ortak Bölenini (EBOB) ve En Küçük Ortak Katını (EKOK) adım adım bölen listesi yöntemiyle hesaplayın.
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
            EBOB ve EKOK Bulma
          </h2>
        </div>

        {/* 3. ANA UYGULAMA ALANI */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          
          {/* SOL: Girdi (Input) Formu */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-[#0056b3] dark:text-blue-400 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20v-8m0 0V4m0 8h8m-8 0H4"/></svg>
                </span>
                Sayıları Girin
              </h2>
              <button onClick={temizle} className="text-[12px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1.5 transition-colors">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {numbers.map((num, idx) => (
                  <div key={idx} className="relative group">
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                      {idx + 1}. Sayı <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        value={num}
                        onChange={(e) => handleNumberChange(idx, e.target.value)}
                        placeholder={`Örn: ${idx === 0 ? '12' : idx === 1 ? '18' : '24'}`}
                        min="1"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-700 dark:text-white font-semibold focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all"
                      />
                      {numbers.length > 2 && (
                        <button
                          onClick={() => removeNumberField(idx)}
                          className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors border border-black/5 dark:border-white/5"
                          title="Sayıyı Kaldır"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={addNumberField}
                  className="flex-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl py-3 border border-black/10 dark:border-white/10 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Plus size={16} /> Başka Sayı Ekle
                </button>
                <button 
                  onClick={hesapla} 
                  className="flex-[2] bg-[#0056b3] hover:bg-[#004494] text-white font-bold rounded-xl py-3 transition-all shadow-sm active:scale-[0.98]"
                >
                  EBOB - EKOK Bul
                </button>
              </div>
            </div>
          </div>

          {/* SAĞ: Sonuç (Result) Paneli */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 flex-1 relative overflow-hidden shadow-lg border border-black/5 dark:border-slate-800">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6 border-b border-black/5 dark:border-white/5 pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-white">Hesaplama Sonuçları</h3>
                </div>

                {result ? (
                  <div className="flex-1 flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-900/20 p-4 rounded-2xl text-center">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">EBOB (Ortak Bölen)</span>
                        <div className="text-3xl font-black text-[#0056b3] dark:text-blue-400 mt-1">
                          {result.ebob}
                        </div>
                      </div>
                      <div className="bg-teal-50/50 dark:bg-teal-900/10 border border-teal-100/50 dark:border-teal-900/20 p-4 rounded-2xl text-center">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">EKOK (Ortak Kat)</span>
                        <div className="text-3xl font-black text-teal-600 dark:text-teal-400 mt-1">
                          {result.ekok}
                        </div>
                      </div>
                    </div>

                    {/* Step-by-Step Ortak Bölen Listesi */}
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">Ortak Asal Bölen Algoritması</h4>
                      <div className="max-h-48 overflow-y-auto pr-1 border border-black/5 dark:border-white/5 rounded-xl">
                        <table className="w-full text-xs text-left">
                          <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-b border-black/5 dark:border-white/5">
                              <th className="py-2 px-3">Adım Sayıları</th>
                              <th className="py-2 px-2 text-right">Bölen</th>
                              <th className="py-2 px-3 text-center">EBOB Ortak Bölen?</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-black/5 dark:divide-white/5 font-mono">
                            {result.steps.map((step, idx) => (
                              <tr key={idx} className={step.selectedForEbob ? "bg-blue-50/20 dark:bg-blue-900/5" : ""}>
                                <td className="py-2 px-3 text-slate-600 dark:text-slate-300">
                                  {step.divisions.join(' , ')}
                                </td>
                                <td className="py-2 px-2 text-right font-bold text-slate-900 dark:text-white">
                                  {step.prime}
                                </td>
                                <td className="py-2 px-3 text-center">
                                  {step.selectedForEbob ? (
                                    <span className="bg-blue-100 dark:bg-blue-900/40 text-[#0056b3] dark:text-blue-300 text-[10px] px-2 py-0.5 rounded-full font-bold">✓ Evet</span>
                                  ) : (
                                    <span className="text-slate-400 dark:text-slate-600">-</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Exponent Forms */}
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Asal Çarpanlarına Ayrılmış Haller</h4>
                      <div className="space-y-1.5 max-h-24 overflow-y-auto">
                        {result.factorizations.map((f, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs border-b border-black/5 dark:border-white/5 pb-1 last:border-0">
                            <span className="font-bold text-slate-700 dark:text-slate-300">{f.num}:</span>
                            <span className="font-mono text-slate-900 dark:text-slate-200" dangerouslySetInnerHTML={{ __html: f.factors }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col justify-center items-center py-12 text-slate-400 dark:text-slate-500">
                    <svg className="w-12 h-12 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-3-3V18m-3-3V18m3-12h.008v.008H12V6zm0 2.25h.008v.008H12V8.25zm0 2.25h.008v.008H12V10.5zm0 2.25h.008v.008H12v-.008zm1.5-4.5h.008v.008H13.5V8.25zm-3 0h.008v.008H10.5V8.25zm3 2.25h.008v.008H13.5V10.5zm-3 0h.008v.008H10.5V10.5z" />
                    </svg>
                    <p className="text-sm font-semibold">Sayıları girip "Hesapla" butonuna basın</p>
                    <p className="text-[11px] mt-1 text-center">Algoritma tüm ortak ve asal çarpanları adım adım çıkaracaktır.</p>
                  </div>
                )}

                {result && (
                  <button
                    type="button"
                    onClick={() => {
                      if (result) {
                        navigator.clipboard.writeText(`EBOB: ${result.ebob}\nEKOK: ${result.ekok}\nGirilen Sayılar: ${numbers.filter(Boolean).join(', ')}`);
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

      {/* 4. SEO & BİLGİLENDİRME ALANI (MİNİMUM 300-500 KELİME) */}
      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          EBOB EKOK Nedir? Nasıl Hesaplanır?
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          
          {/* NASIL KULLANILIR */}
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              EBOB EKOK hesaplama aracımız ile girdiğiniz sayıların matematiksel çözümünü bulmak son derece basittir:
            </p>
            <ul className="list-decimal pl-5 space-y-2">
              <li>İlk olarak en az 2 adet sayı giriniz. Daha fazla sayı ile hesaplamak isterseniz <strong>"Başka Sayı Ekle"</strong> butonuna basarak yeni alanlar ekleyebilirsiniz (En fazla 8 sayıya kadar).</li>
              <li>Hesaplamak istediğiniz pozitif tam sayıları girdikten sonra <strong>"EBOB - EKOK Bul"</strong> butonuna tıklayın.</li>
              <li>Algoritma, sayıların tüm asal bölenlerini adım adım bir bölme tablosunda listeler ve ortak olanları işaretleyerek EBOB ile EKOK değerlerini anında sunar.</li>
            </ul>
          </section>

          {/* NEDİR VE NASIL HESAPLANIR */}
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">EBOB ve EKOK Nedir?</h4>
            <p>
              <strong>EBOB (En Büyük Ortak Bölen):</strong> İki veya daha fazla sayıyı aynı anda tam olarak bölebilen en büyük pozitif tam sayıdır. Örneğin, 12 ve 18 sayılarının bölenlerini incelersek; her ikisini de bölen ortak sayılar 1, 2, 3 ve 6'dır. Bu ortak bölenlerin en büyüğü 6 olduğu için EBOB(12, 18) = 6 olarak bulunur.
            </p>
            <p>
              <strong>EKOK (En Küçük Ortak Kat):</strong> İki veya daha fazla sayının ortak olan katlarının en küçüğüdür. Diğer bir deyişle, bu sayıların her birine tam bölünebilen en küçük ortak pozitif tam sayıdır. Örneğin, 12 ve 18 sayılarının katlarını alırsak (12, 24, 36, 48...) ve (18, 36, 54...), ortak olan katların en küçüğü 36'dır. Dolayısıyla EKOK(12, 18) = 36 elde edilir.
            </p>
          </section>

          {/* KULLANILAN FORMÜLLER */}
          <div className="pt-2">
            <div className="space-y-6 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">EBOB ve EKOK Arasındaki Temel İlişki Formülü:</div>
                <p className="text-xs text-slate-500 mb-2">İki sayı (a ve b) için EBOB ve EKOK değerlerinin çarpımı, o iki sayının çarpımına eşittir:</p>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  EBOB(a, b) × EKOK(a, b) = a × b
                </div>
              </div>
            </div>
          </div>
          
          {/* SSS */}
          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular (FAQ)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">3 veya daha fazla sayının EBOB ve EKOK'u nasıl hesaplanır?</h5>
                <p>3 veya daha fazla sayı hesaplanırken, ilk iki sayının EBOB/EKOK'u bulunur, ardından çıkan sonuç ile üçüncü sayının EBOB/EKOK'u hesaplanır. Bu işlem tüm sayılar bitene kadar ardışık olarak uygulanır. Gelişmiş EBOB EKOK bulucumuz bu işlemi arka planda tüm sayılar için otomatik olarak saniyeler içerisinde tamamlar.</p>
              </div>
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Ardışık iki sayının EBOB ve EKOK'u nedir?</h5>
                <p>Ardışık tam sayılar aralarında asaldır. Aralarında asal olan sayıların ortak bölenleri yalnızca 1 olduğu için EBOB değerleri daima 1'dir. EKOK değerleri ise bu iki sayının çarpımına eşittir. Örneğin, 8 ve 9 ardışık sayılarının EBOB'u 1, EKOK'u ise 8 × 9 = 72'dir.</p>
              </div>
            </div>
          </section>
          
        </div>
      </div>

      {/* 5. DİĞER ARAÇLAR */}
      <RelatedTools category="matematik" currentToolId="ebob-ekok-hesaplama" />

      {/* 6. SORUMLULUK REDDİ */}
      <Disclaimer category="matematik" />
    </div>
  );
}
