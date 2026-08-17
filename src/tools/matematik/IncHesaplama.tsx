import React, { useState, useEffect } from 'react';
import { ChevronRight, RefreshCw, Copy, Info, AlertCircle, Monitor, ArrowRightLeft, Ruler, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToolIcon } from '../../components/icons/ToolIcon';
import { AdSlot } from '../../components/ads/AdSlot';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { RelatedTools } from '../../components/tools/RelatedTools';

type CalcMode = 'uzunluk' | 'ekran';

export default function IncHesaplama() {
  const [mode, setMode] = useState<CalcMode>('uzunluk');

  const [copied, setCopied] = useState<boolean>(false);
  // Uzunluk dönüştürücü state
  const [inputValue, setInputValue] = useState<string>('');
  const [fromUnit, setFromUnit] = useState<'inch' | 'cm' | 'mm' | 'm' | 'ft'>('inch');

  // Ekran boyutu state
  const [screenInch, setScreenInch] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '16:10' | '4:3' | '21:9'>('16:9');

  const [lengthResults, setLengthResults] = useState<{
    inch: number;
    cm: number;
    mm: number;
    m: number;
    ft: number;
    yard: number;
  } | null>(null);

  const [screenResults, setScreenResults] = useState<{
    diagonalCm: number;
    widthCm: number;
    heightCm: number;
    widthInch: number;
    heightInch: number;
    areaCm2: number;
    areaM2: number;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);

  // Uzunluk hesaplama
  useEffect(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val) || val < 0) {
      setLengthResults(null);
      return;
    }

    // Convert everything to inch first
    let inches = 0;
    if (fromUnit === 'inch') inches = val;
    else if (fromUnit === 'cm') inches = val / 2.54;
    else if (fromUnit === 'mm') inches = val / 25.4;
    else if (fromUnit === 'm') inches = (val * 100) / 2.54;
    else if (fromUnit === 'ft') inches = val * 12;

    const cm = inches * 2.54;
    const mm = cm * 10;
    const m = cm / 100;
    const ft = inches / 12;
    const yard = ft / 3;

    setLengthResults({
      inch: inches,
      cm,
      mm,
      m,
      ft,
      yard
    });
  }, [inputValue, fromUnit]);

  // Ekran boyutu hesaplama
  useEffect(() => {
    const diagInch = parseFloat(screenInch);
    if (isNaN(diagInch) || diagInch <= 0) {
      setScreenResults(null);
      return;
    }

    let wRatio = 16;
    let hRatio = 9;
    if (aspectRatio === '16:10') { wRatio = 16; hRatio = 10; }
    else if (aspectRatio === '4:3') { wRatio = 4; hRatio = 3; }
    else if (aspectRatio === '21:9') { wRatio = 21; hRatio = 9; }

    const diagCm = diagInch * 2.54;
    const angle = Math.atan(hRatio / wRatio);
    const widthInch = diagInch * Math.cos(angle);
    const heightInch = diagInch * Math.sin(angle);
    const widthCm = widthInch * 2.54;
    const heightCm = heightInch * 2.54;
    const areaCm2 = widthCm * heightCm;
    const areaM2 = areaCm2 / 10000;

    setScreenResults({
      diagonalCm: diagCm,
      widthCm,
      heightCm,
      widthInch,
      heightInch,
      areaCm2,
      areaM2
    });
  }, [screenInch, aspectRatio]);

  const handleClear = () => {
    setInputValue('1');
    setScreenInch('55');
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
        <span className="text-slate-800 dark:text-slate-300">İnç Hesaplama</span>
      </div>

      {/* 2. BAŞLIK VE AÇIKLAMA */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">İnç Hesaplama ve Dönüştürücü 2026 - Ücretsiz ve Hızlı Sonuçlar</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          İnç (inch) değerlerini santimetre (cm), milimetre (mm), metre ve fit birimlerine anında dönüştürün. Televizyon, monitör ve telefon ekran boyutlarının genişlik, yükseklik ve alan ölçülerini hesaplayın.
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
            İnç Ölçü & Ekran Hesaplayıcı
          </h2>
        </div>

        {/* MOD SEÇİMİ */}
        <div className="flex gap-3 mb-6 mt-4">
          <button
            onClick={() => setMode('uzunluk')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              mode === 'uzunluk'
                ? 'bg-[#0056b3] text-white shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-black/5 dark:border-white/5 hover:bg-slate-50'
            }`}
          >
            <Ruler size={18} />
            Birim Dönüştürücü (İnç ↔ cm / mm)
          </button>
          <button
            onClick={() => setMode('ekran')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              mode === 'ekran'
                ? 'bg-[#0056b3] text-white shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-black/5 dark:border-white/5 hover:bg-slate-50'
            }`}
          >
            <Monitor size={18} />
            TV / Monitör Ekran Boyutları
          </button>
        </div>

        {/* 3. ANA UYGULAMA ALANI */}
        {mode === 'uzunluk' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* SOL: Girdi Formu */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <ArrowRightLeft size={18} className="text-[#0056b3] dark:text-blue-400" />
                  Değer Girişi
                </h3>
                <button onClick={handleClear} className="text-[12px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1.5 transition-colors">
                  <RefreshCw size={12} /> Sıfırla
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                    Dönüştürülecek Değer
                  </label>
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Örn: 55"
                    step="any"
                    min="0"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 focus:border-[#0056b3]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                    Kaynak Birim
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'inch', label: 'İnç (in / ")' },
                      { id: 'cm', label: 'Santimetre (cm)' },
                      { id: 'mm', label: 'Milimetre (mm)' },
                      { id: 'm', label: 'Metre (m)' },
                      { id: 'ft', label: 'Fit (ft / \')' },
                    ].map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => setFromUnit(u.id as any)}
                        className={`py-2 text-xs font-bold rounded-xl transition-all ${
                          fromUnit === u.id
                            ? 'bg-[#0056b3] text-white shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {u.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hızlı Seçim Butonları */}
                <div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase mb-2">Popüler İnç Değerleri</span>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 6.1, 13.3, 15.6, 24, 32, 55, 65].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => {
                          setInputValue(v.toString());
                          setFromUnit('inch');
                        }}
                        className="py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        {v}" inç
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-50/70 dark:bg-blue-950/30 rounded-2xl border border-blue-100 dark:border-blue-900/30 text-xs text-blue-900 dark:text-blue-300">
                  <strong>Temel Eşitlik:</strong> 1 İnç = <strong>2.54 cm</strong> = <strong>25.4 mm</strong> = <strong>0.0833 ft</strong>
                </div>
              </div>
            </div>

            {/* SAĞ: Sonuç Ekranı */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 flex-1 relative overflow-hidden shadow-lg border border-black/5 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4 border-b border-black/5 dark:border-white/5 pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">DÖNÜŞTÜRME SONUÇLARI</h3>
                </div>

                {lengthResults ? (
                  <div className="space-y-4">
                    {/* Vurgulu Ana Sonuç */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 p-4 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {inputValue} {fromUnit.toUpperCase()} eşiti
                        </span>
                        <div className="text-2xl sm:text-3xl font-black text-[#0056b3] dark:text-blue-400 mt-1">
                          {fromUnit === 'inch' ? `${lengthResults.cm.toFixed(2)} cm` : `${lengthResults.inch.toFixed(2)} inç`}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const val = fromUnit === 'inch' ? `${lengthResults.cm.toFixed(2)} cm` : `${lengthResults.inch.toFixed(2)} inç`;
                          navigator.clipboard.writeText(val);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-slate-700 dark:text-slate-200 border border-black/5 dark:border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-[0.98]"
                      >
                        {copied ? <Check size={14} className="text-emerald-500 transition-transform scale-110" /> : <Copy size={14} />}
                        <span>{copied ? 'Kopyalandı!' : 'Kopyala'}</span>
                      </button>
                    </div>

                    {/* Tüm Birimler Tablosu */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">İnç (in / ")</span>
                        <div className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-0.5 font-mono">
                          {lengthResults.inch.toLocaleString('tr-TR', { maximumFractionDigits: 4 })} "
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">Santimetre (cm)</span>
                        <div className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-0.5 font-mono">
                          {lengthResults.cm.toLocaleString('tr-TR', { maximumFractionDigits: 4 })} cm
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">Milimetre (mm)</span>
                        <div className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-0.5 font-mono">
                          {lengthResults.mm.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} mm
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">Metre (m)</span>
                        <div className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-0.5 font-mono">
                          {lengthResults.m.toLocaleString('tr-TR', { maximumFractionDigits: 5 })} m
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">Fit (ft / ')</span>
                        <div className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-0.5 font-mono">
                          {lengthResults.ft.toLocaleString('tr-TR', { maximumFractionDigits: 4 })} ft
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">Yard (yd)</span>
                        <div className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-0.5 font-mono">
                          {lengthResults.yard.toLocaleString('tr-TR', { maximumFractionDigits: 4 })} yd
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400">
                    Lütfen geçerli bir sayı giriniz.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* EKRAN BOYUTU MODU */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* SOL: Ekran Girdileri */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Monitor size={18} className="text-[#0056b3] dark:text-blue-400" />
                  Ekran Özellikleri
                </h3>
                <button onClick={handleClear} className="text-[12px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1.5 transition-colors">
                  <RefreshCw size={12} /> Sıfırla
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                    Ekran Köşegen Boyutu (İnç)
                  </label>
                  <input
                    type="number"
                    value={screenInch}
                    onChange={(e) => setScreenInch(e.target.value)}
                    placeholder="Örn: 55"
                    step="any"
                    min="1"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 focus:border-[#0056b3]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                    En-Boy Oranı (Aspect Ratio)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: '16:9', label: '16:9 (Standart TV & Monitör)' },
                      { id: '16:10', label: '16:10 (Laptop & Ofis)' },
                      { id: '21:9', label: '21:9 (Ultrawide Monitör)' },
                      { id: '4:3', label: '4:3 (Eski / Retro TV)' },
                    ].map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setAspectRatio(r.id as any)}
                        className={`p-2.5 text-xs font-bold rounded-xl text-left transition-all ${
                          aspectRatio === r.id
                            ? 'bg-[#0056b3] text-white shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popüler TV Boyutları */}
                <div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase mb-2">Hızlı TV Boyutları</span>
                  <div className="grid grid-cols-4 gap-2">
                    {[32, 43, 50, 55, 65, 75, 85, 98].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => {
                          setScreenInch(v.toString());
                          setAspectRatio('16:9');
                        }}
                        className="py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                      >
                        {v} Ekran
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SAĞ: Ekran Sonuçları */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 flex-1 relative overflow-hidden shadow-lg border border-black/5 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4 border-b border-black/5 dark:border-white/5 pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">EKRAN ÖLÇÜLERİ VE DETAYLARI</h3>
                </div>

                {screenResults ? (
                  <div className="space-y-4">
                    {/* Görsel Ekran Temsili */}
                    <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
                      <div className="text-xs font-semibold text-slate-400 mb-1">
                        {screenInch}" İnç ({aspectRatio}) Ekran
                      </div>
                      <div className="text-3xl font-black text-blue-400">
                        {screenResults.diagonalCm.toFixed(1)} cm Köşegen
                      </div>
                      <div className="text-xs text-slate-300 mt-2 font-mono">
                        {screenResults.widthCm.toFixed(1)} cm (Genişlik) × {screenResults.heightCm.toFixed(1)} cm (Yükseklik)
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">Ekran Genişliği</span>
                        <div className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                          {screenResults.widthCm.toFixed(1)} cm <span className="text-xs text-slate-400 font-normal">({screenResults.widthInch.toFixed(1)}")</span>
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">Ekran Yüksekliği</span>
                        <div className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                          {screenResults.heightCm.toFixed(1)} cm <span className="text-xs text-slate-400 font-normal">({screenResults.heightInch.toFixed(1)}")</span>
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">Toplam Ekran Alanı</span>
                        <div className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                          {screenResults.areaCm2.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} cm²
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">Metrekare Cinsinden</span>
                        <div className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                          {screenResults.areaM2.toFixed(3)} m²
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400">
                    Lütfen geçerli bir ekran inç değeri giriniz.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Google Ads */}
      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      {/* 4. SEO & BİLGİLENDİRME ALANI */}
      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          İnç Ölçü Birimi ve TV Ekranı Hesaplama Rehberi
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">1 İnç Kaç Santimetredir?</h4>
            <p>
              Uluslararası standartlara göre <strong>1 inç tam olarak 2.54 santimetreye (25.4 milimetreye)</strong> eşittir. İngiliz ölçü sisteminde (Imperial system) kullanılan inç birimi çift tırnak işareti (<strong>"</strong>) veya <strong>in</strong> kısaltması ile gösterilir.
            </p>
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl font-mono text-center text-sm text-[#0056b3] dark:text-blue-400">
              Santimetre (cm) = İnç Değeri × 2.54
            </div>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">TV ve Monitörlerde İnç Nasıl Ölçülür?</h4>
            <p>
              Televizyon ve bilgisayar monitörlerinde belirtilen "ekran boyutu" (örneğin 55 inç veya 65 inç), ekranın sol alt köşesinden sağ üst köşesine kadar olan <strong>çapraz (köşegen) mesafedir</strong>. Çerçeve payı bu ölçüme dahil edilmez.
            </p>
            <p>
              Örneğin <strong>55 inç bir televizyon</strong>, köşegen olarak 55 × 2.54 = <strong>139.7 cm</strong> uzunluğa, yaklaşık <strong>121.8 cm genişliğe</strong> ve <strong>68.5 cm yüksekliğe</strong> sahiptir.
            </p>
          </section>

          {/* TV Boyutları Karşılaştırma Tablosu */}
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Popüler Televizyon (16:9) Ekran Ölçüleri Tablosu</h4>
            <div className="border border-black/5 dark:border-white/5 rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    <th className="py-2.5 px-3">Ekran Boyutu</th>
                    <th className="py-2.5 px-3">Köşegen (cm)</th>
                    <th className="py-2.5 px-3">Genişlik (cm)</th>
                    <th className="py-2.5 px-3">Yükseklik (cm)</th>
                    <th className="py-2.5 px-3">İdeal İzleme Mesafesi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  <tr>
                    <td className="py-2 px-3 font-bold">32 İnç</td>
                    <td className="py-2 px-3">81.3 cm</td>
                    <td className="py-2 px-3">70.8 cm</td>
                    <td className="py-2 px-3">39.8 cm</td>
                    <td className="py-2 px-3">1.2 - 1.5 m</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold">43 İnç</td>
                    <td className="py-2 px-3">109.2 cm</td>
                    <td className="py-2 px-3">95.2 cm</td>
                    <td className="py-2 px-3">53.5 cm</td>
                    <td className="py-2 px-3">1.5 - 1.8 m</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold">50 İnç</td>
                    <td className="py-2 px-3">127.0 cm</td>
                    <td className="py-2 px-3">110.7 cm</td>
                    <td className="py-2 px-3">62.3 cm</td>
                    <td className="py-2 px-3">1.7 - 2.1 m</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-[#0056b3] dark:text-blue-400">55 İnç</td>
                    <td className="py-2 px-3">139.7 cm</td>
                    <td className="py-2 px-3">121.8 cm</td>
                    <td className="py-2 px-3">68.5 cm</td>
                    <td className="py-2 px-3">1.9 - 2.3 m</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-[#0056b3] dark:text-blue-400">65 İnç</td>
                    <td className="py-2 px-3">165.1 cm</td>
                    <td className="py-2 px-3">143.9 cm</td>
                    <td className="py-2 px-3">80.9 cm</td>
                    <td className="py-2 px-3">2.2 - 2.7 m</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold">75 İnç</td>
                    <td className="py-2 px-3">190.5 cm</td>
                    <td className="py-2 px-3">166.0 cm</td>
                    <td className="py-2 px-3">93.4 cm</td>
                    <td className="py-2 px-3">2.5 - 3.1 m</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          
          <div className="pt-2">
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Kullanılan Formüller:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  İnç - Santimetre Dönüşüm Formülü: 1 İnç = 2.54 Santimetre (cm)
                </div>
              </div>
            </div>
          </div>
          
          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular (FAQ)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">1 fit (foot) kaç inç eder?</h5>
                <p>1 fit (foot), 12 inçe eşittir. Bu da 12 × 2.54 = <strong>30.48 cm</strong> yapar.</p>
              </div>
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">TV alırken oda büyüklüğüne göre inç seçimi nasıl olmalı?</h5>
                <p>Genel 4K TV kuralı olarak, televizyon ile koltuğunuz arasındaki mesafeyi (santimetre cinsinden) 1.2 ile 1.5 arasına bölerek ideal ekran köşegenini bulabilirsiniz. Örneğin 2 metre (200 cm) izleme mesafesi için 50-55 inç ekranlar en konforlu izleme açısını sağlar.</p>
              </div>
            </div>
          </section>
          
        </div>
      </div>

      {/* 5. DİĞER ARAÇLAR */}
      
      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          İnç Hesaplama ve Dönüştürücü Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              İnç Hesaplama ve Dönüştürücü aracını kullanmak son derece basit ve kullanıcı dostudur. İlgili form alanlarına elinizdeki verileri eksiksiz ve doğru bir şekilde girdiğinizden emin olun. Tüm alanları doldurduktan sonra "Hesapla" butonuna tıklayarak sonuçları anında görüntüleyebilirsiniz. Aracımız, girdiğiniz değerleri anlık olarak işler ve herhangi bir sayfaya yönlendirme yapmadan, bulunduğunuz ekran üzerinde size en net ve kesin verileri sunar. İhtiyaç duyduğunuz her an bu aracı tamamen ücretsiz olarak kullanabilir, dilerseniz sonuçları kopyalayarak farklı platformlarda kolayca paylaşabilirsiniz. Zaman kaybetmeden, en karmaşık hesaplamaları bile saniyeler içinde tamamlamanın ayrıcalığını yaşayın.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">İnç Hesaplama ve Dönüştürücü Nedir ve Nasıl Hesaplanır?</h4>
            <p>
              İnç Hesaplama ve Dönüştürücü, kullanıcıların günlük hayatta veya profesyonel iş süreçlerinde sıklıkla ihtiyaç duyduğu matematiksel veya istatistiksel hesaplamaları pratik bir şekilde çözmek amacıyla geliştirilmiş kapsamlı bir dijital araçtır. Geleneksel yöntemlerle yapıldığında hata payı yüksek olan ve uzun zaman alan bu tür işlemler, gelişmiş altyapımız sayesinde otomatik olarak hatasız bir biçimde gerçekleştirilir. 
            </p>
            <p className="mt-4">
              Hesaplama arka planda, genel kabul görmüş evrensel formüller, en güncel yasal mevzuatlar veya resmi olarak açıklanmış standart oranlar kullanılarak yapılmaktadır. Veriler sisteme girildiği anda, algoritma bu güncel parametreleri referans alarak verilerinizi analiz eder ve sonuçları net bir şekilde ekranınıza yansıtır. Finansal, istatistiksel veya gündelik hesaplamalar fark etmeksizin her daim doğru ve güvenilir bilgiye ulaşmanız hedeflenmektedir. Bu aracı kullanarak iş akışınızı hızlandırabilir ve hata payını sıfıra indirebilirsiniz.
            </p>
          </section>

          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular (SSS)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">İnç Hesaplama ve Dönüştürücü aracı ücretli midir?</h5>
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
      <RelatedTools category="matematik" currentToolId="inc-hesaplama" />

      {/* 6. SORUMLULUK REDDİ */}
      <Disclaimer category="matematik" />
    </div>
  );
}
