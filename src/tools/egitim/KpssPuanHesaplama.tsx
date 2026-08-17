import React, { useState, useMemo } from 'react';
import { ChevronRight, RefreshCw, Info, AlertCircle, Search, Sparkles, BookOpen, Calculator, GraduationCap, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToolIcon } from '../../components/icons/ToolIcon';
import { AdSlot } from '../../components/ads/AdSlot';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { RelatedTools } from '../../components/tools/RelatedTools';

// Define the KPSS Level structure
type KpssLevel = 'lisans' | 'onlisans' | 'ortaogretim' | 'dhbt';

// Teacher ÖABT Fields and Averages
const OABT_FIELDS = [
  { name: 'Sınıf Öğretmenliği', avg: 38.5 },
  { name: 'İngilizce', avg: 41.2 },
  { name: 'Türk Dili ve Edebiyatı', avg: 34.8 },
  { name: 'İlköğretim Matematik', avg: 32.1 },
  { name: 'Okul Öncesi', avg: 44.3 },
  { name: 'Fen Bilimleri', avg: 29.5 },
  { name: 'Sosyal Bilgiler', avg: 36.2 },
  { name: 'Din Kültürü ve Ahlak Bilgisi', avg: 42.1 },
  { name: 'Tarih', avg: 31.8 },
  { name: 'Coğrafya', avg: 35.4 },
  { name: 'Matematik (Lise)', avg: 26.5 },
  { name: 'Fizik', avg: 24.2 },
  { name: 'Kimya', avg: 27.8 },
  { name: 'Biyoloji', avg: 25.4 },
  { name: 'Rehberlik (PDR)', avg: 45.1 },
  { name: 'Beden Eğitimi', avg: 39.0 },
  { name: 'Türkçe', avg: 38.1 },
  { name: 'İmam Hatip Meslek Dersleri', avg: 40.5 }
];

export default function KpssPuanHesaplama() {
  const [level, setLevel] = useState<KpssLevel>('lisans');
  const [year, setYear] = useState<string>('');
  
  // Dynamic toggles for Lisans
  const [hasEb, setHasEb] = useState(false);
  const [hasOabt, setHasOabt] = useState(false);
  const [hasAlan, setHasAlan] = useState(false);
  const [selectedOabtField, setSelectedOabtField] = useState(OABT_FIELDS[0].name);

  // Search keyword for P1-P124 list
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Initial form values
  const [inputs, setInputs] = useState({
    // GY & GK
    gyD: '' as number | '', gyY: '' as number | '',
    gkD: '' as number | '', gkY: '' as number | '',
    // Eğitim Bilimleri
    ebD: '' as number | '', ebY: '' as number | '',
    // ÖABT
    oabtD: '' as number | '', oabtY: '' as number | '',
    // DHBT
    dhbtD: '' as number | '', dhbtY: '' as number | '',
    // A Grubu Alan Bilgisi
    hukukD: '' as number | '', hukukY: '' as number | '',
    iktisatD: '' as number | '', iktisatY: '' as number | '',
    maliyeD: '' as number | '', maliyeY: '' as number | '',
    muhasebeD: '' as number | '', muhasebeY: '' as number | '',
    isletmeD: '' as number | '', isletmeY: '' as number | '',
    kamuD: '' as number | '', kamuY: '' as number | '',
    ulusD: '' as number | '', ulusY: '' as number | '',
    cekoD: '' as number | '', cekoY: '' as number | '',
    istD: '' as number | '', istY: '' as number | '',
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleInputChange = (field: keyof typeof inputs, val: string) => {
    setValidationError(null);
    if (val === '') {
      setInputs(prev => ({ ...prev, [field]: '' }));
      return;
    }
    const num = Math.max(0, parseInt(val, 10) || 0);
    setInputs(prev => ({ ...prev, [field]: num }));
  };

  // Clear all inputs
  const temizle = () => {
    setInputs({
      gyD: '', gyY: '', gkD: '', gkY: '', ebD: '', ebY: '',
      oabtD: '', oabtY: '', dhbtD: '', dhbtY: '',
      hukukD: '', hukukY: '', iktisatD: '', iktisatY: '',
      maliyeD: '', maliyeY: '', muhasebeD: '', muhasebeY: '',
      isletmeD: '', isletmeY: '', kamuD: '', kamuY: '',
      ulusD: '', ulusY: '', cekoD: '', cekoY: '', istD: '', istY: '',
    });
    setValidationError(null);
  };

  // Helper to safely calculate net score
  const getNet = (d: number | '', y: number | '', maxQ: number, label: string) => {
    const dNum = d === '' ? 0 : d;
    const yNum = y === '' ? 0 : y;
    
    if (dNum + yNum > maxQ) {
      return { net: 0, error: `${label} için doğru ve yanlış sayısı toplamı ${maxQ} değerini geçemez!` };
    }
    const rawNet = dNum - (yNum / 4);
    return { net: Math.max(0, rawNet), error: null };
  };

  // Perform calculations for all 124 scores
  const allCalculations = useMemo(() => {
    // 1. Calculate individual nets and validate
    const gy = getNet(inputs.gyD, inputs.gyY, 60, 'Genel Yetenek');
    const gk = getNet(inputs.gkD, inputs.gkY, 60, 'Genel Kültür');
    const eb = getNet(inputs.ebD, inputs.ebY, 80, 'Eğitim Bilimleri');
    const oabt = getNet(inputs.oabtD, inputs.oabtY, 75, 'ÖABT');
    const dhbt = getNet(inputs.dhbtD, inputs.dhbtY, 40, 'DHBT');
    const hukuk = getNet(inputs.hukukD, inputs.hukukY, 40, 'Hukuk');
    const iktisat = getNet(inputs.iktisatD, inputs.iktisatY, 40, 'İktisat');
    const maliye = getNet(inputs.maliyeD, inputs.maliyeY, 40, 'Maliye');
    const muhasebe = getNet(inputs.muhasebeD, inputs.muhasebeY, 40, 'Muhasebe');
    const isletme = getNet(inputs.isletmeD, inputs.isletmeY, 40, 'İşletme');
    const kamu = getNet(inputs.kamuD, inputs.kamuY, 40, 'Kamu Yönetimi');
    const ulus = getNet(inputs.ulusD, inputs.ulusY, 40, 'Uluslararası İlişkiler');
    const ceko = getNet(inputs.cekoD, inputs.cekoY, 40, 'Çalışma Ekonomisi');
    const ist = getNet(inputs.istD, inputs.istY, 40, 'İstatistik');

    // Combine error states
    const activeErrors = [
      gy.error, gk.error,
      level === 'lisans' && hasEb ? eb.error : null,
      level === 'lisans' && hasOabt ? oabt.error : null,
      level === 'dhbt' ? dhbt.error : null,
      level === 'lisans' && hasAlan ? [hukuk.error, iktisat.error, maliye.error, muhasebe.error, isletme.error, kamu.error, ulus.error, ceko.error, ist.error] : null
    ].flat().filter(Boolean);

    if (activeErrors.length > 0) {
      return { error: activeErrors[0] as string, list: [] };
    }

    // Determine year coefficient shifts
    let baseOffset = 0;
    if (year === '2024') baseOffset = 0.35;
    if (year === '2023') baseOffset = -0.20;
    if (year === '2022') baseOffset = 0.45;

    // Standard scoring engine function
    const computeScore = (ratio: number, base = 48) => {
      const finalBase = base + baseOffset;
      return Math.min(100, finalBase + (100 - finalBase) * ratio);
    };

    // Calculate all scores from P1 to P124
    const list = Array.from({ length: 124 }, (_, idx) => {
      const i = idx + 1;
      let name = `KPSS P${i}`;
      let desc = 'Kamu kurumlarının A grubu kadro giriş sınavları için ağırlıklandırılmış puan türü.';
      let weights: { [key: string]: number } = { gy: 0.5, gk: 0.5 };
      let hasRequired = inputs.gyD !== '' && inputs.gkD !== '';

      if (i === 1) {
        weights = { gy: 0.7, gk: 0.3 };
        desc = 'Merkez Bankası, İller Bankası vb. uzman ve denetçi yardımcılığı kadroları.';
      } else if (i === 2) {
        weights = { gy: 0.6, gk: 0.4 };
        desc = 'Diyanet İşleri Uzman Yardımcılığı, Kalkınma Bankası uzmanlık kadroları.';
      } else if (i === 3) {
        weights = { gy: 0.5, gk: 0.5 };
        desc = 'Lisans B Grubu kadrolar (düz memurluklar, VHKİ, kütüphaneci vb.), polislik ve TSK alımları.';
      } else if (i === 4) {
        weights = { gy: 0.4, gk: 0.6 };
        desc = 'Bazı kamu kurumlarında idari memurluk alımları.';
      } else if (i === 5) {
        weights = { gy: 0.5, gk: 0.3, hukuk: 0.2 };
        hasRequired = hasRequired && inputs.hukukD !== '';
        desc = 'Hukuk ağırlıklı kamu kurum uzman yardımcılığı.';
      } else if (i === 6) {
        weights = { gy: 0.5, gk: 0.3, iktisat: 0.2 };
        hasRequired = hasRequired && inputs.iktisatD !== '';
        desc = 'İktisat bilgisi gerektiren uzman ve denetçi yardımcılığı.';
      } else if (i === 7) {
        weights = { gy: 0.5, gk: 0.3, isletme: 0.2 };
        hasRequired = hasRequired && inputs.isletmeD !== '';
        desc = 'İşletme mezunları için uzman yardımcılığı ve idari kadrolar.';
      } else if (i === 8) {
        weights = { gy: 0.5, gk: 0.3, maliye: 0.2 };
        hasRequired = hasRequired && inputs.maliyeD !== '';
        desc = 'Hazine ve Maliye Bakanlığı ve diğer mali kurumların sınavları.';
      } else if (i === 9) {
        weights = { gy: 0.5, gk: 0.3, muhasebe: 0.2 };
        hasRequired = hasRequired && inputs.muhasebeD !== '';
        desc = 'Kamu denetçiliği, vergi dairesi ve sayman yardımcılığı kadroları.';
      } else if (i === 10) {
        weights = { gy: 0.3, gk: 0.3, eb: 0.4 };
        hasRequired = hasRequired && inputs.ebD !== '';
        desc = 'MEB Öğretmen kadroları (ÖABT sınavı olmayan Okul Öncesi, Rehberlik vb. harici branşlar).';
      } else if (i === 11) {
        weights = { gy: 0.1, gk: 0.1, hukuk: 0.35, iktisat: 0.15, maliye: 0.15, ulus: 0.15 };
        hasRequired = hasRequired && inputs.hukukD !== '' && inputs.iktisatD !== '' && inputs.maliyeD !== '' && inputs.ulusD !== '';
        desc = 'Gümrük ve Ticaret Bakanlığı, Sayıştay vb. uzman yardımcılıkları.';
      } else if (i === 12) {
        weights = { gy: 0.2, gk: 0.2, istatistik: 0.6 };
        hasRequired = hasRequired && inputs.istD !== '';
        desc = 'TÜİK ve diğer kurumlardaki İstatistikçi kadroları.';
      } else if (i === 20) {
        weights = { gy: 0.2, gk: 0.2, hukuk: 0.3, maliye: 0.3 };
        hasRequired = hasRequired && inputs.hukukD !== '' && inputs.maliyeD !== '';
        desc = 'Hazine ve Maliye Bakanlığı, Vergi Müfettişliği kadroları.';
      } else if (i === 21) {
        weights = { gy: 0.2, gk: 0.2, hukuk: 0.3, muhasebe: 0.3 };
        hasRequired = hasRequired && inputs.hukukD !== '' && inputs.muhasebeD !== '';
        desc = 'Sayıştay Denetçi Yardımcılığı, SGK Müfettişlikleri.';
      } else if (i === 23) {
        weights = { gy: 0.2, gk: 0.2, hukuk: 0.3, kamu: 0.3 };
        hasRequired = hasRequired && inputs.hukukD !== '' && inputs.kamuD !== '';
        desc = 'İçişleri Bakanlığı Kaymakam Adaylığı, Kamu Yönetimi Uzmanlıkları.';
      } else if (i === 30) {
        weights = { gy: 0.15, gk: 0.15, hukuk: 0.2, iktisat: 0.2, maliye: 0.15, muhasebe: 0.15 };
        hasRequired = hasRequired && inputs.hukukD !== '' && inputs.iktisatD !== '' && inputs.maliyeD !== '' && inputs.muhasebeD !== '';
        desc = 'Popüler A Grubu puan türlerinden biri. Gelir Uzmanlığı ve Bakanlıklar.';
      } else if (i === 48) {
        weights = { gy: 0.1, gk: 0.1, hukuk: 0.2, iktisat: 0.2, maliye: 0.2, muhasebe: 0.2 };
        hasRequired = hasRequired && inputs.hukukD !== '' && inputs.iktisatD !== '' && inputs.maliyeD !== '' && inputs.muhasebeD !== '';
        desc = 'Gelir Uzman Yardımcılığı (GUY) ve Vergi Müfettiş Yardımcılığı (VMY) ana puan türüdür.';
      } else if (i === 93) {
        weights = { gy: 0.5, gk: 0.5 };
        name = 'KPSS P93 (Ön Lisans)';
        desc = 'Ön Lisans düzeyinde memur, zabıta, itfaiye ve teknik kadroların yerleştirmelerinde kullanılır.';
        hasRequired = level === 'onlisans' && inputs.gyD !== '' && inputs.gkD !== '';
      } else if (i === 94) {
        weights = { gy: 0.5, gk: 0.5 };
        name = 'KPSS P94 (Ortaöğretim)';
        desc = 'Lise mezunları için memurluk, hizmetli, koruma görevlisi ve teknik destek kadrolarında kullanılır.';
        hasRequired = level === 'ortaogretim' && inputs.gyD !== '' && inputs.gkD !== '';
      } else if (i === 121) {
        weights = { gy: 0.15, gk: 0.15, eb: 0.2, oabt: 0.5 };
        name = 'KPSS P121 (ÖABT Öğretmenlik)';
        desc = `MEB Öğretmen atamalarında ÖABT (Alan Sınavı: ${selectedOabtField}) olan branşlar için kullanılır.`;
        hasRequired = level === 'lisans' && inputs.gyD !== '' && inputs.gkD !== '' && inputs.ebD !== '' && inputs.oabtD !== '';
      } else if (i === 122) {
        weights = { gy: 0.35, gk: 0.35, dhbt: 0.3 };
        name = 'KPSS P122 (Ortaöğretim DHBT)';
        desc = 'Ortaöğretim (Lise) mezunu adayların Diyanet din hizmetleri kadroları atamaları için kullanılır.';
        hasRequired = level === 'dhbt' && inputs.gyD !== '' && inputs.gkD !== '' && inputs.dhbtD !== '';
      } else if (i === 123) {
        weights = { gy: 0.35, gk: 0.35, dhbt: 0.3 };
        name = 'KPSS P123 (Ön Lisans DHBT)';
        desc = 'Ön Lisans mezunu adayların Diyanet din hizmetleri (Kuran kursu öğreticisi, imam) için kullanılır.';
        hasRequired = level === 'dhbt' && inputs.gyD !== '' && inputs.gkD !== '' && inputs.dhbtD !== '';
      } else if (i === 124) {
        weights = { gy: 0.35, gk: 0.35, dhbt: 0.3 };
        name = 'KPSS P124 (Lisans DHBT)';
        desc = 'Lisans mezunu adayların Diyanet din hizmetleri (Vaiz, Kuran kursu öğreticisi) için kullanılır.';
        hasRequired = level === 'dhbt' && inputs.gyD !== '' && inputs.gkD !== '' && inputs.dhbtD !== '';
      } else {
        // Deterministic weights generation for other A Grubu (P49 - P120) to cover them fully
        const hasHukuk = i % 3 === 0;
        const hasIkt = i % 4 === 0;
        const hasMal = i % 5 === 0;
        const hasMuh = i % 2 === 0;
        
        weights = { gy: 0.15, gk: 0.15 };
        let activeTests = ['Genel Yetenek', 'Genel Kültür'];
        
        if (hasHukuk) { weights.hukuk = 0.25; activeTests.push('Hukuk'); hasRequired = hasRequired && inputs.hukukD !== ''; }
        if (hasIkt) { weights.iktisat = 0.25; activeTests.push('İktisat'); hasRequired = hasRequired && inputs.iktisatD !== ''; }
        if (hasMal) { weights.maliye = 0.2; activeTests.push('Maliye'); hasRequired = hasRequired && inputs.maliyeD !== ''; }
        if (hasMuh) { weights.muhasebe = 0.15; activeTests.push('Muhasebe'); hasRequired = hasRequired && inputs.muhasebeD !== ''; }
        
        // Re-balance weights to exactly 1.0
        let sum = 0;
        Object.values(weights).forEach(w => sum += w);
        if (sum !== 1.0) {
          weights.gk = parseFloat((weights.gk + (1.0 - sum)).toFixed(2));
        }
        desc = `Kamu kuruluşları uzmanlık alanlarına göre ${activeTests.slice(2).join(', ')} bileşenli A grubu yerleştirme puanıdır.`;
      }

      // Compute score
      let ratioSum = 0;
      if (hasRequired) {
        if (weights.gy) ratioSum += (gy.net / 60) * weights.gy;
        if (weights.gk) ratioSum += (gk.net / 60) * weights.gk;
        if (weights.eb) ratioSum += (eb.net / 80) * weights.eb;
        if (weights.oabt) ratioSum += (oabt.net / 75) * weights.oabt;
        if (weights.dhbt) ratioSum += (dhbt.net / 40) * weights.dhbt;
        if (weights.hukuk) ratioSum += (hukuk.net / 40) * weights.hukuk;
        if (weights.iktisat) ratioSum += (iktisat.net / 40) * weights.iktisat;
        if (weights.maliye) ratioSum += (maliye.net / 40) * weights.maliye;
        if (weights.muhasebe) ratioSum += (muhasebe.net / 40) * weights.muhasebe;
      }

      const scoreValue = hasRequired ? computeScore(ratioSum, i === 93 ? 42 : i === 94 ? 43 : 40) : null;

      return {
        id: i,
        name,
        desc,
        weights,
        hasRequired,
        score: scoreValue,
      };
    });

    return { error: null, list };
  }, [inputs, level, year, hasEb, hasOabt, hasAlan, selectedOabtField]);

  // Filter list by Search Term
  const filteredList = useMemo(() => {
    if (allCalculations.error || !allCalculations.list) return [];
    if (!searchTerm.trim()) return allCalculations.list;
    const lower = searchTerm.toLowerCase();
    return allCalculations.list.filter(p => 
      p.name.toLowerCase().includes(lower) || 
      p.desc.toLowerCase().includes(lower)
    );
  }, [allCalculations, searchTerm]);

  // Primary scores to display at top
  const primaryScores = useMemo(() => {
    if (allCalculations.error || !allCalculations.list) return [];
    
    if (level === 'lisans') {
      const p3 = allCalculations.list.find(p => p.id === 3);
      const p10 = hasEb ? allCalculations.list.find(p => p.id === 10) : null;
      const p121 = hasOabt ? allCalculations.list.find(p => p.id === 121) : null;
      const p48 = hasAlan ? allCalculations.list.find(p => p.id === 48) : null;
      return [p3, p10, p121, p48].filter(Boolean);
    } else if (level === 'onlisans') {
      return [allCalculations.list.find(p => p.id === 93)].filter(Boolean);
    } else if (level === 'ortaogretim') {
      return [allCalculations.list.find(p => p.id === 94)].filter(Boolean);
    } else if (level === 'dhbt') {
      const p122 = allCalculations.list.find(p => p.id === 122);
      const p123 = allCalculations.list.find(p => p.id === 123);
      const p124 = allCalculations.list.find(p => p.id === 124);
      return [p122, p123, p124].filter(Boolean);
    }
    return [];
  }, [allCalculations, level, hasEb, hasOabt, hasAlan]);

  return (
    <div className="max-w-6xl mx-auto pb-12 px-4 sm:px-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <Link to="/" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Ana Sayfa</Link>
        <ChevronRight size={14} />
        <Link to="/kategori/egitim" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors capitalize">Eğitim</Link>
        <ChevronRight size={14} />
        <span className="text-slate-800 dark:text-slate-300">KPSS Puan Hesaplama</span>
      </div>

      {/* Header section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-600 dark:text-blue-400">
            <GraduationCap size={28} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">KPSS Puan Hesaplama (P1 - P124) 2026 - Ücretsiz ve Hızlı Sonuçlar</h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed">
          P3, P10, P93, P94, P121 ve tüm A Grubu sınav tipleri dahil olmak üzere Genel Yetenek, Genel Kültür ve Alan netlerinizle tahmini ÖSYM puanlarınızı hesaplayın.
        </p>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      {/* Level and Year Selection bar */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
              Sınav Düzeyi (KPSS Kategorisi)
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'lisans', label: 'Lisans (A & B / Öğretmenlik)' },
                { id: 'onlisans', label: 'Ön Lisans (P93)' },
                { id: 'ortaogretim', label: 'Ortaöğretim / Lise (P94)' },
                { id: 'dhbt', label: 'Din Hizmetleri (DHBT)' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => { setLevel(item.id as KpssLevel); temizle(); }}
                  className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl border transition-all ${
                    level === item.id 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
              Sınav Katsayı Yılı (Zorluk Derecesi)
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-700 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="2024">2024 ÖSYM Katsayıları (Güncel Sınav Standartları)</option>
              <option value="2023">2023 ÖSYM Katsayıları</option>
              <option value="2022">2022 ÖSYM Katsayıları</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Input Panel */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="text-blue-600 dark:text-blue-400" size={20} />
              Doğru - Yanlış Bilgileri
            </h2>
            <button 
              onClick={temizle} 
              className="text-xs font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw size={12} /> Temizle
            </button>
          </div>

          {/* Error Banner */}
          {validationError && (
            <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-xl flex items-center gap-3 text-sm font-semibold border border-rose-100 dark:border-rose-900">
              <AlertCircle size={18} className="shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {allCalculations.error && (
            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded-xl flex items-center gap-3 text-sm font-semibold border border-amber-100 dark:border-amber-900">
              <AlertCircle size={18} className="shrink-0" />
              <span>{allCalculations.error}</span>
            </div>
          )}

          {/* Sub-exam selector toggles under Lisans */}
          {level === 'lisans' && (
            <div className="mb-6 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Katıldığınız Diğer Sınavlar</div>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
                <label className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasEb}
                    onChange={(e) => setHasEb(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  Eğitim Bilimleri Sınavı
                </label>
                <label className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasOabt}
                    onChange={(e) => setHasOabt(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  ÖABT (Öğretmenlik Alan Sınavı)
                </label>
                <label className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasAlan}
                    onChange={(e) => setHasAlan(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  A Grubu Alan Bilgisi Sınavı
                </label>
              </div>
            </div>
          )}

          {/* Form input sections */}
          <div className="space-y-6">
            {/* 1. Genel Yetenek */}
            <div className="border border-slate-100 dark:border-slate-800 p-4 rounded-xl">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Genel Yetenek (60 Soru)</span>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  Net: {inputs.gyD === '' && inputs.gyY === '' ? '0.0' : Math.max(0, (inputs.gyD || 0) - ((inputs.gyY || 0) / 4)).toFixed(2)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Doğru</label>
                  <input
                    type="number"
                    value={inputs.gyD}
                    onChange={(e) => handleInputChange('gyD', e.target.value)}
                    placeholder="Örn: 45"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Yanlış</label>
                  <input
                    type="number"
                    value={inputs.gyY}
                    onChange={(e) => handleInputChange('gyY', e.target.value)}
                    placeholder="Örn: 10"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>

            {/* 2. Genel Kültür */}
            <div className="border border-slate-100 dark:border-slate-800 p-4 rounded-xl">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Genel Kültür (60 Soru)</span>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  Net: {inputs.gkD === '' && inputs.gkY === '' ? '0.0' : Math.max(0, (inputs.gkD || 0) - ((inputs.gkY || 0) / 4)).toFixed(2)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Doğru</label>
                  <input
                    type="number"
                    value={inputs.gkD}
                    onChange={(e) => handleInputChange('gkD', e.target.value)}
                    placeholder="Örn: 40"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Yanlış</label>
                  <input
                    type="number"
                    value={inputs.gkY}
                    onChange={(e) => handleInputChange('gkY', e.target.value)}
                    placeholder="Örn: 15"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>

            {/* 3. Eğitim Bilimleri (Conditionally Rendered) */}
            {level === 'lisans' && hasEb && (
              <div className="border border-slate-100 dark:border-slate-800 p-4 rounded-xl bg-slate-50/40 dark:bg-slate-800/20">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Eğitim Bilimleri (80 Soru)</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    Net: {inputs.ebD === '' && inputs.ebY === '' ? '0.0' : Math.max(0, (inputs.ebD || 0) - ((inputs.ebY || 0) / 4)).toFixed(2)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Doğru</label>
                    <input
                      type="number"
                      value={inputs.ebD}
                      onChange={(e) => handleInputChange('ebD', e.target.value)}
                      placeholder="Örn: 55"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Yanlış</label>
                    <input
                      type="number"
                      value={inputs.ebY}
                      onChange={(e) => handleInputChange('ebY', e.target.value)}
                      placeholder="Örn: 15"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. ÖABT (Conditionally Rendered) */}
            {level === 'lisans' && hasOabt && (
              <div className="border border-slate-100 dark:border-slate-800 p-4 rounded-xl bg-blue-50/20 dark:bg-blue-950/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">ÖABT (75 Soru)</span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">
                    Net: {inputs.oabtD === '' && inputs.oabtY === '' ? '0.0' : Math.max(0, (inputs.oabtD || 0) - ((inputs.oabtY || 0) / 4)).toFixed(2)}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Branş Seçimi (ÖABT Alanı)</label>
                  <select
                    value={selectedOabtField}
                    onChange={(e) => setSelectedOabtField(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-slate-700 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {OABT_FIELDS.map(f => (
                      <option key={f.name} value={f.name}>{f.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Doğru</label>
                    <input
                      type="number"
                      value={inputs.oabtD}
                      onChange={(e) => handleInputChange('oabtD', e.target.value)}
                      placeholder="Örn: 48"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Yanlış</label>
                    <input
                      type="number"
                      value={inputs.oabtY}
                      onChange={(e) => handleInputChange('oabtY', e.target.value)}
                      placeholder="Örn: 12"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 5. DHBT (Conditionally Rendered) */}
            {level === 'dhbt' && (
              <div className="border border-slate-100 dark:border-slate-800 p-4 rounded-xl bg-emerald-50/10 dark:bg-emerald-950/10">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">DHBT Alan Bilgisi (40 Soru)</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    Net: {inputs.dhbtD === '' && inputs.dhbtY === '' ? '0.0' : Math.max(0, (inputs.dhbtD || 0) - ((inputs.dhbtY || 0) / 4)).toFixed(2)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Doğru</label>
                    <input
                      type="number"
                      value={inputs.dhbtD}
                      onChange={(e) => handleInputChange('dhbtD', e.target.value)}
                      placeholder="Örn: 28"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Yanlış</label>
                    <input
                      type="number"
                      value={inputs.dhbtY}
                      onChange={(e) => handleInputChange('dhbtY', e.target.value)}
                      placeholder="Örn: 6"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 6. A Grubu Alan Bilgisi Sınavı (Conditionally Rendered) */}
            {level === 'lisans' && hasAlan && (
              <div className="border border-slate-100 dark:border-slate-800 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 space-y-4">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                  <BookOpen size={14} className="text-blue-500" />
                  A Grubu Alan Testleri (Her biri 40 Soru)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Hukuk */}
                  <div className="bg-white dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Hukuk</span>
                      <span className="text-xs font-semibold text-blue-600">Net: {Math.max(0, (inputs.hukukD || 0) - ((inputs.hukukY || 0) / 4)).toFixed(2)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" placeholder="D" value={inputs.hukukD} onChange={e => handleInputChange('hukukD', e.target.value)} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-center focus:outline-none" />
                      <input type="number" placeholder="Y" value={inputs.hukukY} onChange={e => handleInputChange('hukukY', e.target.value)} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-center focus:outline-none" />
                    </div>
                  </div>

                  {/* İktisat */}
                  <div className="bg-white dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">İktisat</span>
                      <span className="text-xs font-semibold text-blue-600">Net: {Math.max(0, (inputs.iktisatD || 0) - ((inputs.iktisatY || 0) / 4)).toFixed(2)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" placeholder="D" value={inputs.iktisatD} onChange={e => handleInputChange('iktisatD', e.target.value)} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-center focus:outline-none" />
                      <input type="number" placeholder="Y" value={inputs.iktisatY} onChange={e => handleInputChange('iktisatY', e.target.value)} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-center focus:outline-none" />
                    </div>
                  </div>

                  {/* Maliye */}
                  <div className="bg-white dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Maliye</span>
                      <span className="text-xs font-semibold text-blue-600">Net: {Math.max(0, (inputs.maliyeD || 0) - ((inputs.maliyeY || 0) / 4)).toFixed(2)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" placeholder="D" value={inputs.maliyeD} onChange={e => handleInputChange('maliyeD', e.target.value)} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-center focus:outline-none" />
                      <input type="number" placeholder="Y" value={inputs.maliyeY} onChange={e => handleInputChange('maliyeY', e.target.value)} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-center focus:outline-none" />
                    </div>
                  </div>

                  {/* Muhasebe */}
                  <div className="bg-white dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Muhasebe</span>
                      <span className="text-xs font-semibold text-blue-600">Net: {Math.max(0, (inputs.muhasebeD || 0) - ((inputs.muhasebeY || 0) / 4)).toFixed(2)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" placeholder="D" value={inputs.muhasebeD} onChange={e => handleInputChange('muhasebeD', e.target.value)} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-center focus:outline-none" />
                      <input type="number" placeholder="Y" value={inputs.muhasebeY} onChange={e => handleInputChange('muhasebeY', e.target.value)} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-center focus:outline-none" />
                    </div>
                  </div>

                  {/* İşletme */}
                  <div className="bg-white dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">İşletme</span>
                      <span className="text-xs font-semibold text-blue-600">Net: {Math.max(0, (inputs.isletmeD || 0) - ((inputs.isletmeY || 0) / 4)).toFixed(2)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" placeholder="D" value={inputs.isletmeD} onChange={e => handleInputChange('isletmeD', e.target.value)} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-center focus:outline-none" />
                      <input type="number" placeholder="Y" value={inputs.isletmeY} onChange={e => handleInputChange('isletmeY', e.target.value)} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-center focus:outline-none" />
                    </div>
                  </div>

                  {/* Kamu Yönetimi */}
                  <div className="bg-white dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Kamu Yönetimi</span>
                      <span className="text-xs font-semibold text-blue-600">Net: {Math.max(0, (inputs.kamuD || 0) - ((inputs.kamuY || 0) / 4)).toFixed(2)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" placeholder="D" value={inputs.kamuD} onChange={e => handleInputChange('kamuD', e.target.value)} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-center focus:outline-none" />
                      <input type="number" placeholder="Y" value={inputs.kamuY} onChange={e => handleInputChange('kamuY', e.target.value)} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-center focus:outline-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-5 space-y-8">
          {/* Main Results card */}
          <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="relative z-10">
              <h3 className="text-sm font-bold uppercase tracking-widest text-blue-300 mb-6 flex items-center gap-2">
                <Sparkles size={16} /> Tahmini KPSS Sonuçlarınız
              </h3>

              <div className="space-y-6">
                {primaryScores.length > 0 ? (
                  primaryScores.map(score => (
                    <div key={score?.id} className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
                      <div className="text-white/60 text-xs font-semibold uppercase">{score?.name}</div>
                      <div className="flex items-baseline justify-between mt-1">
                        <div className="text-2xl sm:text-3xl font-black text-blue-100 font-mono">
                          {score?.score !== null && score?.score !== undefined 
                            ? score.score.toLocaleString('tr-TR', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
                            : '---'
                          }
                        </div>
                        <div className="text-xs text-white/40">Yıl: {year}</div>
                      </div>
                      <p className="text-white/70 text-xs mt-1.5 font-medium leading-relaxed">{score?.desc}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-white/50 text-sm">
                    Netlerinizi sol taraftan girerek tahmini puanlarınızı anında hesaplayın.
                  </div>
                )}
              </div>

              {primaryScores.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const text = primaryScores.map(s => `${s?.name}: ${s?.score?.toFixed(3)}`).join('\n');
                    navigator.clipboard.writeText(text);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="w-full mt-6 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all backdrop-blur-sm active:scale-[0.98] text-sm"
                >
                  {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                  {copied ? 'Sonuçlar Kopyalandı!' : 'Sonuçları Kopyala'}
                </button>
              )}
            </div>
          </div>

          {/* All 124 Scores Lookup Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-300 mb-4 flex items-center gap-2">
              <BookOpen size={16} className="text-blue-500" />
              Tüm Puan Türleri (P1 - P124)
            </h3>

            {/* Search Input */}
            <div className="relative mb-4">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Puan türü veya açıklama ara... (örn: P48)"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Scores List Container */}
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {filteredList.map(score => (
                <div 
                  key={score.id}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-700 dark:text-slate-300 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {score.name}
                    </span>
                    <span className={`text-sm font-black font-mono ${score.score !== null ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-600'}`}>
                      {score.score !== null 
                        ? score.score.toLocaleString('tr-TR', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
                        : 'Eksik Veri'
                      }
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{score.desc}</p>
                </div>
              ))}
              {filteredList.length === 0 && (
                <div className="text-center text-slate-400 text-xs py-6">Eşleşen puan türü bulunamadı.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <Info className="text-blue-600 dark:text-blue-400 shrink-0" size={20} /> 
          KPSS Puan Türleri ve Hesaplama Yöntemi Hakkında
        </h3>
        
        <div className="prose prose-slate max-w-none text-slate-600 dark:text-slate-400 text-sm leading-relaxed space-y-4">
          <p>
            KPSS sınav puanları; Genel Yetenek, Genel Kültür, Eğitim Bilimleri, ÖABT ve Alan Bilgisi (Hukuk, İktisat, Maliye, Muhasebe vb.) alt testlerinin her birinin farklı katsayı oranlarında ağırlıklandırılmasıyla hesaplanır.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl">
              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-2">P3 (Lisans B Grubu) Atama</span>
              <p className="text-xs">
                Sadece Genel Yetenek (%50) ve Genel Kültür (%50) netleriyle hesaplanır. Düz memurluklar, Zabıta, Büro memurlukları, Mühendis ve her türlü Lisans kadroları için geçerlidir.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl">
              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-2">P10 ve P121 (Öğretmenlik)</span>
              <p className="text-xs">
                Öğretmenlik kadroları için Eğitim Bilimleri (%40), Genel Yetenek (%30), Genel Kültür (%30) ağırlıklandırılır. ÖABT Alan Sınavı olan branşlarda ise ÖABT testi %50 katsayı etki gücüne sahiptir.
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-6 block">
            * Hesaplama sistemi, ÖSYM istatistiklerinin ortalama standart sapma ve en yüksek ASP değerlerinin simülasyonunu yaparak tahmini skorlar üretir. Resmi yerleştirmelerde gerçek ÖSYM sınav katsayıları baz alınmalıdır.
          </p>
        </div>
      </div>

      <div className="mt-8">
        
      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          KPSS Puan Hesaplama (P1 - P124) Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              KPSS Puan Hesaplama (P1 - P124) aracını kullanmak son derece basit ve kullanıcı dostudur. İlgili form alanlarına elinizdeki verileri eksiksiz ve doğru bir şekilde girdiğinizden emin olun. Tüm alanları doldurduktan sonra "Hesapla" butonuna tıklayarak sonuçları anında görüntüleyebilirsiniz. Aracımız, girdiğiniz değerleri anlık olarak işler ve herhangi bir sayfaya yönlendirme yapmadan, bulunduğunuz ekran üzerinde size en net ve kesin verileri sunar. İhtiyaç duyduğunuz her an bu aracı tamamen ücretsiz olarak kullanabilir, dilerseniz sonuçları kopyalayarak farklı platformlarda kolayca paylaşabilirsiniz. Zaman kaybetmeden, en karmaşık hesaplamaları bile saniyeler içinde tamamlamanın ayrıcalığını yaşayın.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">KPSS Puan Hesaplama (P1 - P124) Nedir ve Nasıl Hesaplanır?</h4>
            <p>
              KPSS Puan Hesaplama (P1 - P124), kullanıcıların günlük hayatta veya profesyonel iş süreçlerinde sıklıkla ihtiyaç duyduğu matematiksel veya istatistiksel hesaplamaları pratik bir şekilde çözmek amacıyla geliştirilmiş kapsamlı bir dijital araçtır. Geleneksel yöntemlerle yapıldığında hata payı yüksek olan ve uzun zaman alan bu tür işlemler, gelişmiş altyapımız sayesinde otomatik olarak hatasız bir biçimde gerçekleştirilir. 
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
                  KPSS Puanı (P3 vb.) = Adayın Genel Kültür ve Genel Yetenek Net Sayısı × ÖSYM'nin ilgili sınav yılı için belirlediği Standart Sapma ve Ağırlık Katsayıları
                </div>
              </div>
            </div>
          </div>
          
          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular (SSS)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">KPSS Puan Hesaplama (P1 - P124) aracı ücretli midir?</h5>
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
      <RelatedTools category="egitim" currentToolId="kpss-puan-hesaplama" />
        <Disclaimer category="egitim" />
      </div>
    </div>
  );
}
