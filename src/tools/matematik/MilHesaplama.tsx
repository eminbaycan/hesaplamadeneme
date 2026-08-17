import React, { useState, useId } from 'react';
import { ChevronRight, RefreshCw, Copy, Info, Gauge, Navigation, Compass, ArrowRightLeft, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToolIcon } from '../../components/icons/ToolIcon';
import { AdSlot } from '../../components/ads/AdSlot';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { RelatedTools } from '../../components/tools/RelatedTools';

type MileType = 'statute' | 'nautical';

export default function MilHesaplama() {
  const inputValueId = useId();
  const inputUnitId = useId();
  const speedValId = useId();
  const speedUnitId = useId();

  const [mileType, setMileType] = useState<MileType>('statute');
  const [inputValue, setInputValue] = useState<string>('');
  const [inputUnit, setInputUnit] = useState<'mile' | 'km' | 'm' | 'yard' | 'foot'>('mile');

  // Hız Dönüşümü (mph / km/h / knot)
  const [speedVal, setSpeedVal] = useState<string>('');
  const [speedUnit, setSpeedUnit] = useState<'mph' | 'kmh' | 'knot' | 'ms'>('mph');

  const [copied, setCopied] = useState<boolean>(false);

  // Sabitler
  const STATUTE_MILE_KM = 1.609344; // Kara mili
  const NAUTICAL_MILE_KM = 1.852; // Deniz mili

  const currentMileKm = mileType === 'statute' ? STATUTE_MILE_KM : NAUTICAL_MILE_KM;

  // Tüm uzunlukları önce Kilometre'ye (km) çeviriyoruz
  const convertToKm = (val: number, unit: string): number => {
    switch (unit) {
      case 'mile':
        return val * currentMileKm;
      case 'km':
        return val;
      case 'm':
        return val / 1000;
      case 'yard':
        return (val * 0.9144) / 1000;
      case 'foot':
        return (val * 0.3048) / 1000;
      default:
        return val;
    }
  };

  const valNum = parseFloat(inputValue) || 0;
  const baseKm = convertToKm(valNum, inputUnit);

  // km'den diğer birimlere sonuçlar
  const resultStatuteMiles = baseKm / STATUTE_MILE_KM;
  const resultNauticalMiles = baseKm / NAUTICAL_MILE_KM;
  const resultKm = baseKm;
  const resultMeters = baseKm * 1000;
  const resultYards = (baseKm * 1000) / 0.9144;
  const resultFeet = (baseKm * 1000) / 0.3048;

  // Hız dönüşümü (Önce km/h'ye çevir)
  const sNum = parseFloat(speedVal) || 0;
  let baseKmh = 0;
  if (speedUnit === 'mph') baseKmh = sNum * 1.609344;
  else if (speedUnit === 'kmh') baseKmh = sNum;
  else if (speedUnit === 'knot') baseKmh = sNum * 1.852;
  else if (speedUnit === 'ms') baseKmh = sNum * 3.6;

  const resMph = baseKmh / 1.609344;
  const resKmh = baseKmh;
  const resKnot = baseKmh / 1.852;
  const resMs = baseKmh / 3.6;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setInputValue('100');
    setInputUnit('mile');
    setSpeedVal('60');
    setSpeedUnit('mph');
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* BREADCRUMB */}
      <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <Link to="/" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Ana Sayfa</Link>
        <ChevronRight size={14} />
        <Link to="/kategori/matematik" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors capitalize">Matematik</Link>
        <ChevronRight size={14} />
        <span className="text-slate-800 dark:text-slate-300">Mil Hesaplama</span>
      </div>

      {/* BAŞLIK */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Mil - Kilometre (km) Çevirme ve Hız Hesaplama 2026 - Ücretsiz ve Hızlı Sonuçlar</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Kara mili (Statute Mile) ve Deniz mili (Nautical Mile) değerlerini kilometre (km), metre, fit ve yardaya dönüştürün. MPH ve Knot hız birimlerini anında hesaplayın.
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
            Mil & Hız Çevirici
          </h2>
        </div>

        {/* MİL TÜRÜ SEÇİMİ */}
        <div className="grid grid-cols-2 gap-3 mb-6 mt-4">
          <button
            type="button"
            onClick={() => setMileType('statute')}
            className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              mileType === 'statute'
                ? 'bg-[#0056b3] text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-black/5 dark:border-white/5 hover:bg-slate-50'
            }`}
          >
            <Compass size={16} />
            Kara Mili (1 mi = 1.609 km)
          </button>
          <button
            type="button"
            onClick={() => setMileType('nautical')}
            className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              mileType === 'nautical'
                ? 'bg-[#0056b3] text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-black/5 dark:border-white/5 hover:bg-slate-50'
            }`}
          >
            <Navigation size={16} />
            Deniz Mili / Havacılık (1 NM = 1.852 km)
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* SOL: Girdi Formu */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Mesafe Dönüştürücü</h3>
              <button
                onClick={handleReset}
                className="text-[12px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw size={12} /> Sıfırla
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor={inputValueId} className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                  Değer
                </label>
                <input
                  id={inputValueId}
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="100"
                  step="any"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 focus:border-[#0056b3]"
                />
              </div>

              <div>
                <label htmlFor={inputUnitId} className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                  Girdi Birimi
                </label>
                <select
                  id={inputUnitId}
                  value={inputUnit}
                  onChange={(e) => setInputUnit(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white font-bold text-sm"
                >
                  <option value="mile">Mil ({mileType === 'statute' ? 'Kara Mili' : 'Deniz Mili - NM'})</option>
                  <option value="km">Kilometre (km)</option>
                  <option value="m">Metre (m)</option>
                  <option value="yard">Yarda (yd)</option>
                  <option value="foot">Fit / Foot (ft)</option>
                </select>
              </div>

              {/* HIZ ÇEVİRİCİ BÖLÜMÜ */}
              <div className="pt-5 border-t border-black/5 dark:border-white/5 space-y-3">
                <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Gauge size={14} className="text-[#0056b3] dark:text-blue-400" />
                  Hız Birimi Dönüştürücü (MPH / KM/H)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor={speedValId} className="block text-[11px] font-semibold text-slate-500 mb-1">Hız Değeri</label>
                    <input placeholder="Örn: 60"
                      id={speedValId}
                      type="number"
                      value={speedVal}
                      onChange={(e) => setSpeedVal(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-lg p-2 font-bold text-xs"
                    />
                  </div>
                  <div>
                    <label htmlFor={speedUnitId} className="block text-[11px] font-semibold text-slate-500 mb-1">Birim</label>
                    <select
                      id={speedUnitId}
                      value={speedUnit}
                      onChange={(e) => setSpeedUnit(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-lg p-2 font-bold text-xs"
                    >
                      <option value="mph">MPH (Mil/Saat)</option>
                      <option value="kmh">KM/H (Km/Saat)</option>
                      <option value="knot">Knot (Deniz Mili/Saat)</option>
                      <option value="ms">m/s (Metre/Saniye)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SAĞ: Sonuç Paneli */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">DÖNÜŞÜM SONUÇLARI</h3>

              {/* ANA ÖNE ÇIKAN SONUÇ */}
              <div className="bg-blue-50/70 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 p-5 rounded-2xl mb-4">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {inputUnit === 'mile' ? 'Kilometre Karşılığı' : 'Mil Karşılığı'}
                </span>
                <div className="text-4xl font-black text-[#0056b3] dark:text-blue-400 mt-1 font-mono">
                  {inputUnit === 'mile'
                    ? `${resultKm.toLocaleString('tr-TR', { maximumFractionDigits: 4 })} km`
                    : `${(mileType === 'statute' ? resultStatuteMiles : resultNauticalMiles).toLocaleString('tr-TR', { maximumFractionDigits: 4 })} mil`}
                </div>
              </div>

              {/* TÜM BİRİMLER LİSTESİ */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4 text-xs">
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Kara Mili (mi)</span>
                  <div className="font-bold font-mono text-sm text-slate-800 dark:text-slate-200 mt-0.5">
                    {resultStatuteMiles.toLocaleString('tr-TR', { maximumFractionDigits: 3 })} mi
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Deniz Mili (NM)</span>
                  <div className="font-bold font-mono text-sm text-slate-800 dark:text-slate-200 mt-0.5">
                    {resultNauticalMiles.toLocaleString('tr-TR', { maximumFractionDigits: 3 })} NM
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Kilometre (km)</span>
                  <div className="font-bold font-mono text-sm text-slate-800 dark:text-slate-200 mt-0.5">
                    {resultKm.toLocaleString('tr-TR', { maximumFractionDigits: 3 })} km
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Metre (m)</span>
                  <div className="font-bold font-mono text-sm text-slate-800 dark:text-slate-200 mt-0.5">
                    {resultMeters.toLocaleString('tr-TR', { maximumFractionDigits: 1 })} m
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Yarda (yd)</span>
                  <div className="font-bold font-mono text-sm text-slate-800 dark:text-slate-200 mt-0.5">
                    {resultYards.toLocaleString('tr-TR', { maximumFractionDigits: 1 })} yd
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Fit / Feet (ft)</span>
                  <div className="font-bold font-mono text-sm text-slate-800 dark:text-slate-200 mt-0.5">
                    {resultFeet.toLocaleString('tr-TR', { maximumFractionDigits: 1 })} ft
                  </div>
                </div>
              </div>

              {/* HIZ DÖNÜŞÜM ÇIKTILARI */}
              <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-black/5 dark:border-white/5 mb-4">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Hız Eşdeğerleri ({speedVal} {speedUnit.toUpperCase()})
                </span>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-white dark:bg-slate-900 p-2 rounded-lg">
                    <div className="font-mono font-black text-[#0056b3] dark:text-blue-400">{resKmh.toFixed(1)}</div>
                    <div className="text-[10px] text-slate-400">km/s (km/h)</div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2 rounded-lg">
                    <div className="font-mono font-black text-slate-800 dark:text-white">{resMph.toFixed(1)}</div>
                    <div className="text-[10px] text-slate-400">MPH (mil/s)</div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2 rounded-lg">
                    <div className="font-mono font-black text-slate-800 dark:text-white">{resKnot.toFixed(1)}</div>
                    <div className="text-[10px] text-slate-400">Knot (Deniz)</div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2 rounded-lg">
                    <div className="font-mono font-black text-slate-800 dark:text-white">{resMs.toFixed(1)}</div>
                    <div className="text-[10px] text-slate-400">m/s</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleCopy(`${resultKm.toFixed(2)} km`)}
                className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-bold rounded-xl py-2.5 flex items-center justify-center gap-2 transition-all text-xs"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                {copied ? 'Kopyalandı!' : 'Kilometre Değerini Kopyala'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      {/* SEO & BİLGİLENDİRME */}
      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Mil Birimleri, Karşılaştırma Tablosu ve Dönüşüm Formülleri
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-6 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-2">1 Mil Kaç Kilometredir?</h4>
            <p>
              Mil birimi kullanım alanına göre ikiye ayrılır:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Kara Mili (Statute Mile):</strong> ABD ve İngiltere'de karayollarında kullanılan resmi mildir. <strong>1 Kara Mili = 1.609344 km</strong>'dir.</li>
              <li><strong>Deniz Mili (Nautical Mile - NM):</strong> Denizcilik ve uluslararası havacılıkta kullanılan mildir. Dünya meridyen dairesinin 1 dakikalık yay uzunluğuna dayanır. <strong>1 Deniz Mili = 1.852 km (1852 metre)</strong>'dir.</li>
            </ul>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-2">Popüler Hız ve Mesafe Karşılaştırma Tablosu</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { mi: '1 Mil', km: '1.61 km', mph: '30 MPH', kmh: '48.3 km/h' },
                { mi: '5 Mil', km: '8.05 km', mph: '50 MPH', kmh: '80.5 km/h' },
                { mi: '10 Mil', km: '16.09 km', mph: '60 MPH', kmh: '96.6 km/h' },
                { mi: '20 Mil', km: '32.19 km', mph: '70 MPH', kmh: '112.7 km/h' },
                { mi: '50 Mil', km: '80.47 km', mph: '80 MPH', kmh: '128.7 km/h' },
                { mi: '100 Mil', km: '160.93 km', mph: '100 MPH', kmh: '160.9 km/h' },
                { mi: '1 Deniz Mili', km: '1.85 km', mph: '1 Knot', kmh: '1.85 km/h' },
                { mi: '10 Deniz Mili', km: '18.52 km', mph: '20 Knot', kmh: '37.0 km/h' },
              ].map((item, i) => (
                <div key={i} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-center font-mono">
                  <div><strong>{item.mi}</strong> = {item.km}</div>
                  <div className="text-slate-400 text-[10px] mt-0.5">{item.mph} = {item.kmh}</div>
                </div>
              ))}
            </div>
          </section>

          
          <div className="pt-2">
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Kullanılan Formüller:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  Kilometre (km) = Mil × 1.609344  |  Mil = Kilometre / 1.609344
                </div>
              </div>
            </div>
          </div>
          
          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular</h4>
            <div className="space-y-4">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-1">MPH nedir?</h5>
                <p><strong>MPH (Miles Per Hour)</strong>, saatte alınan kara mili miktarını belirten hız birimidir. Örneğin 60 MPH hızla giden bir araç saatte yaklaşık 96.6 km hız yapmaktadır.</p>
              </div>
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Knot nedir?</h5>
                <p><strong>Knot (kt)</strong>, saatte 1 deniz miline (1.852 km/h) eşit olan deniz ve hava taşıtlarının hız birimidir.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      
      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Mil - Kilometre (km) Çevirme ve Hız Hesaplama Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              Mil - Kilometre (km) Çevirme ve Hız Hesaplama aracını kullanmak son derece basit ve kullanıcı dostudur. İlgili form alanlarına elinizdeki verileri eksiksiz ve doğru bir şekilde girdiğinizden emin olun. Tüm alanları doldurduktan sonra "Hesapla" butonuna tıklayarak sonuçları anında görüntüleyebilirsiniz. Aracımız, girdiğiniz değerleri anlık olarak işler ve herhangi bir sayfaya yönlendirme yapmadan, bulunduğunuz ekran üzerinde size en net ve kesin verileri sunar. İhtiyaç duyduğunuz her an bu aracı tamamen ücretsiz olarak kullanabilir, dilerseniz sonuçları kopyalayarak farklı platformlarda kolayca paylaşabilirsiniz. Zaman kaybetmeden, en karmaşık hesaplamaları bile saniyeler içinde tamamlamanın ayrıcalığını yaşayın.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Mil - Kilometre (km) Çevirme ve Hız Hesaplama Nedir ve Nasıl Hesaplanır?</h4>
            <p>
              Mil - Kilometre (km) Çevirme ve Hız Hesaplama, kullanıcıların günlük hayatta veya profesyonel iş süreçlerinde sıklıkla ihtiyaç duyduğu matematiksel veya istatistiksel hesaplamaları pratik bir şekilde çözmek amacıyla geliştirilmiş kapsamlı bir dijital araçtır. Geleneksel yöntemlerle yapıldığında hata payı yüksek olan ve uzun zaman alan bu tür işlemler, gelişmiş altyapımız sayesinde otomatik olarak hatasız bir biçimde gerçekleştirilir. 
            </p>
            <p className="mt-4">
              Hesaplama arka planda, genel kabul görmüş evrensel formüller, en güncel yasal mevzuatlar veya resmi olarak açıklanmış standart oranlar kullanılarak yapılmaktadır. Veriler sisteme girildiği anda, algoritma bu güncel parametreleri referans alarak verilerinizi analiz eder ve sonuçları net bir şekilde ekranınıza yansıtır. Finansal, istatistiksel veya gündelik hesaplamalar fark etmeksizin her daim doğru ve güvenilir bilgiye ulaşmanız hedeflenmektedir. Bu aracı kullanarak iş akışınızı hızlandırabilir ve hata payını sıfıra indirebilirsiniz.
            </p>
          </section>

          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular (SSS)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Mil - Kilometre (km) Çevirme ve Hız Hesaplama aracı ücretli midir?</h5>
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
      <RelatedTools category="matematik" currentToolId="mil-hesaplama" />
      <Disclaimer category="matematik" />
    </div>
  );
}
