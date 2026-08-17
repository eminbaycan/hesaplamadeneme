import React, { useState } from 'react';
import { ChevronRight, RefreshCw, Copy, Info, AlertCircle, TrendingUp, DollarSign, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToolIcon } from '../../components/icons/ToolIcon';
import { AdSlot } from '../../components/ads/AdSlot';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { RelatedTools } from '../../components/tools/RelatedTools';

export default function FaizHesaplama() {
  const [anapara, setAnapara] = useState<number | ''>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [faizOrani, setFaizOrani] = useState<number | ''>('');
  const [vade, setVade] = useState<number | ''>('');
  const [vadeTuru, setVadeTuru] = useState<'gun' | 'ay' | 'yil'>('ay');
  const [faizTuru, setFaizTuru] = useState<'basit' | 'bilesik'>('bilesik');
  const [stopaj, setStopaj] = useState<number>(7.5); // Default stopaj rate in TR for medium term

  const [result, setResult] = useState<{
    brutKazanc: number;
    netKazanc: number;
    stopajTutari: number;
    toplamOdeme: number;
    table: { period: number; principal: string; interest: string; total: string }[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hesapla = () => {
    if (anapara === '' || faizOrani === '' || vade === '') {
      setError("Lütfen anapara, faiz oranı ve vade alanlarını doldurun.");
      setResult(null);
      return;
    }

    if (Number(anapara) <= 0 || Number(faizOrani) <= 0 || Number(vade) <= 0) {
      setError("Girdiğiniz tüm değerler sıfırdan büyük olmalıdır.");
      setResult(null);
      return;
    }

    setError(null);

    const P = Number(anapara);
    const r = Number(faizOrani) / 100;
    const t = Number(vade);
    const stopajRate = stopaj / 100;

    let brutKazanc = 0;
    const table: { period: number; principal: string; interest: string; total: string }[] = [];

    if (faizTuru === 'basit') {
      // Simple Interest Formula: I = P * r * (t_days/365 or t_months/12 or t_years)
      let tFraction = 0;
      if (vadeTuru === 'gun') {
        tFraction = t / 365;
      } else if (vadeTuru === 'ay') {
        tFraction = t / 12;
      } else {
        tFraction = t;
      }

      brutKazanc = P * r * tFraction;

      // Amortization representation (Simple interest linear growth)
      const stepsCount = Math.min(t, 12);
      const stepFraction = tFraction / stepsCount;
      for (let i = 1; i <= stepsCount; i++) {
        const stepInterest = P * r * stepFraction * i;
        table.push({
          period: i,
          principal: P.toFixed(2),
          interest: stepInterest.toFixed(2),
          total: (P + stepInterest).toFixed(2)
        });
      }
    } else {
      // Compound Interest Formula: A = P * (1 + r/n)^(n*t)
      // Usually, in Turkey, bank deposits compound monthly or at the end of the selected period.
      // We will calculate compounding based on the period type selected.
      if (vadeTuru === 'gun') {
        // Daily compounding: A = P * (1 + r/365)^t
        const A = P * Math.pow(1 + r / 365, t);
        brutKazanc = A - P;

        // Generate sample steps
        const step = Math.ceil(t / 10);
        let currentP = P;
        for (let i = 1; i <= t; i++) {
          const nextP = currentP * (1 + r / 365);
          const dayInterest = nextP - currentP;
          currentP = nextP;
          if (i % step === 0 || i === t) {
            table.push({
              period: i,
              principal: P.toFixed(2),
              interest: (currentP - P).toFixed(2),
              total: currentP.toFixed(2)
            });
          }
        }
      } else if (vadeTuru === 'ay') {
        // Monthly compounding: A = P * (1 + r/12)^t
        let currentP = P;
        for (let i = 1; i <= t; i++) {
          const nextP = currentP * (1 + r / 12);
          currentP = nextP;
          if (i <= 12 || i === t || i % 12 === 0) {
            table.push({
              period: i,
              principal: P.toFixed(2),
              interest: (currentP - P).toFixed(2),
              total: currentP.toFixed(2)
            });
          }
        }
        brutKazanc = currentP - P;
      } else {
        // Yearly compounding: A = P * (1 + r)^t
        let currentP = P;
        for (let i = 1; i <= t; i++) {
          const nextP = currentP * (1 + r);
          currentP = nextP;
          if (i <= 10 || i === t) {
            table.push({
              period: i,
              principal: P.toFixed(2),
              interest: (currentP - P).toFixed(2),
              total: currentP.toFixed(2)
            });
          }
        }
        brutKazanc = currentP - P;
      }
    }

    const stopajTutari = brutKazanc * stopajRate;
    const netKazanc = brutKazanc - stopajTutari;
    const toplamOdeme = P + netKazanc;

    setResult({
      brutKazanc,
      netKazanc,
      stopajTutari,
      toplamOdeme,
      table
    });
  };

  const temizle = () => {
    setAnapara('');
    setFaizOrani('');
    setVade('');
    setVadeTuru('ay');
    setFaizTuru('bilesik');
    setStopaj(7.5);
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
        <span className="text-slate-800 dark:text-slate-300">Faiz Hesaplama</span>
      </div>

      {/* 2. BAŞLIK VE AÇIKLAMA */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Faiz Hesaplama 2026 - Ücretsiz ve Hızlı Sonuçlar</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Anaparanızın getireceği basit faiz veya bileşik faiz kazancını stopaj vergisi kesintileriyle birlikte gün, ay veya yıl bazında hesaplayın.
        </p>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      {/* HESAPLAMA ARACI KAPSAYICISI */}
      <div className="calculator-container mb-8 relative border-4 border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-8 mt-8">
        <div className="absolute -top-4 left-4 sm:left-8 bg-[#eef2f7] dark:bg-slate-950 px-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ToolIcon name="faiz" size={20} className="text-[#0056b3] dark:text-blue-400" />
            Mevduat ve Faiz Getirisi Bulma
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
                Yatırım Bilgileri
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
              {/* Anapara */}
              <div>
                <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  Anapara (TL) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={anapara}
                    onChange={(e) => {
                      setAnapara(e.target.value === '' ? '' : Number(e.target.value));
                      setError(null);
                    }}
                    placeholder="Örn: 10000" 
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all"
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₺</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Yıllık Faiz Oranı */}
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                    Faiz Oranı (%) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="number" 
                    value={faizOrani}
                    onChange={(e) => {
                      setFaizOrani(e.target.value === '' ? '' : Number(e.target.value));
                      setError(null);
                    }}
                    placeholder="Yıllık Örn: 45" 
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
                  />
                </div>

                {/* Vade Değeri */}
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                    Vade <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="number" 
                    value={vade}
                    onChange={(e) => {
                      setVade(e.target.value === '' ? '' : Number(e.target.value));
                      setError(null);
                    }}
                    placeholder="Süre girin" 
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Vade Türü Toggles */}
              <div>
                <label className="block text-[12px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Vade Birimi</label>
                <div className="grid grid-cols-3 gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  {(['gun', 'ay', 'yil'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setVadeTuru(type)}
                      className={`py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${
                        vadeTuru === type
                          ? 'bg-white dark:bg-slate-700 text-[#0056b3] dark:text-blue-400 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-800'
                      }`}
                    >
                      {type === 'gun' ? 'Gün' : type === 'ay' ? 'Ay' : 'Yıl'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Faiz Türü Toggles */}
              <div>
                <label className="block text-[12px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Faiz Türü</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  {(['basit', 'bilesik'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFaizTuru(type)}
                      className={`py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${
                        faizTuru === type
                          ? 'bg-white dark:bg-slate-700 text-[#0056b3] dark:text-blue-400 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-800'
                      }`}
                    >
                      {type === 'basit' ? 'Basit Faiz' : 'Bileşik Faiz'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stopaj Kesintisi Oranı */}
              <div>
                <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  Stopaj Kesintisi Oranı (%)
                </label>
                <select
                  value={stopaj}
                  onChange={(e) => setStopaj(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-700 dark:text-white font-medium"
                >
                  <option value={0}>%0 (Vergisiz / Muaf)</option>
                  <option value={5}>%5 (6 Aydan Uzun Vade)</option>
                  <option value={7.5}>%7.5 (Standart / 6 Aya Kadar)</option>
                  <option value={10}>%10 (Özel Hesaplar / Kısa Vade)</option>
                  <option value={15}>%15 (Yüksek Gelir Katılım Oranı)</option>
                </select>
              </div>

              <button onClick={hesapla} className="w-full bg-[#0056b3] hover:bg-[#004494] text-white font-bold rounded-xl py-3.5 mt-2 transition-all shadow-sm active:scale-[0.98]">
                Getiri Hesapla
              </button>
            </div>
          </div>

          {/* SAĞ: Sonuç (Result) Paneli */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 flex-1 relative overflow-hidden shadow-lg border border-black/5 dark:border-slate-800">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 dark:bg-emerald-500/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6 border-b border-black/5 dark:border-white/5 pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-white">Kazanç Tablosu</h3>
                </div>

                {result ? (
                  <div className="flex-1 flex flex-col gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100/50 dark:border-emerald-900/20 p-4 rounded-xl">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">NET FAİZ GETİRİSİ</span>
                        <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                          ₺{result.netKazanc.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">TOPLAM VADE TUTARI</span>
                        <div className="text-2xl font-black text-slate-950 dark:text-white mt-1">
                          ₺{result.toplamOdeme.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-2 text-xs bg-slate-50 dark:bg-slate-800/30 p-3.5 rounded-xl border border-black/5 dark:border-white/5">
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400 font-semibold">Brüt Faiz Getirisi:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">₺{result.brutKazanc.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400 font-semibold">Stopaj Vergisi Kesintisi (%{stopaj}):</span>
                        <span className="font-bold text-rose-500">-₺{result.stopajTutari.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-black/5 dark:border-white/5 font-bold">
                        <span className="text-slate-800 dark:text-white">Net Faiz Getirisi:</span>
                        <span className="text-emerald-600 dark:text-emerald-400">₺{result.netKazanc.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}</span>
                      </div>
                    </div>

                    {/* Growth Table */}
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Vade Birikim Süreci</h4>
                      <div className="max-h-36 overflow-y-auto pr-1 border border-black/5 dark:border-white/5 rounded-lg">
                        <table className="w-full text-[11px] text-left">
                          <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-b border-black/5 dark:border-white/5">
                              <th className="py-1.5 px-3">Süre ({vadeTuru === 'gun' ? 'Gün' : vadeTuru === 'ay' ? 'Ay' : 'Yıl'})</th>
                              <th className="py-1.5 px-3 text-right">Kümülatif Getiri</th>
                              <th className="py-1.5 px-3 text-right">Toplam Değer</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-black/5 dark:divide-white/5 font-mono">
                            {result.table.map((row) => (
                              <tr key={row.period}>
                                <td className="py-1.5 px-3 text-slate-600 dark:text-slate-300">
                                  {row.period}. {vadeTuru === 'gun' ? 'Gün' : vadeTuru === 'ay' ? 'Ay' : 'Yıl'}
                                </td>
                                <td className="py-1.5 px-3 text-right text-emerald-600 dark:text-emerald-400 font-bold">
                                  ₺{Number(row.interest).toLocaleString('tr-TR', { maximumFractionDigits: 2 })}
                                </td>
                                <td className="py-1.5 px-3 text-right text-slate-800 dark:text-slate-200">
                                  ₺{Number(row.total).toLocaleString('tr-TR', { maximumFractionDigits: 2 })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col justify-center items-center py-12 text-slate-400 dark:text-slate-500">
                    <TrendingUp className="w-12 h-12 mb-3 opacity-50 text-slate-400 dark:text-slate-600" />
                    <p className="text-sm font-semibold">Parametreleri girip "Getiri Hesapla" butonuna basın</p>
                    <p className="text-[11px] mt-1 text-center">Basit veya kümülatif faiz kazancınız net stopaj kesintileriyle birlikte burada modellenecektir.</p>
                  </div>
                )}

                {result && (
                  <button
                    type="button"
                    onClick={() => {
                      if (result) {
                        navigator.clipboard.writeText(`Anapara: ₺${anapara}\nNet Kazanç: ₺${result.netKazanc.toFixed(2)}\nToplam Ödeme: ₺${result.toplamOdeme.toFixed(2)}`);
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
          Faiz Hesaplama Nedir? Nasıl Hesaplanır?
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          
          {/* NASIL KULLANILIR */}
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              Faiz hesaplama aracımız ile mevduat getirilerini, yatırımlarınızın kümülatif büyümelerini saniyeler içinde hesaplayabilirsiniz:
            </p>
            <ul className="list-decimal pl-5 space-y-2">
              <li>Mevduata yatırmak istediğiniz toplam tutarı <strong>"Anapara (TL)"</strong> alanına giriniz.</li>
              <li>Bankanın veya kurumun uygulayacağı <strong>"Yıllık Faiz Oranı (%)"</strong> miktarını belirtiniz.</li>
              <li>Yatırımınızın kalacağı süreyi girin ve yanındaki birimden <strong>Gün, Ay</strong> ya da <strong>Yıl</strong> olarak vadesini seçiniz.</li>
              <li><strong>Basit Faiz</strong> (anaparanın getirdiği sabit kazanç) veya <strong>Bileşik Faiz</strong> (kazancın da faiz getirdiği kümülatif model) seçeneğini tercih ediniz.</li>
              <li>Mevduat vadesine ve türüne göre uygulanan <strong>Stopaj Vergisi Oranını</strong> seçerek "Getiri Hesapla" butonuna basınız.</li>
            </ul>
          </section>

          {/* NEDİR VE NASIL HESAPLANIR */}
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Faiz Türleri ve Hesaplama Formülleri</h4>
            <p>
              Faiz hesaplaması temel olarak basit ve bileşik faiz olmak üzere iki yöntemle gerçekleştirilir. Ayrıca, Türkiye'deki banka vadeli hesaplarında elde edilen kazanç üzerinden yasal olarak stopaj kesintisi uygulanır.
            </p>
            <p>
              <strong>Basit Faiz:</strong> Yalnızca başlangıçta yatırılan anapara üzerinden faiz hesaplandığı yöntemdir. Faiz kazancı vade süresi boyunca her ay veya yıl aynı kalır.
            </p>
            <p>
              <strong>Bileşik Faiz:</strong> Her vade sonunda kazanılan faizin de anaparaya eklenerek bir sonraki dönemde yeniden faiz getirdiği kümülatif faiz yöntemidir. Halk dilinde "faizin faizi" olarak bilinir ve uzun vadeli yatırımlarda geometrik bir büyüme sağlar.
            </p>
          </section>

          {/* KULLANILAN FORMÜLLER */}
          <div className="pt-2">
            <div className="space-y-6 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Basit Faiz Formülü (Yıllık):</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  Faiz Kazancı = Anapara × (Faiz Oranı / 100) × Vade (Yıl)
                </div>
              </div>
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Bileşik Faiz Formülü:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  Toplam Tutar = Anapara × (1 + Yıllık Faiz Oranı / Dönem Sayısı)^(Dönem Sayısı × Vade)
                </div>
              </div>
            </div>
          </div>
          
          {/* SSS */}
          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular (FAQ)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Stopaj vergisi nedir ve net faiz getirimi nasıl etkiler?</h5>
                <p>Stopaj vergisi, faiz geliriniz üzerinden devlet tarafından kaynağında kesilen gelir vergisidir. Bankalar vadeli mevduat kazancınızdan bu tutarı otomatik keser ve hesabınıza net getiriyi yatırır. Vadeli hesaplarda vade uzadıkça uygulanan stopaj oranı azalır ve net kazancınız artar.</p>
              </div>
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Kümülatif faiz her gün mü hesaplanır yoksa aylık mı?</h5>
                <p>Türkiye'deki mevduat hesapları genellikle vade sonunda kümülatif eklenir (örn. 32 günlük veya 92 günlük periyotlar). Günlük faiz işleten esnek (marifetli/turuncu vb.) hesaplarda ise biriken faiz günlük olarak anaparaya eklenip ertesi gün yeni faiz getirmeye başlar.</p>
              </div>
            </div>
          </section>
          
        </div>
      </div>

      {/* 5. DİĞER ARAÇLAR */}
      <RelatedTools category="matematik" currentToolId="faiz-hesaplama" />

      {/* 6. SORUMLULUK REDDİ */}
      <Disclaimer category="matematik" />
    </div>
  );
}
