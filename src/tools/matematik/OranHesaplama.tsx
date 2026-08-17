import React, { useState, useEffect } from 'react';
import { ChevronRight, RefreshCw, Copy, Info, AlertCircle, Sparkles, Scale, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToolIcon } from '../../components/icons/ToolIcon';
import { AdSlot } from '../../components/ads/AdSlot';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { RelatedTools } from '../../components/tools/RelatedTools';

export default function OranHesaplama() {
  // Tab 1: Orantı Çözücü (A:B = C:D)
  const [valA, setValA] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [valB, setValB] = useState<string>('');
  const [valC, setValC] = useState<string>('');
  const [valD, setValD] = useState<string>('x'); // 'x' designates the unknown value

  const [solveResult, setSolveResult] = useState<{
    equation: string;
    steps: string[];
    value: string;
  } | null>(null);

  // Tab 2: Oran Sadeleştirme
  const [simpNum1, setSimpNum1] = useState<string>('');
  const [simpNum2, setSimpNum2] = useState<string>('');
  const [simpResult, setSimpResult] = useState<{
    original: string;
    simplified: string;
    gcd: number;
    decimal: string;
    percentage: string;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'solver' | 'simplify'>('solver');

  // En büyük ortak bölen (EBOB)
  const findGCD = (a: number, b: number): number => {
    let x = Math.abs(a);
    let y = Math.abs(b);
    while (y) {
      const t = y;
      y = x % y;
      x = t;
    }
    return x;
  };

  const solveProportion = () => {
    setError(null);
    setSolveResult(null);

    const inputs = [valA, valB, valC, valD];
    const xCount = inputs.filter(v => v.trim().toLowerCase() === 'x').length;

    if (xCount !== 1) {
      setError("Lütfen bilinmeyen değer olarak tam olarak bir kutuya 'x' yazınız.");
      return;
    }

    const numA = parseFloat(valA);
    const numB = parseFloat(valB);
    const numC = parseFloat(valC);
    const numD = parseFloat(valD);

    const isA_X = valA.trim().toLowerCase() === 'x';
    const isB_X = valB.trim().toLowerCase() === 'x';
    const isC_X = valC.trim().toLowerCase() === 'x';
    const isD_X = valD.trim().toLowerCase() === 'x';

    // Sıfır kontrolü
    if ((isA_X && (numB === 0 || numD === 0)) ||
        (isB_X && (numD === 0)) || // B x ise paydadadır, A/x = C/D. C sıfır ise çözülemez
        (isC_X && (numB === 0 || numD === 0)) ||
        (isD_X && (numB === 0))) {
      setError("Payda sıfır olamaz. Lütfen geçerli sayılar girin.");
      return;
    }

    let calculatedX = 0;
    const steps: string[] = [];
    let eqStr = "";

    if (isA_X) {
      // x / B = C / D => x = (B * C) / D
      if (isNaN(numB) || isNaN(numC) || isNaN(numD)) {
        setError("Lütfen diğer 3 değeri geçerli sayı olarak girin.");
        return;
      }
      if (numD === 0) {
        setError("Payda (D) sıfır olamaz.");
        return;
      }
      calculatedX = (numB * numC) / numD;
      eqStr = `x / ${numB} = ${numC} / ${numD}`;
      steps.push(`İçler dışlar çarpımı yapılır: x × ${numD} = ${numB} × ${numC}`);
      steps.push(`${numD}x = ${numB * numC}`);
      steps.push(`x = ${numB * numC} / ${numD}`);
    } else if (isB_X) {
      // A / x = C / D => x = (A * D) / C
      if (isNaN(numA) || isNaN(numC) || isNaN(numD)) {
        setError("Lütfen diğer 3 değeri geçerli sayı olarak girin.");
        return;
      }
      if (numC === 0) {
        setError("Payda (C) sıfır olamaz. Orantı çözülemez.");
        return;
      }
      calculatedX = (numA * numD) / numC;
      eqStr = `${numA} / x = ${numC} / ${numD}`;
      steps.push(`İçler dışlar çarpımı yapılır: x × ${numC} = ${numA} × ${numD}`);
      steps.push(`${numC}x = ${numA * numD}`);
      steps.push(`x = ${numA * numD} / ${numC}`);
    } else if (isC_X) {
      // A / B = x / D => x = (A * D) / B
      if (isNaN(numA) || isNaN(numB) || isNaN(numD)) {
        setError("Lütfen diğer 3 değeri geçerli sayı olarak girin.");
        return;
      }
      if (numB === 0) {
        setError("Payda (B) sıfır olamaz.");
        return;
      }
      calculatedX = (numA * numD) / numB;
      eqStr = `${numA} / ${numB} = x / ${numD}`;
      steps.push(`İçler dışlar çarpımı yapılır: x × ${numB} = ${numA} × ${numD}`);
      steps.push(`${numB}x = ${numA * numD}`);
      steps.push(`x = ${numA * numD} / ${numB}`);
    } else if (isD_X) {
      // A / B = C / x => x = (B * C) / A
      if (isNaN(numA) || isNaN(numB) || isNaN(numC)) {
        setError("Lütfen diğer 3 değeri geçerli sayı olarak girin.");
        return;
      }
      if (numA === 0) {
        setError("Payda (A) sıfır olamaz. Orantı çözülemez.");
        return;
      }
      calculatedX = (numB * numC) / numA;
      eqStr = `${numA} / ${numB} = ${numC} / x`;
      steps.push(`İçler dışlar çarpımı yapılır: x × ${numA} = ${numB} × ${numC}`);
      steps.push(`${numA}x = ${numB * numC}`);
      steps.push(`x = ${numB * numC} / ${numA}`);
    }

    const formattedX = Number.isInteger(calculatedX) ? calculatedX.toString() : calculatedX.toFixed(4);

    setSolveResult({
      equation: eqStr,
      steps,
      value: formattedX
    });
  };

  const simplifyRatio = () => {
    setError(null);
    setSimpResult(null);

    const n1 = parseInt(simpNum1, 10);
    const n2 = parseInt(simpNum2, 10);

    if (isNaN(n1) || isNaN(n2)) {
      setError("Lütfen geçerli tam sayılar giriniz.");
      return;
    }

    if (n1 <= 0 || n2 <= 0) {
      setError("Sadeleştirme için değerler sıfırdan büyük olmalıdır.");
      return;
    }

    const gcd = findGCD(n1, n2);
    const s1 = n1 / gcd;
    const s2 = n2 / gcd;

    const decimalValue = (n1 / n2).toFixed(4);
    const percentageValue = ((n1 / n2) * 100).toFixed(2);

    setSimpResult({
      original: `${n1} : ${n2}`,
      simplified: `${s1} : ${s2}`,
      gcd,
      decimal: Number.isInteger(n1 / n2) ? (n1 / n2).toString() : decimalValue,
      percentage: percentageValue + '%'
    });
  };

  useEffect(() => {
    if (activeTab === 'solver') {
      solveProportion();
    } else {
      simplifyRatio();
    }
  }, [valA, valB, valC, valD, simpNum1, simpNum2, activeTab]);

  const handleClear = () => {
    if (activeTab === 'solver') {
      setValA('10');
      setValB('20');
      setValC('30');
      setValD('x');
    } else {
      setSimpNum1('120');
      setSimpNum2('180');
    }
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
        <span className="text-slate-800 dark:text-slate-300">Oran Hesaplama</span>
      </div>

      {/* 2. BAŞLIK VE AÇIKLAMA */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Oran Hesaplama ve Sadeleştirme 2026 - Ücretsiz ve Hızlı Sonuçlar</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Doğru orantı denklemlerini çözün (A:B = C:D) veya iki sayının oranını en yalın haline sadeleştirerek yüzde ve ondalık karşılıklarını görün.
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-px">
        <button
          onClick={() => { setActiveTab('solver'); setError(null); }}
          className={`pb-2.5 px-4 text-sm font-bold transition-all relative ${
            activeTab === 'solver'
              ? 'text-[#0056b3] dark:text-blue-400 border-b-2 border-[#0056b3] dark:border-blue-400'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
          }`}
        >
          Orantı Çözücü (A:B = C:D)
        </button>
        <button
          onClick={() => { setActiveTab('simplify'); setError(null); }}
          className={`pb-2.5 px-4 text-sm font-bold transition-all relative ${
            activeTab === 'simplify'
              ? 'text-[#0056b3] dark:text-blue-400 border-b-2 border-[#0056b3] dark:border-blue-400'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
          }`}
        >
          Oran Sadeleştirme
        </button>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      {/* HESAPLAMA KAPSAYICISI */}
      <div className="calculator-container mb-8 relative border-4 border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-8 mt-8">
        <div className="absolute -top-4 left-4 sm:left-8 bg-[#eef2f7] dark:bg-slate-950 px-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Scale size={20} className="text-[#0056b3] dark:text-blue-400" />
            {activeTab === 'solver' ? 'Orantı Denklemi Çöz' : 'İki Oranı Sadeleştir'}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          {/* SOL: Girdiler */}
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

            {activeTab === 'solver' ? (
              <div className="space-y-6">
                <p className="text-xs text-slate-500 leading-normal">
                  Bilinmeyen kutuya küçük harfle <strong>x</strong> yazın. Diğer kutulara sayıları yazıp orantı sonucunu görün.
                </p>

                <div className="grid grid-cols-5 items-center gap-2 text-center">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">A</label>
                    <input placeholder="Örn: 10"
                      type="text"
                      value={valA}
                      onChange={(e) => setValA(e.target.value)}
                      className="w-full text-center bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl py-3 text-slate-800 dark:text-white font-mono font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 focus:border-[#0056b3]"
                    />
                  </div>
                  <div className="text-slate-400 font-bold text-lg mt-4">:</div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">B</label>
                    <input placeholder="Örn: 20"
                      type="text"
                      value={valB}
                      onChange={(e) => setValB(e.target.value)}
                      className="w-full text-center bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl py-3 text-slate-800 dark:text-white font-mono font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 focus:border-[#0056b3]"
                    />
                  </div>
                </div>

                <div className="flex justify-center my-2">
                  <span className="text-2xl font-black text-slate-400">=</span>
                </div>

                <div className="grid grid-cols-5 items-center gap-2 text-center">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">C</label>
                    <input placeholder="Örn: 30"
                      type="text"
                      value={valC}
                      onChange={(e) => setValC(e.target.value)}
                      className="w-full text-center bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl py-3 text-slate-800 dark:text-white font-mono font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 focus:border-[#0056b3]"
                    />
                  </div>
                  <div className="text-slate-400 font-bold text-lg mt-4">:</div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">D</label>
                    <input
                      type="text"
                      value={valD}
                      onChange={(e) => setValD(e.target.value)}
                      className="w-full text-center bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl py-3 text-slate-800 dark:text-white font-mono font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 focus:border-[#0056b3]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <span className="block text-[11px] font-bold text-slate-400 uppercase mb-2">Hızlı Örnekler</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => { setValA('5'); setValB('10'); setValC('x'); setValD('40'); }}
                      className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-black/5 dark:border-white/5"
                    >
                      5 : 10 = x : 40
                    </button>
                    <button
                      type="button"
                      onClick={() => { setValA('x'); setValB('15'); setValC('4'); setValD('12'); }}
                      className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-black/5 dark:border-white/5"
                    >
                      x : 15 = 4 : 12
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Birinci Sayı (Pay)</label>
                  <input placeholder="Örn: 120"
                    type="number"
                    value={simpNum1}
                    onChange={(e) => setSimpNum1(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">İkinci Sayı (Payda)</label>
                  <input placeholder="Örn: 180"
                    type="number"
                    value={simpNum2}
                    onChange={(e) => setSimpNum2(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white font-bold"
                  />
                </div>

                <div className="pt-2">
                  <span className="block text-[11px] font-bold text-slate-400 uppercase mb-2">Hızlı Sayılar</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => { setSimpNum1('60'); setSimpNum2('90'); }}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border"
                    >
                      60 : 90
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSimpNum1('1920'); setSimpNum2('1080'); }}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border"
                    >
                      1080p Ekran Oranı (1920:1080)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SAĞ: Sonuç Ekranı */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 flex-1 relative overflow-hidden shadow-lg border border-black/5 dark:border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4 border-b border-black/5 dark:border-white/5 pb-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">HESAPLAMA ÇIKTISI</h3>
              </div>

              {activeTab === 'solver' && solveResult ? (
                <div className="space-y-4 flex-1">
                  <div className="bg-emerald-50/60 dark:bg-emerald-900/10 border border-emerald-100/60 dark:border-emerald-900/20 p-5 rounded-2xl">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Bilinmeyen Değer (x)</span>
                    <div className="text-4xl font-black text-emerald-700 dark:text-emerald-400 mt-1 font-mono">
                      x = {solveResult.value}
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Çözüm Adımları</span>
                    <div className="font-mono text-xs text-slate-500 dark:text-slate-400 font-bold mb-2">
                      {solveResult.equation}
                    </div>
                    <ul className="space-y-1.5">
                      {solveResult.steps.map((step, idx) => (
                        <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                          <span className="font-bold text-[#0056b3] shrink-0">{idx + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => {
    navigator.clipboard.writeText(`x = ${solveResult.value}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }}
  className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white border border-black/5 dark:border-transparent font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all backdrop-blur-sm active:scale-[0.98] text-sm"
  >
  {copied ? <Check size={16} className="text-emerald-500 transition-transform scale-110" /> : <Copy size={16} />}
  {copied ? 'Sonuç Kopyalandı!' : 'Değeri Kopyala'}
                  </button>
                </div>
              ) : activeTab === 'simplify' && simpResult ? (
                <div className="space-y-4 flex-1">
                  <div className="bg-emerald-50/60 dark:bg-emerald-900/10 border border-emerald-100/60 dark:border-emerald-900/20 p-5 rounded-2xl">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Sadeleşmiş En Sade Oran</span>
                    <div className="text-4xl font-black text-emerald-700 dark:text-emerald-400 mt-1 font-mono">
                      {simpResult.simplified}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      Sayılar ortak en büyük bölen olan <strong>{simpResult.gcd}</strong> ile sadeleştirildi.
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Ondalık Değer</span>
                      <div className="text-xl font-bold text-slate-800 dark:text-slate-200 font-mono mt-1">
                        {simpResult.decimal}
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Yüzde Oran</span>
                      <div className="text-xl font-bold text-[#0056b3] dark:text-blue-400 font-mono mt-1">
                        {simpResult.percentage}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
    navigator.clipboard.writeText(`${simpResult.original} = ${simpResult.simplified}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }}
  className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white border border-black/5 dark:border-transparent font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all backdrop-blur-sm active:scale-[0.98] text-sm"
  >
  {copied ? <Check size={16} className="text-emerald-500 transition-transform scale-110" /> : <Copy size={16} />}
  {copied ? 'Sonuç Kopyalandı!' : 'Sadeleşmiş Hali Kopyala'}
                  </button>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400">
                  Lütfen girdileri kontrol edin.
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
          Oran ve Orantı Nedir?
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3 font-semibold">Oran Nedir?</h4>
            <p>
              İki çokluğun veya büyüklüğün birbirine bölünerek karşılaştırılmasına <strong>oran</strong> denir. Örneğin, bir sınıfta 12 kız ve 18 erkek varsa, kız öğrencilerin erkek öğrencilere oranı 12 / 18, yani sadeleştirildiğinde 2 / 3'tür (2:3).
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3 font-semibold">Orantı Nedir?</h4>
            <p>
              En az iki oranın birbirine eşit olmasına ise <strong>orantı</strong> denir. A:B = C:D ifadesi bir orantıdır. Bu denklemde eğer elemanlardan biri bilinmiyorsa (x), içler dışlar çarpımı yapılarak bilinmeyen değer kolayca hesaplanabilir:
            </p>
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl font-mono text-center text-sm text-[#0056b3] dark:text-blue-400">
              A × D = B × C
            </div>
          </section>

          
          <div className="pt-2">
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Kullanılan Formüller:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  Doğru Orantı (A / B = C / X) ➔ İçler Dışlar Çarpımı: X = (B × C) / A
                </div>
              </div>
            </div>
          </div>
          
          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4 font-semibold">Sıkça Sorulan Sorular (FAQ)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2 font-semibold">İçler dışlar çarpımı nasıl çalışır?</h5>
                <p>Orantıdaki sol payda ile sağ payın, sol pay ile sağ paydanın çarpılarak eşitlenmesidir. A/B = C/D denkleminde A × D ile B × C çarpımları her zaman eşittir.</p>
              </div>
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2 font-semibold">Altın oran nedir?</h5>
                <p>Matematik ve sanatta bir bütünün parçaları arasında gözlemlenen, uyum açısından en yetkin boyutları verdiği sanılan geometrik ve sayısal bir oran bağıntısıdır. Yaklaşık olarak 1,618'e eşittir.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* 5. DİĞER ARAÇLAR */}
      
      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Oran Hesaplama ve Sadeleştirme Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              Oran Hesaplama ve Sadeleştirme aracını kullanmak son derece basit ve kullanıcı dostudur. İlgili form alanlarına elinizdeki verileri eksiksiz ve doğru bir şekilde girdiğinizden emin olun. Tüm alanları doldurduktan sonra "Hesapla" butonuna tıklayarak sonuçları anında görüntüleyebilirsiniz. Aracımız, girdiğiniz değerleri anlık olarak işler ve herhangi bir sayfaya yönlendirme yapmadan, bulunduğunuz ekran üzerinde size en net ve kesin verileri sunar. İhtiyaç duyduğunuz her an bu aracı tamamen ücretsiz olarak kullanabilir, dilerseniz sonuçları kopyalayarak farklı platformlarda kolayca paylaşabilirsiniz. Zaman kaybetmeden, en karmaşık hesaplamaları bile saniyeler içinde tamamlamanın ayrıcalığını yaşayın.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Oran Hesaplama ve Sadeleştirme Nedir ve Nasıl Hesaplanır?</h4>
            <p>
              Oran Hesaplama ve Sadeleştirme, kullanıcıların günlük hayatta veya profesyonel iş süreçlerinde sıklıkla ihtiyaç duyduğu matematiksel veya istatistiksel hesaplamaları pratik bir şekilde çözmek amacıyla geliştirilmiş kapsamlı bir dijital araçtır. Geleneksel yöntemlerle yapıldığında hata payı yüksek olan ve uzun zaman alan bu tür işlemler, gelişmiş altyapımız sayesinde otomatik olarak hatasız bir biçimde gerçekleştirilir. 
            </p>
            <p className="mt-4">
              Hesaplama arka planda, genel kabul görmüş evrensel formüller, en güncel yasal mevzuatlar veya resmi olarak açıklanmış standart oranlar kullanılarak yapılmaktadır. Veriler sisteme girildiği anda, algoritma bu güncel parametreleri referans alarak verilerinizi analiz eder ve sonuçları net bir şekilde ekranınıza yansıtır. Finansal, istatistiksel veya gündelik hesaplamalar fark etmeksizin her daim doğru ve güvenilir bilgiye ulaşmanız hedeflenmektedir. Bu aracı kullanarak iş akışınızı hızlandırabilir ve hata payını sıfıra indirebilirsiniz.
            </p>
          </section>

          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular (SSS)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Oran Hesaplama ve Sadeleştirme aracı ücretli midir?</h5>
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
      <RelatedTools category="matematik" currentToolId="oran-hesaplama" />

      {/* 6. SORUMLULUK REDDİ */}
      <Disclaimer category="matematik" />
    </div>
  );
}
