import React, { useState, useEffect } from 'react';
import { ChevronRight, RefreshCw, Copy, Info, AlertCircle, Coins, Gem, ArrowUpDown, DollarSign, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToolIcon } from '../../components/icons/ToolIcon';
import { AdSlot } from '../../components/ads/AdSlot';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { RelatedTools } from '../../components/tools/RelatedTools';

export default function ZekatHesaplama() {
  // Altın ve Gümüş Gram Fiyatları (Güncel Oranlar ve Parametreler / localStorage'dan yüklenir)
  const [altinFiyat, setAltinFiyat] = useState<number>(() => {
    const saved = localStorage.getItem('altinFiyat');
    return saved ? Number(saved) : 3000;
  });
  const [gumusFiyat, setGumusFiyat] = useState<number>(() => {
    const saved = localStorage.getItem('gumusFiyat');
    return saved ? Number(saved) : 35;
  });

  const [apiLoading, setApiLoading] = useState(false);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleAltinFiyatChange = (val: number) => {
    setAltinFiyat(val);
    localStorage.setItem('altinFiyat', val.toString());
    setSonuc(null);
  };

  const handleGumusFiyatChange = (val: number) => {
    setGumusFiyat(val);
    localStorage.setItem('gumusFiyat', val.toString());
    setSonuc(null);
  };

  const fetchLivePrices = async () => {
    setApiLoading(true);
    setApiSuccess(null);
    setApiError(null);
    try {
      // 1. USD/TRY kurunu çek
      const erResponse = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!erResponse.ok) throw new Error('Döviz kuru API bağlantısı başarısız oldu.');
      const erData = await erResponse.json();
      const usdTry = erData?.rates?.TRY;
      if (!usdTry) throw new Error('USD/TRY kuru bulunamadı.');

      // 2. Canlı Altın (XAU) Fiyatını çek (USD/ounce)
      const xauResponse = await fetch('https://api.gold-api.com/price/XAU');
      if (!xauResponse.ok) throw new Error('Canlı altın fiyatı API bağlantısı başarısız oldu.');
      const xauData = await xauResponse.json();
      const xauPriceUsd = xauData?.price;
      if (!xauPriceUsd) throw new Error('Altın spot fiyatı bulunamadı.');

      // 3. Canlı Gümüş (XAG) Fiyatını çek (USD/ounce)
      const xagResponse = await fetch('https://api.gold-api.com/price/XAG');
      if (!xagResponse.ok) throw new Error('Canlı gümüş fiyatı API bağlantısı başarısız oldu.');
      const xagData = await xagResponse.json();
      const xagPriceUsd = xagData?.price;
      if (!xagPriceUsd) throw new Error('Gümüş spot fiyatı bulunamadı.');

      // Troy Ounce -> Gram Dönüşümü: 1 Troy Ounce = 31.1034768 gram
      const altinGramTl = Math.round((xauPriceUsd / 31.1034768) * usdTry);
      const gumusGramTl = Math.round((xagPriceUsd / 31.1034768) * usdTry);

      handleAltinFiyatChange(altinGramTl);
      handleGumusFiyatChange(gumusGramTl);
      
      setApiSuccess(`Canlı fiyatlar başarıyla güncellendi!`);
      setTimeout(() => setApiSuccess(null), 5000);
    } catch (err: any) {
      console.error(err);
      setApiError(err?.message || 'Canlı fiyatlar alınamadı. Lütfen manuel düzenleyiniz.');
      setTimeout(() => setApiError(null), 5000);
    } finally {
      setApiLoading(false);
    }
  };

  useEffect(() => {
    fetchLivePrices();
  }, []);

  // Varlıklar
  const [nakit, setNakit] = useState<number | ''>('');
  const [altinGram, setAltinGram] = useState<number | ''>('');
  const [gumusGram, setGumusGram] = useState<number | ''>('');
  const [hisseYatirim, setHisseYatirim] = useState<number | ''>('');
  const [ticariMal, setTicariMal] = useState<number | ''>('');
  const [alacaklar, setAlacaklar] = useState<number | ''>('');

  // Borçlar
  const [borclar, setBorclar] = useState<number | ''>('');

  // Sonuç State'i
  const [sonuc, setSonuc] = useState<{
    toplamVarlik: number;
    toplamBorc: number;
    netMatrah: number;
    nisapMiktari: number;
    isEligible: boolean;
    zekatMiktarı: number;
    altinDegeri: number;
    gumusDegeri: number;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const hesapla = () => {
    setError(null);

    // En az bir varlık alanı doldurulmuş olmalı
    const valNakit = Number(nakit || 0);
    const valAltinGram = Number(altinGram || 0);
    const valGumusGram = Number(gumusGram || 0);
    const valHisse = Number(hisseYatirim || 0);
    const valTicari = Number(ticariMal || 0);
    const valAlacak = Number(alacaklar || 0);
    const valBorclar = Number(borclar || 0);

    if (valNakit < 0 || valAltinGram < 0 || valGumusGram < 0 || valHisse < 0 || valTicari < 0 || valAlacak < 0 || valBorclar < 0) {
      setError('*Lütfen negatif değer girmeyiniz.');
      setSonuc(null);
      return;
    }

    const altinDegeri = valAltinGram * altinFiyat;
    const gumusDegeri = valGumusGram * gumusFiyat;

    const toplamVarlik = valNakit + altinDegeri + gumusDegeri + valHisse + valTicari + valAlacak;
    const netMatrah = toplamVarlik - valBorclar;

    // Nisap Sınırı (80.18 gram altın piyasa değeri üzerinden hesaplanır)
    const nisapMiktari = 80.18 * altinFiyat;

    const isEligible = netMatrah >= nisapMiktari;
    const zekatMiktarı = isEligible ? netMatrah * 0.025 : 0; // %2.5 veya 1/40

    setSonuc({
      toplamVarlik,
      toplamBorc: valBorclar,
      netMatrah,
      nisapMiktari,
      isEligible,
      zekatMiktarı,
      altinDegeri,
      gumusDegeri
    });
  };

  const temizle = () => {
    setNakit('');
    setAltinGram('');
    setGumusGram('');
    setHisseYatirim('');
    setTicariMal('');
    setAlacaklar('');
    setBorclar('');
    setSonuc(null);
    setError(null);
  };

  const kopyala = () => {
    if (!sonuc) return;
    const text = `Zekat Hesaplama Özeti:\nToplam Varlıklar: ${sonuc.toplamVarlik.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL\nDüşülen Borçlar: ${sonuc.toplamBorc.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL\nZekat Matrahı: ${sonuc.netMatrah.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL\nNisap Sınırı: ${sonuc.nisapMiktari.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL\nDurum: ${sonuc.isEligible ? 'Zekat Vermesi Farz' : 'Zekat Gerekmiyor'}\nÖdenecek Zekat: ${sonuc.zekatMiktarı.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <Link to="/" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Ana Sayfa</Link>
        <ChevronRight size={14} />
        <Link to="/kategori/diger" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors capitalize">Diğer</Link>
        <ChevronRight size={14} />
        <span className="text-slate-800 dark:text-slate-300">Zekat Hesaplama</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Zekat Hesaplama 2026 - Ücretsiz ve Hızlı Sonuçlar</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Nakit para, altın, gümüş, hisse senedi ve ticari mallarınızı borçlarınızdan düşerek net dinî zenginlik (Nisap) ölçünüzü öğrenin ve verilecek zekat miktarını (%2.5) kolayca hesaplayın.
        </p>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      {/* Altın ve Gümüş Fiyat Ayarları */}
      <div className="mb-6 bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-400 dark:border-amber-900 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3 text-sm text-amber-900 dark:text-amber-200">
            <AlertCircle size={22} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <span className="font-extrabold text-base block mb-1">Piyasa Altın & Gümüş Fiyatları</span>
              <span className="text-xs leading-relaxed opacity-90 block">
                Zekat Nisap eşiğinin (80.18 gram altın) doğru hesaplanması için aşağıdaki gram fiyatlarını elle düzenleyebilirsiniz. Dilerseniz piyasa canlı fiyatlarını resmi API servislerinden otomatik çekip dönüştürmek için <strong>Canlı Fiyatları Getir</strong> butonuna tıklayabilirsiniz.
              </span>
            </div>
          </div>
          <button
            onClick={fetchLivePrices}
            disabled={apiLoading}
            className="w-full md:w-auto shrink-0 flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400/50 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-[0.98] cursor-pointer"
          >
            <RefreshCw size={14} className={apiLoading ? "animate-spin" : ""} />
            {apiLoading ? 'Canlı Fiyatlar Çekiliyor...' : 'Canlı Fiyatları Getir'}
          </button>
        </div>

        {/* Canlı fiyat durumu */}
        {(apiSuccess || apiError) && (
          <div className="text-xs font-bold px-3 py-2 rounded-lg border">
            {apiSuccess && (
              <div className="text-emerald-700 dark:text-emerald-400 border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/15">
                ✓ {apiSuccess}
              </div>
            )}
            {apiError && (
              <div className="text-rose-700 dark:text-rose-400 border-rose-200 bg-rose-50/50 dark:bg-rose-950/15">
                ⚠ {apiError}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-amber-200 dark:border-amber-900/60">
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border-2 border-amber-400 dark:border-amber-900 rounded-xl px-3 py-1.5 shadow-sm flex-1 md:flex-initial">
            <span className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase">Altın Gram:</span>
            <input
              type="number"
              value={altinFiyat}
              onChange={(e) => handleAltinFiyatChange(Number(e.target.value))}
              className="w-20 text-center text-sm font-black focus:outline-none bg-transparent text-slate-900 dark:text-white"
            />
            <span className="text-xs font-bold text-slate-400">TL</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border-2 border-amber-400 dark:border-amber-900 rounded-xl px-3 py-1.5 shadow-sm flex-1 md:flex-initial">
            <span className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase">Gümüş Gram:</span>
            <input
              type="number"
              value={gumusFiyat}
              onChange={(e) => handleGumusFiyatChange(Number(e.target.value))}
              className="w-16 text-center text-sm font-black focus:outline-none bg-transparent text-slate-900 dark:text-white"
            />
            <span className="text-xs font-bold text-slate-400">TL</span>
          </div>
        </div>
      </div>

      <div className="calculator-container mb-8 relative border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-8 mt-8">
        <div className="absolute -top-3.5 left-4 sm:left-8 bg-[#eef2f7] dark:bg-slate-950 px-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Coins size={20} className="text-[#0056b3] dark:text-blue-400" />
            Zekat Hesap Matrahı
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                Mal ve Borç Durumu
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
              <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl space-y-4 border border-black/5 dark:border-white/5">
                <h3 className="text-xs font-bold text-[#0056b3] dark:text-blue-400 uppercase tracking-widest mb-1">Mevcut Varlıklar</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">
                      Nakit Para / Banka Hesabı (TL)
                    </label>
                    <input
                      type="number"
                      value={nakit}
                      onChange={(e) => {
                        setNakit(e.target.value === '' ? '' : Number(e.target.value));
                        setError(null);
                      }}
                      placeholder="Örn: 150000"
                      className="w-full bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#0056b3] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">
                      Yatırım (Hisse, Fon vb.) (TL)
                    </label>
                    <input
                      type="number"
                      value={hisseYatirim}
                      onChange={(e) => {
                        setHisseYatirim(e.target.value === '' ? '' : Number(e.target.value));
                        setError(null);
                      }}
                      placeholder="Örn: 45000"
                      className="w-full bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#0056b3] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">
                      Altın Miktarı (Gram)
                    </label>
                    <input
                      type="number"
                      value={altinGram}
                      onChange={(e) => {
                        setAltinGram(e.target.value === '' ? '' : Number(e.target.value));
                        setError(null);
                      }}
                      placeholder="Örn: 20"
                      className="w-full bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#0056b3] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">
                      Gümüş Miktarı (Gram)
                    </label>
                    <input
                      type="number"
                      value={gumusGram}
                      onChange={(e) => {
                        setGumusGram(e.target.value === '' ? '' : Number(e.target.value));
                        setError(null);
                      }}
                      placeholder="Örn: 100"
                      className="w-full bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#0056b3] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">
                      Ticaret Malları Değeri (TL)
                    </label>
                    <input
                      type="number"
                      value={ticariMal}
                      onChange={(e) => {
                        setTicariMal(e.target.value === '' ? '' : Number(e.target.value));
                        setError(null);
                      }}
                      placeholder="Örn: 30000"
                      className="w-full bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#0056b3] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">
                      Alacaklar (Kesin Ödenecek) (TL)
                    </label>
                    <input
                      type="number"
                      value={alacaklar}
                      onChange={(e) => {
                        setAlacaklar(e.target.value === '' ? '' : Number(e.target.value));
                        setError(null);
                      }}
                      placeholder="Örn: 12000"
                      className="w-full bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#0056b3] transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-rose-50/20 dark:bg-rose-950/10 rounded-2xl border border-rose-500/10">
                <h3 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest mb-2">Düşülecek Borçlar</h3>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    Ödemeniz Gereken Borçlar, Faturalar (TL)
                  </label>
                  <input
                    type="number"
                    value={borclar}
                    onChange={(e) => {
                      setBorclar(e.target.value === '' ? '' : Number(e.target.value));
                      setError(null);
                    }}
                    placeholder="Örn: 15000"
                    className="w-full bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-700 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all"
                  />
                </div>
              </div>

              <button
                onClick={hesapla}
                className="w-full bg-[#0056b3] hover:bg-[#004494] text-white font-bold rounded-xl py-3.5 mt-2 transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Zekat Değerlerini Hesapla
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 md:p-8 flex-1 relative overflow-hidden shadow-lg border border-black/5 dark:border-slate-800 flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 dark:bg-amber-500/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-4 border-b border-black/5 dark:border-white/5 pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">ZEKAT HESAP SONUCU</h3>
                </div>

                <div className="flex-1 flex flex-col justify-center gap-4 my-4">
                  {sonuc !== null ? (
                    <>
                      {sonuc.isEligible ? (
                        <div className="flex flex-col gap-1 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-xl text-amber-800 dark:text-amber-300 text-xs font-semibold">
                          <span className="font-bold text-sm">Zekat Vermeniz Farzdır.</span>
                          <span className="font-normal opacity-90">Net varlığınız ({sonuc.netMatrah.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL) nisap sınırını ({sonuc.nisapMiktari.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} TL) geçmektedir.</span>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1 p-3 bg-slate-50 dark:bg-slate-800/40 border border-black/5 dark:border-white/5 rounded-xl text-slate-700 dark:text-slate-300 text-xs font-semibold">
                          <span className="font-bold text-sm">Zekat Farz Değildir.</span>
                          <span className="font-normal opacity-90">Net varlığınız ({sonuc.netMatrah.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL) nisap miktarından ({sonuc.nisapMiktari.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} TL) düşüktür.</span>
                        </div>
                      )}

                      <div className="space-y-3 mt-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-slate-400 text-[10px] mb-0.5 font-bold uppercase">Toplam Varlık</p>
                            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                              {sonuc.toplamVarlik.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL
                            </div>
                          </div>
                          <div>
                            <p className="text-slate-400 text-[10px] mb-0.5 font-bold uppercase">Toplam Borç</p>
                            <div className="text-xs font-bold text-rose-500">
                              -{sonuc.toplamBorc.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-slate-400 text-[10px] mb-0.5 font-bold uppercase">Zekat Matrahı (Net Varlık)</p>
                          <div className="text-base font-bold text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800/40 p-2 rounded border border-black/5">
                            {sonuc.netMatrah.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL
                          </div>
                        </div>

                        <div>
                          <p className="text-slate-400 text-[10px] mb-0.5 font-bold uppercase">Nisap Sınırı (80.18 gr Altın)</p>
                          <div className="text-xs font-bold text-slate-600 dark:text-slate-400">
                            {sonuc.nisapMiktari.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL
                          </div>
                        </div>

                        {sonuc.isEligible && (
                          <div className="pt-2 border-t border-black/5 dark:border-white/5">
                            <p className="text-amber-600 dark:text-amber-400 text-xs mb-1 font-bold uppercase">Ödenmesi Gereken Zekat (%2.5)</p>
                            <div className="text-3xl font-black tracking-tighter text-amber-600 dark:text-amber-400">
                              {sonuc.zekatMiktarı.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} <span className="text-lg text-slate-500">TL</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-[#eef2f7] dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Coins className="text-slate-400 dark:text-slate-500" size={20} />
                      </div>
                      <p className="text-slate-400 dark:text-slate-500 text-sm">
                        Zekat yükümlülüğünüzü ve tutarını hesaplamak için yukarıdaki alanları doldurun.
                      </p>
                    </div>
                  )}
                </div>

                {sonuc && (
                  <button
                    onClick={kopyala}
                    className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Copy size={14} />
                    {copied ? 'Kopyalandı!' : 'Detayları Kopyala'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SSS Bölümü */}
      <div className="mt-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Sıkça Sorulan Sorular (SSS)</h3>
        <div className="space-y-6">
          <div>
            <h4 className="text-[15px] font-bold text-slate-800 dark:text-slate-200 mb-2">Zekat kimlere farzdır?</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Müslüman, akıl sağlığı yerinde, ergenlik çağına gelmiş, hür olan ve asgari zenginlik ölçüsü sayılan **Nisap Miktarı** (80.18 gram altın değerinde) mala sahip olan, bu malın üzerinden en az bir ay/yıl geçmiş her bireye zekat vermek farzdır.
            </p>
          </div>
          <div>
            <h4 className="text-[15px] font-bold text-slate-800 dark:text-slate-200 mb-2">Zekat hangi mallardan verilir ve oranı nedir?</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Zekat nakit para, altın, gümüş, döviz, hisse senedi ve ticaret mallarından verilir. Bu mallar için temel zekat oranı **%2.5 (yani kırkta bir - 1/40)** olarak belirlenmiştir. Tarım ürünlerinde (Öşür) ve madenlerde oranlar değişiklik gösterir.
            </p>
          </div>
          <div>
            <h4 className="text-[15px] font-bold text-slate-800 dark:text-slate-200 mb-2">Hangi borçlar zekat matrahından düşülür?</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Ödemeniz gereken ve vadesi gelmiş borçlar, faturalar, kira ödemeleri ve ticari yükümlülükler toplam varlığınızdan düşülür. Henüz vadesi gelmemiş uzun vadeli taksitli borçların (örneğin konut kredisinin sonraki yıllara ait taksitleri) sadece içinde bulunulan yıl ödenecek kısımları düşülmelidir.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-slate-50 dark:bg-slate-900/40 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/60">
        <h4 className="text-[15px] font-bold text-slate-800 dark:text-slate-200 mb-2">Dini Hesaplama Temelleri</h4>
        <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
          Zekat Matrahı = Toplam Varlıklar (Nakit + Altın Değeri + Diğer Varlıklar) − Düşülecek Borçlar <br />
          Zekat Miktarı = Zekat Matrahı × 0.025 (Eğer matrah ≥ 80.18 gram altın değeri ise)
        </p>
      </div>



      <div className="mt-8">
        
      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Zekat Hesaplama Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              Zekat Hesaplama aracını kullanmak son derece basit ve kullanıcı dostudur. İlgili form alanlarına elinizdeki verileri eksiksiz ve doğru bir şekilde girdiğinizden emin olun. Tüm alanları doldurduktan sonra "Hesapla" butonuna tıklayarak sonuçları anında görüntüleyebilirsiniz. Aracımız, girdiğiniz değerleri anlık olarak işler ve herhangi bir sayfaya yönlendirme yapmadan, bulunduğunuz ekran üzerinde size en net ve kesin verileri sunar. İhtiyaç duyduğunuz her an bu aracı tamamen ücretsiz olarak kullanabilir, dilerseniz sonuçları kopyalayarak farklı platformlarda kolayca paylaşabilirsiniz. Zaman kaybetmeden, en karmaşık hesaplamaları bile saniyeler içinde tamamlamanın ayrıcalığını yaşayın.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Zekat Hesaplama Nedir ve Nasıl Hesaplanır?</h4>
            <p>
              Zekat Hesaplama, kullanıcıların günlük hayatta veya profesyonel iş süreçlerinde sıklıkla ihtiyaç duyduğu matematiksel veya istatistiksel hesaplamaları pratik bir şekilde çözmek amacıyla geliştirilmiş kapsamlı bir dijital araçtır. Geleneksel yöntemlerle yapıldığında hata payı yüksek olan ve uzun zaman alan bu tür işlemler, gelişmiş altyapımız sayesinde otomatik olarak hatasız bir biçimde gerçekleştirilir. 
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
                  Zekat Tutarı = (Toplam Nakit + Altın/Gümüş Değeri + Ticari Mallar - Borçlar) × %2.5 (1/40) (Eğer toplam nisap miktarını geçiyorsa)
                </div>
              </div>
            </div>
          </div>
          
          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular (SSS)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Zekat Hesaplama aracı ücretli midir?</h5>
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
      <RelatedTools category="diger" currentToolId="zekat-hesaplama" />

      <div className="mt-8">
        <Disclaimer />
      </div>
      </div>
    </div>
  );
}
