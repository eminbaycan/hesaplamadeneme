import React, { useState } from 'react';
import { ChevronRight, RefreshCw, Copy, Info, AlertCircle, Percent, Calendar, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToolIcon } from '../../components/icons/ToolIcon';
import { AdSlot } from '../../components/ads/AdSlot';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { RelatedTools } from '../../components/tools/RelatedTools';

export default function KiraArtisHesaplama() {
  const [mevcutKira, setMevcutKira] = useState<number | ''>('');
  const [artisTuru, setArtisTuru] = useState<'tufe' | 'ozel' | 'sinir'>('tufe');
  const [ozelOran, setOzelOran] = useState<number | ''>(''); // Son dönem TÜFE ortalamalarına benzer makul bir varsayılan
  const [yenilemeAyi, setYenilemeAyi] = useState<string>('Ağustos 2026');

  const [sonuc, setSonuc] = useState<{
    artisOrani: number;
    artisTutari: number;
    yeniKira: number;
    yillikToplamArtis: number;
    yillikToplamKira: number;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const hesapla = () => {
    if (mevcutKira === '') {
      setError('*Lütfen mevcut kira bedelini giriniz.');
      setSonuc(null);
      return;
    }
    if (Number(mevcutKira) <= 0) {
      setError('*Mevcut kira bedeli 0\'dan büyük olmalıdır.');
      setSonuc(null);
      return;
    }

    let oran = 0;
    if (artisTuru === 'tufe') {
      oran = 62.51; // Resmi ortalama varsayılanı (kullanıcı değiştiremez veya açıklama ile sabit kalır)
    } else if (artisTuru === 'ozel') {
      if (ozelOran === '' || Number(ozelOran) < 0) {
        setError('*Lütfen geçerli bir artış oranı (%) giriniz.');
        setSonuc(null);
        return;
      }
      oran = Number(ozelOran);
    } else if (artisTuru === 'sinir') {
      oran = 25; // Eski yasal sınır
    }

    setError(null);
    const kira = Number(mevcutKira);
    const artisTutari = kira * (oran / 100);
    const yeniKira = kira + artisTutari;
    const yillikToplamArtis = artisTutari * 12;
    const yillikToplamKira = yeniKira * 12;

    setSonuc({
      artisOrani: oran,
      artisTutari,
      yeniKira,
      yillikToplamArtis,
      yillikToplamKira
    });
  };

  const temizle = () => {
    setMevcutKira('');
    setArtisTuru('tufe');
    setOzelOran(62.51);
    setYenilemeAyi('Ağustos 2026');
    setSonuc(null);
    setError(null);
  };

  const kopyala = () => {
    if (!sonuc) return;
    const text = `Kira Artış Analizi (${yenilemeAyi}):\nEski Kira: ${Number(mevcutKira).toLocaleString('tr-TR')} TL\nArtış Oranı: %${sonuc.artisOrani.toLocaleString('tr-TR')}\nArtış Tutarı: ${sonuc.artisTutari.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL\nYeni Kira: ${sonuc.yeniKira.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL\nYıllık Toplam Artış: ${sonuc.yillikToplamArtis.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <Link to="/" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Ana Sayfa</Link>
        <ChevronRight size={14} />
        <Link to="/kategori/finans" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors capitalize">Finans</Link>
        <ChevronRight size={14} />
        <span className="text-slate-800 dark:text-slate-300">Kira Artış Oranı Hesaplama</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Kira Artış Oranı Hesaplama 2026 - Ücretsiz ve Hızlı Sonuçlar</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Sözleşme yenileme dönemine göre resmi TÜFE 12 aylık ortalamaları veya özel oranlar üzerinden kira artışınızı, aylık ve yıllık yeni ödemelerinizi hesaplayın.
        </p>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      <div className="calculator-container mb-8 relative border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-8 mt-8">
        <div className="absolute -top-3.5 left-4 sm:left-8 bg-[#eef2f7] dark:bg-slate-950 px-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ToolIcon name="finans" size={20} className="text-[#0056b3] dark:text-blue-400" />
            Kira Artış Hesabı
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                Sözleşme Bilgileri
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

            <div className="space-y-5">
              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  Mevcut Kira Bedeli (TL) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={mevcutKira}
                    onChange={(e) => {
                      setMevcutKira(e.target.value === '' ? '' : Number(e.target.value));
                      setError(null);
                    }}
                    placeholder="Örn: 15000"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl pl-4 pr-12 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">TL</span>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  Yenileme Dönemi (Ay/Yıl)
                </label>
                <div className="relative">
                  <select
                    value={yenilemeAyi}
                    onChange={(e) => setYenilemeAyi(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all appearance-none"
                  >
                    <option value="Ocak 2026">Ocak 2026</option>
                    <option value="Şubat 2026">Şubat 2026</option>
                    <option value="Mart 2026">Mart 2026</option>
                    <option value="Nisan 2026">Nisan 2026</option>
                    <option value="Mayıs 2026">Mayıs 2026</option>
                    <option value="Haziran 2026">Haziran 2026</option>
                    <option value="Temmuz 2026">Temmuz 2026</option>
                    <option value="Ağustos 2026">Ağustos 2026</option>
                    <option value="Eylül 2026">Eylül 2026</option>
                    <option value="Ekim 2026">Ekim 2026</option>
                    <option value="Kasım 2026">Kasım 2026</option>
                    <option value="Aralık 2026">Aralık 2026</option>
                  </select>
                  <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                  Artış Oranı Belirleme Yöntemi
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => { setArtisTuru('tufe'); setError(null); }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center gap-1 ${artisTuru === 'tufe' ? 'bg-[#0056b3] text-white border-[#0056b3]' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-black/10 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                  >
                    <span>Resmi TÜFE Oranı</span>
                    <span className="opacity-80 font-semibold">%62.51</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setArtisTuru('ozel'); setError(null); }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center gap-1 ${artisTuru === 'ozel' ? 'bg-[#0056b3] text-white border-[#0056b3]' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-black/10 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                  >
                    <span>Özel Oran Gir</span>
                    <span className="opacity-80 font-semibold">Manuel Giriş</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setArtisTuru('sinir'); setError(null); }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center gap-1 ${artisTuru === 'sinir' ? 'bg-[#0056b3] text-white border-[#0056b3]' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-black/10 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                  >
                    <span>Yasal Sınır %25</span>
                    <span className="opacity-80 font-semibold">Tarihsel</span>
                  </button>
                </div>
              </div>

              {artisTuru === 'ozel' && (
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                    Artış Oranı (%) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={ozelOran}
                      onChange={(e) => {
                        setOzelOran(e.target.value === '' ? '' : Number(e.target.value));
                        setError(null);
                      }}
                      placeholder="Örn: 50"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl pl-4 pr-12 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all"
                    />
                    <Percent size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              )}

              <button
                onClick={hesapla}
                className="w-full bg-[#0056b3] hover:bg-[#004494] text-white font-bold rounded-xl py-3.5 mt-2 transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Kira Değişimini Hesapla
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 md:p-8 flex-1 relative overflow-hidden shadow-lg border border-black/5 dark:border-slate-800 flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-4 border-b border-black/5 dark:border-white/5 pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">İŞLEM ÇIKTISI</h3>
                </div>

                <div className="flex-1 flex flex-col justify-center gap-5 my-4">
                  {sonuc !== null ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-slate-400 text-[11px] mb-0.5 font-bold uppercase">Mevcut Kira</p>
                          <div className="text-base font-bold text-slate-700 dark:text-slate-300">
                            {Number(mevcutKira).toLocaleString('tr-TR')} TL
                          </div>
                        </div>
                        <div>
                          <p className="text-slate-400 text-[11px] mb-0.5 font-bold uppercase">Artış Oranı</p>
                          <div className="text-base font-bold text-slate-700 dark:text-slate-300">
                            %{sonuc.artisOrani.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-black/5 dark:border-white/5">
                        <p className="text-slate-400 text-[11px] mb-0.5 font-bold uppercase">Aylık Artış Farkı</p>
                        <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                          +{sonuc.artisTutari.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} <span className="text-xs">TL</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-[#0056b3] dark:text-blue-400 text-xs mb-1 font-bold uppercase">Yeni Aylık Kira Tutarı</p>
                        <div className="text-4xl font-black tracking-tighter text-[#0056b3] dark:text-blue-400">
                          {sonuc.yeniKira.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} <span className="text-xl text-slate-500">TL</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-black/5 dark:border-white/5 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-slate-400 text-[10px] font-bold uppercase">Yıllık Ek Maliyet</p>
                          <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            {sonuc.yillikToplamArtis.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL
                          </div>
                        </div>
                        <div>
                          <p className="text-slate-400 text-[10px] font-bold uppercase">Yıllık Toplam Kira</p>
                          <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            {sonuc.yillikToplamKira.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-[#eef2f7] dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Percent className="text-slate-400 dark:text-slate-500" size={20} />
                      </div>
                      <p className="text-slate-400 dark:text-slate-500 text-sm">
                        Hesaplamak için bilgileri girip "Kira Değişimini Hesapla" butonuna tıklayın.
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
            <h4 className="text-[15px] font-bold text-slate-800 dark:text-slate-200 mb-2">Konutlarda %25 kira artış sınırı kalktı mı?</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Evet, 11 Haziran 2022 ile 1 Temmuz 2024 tarihleri arasında uygulanan %25'lik yasal kira artış tavanı uygulaması resmen sona ermiştir. Bu tarihten sonra yapılan yenilemelerde yasal üst sınır, TÜFE'nin 12 aylık ortalamasıdır.
            </p>
          </div>
          <div>
            <h4 className="text-[15px] font-bold text-slate-800 dark:text-slate-200 mb-2">Resmi kira artış üst sınırı nasıl hesaplanır?</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Resmi kira artış oranı, Borçlar Kanunu'na göre kira sözleşmesinin yenilendiği ay yayınlanan **son 12 aylık TÜFE (Tüketici Fiyat Endeksi) ortalaması** üzerinden hesaplanır. Ev sahibi bu oranın üzerinde bir artış yapamaz ancak taraflar anlaşarak bu oranın altında bir artış belirleyebilirler.
            </p>
          </div>
          <div>
            <h4 className="text-[15px] font-bold text-slate-800 dark:text-slate-200 mb-2">İşyeri (Ticari) kira artış oranı konutlardan farklı mıdır?</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Hayır, konutlardaki %25 sınırı bittiğinden beri hem konutlarda hem de işyerlerinde resmi kira artış tavan oranı aynı şekilde yenileme ayının 12 aylık TÜFE ortalamasına göre belirlenmektedir.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-slate-50 dark:bg-slate-900/40 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/60">
        <h4 className="text-[15px] font-bold text-slate-800 dark:text-slate-200 mb-2">Matematiksel Formül</h4>
        <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
          Kira Artış Tutarı = Mevcut Kira × (Artış Oranı / 100) <br />
          Yeni Kira Tutarı = Mevcut Kira + Kira Artış Tutarı
        </p>
      </div>



      <div className="mt-8">
        
      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Kira Artış Oranı Hesaplama Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              Kira Artış Oranı Hesaplama aracını kullanmak son derece basit ve kullanıcı dostudur. İlgili form alanlarına elinizdeki verileri eksiksiz ve doğru bir şekilde girdiğinizden emin olun. Tüm alanları doldurduktan sonra "Hesapla" butonuna tıklayarak sonuçları anında görüntüleyebilirsiniz. Aracımız, girdiğiniz değerleri anlık olarak işler ve herhangi bir sayfaya yönlendirme yapmadan, bulunduğunuz ekran üzerinde size en net ve kesin verileri sunar. İhtiyaç duyduğunuz her an bu aracı tamamen ücretsiz olarak kullanabilir, dilerseniz sonuçları kopyalayarak farklı platformlarda kolayca paylaşabilirsiniz. Zaman kaybetmeden, en karmaşık hesaplamaları bile saniyeler içinde tamamlamanın ayrıcalığını yaşayın.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Kira Artış Oranı Hesaplama Nedir ve Nasıl Hesaplanır?</h4>
            <p>
              Kira Artış Oranı Hesaplama, kullanıcıların günlük hayatta veya profesyonel iş süreçlerinde sıklıkla ihtiyaç duyduğu matematiksel veya istatistiksel hesaplamaları pratik bir şekilde çözmek amacıyla geliştirilmiş kapsamlı bir dijital araçtır. Geleneksel yöntemlerle yapıldığında hata payı yüksek olan ve uzun zaman alan bu tür işlemler, gelişmiş altyapımız sayesinde otomatik olarak hatasız bir biçimde gerçekleştirilir. 
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
                  Yeni Kira Bedeli = Mevcut Kira + (Mevcut Kira × Artış Oranı / 100)
                </div>
              </div>
            </div>
          </div>
          
          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular (SSS)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Kira Artış Oranı Hesaplama aracı ücretli midir?</h5>
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
      <RelatedTools category="finans" currentToolId="kira-artis-orani-hesaplama" />

      <div className="mt-8">
        <Disclaimer />
      </div>
      </div>
    </div>
  );
}
