import React, { useState, useEffect } from 'react';
import { RefreshCw, DollarSign, Euro, Percent, Landmark, Clock, Database, Edit2, Check, ExternalLink, ShieldCheck, FileText, UserCheck, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { taxRates } from '../data/marketData';

interface ExchangeData {
  usd: number | null;
  eur: number | null;
  lastUpdate: string | null;
  source: string;
  loading: boolean;
  error: string | null;
}

export function GuncelVeriler() {
  const [exchange, setExchange] = useState<ExchangeData>({
    usd: null,
    eur: null,
    lastUpdate: null,
    source: 'ExchangeRate-API',
    loading: true,
    error: null
  });

  // Yasal parametreler için state (Kullanıcı tarafından güncellenebilir simülasyonu)
  const [kdvRate, setKdvRate] = useState<string>("20");
  const [isEditingKdv, setIsEditingKdv] = useState(false);
  
  const [minWage, setMinWage] = useState<string>("22104");
  const [isEditingWage, setIsEditingWage] = useState(false);

  const [altinFiyat, setAltinFiyat] = useState<string>(() => localStorage.getItem('altinFiyat') || '3000');
  const [gumusFiyat, setGumusFiyat] = useState<string>(() => localStorage.getItem('gumusFiyat') || '35');
  const [isEditingMetal, setIsEditingMetal] = useState(false);
  const [metalLoading, setMetalLoading] = useState(false);
  const [metalError, setMetalError] = useState<string | null>(null);
  const [metalSuccess, setMetalSuccess] = useState<string | null>(null);

  const [taxState, setTaxState] = useState(() => {
    const saved = localStorage.getItem('customTaxRates');
    if (saved) {
      try { return JSON.parse(saved); } catch(e){}
    }
    return {
      sgkCalisan: taxRates.sgkCalisan * 100,
      sgkIsveren: taxRates.sgkIsveren * 100,
      issizlikCalisan: taxRates.issizlikCalisan * 100,
      issizlikIsveren: taxRates.issizlikIsveren * 100,
      gelirVergisi: taxRates.gelirVergisi * 100,
      damgaVergisi: taxRates.damgaVergisi * 100,
      kidemTavani: taxRates.kidemTavani
    };
  });
  const [isEditingTax, setIsEditingTax] = useState(false);

  const fetchLiveMetals = async () => {
    setMetalLoading(true);
    setMetalError(null);
    setMetalSuccess(null);
    try {
      const erRes = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!erRes.ok) throw new Error('Döviz kuru alınamadı.');
      const erData = await erRes.json();
      const usdTry = erData?.rates?.TRY;
      if (!usdTry) throw new Error('USD kuru bulunamadı.');

      const xauRes = await fetch('https://api.gold-api.com/price/XAU');
      if (!xauRes.ok) throw new Error('Altın fiyatı alınamadı.');
      const xauData = await xauRes.json();
      const xauUsd = xauData?.price;
      if (!xauUsd) throw new Error('Altın ons fiyatı bulunamadı.');

      const xagRes = await fetch('https://api.gold-api.com/price/XAG');
      if (!xagRes.ok) throw new Error('Gümüş fiyatı alınamadı.');
      const xagData = await xagRes.json();
      const xagUsd = xagData?.price;
      if (!xagUsd) throw new Error('Gümüş ons fiyatı bulunamadı.');

      const altinGram = Math.round((xauUsd / 31.1034768) * usdTry).toString();
      const gumusGram = Math.round((xagUsd / 31.1034768) * usdTry).toString();

      setAltinFiyat(altinGram);
      setGumusFiyat(gumusGram);
      localStorage.setItem('altinFiyat', altinGram);
      localStorage.setItem('gumusFiyat', gumusGram);

      setMetalSuccess('Canlı piyasa verileri başarıyla güncellendi!');
      setTimeout(() => setMetalSuccess(null), 4000);
    } catch (err: any) {
      console.error(err);
      setMetalError(err?.message || 'Canlı veriler alınamadı.');
      setTimeout(() => setMetalError(null), 4000);
    } finally {
      setMetalLoading(false);
    }
  };

  const fetchExchangeRates = async () => {
    setExchange(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Ücretsiz ve key gerektirmeyen açık kaynak API
      const response = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!response.ok) throw new Error('API yanıt vermedi');
      const data = await response.json();
      
      const usdToTry = data.rates.TRY;
      const usdToEur = data.rates.EUR;
      const eurToTry = usdToTry / usdToEur; // EUR/TRY çapraz kuru
      
      const updateDate = new Date(data.time_last_update_utc).toLocaleString('tr-TR', {
        day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      setExchange({
        usd: usdToTry,
        eur: eurToTry,
        lastUpdate: updateDate,
        source: 'open.er-api.com (Merkez Bankaları Ortalaması)',
        loading: false,
        error: null
      });
    } catch (err) {
      setExchange(prev => ({
        ...prev,
        usd: 33.51, // Hata durumunda varsayılan değer
        eur: 36.85,
        lastUpdate: new Date().toLocaleString('tr-TR'),
        source: 'Sistem Varsayılanı (Bağlantı Hatası)',
        loading: false,
        error: 'Canlı veri çekilemedi, varsayılan değerler gösteriliyor.'
      }));
    }
  };

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">Güncel Oranlar ve Parametreler</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-3xl">
          Sistemdeki araçların (KDV, Maaş, Döviz vb.) hesaplamalarında kullandığı temel parametreleri tek bir ekrandan kontrol edebilirsiniz. Canlı piyasa verileri anlık olarak API'lerden çekilmekte, yasal oranlar ise düzenlenebilir yapıdadır.
        </p>
      </div>

      <div className="space-y-8">
        {/* CANLI PİYASA VERİLERİ (API) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Database className="text-[#0056b3] dark:text-blue-400" size={20} /> Canlı Piyasa Verileri
            </h2>
            <button 
              onClick={fetchExchangeRates}
              disabled={exchange.loading}
              className="text-sm font-semibold text-[#0056b3] dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} className={cn(exchange.loading && "animate-spin")} /> Yenile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* DOLAR KARTI */}
            <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-2xl p-5 md:p-6 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 dark:bg-green-500/10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                    <DollarSign size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200">Dolar Kuru</h3>
                    <p className="text-xs text-slate-500 font-medium">USD / TRY</p>
                  </div>
                </div>
              </div>

              <div className="mb-4 relative z-10">
                {exchange.loading ? (
                  <div className="h-10 w-32 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
                ) : (
                  <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {exchange.usd?.toFixed(2).replace('.', ',')} <span className="text-lg text-slate-400 font-bold">₺</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-2 relative z-10">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <ExternalLink size={12} />
                  <span className="font-semibold">Kaynak:</span> {exchange.source}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Clock size={12} />
                  <span className="font-semibold">Son Güncelleme:</span> {exchange.lastUpdate}
                </div>
                {exchange.error && <div className="text-[10px] text-red-500 font-medium mt-1">{exchange.error}</div>}
              </div>
            </div>

            {/* EURO KARTI */}
            <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-2xl p-5 md:p-6 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 dark:bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Euro size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200">Euro Kuru</h3>
                    <p className="text-xs text-slate-500 font-medium">EUR / TRY</p>
                  </div>
                </div>
              </div>

              <div className="mb-4 relative z-10">
                {exchange.loading ? (
                  <div className="h-10 w-32 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
                ) : (
                  <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {exchange.eur?.toFixed(2).replace('.', ',')} <span className="text-lg text-slate-400 font-bold">₺</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-2 relative z-10">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <ExternalLink size={12} />
                  <span className="font-semibold">Kaynak:</span> {exchange.source}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Clock size={12} />
                  <span className="font-semibold">Son Güncelleme:</span> {exchange.lastUpdate}
                </div>
              </div>
            </div>
          </div>
        </section>

          {/* SOSYAL GÜVENLİK VE VERGİ ORANLARI */}
          <section>
            <div className="flex items-center justify-between mb-4 mt-8">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <ShieldCheck className="text-indigo-600 dark:text-indigo-400" size={20} /> Sosyal Güvenlik ve Vergi Oranları (Düzenlenebilir)
              </h2>
              <button
                onClick={() => {
                  if (isEditingTax) {
                    const savedObj = {
                      sgkCalisan: Number(taxState.sgkCalisan),
                      sgkIsveren: Number(taxState.sgkIsveren),
                      issizlikCalisan: Number(taxState.issizlikCalisan),
                      issizlikIsveren: Number(taxState.issizlikIsveren),
                      gelirVergisi: Number(taxState.gelirVergisi),
                      damgaVergisi: Number(taxState.damgaVergisi),
                      kidemTavani: Number(taxState.kidemTavani)
                    };
                    const toStore = {
                      sgkCalisan: savedObj.sgkCalisan / 100,
                      sgkIsveren: savedObj.sgkIsveren / 100,
                      issizlikCalisan: savedObj.issizlikCalisan / 100,
                      issizlikIsveren: savedObj.issizlikIsveren / 100,
                      gelirVergisi: savedObj.gelirVergisi / 100,
                      damgaVergisi: savedObj.damgaVergisi / 100,
                      kidemTavani: savedObj.kidemTavani
                    };
                    localStorage.setItem('customTaxRates', JSON.stringify(toStore));
                  }
                  setIsEditingTax(!isEditingTax);
                }}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer",
                  isEditingTax ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:text-indigo-300"
                )}
              >
                {isEditingTax ? <><Check size={14} /> Kaydet</> : <><Edit2 size={14} /> Düzenle</>}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* SGK Çalışan */}
              <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2 text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <UserCheck size={16}/>
                    <span className="text-sm font-semibold">SGK Primi (Çalışan)</span>
                  </div>
                </div>
                {isEditingTax ? (
                  <div className="flex items-center gap-1">
                    <input 
                      type="number"
                      step="0.01"
                      value={taxState.sgkCalisan}
                      onChange={(e) => setTaxState({...taxState, sgkCalisan: e.target.value})}
                      className="text-xl font-black bg-slate-50 dark:bg-slate-800 border border-indigo-500 rounded px-2 py-1 w-full text-slate-900 dark:text-white"
                    />
                    <span className="font-bold">%</span>
                  </div>
                ) : (
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{Number(taxState.sgkCalisan).toFixed(2)}%</div>
                )}
              </div>

              {/* SGK İşveren */}
              <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2 text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <UserCheck size={16}/>
                    <span className="text-sm font-semibold">SGK Primi (İşveren)</span>
                  </div>
                </div>
                {isEditingTax ? (
                  <div className="flex items-center gap-1">
                    <input 
                      type="number"
                      step="0.01"
                      value={taxState.sgkIsveren}
                      onChange={(e) => setTaxState({...taxState, sgkIsveren: e.target.value})}
                      className="text-xl font-black bg-slate-50 dark:bg-slate-800 border border-indigo-500 rounded px-2 py-1 w-full text-slate-900 dark:text-white"
                    />
                    <span className="font-bold">%</span>
                  </div>
                ) : (
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{Number(taxState.sgkIsveren).toFixed(2)}%</div>
                )}
              </div>

              {/* İşsizlik Çalışan */}
              <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2 text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16}/>
                    <span className="text-sm font-semibold">İşsizlik (Çalışan)</span>
                  </div>
                </div>
                {isEditingTax ? (
                  <div className="flex items-center gap-1">
                    <input 
                      type="number"
                      step="0.01"
                      value={taxState.issizlikCalisan}
                      onChange={(e) => setTaxState({...taxState, issizlikCalisan: e.target.value})}
                      className="text-xl font-black bg-slate-50 dark:bg-slate-800 border border-indigo-500 rounded px-2 py-1 w-full text-slate-900 dark:text-white"
                    />
                    <span className="font-bold">%</span>
                  </div>
                ) : (
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{Number(taxState.issizlikCalisan).toFixed(2)}%</div>
                )}
              </div>

              {/* İşsizlik İşveren */}
              <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2 text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16}/>
                    <span className="text-sm font-semibold">İşsizlik (İşveren)</span>
                  </div>
                </div>
                {isEditingTax ? (
                  <div className="flex items-center gap-1">
                    <input 
                      type="number"
                      step="0.01"
                      value={taxState.issizlikIsveren}
                      onChange={(e) => setTaxState({...taxState, issizlikIsveren: e.target.value})}
                      className="text-xl font-black bg-slate-50 dark:bg-slate-800 border border-indigo-500 rounded px-2 py-1 w-full text-slate-900 dark:text-white"
                    />
                    <span className="font-bold">%</span>
                  </div>
                ) : (
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{Number(taxState.issizlikIsveren).toFixed(2)}%</div>
                )}
              </div>

              {/* Gelir Vergisi */}
              <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2 text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <FileText size={16}/>
                    <span className="text-sm font-semibold">Gelir Vergisi (1. Dilim)</span>
                  </div>
                </div>
                {isEditingTax ? (
                  <div className="flex items-center gap-1">
                    <input 
                      type="number"
                      step="0.01"
                      value={taxState.gelirVergisi}
                      onChange={(e) => setTaxState({...taxState, gelirVergisi: e.target.value})}
                      className="text-xl font-black bg-slate-50 dark:bg-slate-800 border border-indigo-500 rounded px-2 py-1 w-full text-slate-900 dark:text-white"
                    />
                    <span className="font-bold">%</span>
                  </div>
                ) : (
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{Number(taxState.gelirVergisi).toFixed(2)}%</div>
                )}
              </div>

              {/* Damga Vergisi */}
              <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2 text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Percent size={16}/>
                    <span className="text-sm font-semibold">Damga Vergisi</span>
                  </div>
                </div>
                {isEditingTax ? (
                  <div className="flex items-center gap-1">
                    <input 
                      type="number"
                      step="0.0001"
                      value={taxState.damgaVergisi}
                      onChange={(e) => setTaxState({...taxState, damgaVergisi: e.target.value})}
                      className="text-xl font-black bg-slate-50 dark:bg-slate-800 border border-indigo-500 rounded px-2 py-1 w-full text-slate-900 dark:text-white"
                    />
                    <span className="font-bold">%</span>
                  </div>
                ) : (
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{Number(taxState.damgaVergisi).toFixed(4)}%</div>
                )}
              </div>

              {/* Kıdem Tazminatı Tavanı */}
              <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-2xl p-4 shadow-sm sm:col-span-2">
                <div className="flex items-center justify-between mb-2 text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Landmark size={16}/>
                    <span className="text-sm font-semibold">Kıdem Tazminatı Tavanı</span>
                  </div>
                </div>
                {isEditingTax ? (
                  <div className="flex items-center gap-1.5">
                    <input 
                      type="number"
                      value={taxState.kidemTavani}
                      onChange={(e) => setTaxState({...taxState, kidemTavani: e.target.value})}
                      className="text-xl font-black bg-slate-50 dark:bg-slate-800 border border-indigo-500 rounded px-2 py-1 w-full text-slate-900 dark:text-white"
                    />
                    <span className="font-bold text-slate-500">₺</span>
                  </div>
                ) : (
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{Number(taxState.kidemTavani).toLocaleString('tr-TR')} ₺</div>
                )}
              </div>
            </div>
          </section>

          {/* YASAL PARAMETRELER (DÜZENLENEBİLİR) */}
          <section>
            <div className="flex items-center justify-between mb-4 mt-8">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Landmark className="text-purple-600 dark:text-purple-400" size={20} /> Yasal Parametreler (Düzenlenebilir)
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* KDV ORANI */}
            <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-2xl p-5 md:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Percent size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200">Genel KDV Oranı</h3>
                    <p className="text-xs text-slate-500 font-medium">Fatura ve Matrah</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsEditingKdv(!isEditingKdv)}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    isEditingKdv ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                  )}
                >
                  {isEditingKdv ? <Check size={16} /> : <Edit2 size={16} />}
                </button>
              </div>

              <div className="mb-4">
                {isEditingKdv ? (
                  <div className="flex items-center gap-2">
                    <input 
                      type="number"
                      value={kdvRate}
                      onChange={(e) => setKdvRate(e.target.value)}
                      className="text-2xl font-black bg-slate-50 dark:bg-slate-800 border-2 border-purple-500 rounded-xl px-3 py-1 w-24 text-slate-900 dark:text-white focus:outline-none"
                    />
                    <span className="text-xl font-bold text-slate-400">%</span>
                  </div>
                ) : (
                  <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    %{kdvRate}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <ExternalLink size={12} />
                  <span className="font-semibold">Kaynak:</span> Resmi Gazete (GİB)
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Clock size={12} />
                  <span className="font-semibold">Son Değişiklik:</span> 10 Temmuz 2023
                </div>
              </div>
            </div>

            {/* ASGARİ ÜCRET */}
            <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-2xl p-5 md:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                    <Landmark size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200">Net Asgari Ücret</h3>
                    <p className="text-xs text-slate-500 font-medium">Maaş Hesaplamaları İçin</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsEditingWage(!isEditingWage)}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    isEditingWage ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                  )}
                >
                  {isEditingWage ? <Check size={16} /> : <Edit2 size={16} />}
                </button>
              </div>

              <div className="mb-4">
                {isEditingWage ? (
                  <div className="flex items-center gap-2">
                    <input 
                      type="number"
                      value={minWage}
                      onChange={(e) => setMinWage(e.target.value)}
                      className="text-2xl font-black bg-slate-50 dark:bg-slate-800 border-2 border-orange-500 rounded-xl px-3 py-1 w-40 text-slate-900 dark:text-white focus:outline-none"
                    />
                    <span className="text-xl font-bold text-slate-400">₺</span>
                  </div>
                ) : (
                  <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {Number(minWage).toLocaleString('tr-TR')} <span className="text-lg text-slate-400 font-bold">₺</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <ExternalLink size={12} />
                  <span className="font-semibold">Kaynak:</span> Çalışma ve Sosyal Güvenlik Bak.
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Clock size={12} />
                  <span className="font-semibold">Son Karar:</span> 1 Ocak 2024
                </div>
              </div>
            </div>

            {/* ALTIN VE GÜMÜŞ FİYATI */}
            <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-2xl p-5 md:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Coins size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200">Değerli Metaller</h3>
                    <p className="text-xs text-slate-500 font-medium">Zekat Hesaplamaları İçin</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (isEditingMetal) {
                      localStorage.setItem('altinFiyat', altinFiyat);
                      localStorage.setItem('gumusFiyat', gumusFiyat);
                    }
                    setIsEditingMetal(!isEditingMetal);
                  }}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    isEditingMetal ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                  )}
                >
                  {isEditingMetal ? <Check size={16} /> : <Edit2 size={16} />}
                </button>
              </div>

              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Gram Altın:</span>
                  {isEditingMetal ? (
                    <div className="flex items-center gap-1.5">
                      <input 
                        type="number"
                        value={altinFiyat}
                        onChange={(e) => setAltinFiyat(e.target.value)}
                        className="text-lg font-black bg-slate-50 dark:bg-slate-800 border border-amber-500 rounded px-2 py-0.5 w-24 text-slate-900 dark:text-white focus:outline-none"
                      />
                      <span className="text-xs font-bold text-slate-400">₺</span>
                    </div>
                  ) : (
                    <div className="text-lg font-bold text-slate-900 dark:text-white">
                      {Number(altinFiyat).toLocaleString('tr-TR')} ₺
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Gram Gümüş:</span>
                  {isEditingMetal ? (
                    <div className="flex items-center gap-1.5">
                      <input 
                        type="number"
                        value={gumusFiyat}
                        onChange={(e) => setGumusFiyat(e.target.value)}
                        className="text-lg font-black bg-slate-50 dark:bg-slate-800 border border-amber-500 rounded px-2 py-0.5 w-24 text-slate-900 dark:text-white focus:outline-none"
                      />
                      <span className="text-xs font-bold text-slate-400">₺</span>
                    </div>
                  ) : (
                    <div className="text-lg font-bold text-slate-900 dark:text-white">
                      {Number(gumusFiyat).toLocaleString('tr-TR')} ₺
                    </div>
                  )}
                </div>
              </div>

              {/* Canlı API Butonu ve Durumları */}
              <div className="mb-4">
                <button
                  onClick={fetchLiveMetals}
                  disabled={metalLoading}
                  className="w-full flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  <RefreshCw size={14} className={metalLoading ? "animate-spin" : ""} />
                  {metalLoading ? 'API den Çekiliyor...' : 'Canlı Fiyatları API\'den Güncelle'}
                </button>
                {metalSuccess && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1.5 text-center">✓ {metalSuccess}</p>
                )}
                {metalError && (
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-1.5 text-center">⚠ {metalError}</p>
                )}
              </div>

              <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <ExternalLink size={12} />
                  <span className="font-semibold">Kaynak:</span> Serbest Piyasa
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Clock size={12} />
                  <span className="font-semibold">Son Güncelleme:</span> Düzenlenebilir
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
}
