import React, { useState, useId } from 'react';
import { ChevronRight, RefreshCw, Copy, Info, Home, Layers, Grid, Square, ShieldCheck, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToolIcon } from '../../components/icons/ToolIcon';
import { AdSlot } from '../../components/ads/AdSlot';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { RelatedTools } from '../../components/tools/RelatedTools';

type RoomShape = 'dikdortgen' | 'l_sekli' | 'daire' | 'ucgen';

interface CustomRoom {
  id: string;
  name: string;
  width: number;
  length: number;
  area: number;
}

export default function MetrekareHesaplama() {
  const widthInputId = useId();
  const lengthInputId = useId();
  const lWidth1Id = useId();
  const lLength1Id = useId();
  const lWidth2Id = useId();
  const lLength2Id = useId();
  const radiusId = useId();
  const triBaseId = useId();
  const triHeightId = useId();
  const paintCoverageId = useId();
  const paintCoatsId = useId();
  const tileWasteId = useId();
  const customRoomNameId = useId();
  const customRoomWidthId = useId();
  const customRoomLengthId = useId();

  const [shape, setShape] = useState<RoomShape>('dikdortgen');

  // Dikdörtgen / Kare
  const [width, setWidth] = useState<string>('');
  const [length, setLength] = useState<string>('');

  // L Şekli (2 Dikdörtgen)
  const [lW1, setLW1] = useState<string>('');
  const [lL1, setLL1] = useState<string>('');
  const [lW2, setLW2] = useState<string>('');
  const [lL2, setLL2] = useState<string>('');

  // Daire / Silindir
  const [radius, setRadius] = useState<string>('');

  // Üçgen
  const [triBase, setTriBase] = useState<string>('');
  const [triHeight, setTriHeight] = useState<string>('');

  // Malzeme / Boya / Parke Hesaplama
  const [paintCoverage, setPaintCoverage] = useState<string>(''); // 1 litre boya kaç m2
  const [paintCoats, setPaintCoats] = useState<string>(''); // Kat sayısı
  const [tileWaste, setTileWaste] = useState<string>(''); // % fire payı

  // Çoklu Oda / Ev Toplamı Listesi
  const [rooms, setRooms] = useState<CustomRoom[]>([
    { id: '1', name: 'Salon', width: 5.5, length: 6.2, area: 34.1 },
    { id: '2', name: 'Yatak Odası', width: 4.0, length: 4.5, area: 18.0 },
    { id: '3', name: 'Mutfak', width: 3.2, length: 4.0, area: 12.8 },
    { id: '4', name: 'Banyo', width: 2.2, length: 2.8, area: 6.16 },
  ]);
  const [newRoomName, setNewRoomName] = useState<string>('');
  const [newRoomW, setNewRoomW] = useState<string>('');
  const [newRoomL, setNewRoomL] = useState<string>('');

  const [copied, setCopied] = useState<boolean>(false);

  // Alan Hesaplama
  const calculateArea = (): number => {
    if (shape === 'dikdortgen') {
      const w = parseFloat(width) || 0;
      const l = parseFloat(length) || 0;
      return w * l;
    }
    if (shape === 'l_sekli') {
      const w1 = parseFloat(lW1) || 0;
      const l1 = parseFloat(lL1) || 0;
      const w2 = parseFloat(lW2) || 0;
      const l2 = parseFloat(lL2) || 0;
      return (w1 * l1) + (w2 * l2);
    }
    if (shape === 'daire') {
      const r = parseFloat(radius) || 0;
      return Math.PI * r * r;
    }
    if (shape === 'ucgen') {
      const b = parseFloat(triBase) || 0;
      const h = parseFloat(triHeight) || 0;
      return (b * h) / 2;
    }
    return 0;
  };

  const currentArea = calculateArea();

  // Malzeme İhtiyaçları
  const coverageVal = parseFloat(paintCoverage) || 10;
  const coatsVal = parseFloat(paintCoats) || 2;
  const requiredPaintLiters = coverageVal > 0 ? (currentArea * coatsVal) / coverageVal : 0;

  const wastePercent = parseFloat(tileWaste) || 10;
  const parquetAreaWithWaste = currentArea * (1 + wastePercent / 100);

  // Çoklu Oda Toplamı
  const totalMultiRoomArea = rooms.reduce((acc, r) => acc + r.area, 0);

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(newRoomW);
    const l = parseFloat(newRoomL);
    if (!newRoomName.trim() || isNaN(w) || isNaN(l) || w <= 0 || l <= 0) return;

    const area = w * l;
    setRooms(prev => [...prev, {
      id: Date.now().toString(),
      name: newRoomName.trim(),
      width: w,
      length: l,
      area: parseFloat(area.toFixed(2))
    }]);

    setNewRoomName('');
    setNewRoomW('');
    setNewRoomL('');
  };

  const handleRemoveRoom = (id: string) => {
    setRooms(prev => prev.filter(r => r.id !== id));
  };

  const handleCopy = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setWidth('4.5');
    setLength('6');
    setLW1('4');
    setLL1('5');
    setLW2('2.5');
    setLL2('3');
    setRadius('3');
    setTriBase('5');
    setTriHeight('4');
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* BREADCRUMB */}
      <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <Link to="/" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Ana Sayfa</Link>
        <ChevronRight size={14} />
        <Link to="/kategori/matematik" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors capitalize">Matematik</Link>
        <ChevronRight size={14} />
        <span className="text-slate-800 dark:text-slate-300">Metrekare Hesaplama</span>
      </div>

      {/* BAŞLIK */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Metrekare ($m^2$) Hesaplama ve Alan Ölçümü 2026 - Ücretsiz ve Hızlı Sonuçlar</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Oda, ev, arsa ve duvarların metrekare (m²) alanını hesaplayın. L şekilli odalar, çoklu oda toplamı, boya ve parke fire payı ihtiyaçlarını anında öğrenin.
        </p>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      {/* HESAPLAMA MOTORU */}
      <div className="calculator-container mb-8 relative border-4 border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-8 mt-8">
        <div className="absolute -top-4 left-4 sm:left-8 bg-[#eef2f7] dark:bg-slate-950 px-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ToolIcon name="matematik" size={20} className="text-[#0056b3] dark:text-blue-400" />
            Metrekare (m²) Hesaplayıcı
          </h2>
        </div>

        {/* ŞEKİL SEÇİCİ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 mt-4">
          {[
            { id: 'dikdortgen', label: 'Dikdörtgen / Kare', icon: Square },
            { id: 'l_sekli', label: 'L Şekli (Girintili)', icon: Layers },
            { id: 'daire', label: 'Daire / Yuvarlak', icon: Grid },
            { id: 'ucgen', label: 'Üçgen Alan', icon: Home },
          ].map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setShape(item.id as RoomShape)}
                className={`py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                  shape === item.id
                    ? 'bg-[#0056b3] text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-black/5 dark:border-white/5 hover:bg-slate-50'
                }`}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* SOL: Girdi Formu */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                Ölçüleri Girin (Metre - m)
              </h3>
              <button
                onClick={handleReset}
                className="text-[12px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw size={12} /> Sıfırla
              </button>
            </div>

            {/* DİKDÖRTGEN */}
            {shape === 'dikdortgen' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor={widthInputId} className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                    Genişlik / En (Metre)
                  </label>
                  <input
                    id={widthInputId}
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    placeholder="Örn: 4.5"
                    step="0.01"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 focus:border-[#0056b3]"
                  />
                </div>
                <div>
                  <label htmlFor={lengthInputId} className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                    Uzunluk / Boy (Metre)
                  </label>
                  <input
                    id={lengthInputId}
                    type="number"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    placeholder="Örn: 6.0"
                    step="0.01"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 focus:border-[#0056b3]"
                  />
                </div>
              </div>
            )}

            {/* L ŞEKLİ */}
            {shape === 'l_sekli' && (
              <div className="space-y-4">
                <div className="p-3 bg-blue-50/60 dark:bg-blue-900/10 rounded-xl text-xs text-blue-700 dark:text-blue-300">
                  L şeklindeki odayı 2 ayrı dikdörtgen bölüme ayırarak ölçülerini giriniz:
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor={lWidth1Id} className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">1. Bölüm En (m)</label>
                    <input placeholder="Örn: 4"
                      id={lWidth1Id}
                      type="number"
                      value={lW1}
                      onChange={(e) => setLW1(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl p-2.5 font-bold"
                    />
                  </div>
                  <div>
                    <label htmlFor={lLength1Id} className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">1. Bölüm Boy (m)</label>
                    <input placeholder="Örn: 5"
                      id={lLength1Id}
                      type="number"
                      value={lL1}
                      onChange={(e) => setLL1(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl p-2.5 font-bold"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor={lWidth2Id} className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">2. Bölüm En (m)</label>
                    <input placeholder="Örn: 2.5"
                      id={lWidth2Id}
                      type="number"
                      value={lW2}
                      onChange={(e) => setLW2(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl p-2.5 font-bold"
                    />
                  </div>
                  <div>
                    <label htmlFor={lLength2Id} className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">2. Bölüm Boy (m)</label>
                    <input placeholder="Örn: 3"
                      id={lLength2Id}
                      type="number"
                      value={lL2}
                      onChange={(e) => setLL2(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl p-2.5 font-bold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* DAİRE */}
            {shape === 'daire' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor={radiusId} className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                    Yarıçap - r (Metre)
                  </label>
                  <input
                    id={radiusId}
                    type="number"
                    value={radius}
                    onChange={(e) => setRadius(e.target.value)}
                    placeholder="Örn: 3"
                    step="0.01"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white font-bold text-lg"
                  />
                  <div className="text-xs text-slate-400 mt-1">Daire çapının yarısıdır (Çap / 2).</div>
                </div>
              </div>
            )}

            {/* ÜÇGEN */}
            {shape === 'ucgen' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor={triBaseId} className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                    Taban Uzunluğu (Metre)
                  </label>
                  <input
                    id={triBaseId}
                    type="number"
                    value={triBase}
                    onChange={(e) => setTriBase(e.target.value)}
                    placeholder="5"
                    step="0.01"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label htmlFor={triHeightId} className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                    Yükseklik (Metre)
                  </label>
                  <input
                    id={triHeightId}
                    type="number"
                    value={triHeight}
                    onChange={(e) => setTriHeight(e.target.value)}
                    placeholder="4"
                    step="0.01"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white font-bold"
                  />
                </div>
              </div>
            )}

            {/* EK HESAP PARAMETRELERİ (BOYA / PARKE) */}
            <div className="mt-6 pt-5 border-t border-black/5 dark:border-white/5 space-y-3">
              <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Malzeme ve Tadilat Hesaplayıcı
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label htmlFor={paintCoverageId} className="block text-[11px] font-semibold text-slate-500 mb-1">1 Lt Boya (m²)</label>
                  <input placeholder="Örn: 10"
                    id={paintCoverageId}
                    type="number"
                    value={paintCoverage}
                    onChange={(e) => setPaintCoverage(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-lg p-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label htmlFor={paintCoatsId} className="block text-[11px] font-semibold text-slate-500 mb-1">Kat Sayısı</label>
                  <input placeholder="Örn: 2"
                    id={paintCoatsId}
                    type="number"
                    value={paintCoats}
                    onChange={(e) => setPaintCoats(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-lg p-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label htmlFor={tileWasteId} className="block text-[11px] font-semibold text-slate-500 mb-1">Parke Fire (%)</label>
                  <input placeholder="Örn: 10"
                    id={tileWasteId}
                    type="number"
                    value={tileWaste}
                    onChange={(e) => setTileWaste(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-lg p-2 text-xs font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SAĞ: Sonuç Paneli */}
          <div className="lg:col-span-6 flex flex-col space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">HESAPLANAN ALAN SONUCU</h3>
              
              <div className="bg-blue-50/70 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 p-5 rounded-2xl mb-4">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Toplam Alan (m²)</span>
                <div className="text-4xl font-black text-[#0056b3] dark:text-blue-400 mt-1 font-mono">
                  {currentArea.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} <span className="text-xl font-bold">m²</span>
                </div>
                <div className="text-xs text-slate-500 mt-1 font-mono">
                  = {(currentArea * 10000).toLocaleString('tr-TR', { maximumFractionDigits: 0 })} cm² | {(currentArea * 10.7639).toFixed(2)} ft² (Square Feet)
                </div>
              </div>

              {/* Malzeme Sonuçları */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Gereken Boya ({paintCoats} Kat)</span>
                  <div className="text-lg font-black text-slate-800 dark:text-slate-200 mt-0.5 font-mono">
                    ~{requiredPaintLiters.toFixed(1)} <span className="text-xs font-bold">Litre</span>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Parke / Seramik (+%{tileWaste} Fire)</span>
                  <div className="text-lg font-black text-slate-800 dark:text-slate-200 mt-0.5 font-mono">
                    {parquetAreaWithWaste.toFixed(2)} <span className="text-xs font-bold">m²</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleCopy(`${currentArea.toFixed(2)} m²`)}
                className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-bold rounded-xl py-2.5 flex items-center justify-center gap-2 transition-all text-xs"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                {copied ? 'Kopyalandı!' : 'Metrekare Sonucunu Kopyala'}
              </button>
            </div>

            {/* ÇOKLU ODA / EV TOPLAMI ARACI */}
            <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                  <Home size={16} className="text-[#0056b3] dark:text-blue-400" />
                  Ev / Daire Oda Toplamı
                </h4>
                <span className="text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-0.5 rounded-md">
                  Toplam: {totalMultiRoomArea.toFixed(1)} m²
                </span>
              </div>

              {/* Oda Listesi */}
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 mb-3 text-xs">
                {rooms.map(r => (
                  <div key={r.id} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{r.name} ({r.width}m × {r.length}m)</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono text-slate-900 dark:text-white">{r.area} m²</span>
                      <button
                        onClick={() => handleRemoveRoom(r.id)}
                        className="text-rose-500 hover:text-rose-700 font-bold px-1"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Yeni Oda Ekle */}
              <form onSubmit={handleAddRoom} className="grid grid-cols-4 gap-2">
                <input
                  id={customRoomNameId}
                  type="text"
                  placeholder="Oda (Örn: Balkon)"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="col-span-2 p-2 bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-lg text-xs"
                />
                <input
                  id={customRoomWidthId}
                  type="number"
                  placeholder="En"
                  step="0.1"
                  value={newRoomW}
                  onChange={(e) => setNewRoomW(e.target.value)}
                  className="p-2 bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-lg text-xs"
                />
                <input
                  id={customRoomLengthId}
                  type="number"
                  placeholder="Boy"
                  step="0.1"
                  value={newRoomL}
                  onChange={(e) => setNewRoomL(e.target.value)}
                  className="p-2 bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-lg text-xs"
                />
                <button
                  type="submit"
                  className="col-span-4 bg-[#0056b3] text-white text-xs font-bold py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  + Listeye Oda Ekle
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      {/* SEO & BİLGİLENDİRME ALANI */}
      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Metrekare (m²) Nasıl Hesaplanır? Rehber ve Formüller
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-6 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-2">Metrekare Nedir ve Formülü Nedir?</h4>
            <p>
              Metrekare (m²), kenar uzunluğu 1 metre olan bir karenin kapladığı iki boyutlu yüzey alanını ifade eden uluslararası SI alan ölçü birimidir.
            </p>
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl font-mono text-center text-sm text-[#0056b3] dark:text-blue-400 my-3">
              Alan (m²) = En (Genişlik) × Boy (Uzunluk)
            </div>
            <p>
              Örneğin eni 4 metre, boyu 5 metre olan bir salonun alanı: <strong>4 × 5 = 20 m²</strong>'dir.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-2">Farklı Şekiller İçin Metrekare Formülleri</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Dikdörtgen & Kare:</strong> Alan = En × Boy</li>
              <li><strong>Üçgen Alan:</strong> Alan = (Taban × Yükseklik) / 2</li>
              <li><strong>Daire Alan:</strong> Alan = π × r² (Yarıçapın karesi çarpı pi sayısı)</li>
              <li><strong>L Şeklindeki Odalar:</strong> Oda iki ayrı dikdörtgene bölünür, her birinin alanı hesaplanarak toplanır.</li>
            </ul>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-2">Parke ve Boya İçin Metrekare Hesabı</h4>
            <p>
              Zemin kaplama, parke ve fayans alırken kesim ve köşe payları için <strong>%10 ila %15 fire payı</strong> eklenmesi önerilir. Örneğin 20 m² oda için en az 22 m² parke satın alınmalıdır. Duvar boyası içinse 1 litre boya genellikle 1 katta yaklaşık 10-12 m² alan boyar.
            </p>
          </section>

          
          <div className="pt-2">
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Kullanılan Formüller:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  Dikdörtgen/Kare için Alan (m²) = En (Metre) × Boy (Metre)
                </div>
              </div>
            </div>
          </div>
          
          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular</h4>
            <div className="space-y-4">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Brüt metrekare ile net metrekare arasındaki fark nedir?</h5>
                <p><strong>Net metrekare</strong>, duvarlar arasındaki fiilen basılabilen ve süpürülebilir kullanım alanıdır. <strong>Brüt metrekare</strong> ise duvar kalınlıkları, kolonlar, balkonlar ve ortak alan paylarını (merdiven, asansör) içeren toplam inşaat alanıdır.</p>
              </div>
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-1">1 dönüm kaç metrekaredir?</h5>
                <p>1 dönüm (dekar) <strong>1.000 metrekareye</strong> eşittir. 1 hektar ise 10.000 metrekaredir.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      
      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Metrekare ($m^2$) Hesaplama ve Alan Ölçümü Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              Metrekare ($m^2$) Hesaplama ve Alan Ölçümü aracını kullanmak son derece basit ve kullanıcı dostudur. İlgili form alanlarına elinizdeki verileri eksiksiz ve doğru bir şekilde girdiğinizden emin olun. Tüm alanları doldurduktan sonra "Hesapla" butonuna tıklayarak sonuçları anında görüntüleyebilirsiniz. Aracımız, girdiğiniz değerleri anlık olarak işler ve herhangi bir sayfaya yönlendirme yapmadan, bulunduğunuz ekran üzerinde size en net ve kesin verileri sunar. İhtiyaç duyduğunuz her an bu aracı tamamen ücretsiz olarak kullanabilir, dilerseniz sonuçları kopyalayarak farklı platformlarda kolayca paylaşabilirsiniz. Zaman kaybetmeden, en karmaşık hesaplamaları bile saniyeler içinde tamamlamanın ayrıcalığını yaşayın.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Metrekare ($m^2$) Hesaplama ve Alan Ölçümü Nedir ve Nasıl Hesaplanır?</h4>
            <p>
              Metrekare ($m^2$) Hesaplama ve Alan Ölçümü, kullanıcıların günlük hayatta veya profesyonel iş süreçlerinde sıklıkla ihtiyaç duyduğu matematiksel veya istatistiksel hesaplamaları pratik bir şekilde çözmek amacıyla geliştirilmiş kapsamlı bir dijital araçtır. Geleneksel yöntemlerle yapıldığında hata payı yüksek olan ve uzun zaman alan bu tür işlemler, gelişmiş altyapımız sayesinde otomatik olarak hatasız bir biçimde gerçekleştirilir. 
            </p>
            <p className="mt-4">
              Hesaplama arka planda, genel kabul görmüş evrensel formüller, en güncel yasal mevzuatlar veya resmi olarak açıklanmış standart oranlar kullanılarak yapılmaktadır. Veriler sisteme girildiği anda, algoritma bu güncel parametreleri referans alarak verilerinizi analiz eder ve sonuçları net bir şekilde ekranınıza yansıtır. Finansal, istatistiksel veya gündelik hesaplamalar fark etmeksizin her daim doğru ve güvenilir bilgiye ulaşmanız hedeflenmektedir. Bu aracı kullanarak iş akışınızı hızlandırabilir ve hata payını sıfıra indirebilirsiniz.
            </p>
          </section>

          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular (SSS)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Metrekare ($m^2$) Hesaplama ve Alan Ölçümü aracı ücretli midir?</h5>
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
      <RelatedTools category="matematik" currentToolId="metrekare-hesaplama" />
      <Disclaimer category="matematik" />
    </div>
  );
}
