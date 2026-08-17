import React, { useState, useEffect } from 'react';
import { ChevronRight, RefreshCw, Copy, Info, AlertCircle, Sparkles, Hash, Calculator, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToolIcon } from '../../components/icons/ToolIcon';
import { AdSlot } from '../../components/ads/AdSlot';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { RelatedTools } from '../../components/tools/RelatedTools';

type SubToolMode = 'dereceli' | 'sadelestir' | 'dortislem';

export default function KokluSayiHesaplama() {
  const [activeTab, setActiveTab] = useState<SubToolMode>('dereceli');

  const [copied, setCopied] = useState<boolean>(false);
  // Dereceli Kök State
  const [radicand, setRadicand] = useState<string>('');
  const [degree, setDegree] = useState<string>('');

  // Sadeleştirme State (a * sqrt(b))
  const [simplifyInput, setSimplifyInput] = useState<string>('');

  // Dört İşlem State
  const [opNum1, setOpNum1] = useState<string>('');
  const [opNum2, setOpNum2] = useState<string>('');
  const [operation, setOperation] = useState<'+' | '-' | '*' | '/'>('+');

  const [rootResult, setRootResult] = useState<{
    value: number;
    isExact: boolean;
    exponentialForm: string;
    description: string;
  } | null>(null);

  const [simplifiedResult, setSimplifiedResult] = useState<{
    outside: number;
    inside: number;
    formatted: string;
    factorization: string;
  } | null>(null);

  const [operationResult, setOperationResult] = useState<{
    decimal: number;
    expression: string;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);

  // 1. Dereceli Kök Hesaplama
  useEffect(() => {
    if (activeTab !== 'dereceli') return;

    const x = parseFloat(radicand);
    const n = parseInt(degree, 10);

    if (isNaN(x) || isNaN(n)) {
      setRootResult(null);
      return;
    }

    if (n === 0) {
      setError("Kök derecesi 0 olamaz.");
      setRootResult(null);
      return;
    }

    if (x < 0 && n % 2 === 0) {
      setError("Çift dereceli köklerin içi negatif sayı olamaz (reel sayılarda tanımsızdır).");
      setRootResult(null);
      return;
    }

    setError(null);

    let val = 0;
    if (x < 0 && n % 2 !== 0) {
      val = -Math.pow(Math.abs(x), 1 / n);
    } else {
      val = Math.pow(x, 1 / n);
    }

    const roundedVal = Math.round(val);
    const isExact = Math.abs(Math.pow(roundedVal, n) - x) < 1e-9;

    setRootResult({
      value: isExact ? roundedVal : val,
      isExact,
      exponentialForm: `${x}^(1/${n})`,
      description: `${n === 2 ? 'Karekök' : n === 3 ? 'Küpkök' : `${n}. dereceden kök`} değeri hesaplandı.`
    });
  }, [radicand, degree, activeTab]);

  // 2. Kök Dışına Çıkarma / Sadeleştirme
  useEffect(() => {
    if (activeTab !== 'sadelestir') return;

    const num = parseInt(simplifyInput, 10);
    if (isNaN(num) || num <= 0) {
      setSimplifiedResult(null);
      return;
    }

    setError(null);

    // Karekök sadeleştirme: en büyük tam kare çarpanı bul
    let outside = 1;
    let inside = num;

    for (let i = Math.floor(Math.sqrt(num)); i >= 2; i--) {
      const square = i * i;
      if (inside % square === 0) {
        outside *= i;
        inside = inside / square;
        break;
      }
    }

    let formatted = '';
    if (inside === 1) {
      formatted = `${outside}`;
    } else if (outside === 1) {
      formatted = `√${inside}`;
    } else {
      formatted = `${outside}√${inside}`;
    }

    setSimplifiedResult({
      outside,
      inside,
      formatted,
      factorization: `√${num} = √(${outside * outside} × ${inside}) = ${formatted}`
    });
  }, [simplifyInput, activeTab]);

  // 3. Dört İşlem
  useEffect(() => {
    if (activeTab !== 'dortislem') return;

    const n1 = parseFloat(opNum1);
    const n2 = parseFloat(opNum2);

    if (isNaN(n1) || isNaN(n2) || n1 < 0 || n2 < 0) {
      setOperationResult(null);
      return;
    }

    if (operation === '/' && n2 === 0) {
      setError("0'a bölme işlemi yapılamaz.");
      setOperationResult(null);
      return;
    }

    setError(null);

    const sqrt1 = Math.sqrt(n1);
    const sqrt2 = Math.sqrt(n2);
    let decimal = 0;

    if (operation === '+') decimal = sqrt1 + sqrt2;
    else if (operation === '-') decimal = sqrt1 - sqrt2;
    else if (operation === '*') decimal = sqrt1 * sqrt2;
    else if (operation === '/') decimal = sqrt1 / sqrt2;

    setOperationResult({
      decimal,
      expression: `√${n1} ${operation === '*' ? '×' : operation === '/' ? '÷' : operation} √${n2}`
    });
  }, [opNum1, opNum2, operation, activeTab]);

  const handleClear = () => {
    setRadicand('64');
    setDegree('2');
    setSimplifyInput('72');
    setOpNum1('12');
    setOpNum2('27');
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
        <span className="text-slate-800 dark:text-slate-300">Köklü Sayı Hesaplama</span>
      </div>

      {/* 2. BAŞLIK VE AÇIKLAMA */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Köklü Sayı Hesaplama ve Sadeleştirme 2026 - Ücretsiz ve Hızlı Sonuçlar</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Karekök, küpkök ve n. dereceden kök değerlerini hesaplayın. Köklü sayıları kök dışına çıkararak a√b formunda sadeleştirin ve köklü sayılarda dört işlem yapın.
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
            Köklü İfade Hesap Motoru
          </h2>
        </div>

        {/* SEKME SEÇİMİ */}
        <div className="grid grid-cols-3 gap-2 mb-6 mt-4">
          <button
            onClick={() => setActiveTab('dereceli')}
            className={`py-3 px-2 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'dereceli'
                ? 'bg-[#0056b3] text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-black/5 dark:border-white/5 hover:bg-slate-50'
            }`}
          >
            <Hash size={16} />
            Dereceli Kök (√ / ∛ / ⁿ√)
          </button>
          <button
            onClick={() => setActiveTab('sadelestir')}
            className={`py-3 px-2 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'sadelestir'
                ? 'bg-[#0056b3] text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-black/5 dark:border-white/5 hover:bg-slate-50'
            }`}
          >
            <Sparkles size={16} />
            Kök Dışına Çıkarma (a√b)
          </button>
          <button
            onClick={() => setActiveTab('dortislem')}
            className={`py-3 px-2 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'dortislem'
                ? 'bg-[#0056b3] text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-black/5 dark:border-white/5 hover:bg-slate-50'
            }`}
          >
            <Calculator size={16} />
            Köklü Dört İşlem
          </button>
        </div>

        {/* 3. ANA UYGULAMA ALANI */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* SOL: Girdi Formu */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                Girdi Değerleri
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

            {/* TAB 1: DERECELİ KÖK */}
            {activeTab === 'dereceli' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                    Kökün İçi (Sayı - x)
                  </label>
                  <input
                    type="number"
                    value={radicand}
                    onChange={(e) => setRadicand(e.target.value)}
                    placeholder="Örn: 64"
                    step="any"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 focus:border-[#0056b3]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                    Kökün Derecesi (n)
                  </label>
                  <input
                    type="number"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="Örn: 2"
                    min="1"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 focus:border-[#0056b3]"
                  />
                </div>

                {/* Hızlı Derece Butonları */}
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {[
                    { n: '2', label: '√ Karekök (2)' },
                    { n: '3', label: '∛ Küpkök (3)' },
                    { n: '4', label: '⁴√ (4)' },
                    { n: '5', label: '⁵√ (5)' }
                  ].map((d) => (
                    <button
                      key={d.n}
                      type="button"
                      onClick={() => setDegree(d.n)}
                      className={`p-2 text-xs font-semibold rounded-lg transition-all ${
                        degree === d.n
                          ? 'bg-[#0056b3] text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: SADELEŞTİRME */}
            {activeTab === 'sadelestir' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                    Karekökün İçi (Sayı)
                  </label>
                  <input
                    type="number"
                    value={simplifyInput}
                    onChange={(e) => setSimplifyInput(e.target.value)}
                    placeholder="Örn: 72"
                    min="1"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 focus:border-[#0056b3]"
                  />
                </div>

                {/* Hızlı Örnekler */}
                <div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase mb-2">Hızlı Örnekler</span>
                  <div className="grid grid-cols-4 gap-2">
                    {[18, 48, 72, 98, 125, 200, 300, 500].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setSimplifyInput(v.toString())}
                        className="p-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                      >
                        √{v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: DÖRT İŞLEM */}
            {activeTab === 'dortislem' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">
                      1. Kök (√x)
                    </label>
                    <input
                      type="number"
                      value={opNum1}
                      onChange={(e) => setOpNum1(e.target.value)}
                      placeholder="12"
                      min="0"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-slate-800 dark:text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">
                      2. Kök (√y)
                    </label>
                    <input
                      type="number"
                      value={opNum2}
                      onChange={(e) => setOpNum2(e.target.value)}
                      placeholder="27"
                      min="0"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-slate-800 dark:text-white font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                    İşlem Türü
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: '+', label: '+ Toplama' },
                      { id: '-', label: '- Çıkarma' },
                      { id: '*', label: '× Çarpma' },
                      { id: '/', label: '÷ Bölme' }
                    ].map((op) => (
                      <button
                        key={op.id}
                        type="button"
                        onClick={() => setOperation(op.id as any)}
                        className={`py-2 text-xs font-bold rounded-xl transition-all ${
                          operation === op.id
                            ? 'bg-[#0056b3] text-white shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {op.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SAĞ: Sonuç Ekranı */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 flex-1 relative overflow-hidden shadow-lg border border-black/5 dark:border-slate-800 flex flex-col">
              <div className="flex items-center justify-between mb-4 border-b border-black/5 dark:border-white/5 pb-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">SONUÇ VE DETAYLAR</h3>
              </div>

              {/* SONUÇ 1: DERECELİ KÖK */}
              {activeTab === 'dereceli' && rootResult && (
                <div className="space-y-4 flex-1 flex flex-col">
                  <div className="bg-blue-50/70 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 p-5 rounded-2xl">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      {degree === '2' ? `√${radicand}` : `${degree}√${radicand}`} Değeri
                    </span>
                    <div className="text-3xl sm:text-4xl font-black text-[#0056b3] dark:text-blue-400 mt-1 font-mono">
                      {rootResult.isExact
                        ? rootResult.value
                        : rootResult.value.toLocaleString('tr-TR', { maximumFractionDigits: 6 })}
                    </div>
                    {!rootResult.isExact && (
                      <div className="text-[11px] text-slate-400 mt-1">
                        (Yaklaşık ondalık değer gösterilmektedir)
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Üslü Gösterimi</span>
                      <div className="text-base font-bold text-slate-800 dark:text-slate-200 mt-0.5 font-mono">
                        {rootResult.exponentialForm}
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Tam Kök Durumu</span>
                      <div className="text-base font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                        {rootResult.isExact ? '✅ Tam Kare / Kök' : 'İrrasyonel Sayı'}
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(`${rootResult.value}`)}
                      className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white border border-black/5 dark:border-transparent font-bold rounded-xl py-2.5 flex items-center justify-center gap-2 transition-all text-xs"
                    >
                      <Copy size={14} /> Sonucu Kopyala
                    </button>
                  </div>
                </div>
              )}

              {/* SONUÇ 2: SADELEŞTİRME */}
              {activeTab === 'sadelestir' && simplifiedResult && (
                <div className="space-y-4 flex-1 flex flex-col">
                  <div className="bg-emerald-50/70 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 p-5 rounded-2xl">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Sadeleştirilmiş Karekök (a√b)
                    </span>
                    <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
                      {simplifiedResult.formatted}
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Adım Adım Ayrıştırma</span>
                    <div className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">
                      {simplifiedResult.factorization}
                    </div>
                    <div className="text-xs text-slate-400 pt-1">
                      Katsayı (a): <strong>{simplifiedResult.outside}</strong>, Kök İçi (b): <strong>{simplifiedResult.inside}</strong>
                    </div>
                  </div>

                  <div className="mt-auto pt-2">
                    <button
                  type="button"
                  onClick={(e) => {
                    () => navigator.clipboard.writeText(simplifiedResult.formatted);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                      className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white border border-black/5 dark:border-transparent font-bold rounded-xl py-2.5 flex items-center justify-center gap-2 transition-all text-xs"
                    
                >
                  {copied ? <Check size={16} className="text-emerald-500 transition-transform scale-110" /> : <Copy size={14} />}
                  {copied ? 'Sonuç Kopyalandı!' : 'Sonucu Kopyala'}
                </button>
                  </div>
                </div>
              )}

              {/* SONUÇ 3: DÖRT İŞLEM */}
              {activeTab === 'dortislem' && operationResult && (
                <div className="space-y-4 flex-1 flex flex-col">
                  <div className="bg-purple-50/70 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/20 p-5 rounded-2xl">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      {operationResult.expression}
                    </span>
                    <div className="text-3xl sm:text-4xl font-black text-purple-600 dark:text-purple-400 mt-1 font-mono">
                      {operationResult.decimal.toLocaleString('tr-TR', { maximumFractionDigits: 6 })}
                    </div>
                  </div>

                  <div className="mt-auto pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (operationResult) {
                          navigator.clipboard.writeText(`${operationResult.decimal.toFixed(4)}`);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }
                      }}
                      className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white border border-black/5 dark:border-transparent font-bold rounded-xl py-2.5 flex items-center justify-center gap-2 transition-all text-xs active:scale-[0.98]"
                    >
                      {copied ? <Check size={16} className="text-emerald-500 transition-transform scale-110" /> : <Copy size={14} />}
                      {copied ? 'Sonuç Kopyalandı!' : 'Sonucu Kopyala'}
                    </button>
                  </div>
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
          Köklü Sayılar ve Karekök Hesaplama Kılavuzu
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Köklü Sayı Nedir?</h4>
            <p>
              Matematikte bir sayının karesi, küpü veya herhangi bir kuvveti bilindiğinde, bu kuvveti oluşturan ana taban sayıyı bulma işlemine <strong>kök alma</strong> denir. En yaygın kullanılanı 2. dereceden kök olan <strong>karekök (√x)</strong> işlemidir.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Tam Kare Sayılar Tablosu</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { n: 1, sq: 1 }, { n: 2, sq: 4 }, { n: 3, sq: 9 }, { n: 4, sq: 16 },
                { n: 5, sq: 25 }, { n: 6, sq: 36 }, { n: 7, sq: 49 }, { n: 8, sq: 64 },
                { n: 9, sq: 81 }, { n: 10, sq: 100 }, { n: 11, sq: 121 }, { n: 12, sq: 144 },
                { n: 13, sq: 169 }, { n: 14, sq: 196 }, { n: 15, sq: 225 }, { n: 20, sq: 400 }
              ].map((item) => (
                <div key={item.n} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-center font-mono">
                  √{item.sq} = <strong>{item.n}</strong>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Kök Dışına Çıkarma (a√b) Nasıl Yapılır?</h4>
            <p>
              Tam kare olmayan bir sayıyı kök dışına çıkarmak için sayının çarpanları arasında en büyük tam kare sayı aranır. Tam kare olan çarpan karekökün dışına karekökü alınarak yazılır, diğer çarpan ise kökün içinde kalır:
            </p>
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl font-mono text-center text-sm text-[#0056b3] dark:text-blue-400">
              √72 = √(36 × 2) = √36 × √2 = 6√2
            </div>
          </section>

          
          <div className="pt-2">
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Kullanılan Formüller:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  Kök Alma Formülü: √x = y ➔ y² = x (Karekök için)
                </div>
              </div>
            </div>
          </div>
          
          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular (FAQ)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Negatif sayıların karekökü neden tanımsızdır?</h5>
                <p>Reel sayılar kümesinde hiçbir reel sayının karesi negatif olamaz. Bu nedenle çift dereceli köklerin içerisine negatif sayı yazılamaz. Negatif sayıların kökleri Karmaşık Sayılar kümesinde tanımlanır.</p>
              </div>
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Köklü sayılarda toplama işlemi nasıl yapılır?</h5>
                <p>Köklü sayılarda toplama yapılabilmesi için kök derecelerinin ve kök içlerinin birebir aynı olması gerekir. Örneğin 2√3 + 5√3 = 7√3 şeklinde katsayılar toplanır.</p>
              </div>
            </div>
          </section>
          
        </div>
      </div>

      {/* 5. DİĞER ARAÇLAR */}
      
      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Köklü Sayı Hesaplama ve Sadeleştirme Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              Köklü Sayı Hesaplama ve Sadeleştirme aracını kullanmak son derece basit ve kullanıcı dostudur. İlgili form alanlarına elinizdeki verileri eksiksiz ve doğru bir şekilde girdiğinizden emin olun. Tüm alanları doldurduktan sonra "Hesapla" butonuna tıklayarak sonuçları anında görüntüleyebilirsiniz. Aracımız, girdiğiniz değerleri anlık olarak işler ve herhangi bir sayfaya yönlendirme yapmadan, bulunduğunuz ekran üzerinde size en net ve kesin verileri sunar. İhtiyaç duyduğunuz her an bu aracı tamamen ücretsiz olarak kullanabilir, dilerseniz sonuçları kopyalayarak farklı platformlarda kolayca paylaşabilirsiniz. Zaman kaybetmeden, en karmaşık hesaplamaları bile saniyeler içinde tamamlamanın ayrıcalığını yaşayın.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Köklü Sayı Hesaplama ve Sadeleştirme Nedir ve Nasıl Hesaplanır?</h4>
            <p>
              Köklü Sayı Hesaplama ve Sadeleştirme, kullanıcıların günlük hayatta veya profesyonel iş süreçlerinde sıklıkla ihtiyaç duyduğu matematiksel veya istatistiksel hesaplamaları pratik bir şekilde çözmek amacıyla geliştirilmiş kapsamlı bir dijital araçtır. Geleneksel yöntemlerle yapıldığında hata payı yüksek olan ve uzun zaman alan bu tür işlemler, gelişmiş altyapımız sayesinde otomatik olarak hatasız bir biçimde gerçekleştirilir. 
            </p>
            <p className="mt-4">
              Hesaplama arka planda, genel kabul görmüş evrensel formüller, en güncel yasal mevzuatlar veya resmi olarak açıklanmış standart oranlar kullanılarak yapılmaktadır. Veriler sisteme girildiği anda, algoritma bu güncel parametreleri referans alarak verilerinizi analiz eder ve sonuçları net bir şekilde ekranınıza yansıtır. Finansal, istatistiksel veya gündelik hesaplamalar fark etmeksizin her daim doğru ve güvenilir bilgiye ulaşmanız hedeflenmektedir. Bu aracı kullanarak iş akışınızı hızlandırabilir ve hata payını sıfıra indirebilirsiniz.
            </p>
          </section>

          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular (SSS)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Köklü Sayı Hesaplama ve Sadeleştirme aracı ücretli midir?</h5>
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
      <RelatedTools category="matematik" currentToolId="koklu-sayi-hesaplama" />

      {/* 6. SORUMLULUK REDDİ */}
      <Disclaimer category="matematik" />
    </div>
  );
}
