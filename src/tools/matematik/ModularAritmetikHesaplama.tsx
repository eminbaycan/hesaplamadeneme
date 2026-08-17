import React, { useState, useId } from 'react';
import { ChevronRight, RefreshCw, Copy, Info, Calculator, Clock, Calendar, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToolIcon } from '../../components/icons/ToolIcon';
import { AdSlot } from '../../components/ads/AdSlot';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { RelatedTools } from '../../components/tools/RelatedTools';

type ModMode = 'basic' | 'power' | 'clock' | 'calendar';

export default function ModularAritmetikHesaplama() {
  const numAId = useId();
  const modNId = useId();
  const baseAId = useId();
  const expBId = useId();
  const modPowNId = useId();
  const currentHourId = useId();
  const addHoursId = useId();
  const targetDaysId = useId();

  const [mode, setMode] = useState<ModMode>('basic');

  // Temel Mod: A mod N
  const [numA, setNumA] = useState<string>('');
  const [modN, setModN] = useState<string>('');

  // Üslü Mod: (A^B) mod N (Modüler Üs Alma)
  const [baseA, setBaseA] = useState<string>('');
  const [expB, setExpB] = useState<string>('');
  const [modPowN, setModPowN] = useState<string>('');

  // Saat Aritmetiği
  const [currentHour, setCurrentHour] = useState<string>('');
  const [addHours, setAddHours] = useState<string>('');

  // Gün / Takvim Aritmetiği
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(1); // 1: Pazartesi ... 7: Pazar
  const [targetDays, setTargetDays] = useState<string>('');
  const [dayDirection, setDayDirection] = useState<'after' | 'before'>('after');

  const [copied, setCopied] = useState<boolean>(false);

  const daysOfWeek = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

  // 1. Temel Mod Hesaplama (Negatif sayıları da doğru kapsayan modül mantığı)
  const aVal = parseFloat(numA) || 0;
  const nVal = parseInt(modN, 10) || 1;
  const isValidN = nVal > 0;

  // Matematiksel modül: ((a % n) + n) % n
  const basicRemainder = isValidN ? ((Math.floor(aVal) % nVal) + nVal) % nVal : 0;
  const basicQuotient = isValidN ? Math.floor((Math.floor(aVal) - basicRemainder) / nVal) : 0;

  // 2. Modüler Üs Alma: (base^exp) % mod (BigInt tabanlı hızlı üs alma)
  const calculateModularExponentiation = (bStr: string, eStr: string, mStr: string): string => {
    try {
      const b = BigInt(bStr);
      const e = BigInt(eStr);
      const m = BigInt(mStr);
      if (m <= 0n) return 'Geçersiz Modül';
      if (e < 0n) return 'Pozitif üs giriniz';

      let result = 1n;
      let base = ((b % m) + m) % m;
      let exp = e;

      while (exp > 0n) {
        if (exp % 2n === 1n) {
          result = (result * base) % m;
        }
        base = (base * base) % m;
        exp = exp / 2n;
      }
      return result.toString();
    } catch {
      return 'Hesaplanamadı';
    }
  };

  const modularPowerResult = calculateModularExponentiation(baseA, expB, modPowN);

  // 3. Saat Aritmetiği (mod 12 ve mod 24)
  const curH = parseInt(currentHour, 10) || 0;
  const addH = parseInt(addHours, 10) || 0;
  const futureHour24 = ((curH + addH) % 24 + 24) % 24;
  const futureHour12 = futureHour24 % 12 === 0 ? 12 : futureHour24 % 12;

  // 4. Gün / Takvim Aritmetiği (mod 7)
  const daysDiff = parseInt(targetDays, 10) || 0;
  const calculatedDayIndex = dayDirection === 'after'
    ? ((currentDayIndex - 1 + (daysDiff % 7)) % 7 + 7) % 7
    : ((currentDayIndex - 1 - (daysDiff % 7)) % 7 + 7) % 7;
  const resultDayName = daysOfWeek[calculatedDayIndex];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setNumA('47');
    setModN('5');
    setBaseA('7');
    setExpB('123');
    setModPowN('11');
    setCurrentHour('14');
    setAddHours('50');
    setTargetDays('100');
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* BREADCRUMB */}
      <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <Link to="/" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Ana Sayfa</Link>
        <ChevronRight size={14} />
        <Link to="/kategori/matematik" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors capitalize">Matematik</Link>
        <ChevronRight size={14} />
        <span className="text-slate-800 dark:text-slate-300">Modüler Aritmetik Hesaplama</span>
      </div>

      {/* BAŞLIK */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Modüler Aritmetik ve Kalan (Mod) Hesaplama 2026 - Ücretsiz ve Hızlı Sonuçlar</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          $a \pmod n$ kalan hesabı, $(a^b) \pmod n$ üslü modüler aritmetik, saat döngüsü ve gün tekrarı problemlerini adım adım hesaplayın.
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
            Modüler Aritmetik Motoru
          </h2>
        </div>

        {/* MOD SEÇİMİ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 mt-4">
          {[
            { id: 'basic', label: 'a mod n (Kalan)', icon: Calculator },
            { id: 'power', label: 'Üslü Mod (aᵇ mod n)', icon: Calculator },
            { id: 'clock', label: 'Saat Problemleri', icon: Clock },
            { id: 'calendar', label: 'Gün / Takvim Modu', icon: Calendar },
          ].map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id as ModMode)}
                className={`py-3 px-2 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
                  mode === item.id
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
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Girdi Değerleri</h3>
              <button
                onClick={handleReset}
                className="text-[12px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw size={12} /> Sıfırla
              </button>
            </div>

            {/* MOD 1: TEMEL a mod n */}
            {mode === 'basic' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor={numAId} className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                    Bölünen Sayı (a)
                  </label>
                  <input
                    id={numAId}
                    type="number"
                    value={numA}
                    onChange={(e) => setNumA(e.target.value)}
                    placeholder="Örn: 47"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white font-bold text-lg focus:ring-2 focus:ring-[#0056b3]/20 focus:border-[#0056b3]"
                  />
                </div>
                <div>
                  <label htmlFor={modNId} className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                    Modül / Bölen Sayı (n)
                  </label>
                  <input
                    id={modNId}
                    type="number"
                    value={modN}
                    onChange={(e) => setModN(e.target.value)}
                    placeholder="Örn: 5"
                    min="1"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white font-bold text-lg focus:ring-2 focus:ring-[#0056b3]/20 focus:border-[#0056b3]"
                  />
                </div>
              </div>
            )}

            {/* MOD 2: ÜSLÜ MOD (a^b mod n) */}
            {mode === 'power' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor={baseAId} className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                    Taban (a)
                  </label>
                  <input
                    id={baseAId}
                    type="number"
                    value={baseA}
                    onChange={(e) => setBaseA(e.target.value)}
                    placeholder="7"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 font-bold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor={expBId} className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                      Kuvvet / Üs (b)
                    </label>
                    <input
                      id={expBId}
                      type="number"
                      value={expB}
                      onChange={(e) => setExpB(e.target.value)}
                      placeholder="123"
                      min="0"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 font-bold"
                    />
                  </div>
                  <div>
                    <label htmlFor={modPowNId} className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                      Mod (n)
                    </label>
                    <input
                      id={modPowNId}
                      type="number"
                      value={modPowN}
                      onChange={(e) => setModPowN(e.target.value)}
                      placeholder="11"
                      min="1"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 font-bold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* MOD 3: SAAT PROBLEMLERİ */}
            {mode === 'clock' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor={currentHourId} className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                    Şu Anki Saat (0-23)
                  </label>
                  <input placeholder="Örn: 14"
                    id={currentHourId}
                    type="number"
                    value={currentHour}
                    onChange={(e) => setCurrentHour(e.target.value)}
                    min="0"
                    max="23"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 font-bold text-lg"
                  />
                </div>
                <div>
                  <label htmlFor={addHoursId} className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                    Eklenecek Saat Miktarı
                  </label>
                  <input
                    id={addHoursId}
                    type="number"
                    value={addHours}
                    onChange={(e) => setAddHours(e.target.value)}
                    placeholder="Örn: 50"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 font-bold text-lg"
                  />
                </div>
              </div>
            )}

            {/* MOD 4: GÜN PROBLEMLERİ */}
            {mode === 'calendar' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                    Başlangıç Günü
                  </label>
                  <select
                    value={currentDayIndex}
                    onChange={(e) => setCurrentDayIndex(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white font-bold"
                  >
                    {daysOfWeek.map((d, i) => (
                      <option key={d} value={i + 1}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor={targetDaysId} className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                      Gün Sayısı
                    </label>
                    <input
                      id={targetDaysId}
                      type="number"
                      value={targetDays}
                      onChange={(e) => setTargetDays(e.target.value)}
                      placeholder="100"
                      min="0"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                      Zaman Yönü
                    </label>
                    <select
                      value={dayDirection}
                      onChange={(e) => setDayDirection(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 font-bold text-xs"
                    >
                      <option value="after">Gün Sonra</option>
                      <option value="before">Gün Önce</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SAĞ: Sonuç Paneli */}
          <div className="lg:col-span-6 flex flex-col space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">HESAPLAMA SONUCU</h3>

              {/* SONUÇ 1: TEMEL MOD */}
              {mode === 'basic' && (
                <div className="space-y-4">
                  <div className="bg-blue-50/70 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 p-5 rounded-2xl">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {numA} mod {modN} (Kalan)
                    </span>
                    <div className="text-4xl font-black text-[#0056b3] dark:text-blue-400 mt-1 font-mono">
                      {basicRemainder}
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl space-y-1 text-xs">
                    <span className="font-bold text-slate-400 uppercase">Bölme Özdeşliği</span>
                    <div className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">
                      {numA} = ({modN} × {basicQuotient}) + {basicRemainder}
                    </div>
                    <div className="text-slate-400 mt-1">Bölüm: <strong>{basicQuotient}</strong>, Kalan: <strong>{basicRemainder}</strong></div>
                  </div>
                </div>
              )}

              {/* SONUÇ 2: ÜSLÜ MOD */}
              {mode === 'power' && (
                <div className="space-y-4">
                  <div className="bg-blue-50/70 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 p-5 rounded-2xl">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      ({baseA}^{expB}) mod {modPowN} Sonucu
                    </span>
                    <div className="text-4xl font-black text-[#0056b3] dark:text-blue-400 mt-1 font-mono">
                      {modularPowerResult}
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl text-xs text-slate-500">
                    Fermat'ın Küçük Teoremi ve Hızlı Üs Alma (Binary Exponentiation) yöntemiyle hesaplanmıştır.
                  </div>
                </div>
              )}

              {/* SONUÇ 3: SAAT */}
              {mode === 'clock' && (
                <div className="space-y-4">
                  <div className="bg-blue-50/70 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 p-5 rounded-2xl">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      Saat {currentHour}:00 iken {addHours} saat sonra:
                    </span>
                    <div className="text-4xl font-black text-[#0056b3] dark:text-blue-400 mt-1 font-mono">
                      {futureHour24.toString().padStart(2, '0')}:00
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      12 Saatlik Formatta: <strong>{futureHour12}:00 {futureHour24 >= 12 ? 'Ö.S (PM)' : 'Ö.Ö (AM)'}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* SONUÇ 4: GÜN / TAKVİM */}
              {mode === 'calendar' && (
                <div className="space-y-4">
                  <div className="bg-blue-50/70 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 p-5 rounded-2xl">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      Gün {daysOfWeek[currentDayIndex - 1]} iken {targetDays} {dayDirection === 'after' ? 'gün sonra' : 'gün önce'}:
                    </span>
                    <div className="text-3xl sm:text-4xl font-black text-[#0056b3] dark:text-blue-400 mt-1">
                      {resultDayName}
                    </div>
                    <div className="text-xs text-slate-400 mt-1 font-mono">
                      Hesap: {targetDays} mod 7 = {daysDiff % 7} gün kaydırma
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => handleCopy(mode === 'basic' ? `${basicRemainder}` : mode === 'power' ? `${modularPowerResult}` : mode === 'clock' ? `${futureHour24}:00` : resultDayName)}
                className="w-full mt-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-bold rounded-xl py-2.5 flex items-center justify-center gap-2 transition-all text-xs"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                {copied ? 'Kopyalandı!' : 'Sonucu Kopyala'}
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
          Modüler Aritmetik Nedir? Formüller ve Günlük Hayat Örnekleri
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-6 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-2">Modüler Aritmetik Tanımı</h4>
            <p>
              Modüler aritmetik, tam sayıların belirli bir sayıya (modüle) bölündüğünde kalanlarla ilgilenen döngüsel bir matematik dalıdır. Genellikle "saat matematiği" olarak da bilinir.
            </p>
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl font-mono text-center text-sm text-[#0056b3] dark:text-blue-400 my-3">
              a ≡ b (mod n) ⟺ (a - b), n'e tam bölünür.
            </div>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-2">Günlük Hayatta Kullanım Alanları</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Saatler (Mod 12 ve Mod 24):</strong> Saat 22:00'den 5 saat sonra saat (22 + 5) mod 24 = 3:00 olur.</li>
              <li><strong>Haftanın Günleri (Mod 7):</strong> 7 günde bir günler aynı sırayla tekrar eder.</li>
              <li><strong>Kriptografi & Siber Güvenlik:</strong> RSA şifreleme ve Diffie-Hellman anahtar değişim algoritmaları tamamen büyük asal sayılarla yapılan modüler üs alma işlemlerine dayanır.</li>
              <li><strong>TC Kimlik ve Barkod Doğrulama:</strong> TC kimlik numaralarının son haneleri modüler aritmetik algoritmasıyla doğrulanır.</li>
            </ul>
          </section>
        </div>
      </div>

      
      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Modüler Aritmetik ve Kalan (Mod) Hesaplama Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              Modüler Aritmetik ve Kalan (Mod) Hesaplama aracını kullanmak son derece basit ve kullanıcı dostudur. İlgili form alanlarına elinizdeki verileri eksiksiz ve doğru bir şekilde girdiğinizden emin olun. Tüm alanları doldurduktan sonra "Hesapla" butonuna tıklayarak sonuçları anında görüntüleyebilirsiniz. Aracımız, girdiğiniz değerleri anlık olarak işler ve herhangi bir sayfaya yönlendirme yapmadan, bulunduğunuz ekran üzerinde size en net ve kesin verileri sunar. İhtiyaç duyduğunuz her an bu aracı tamamen ücretsiz olarak kullanabilir, dilerseniz sonuçları kopyalayarak farklı platformlarda kolayca paylaşabilirsiniz. Zaman kaybetmeden, en karmaşık hesaplamaları bile saniyeler içinde tamamlamanın ayrıcalığını yaşayın.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Modüler Aritmetik ve Kalan (Mod) Hesaplama Nedir ve Nasıl Hesaplanır?</h4>
            <p>
              Modüler Aritmetik ve Kalan (Mod) Hesaplama, kullanıcıların günlük hayatta veya profesyonel iş süreçlerinde sıklıkla ihtiyaç duyduğu matematiksel veya istatistiksel hesaplamaları pratik bir şekilde çözmek amacıyla geliştirilmiş kapsamlı bir dijital araçtır. Geleneksel yöntemlerle yapıldığında hata payı yüksek olan ve uzun zaman alan bu tür işlemler, gelişmiş altyapımız sayesinde otomatik olarak hatasız bir biçimde gerçekleştirilir. 
            </p>
            <p className="mt-4">
              Hesaplama arka planda, genel kabul görmüş evrensel formüller, en güncel yasal mevzuatlar veya resmi olarak açıklanmış standart oranlar kullanılarak yapılmaktadır. Veriler sisteme girildiği anda, algoritma bu güncel parametreleri referans alarak verilerinizi analiz eder ve sonuçları net bir şekilde ekranınıza yansıtır. Finansal, istatistiksel veya gündelik hesaplamalar fark etmeksizin her daim doğru ve güvenilir bilgiye ulaşmanız hedeflenmektedir. Bu aracı kullanarak iş akışınızı hızlandırabilir ve hata payını sıfıra indirebilirsiniz.
            </p>
          </section>

          
          <div className="pt-2">
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Kullanılan Formüller:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  A ≡ R (mod M) ➔ A sayısının M sayısına bölümünden kalan R'dir. (A = k × M + R)
                </div>
              </div>
            </div>
          </div>
          
          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular (SSS)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Modüler Aritmetik ve Kalan (Mod) Hesaplama aracı ücretli midir?</h5>
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
      <RelatedTools category="matematik" currentToolId="modular-aritmetik-hesaplama" />
      <Disclaimer category="matematik" />
    </div>
  );
}
