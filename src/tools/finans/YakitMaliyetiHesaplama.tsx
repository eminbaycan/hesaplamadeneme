import React, { useState } from 'react';
import { ChevronRight, RefreshCw, Copy, Info, Fuel, AlertCircle, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdSlot } from '../../components/ads/AdSlot';
import { RelatedTools } from '../../components/tools/RelatedTools';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { ToolIcon } from '../../components/icons/ToolIcon';

export default function YakitMaliyetiHesaplama() {
  const [mesafe, setMesafe] = useState<number | ''>('');
  const [tuketim, setTuketim] = useState<number | ''>('');
  const [litreFiyati, setLitreFiyati] = useState<number | ''>('');
  const [kisiSayisi, setKisiSayisi] = useState<number | ''>('');
  const [sonuc, setSonuc] = useState<{ toplamTutar: number; kisiBasi: number; toplamLitre: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCalculate = () => {
    if (mesafe === '' || tuketim === '' || litreFiyati === '') {
      setError('*Lütfen gerekli tüm alanları doldurun.');
      setSonuc(null);
      return;
    }
    setError(null);
    const toplamLitre = (Number(mesafe) * Number(tuketim)) / 100;
    const toplamTutar = toplamLitre * Number(litreFiyati);
    const kisi = typeof kisiSayisi === 'number' && kisiSayisi > 0 ? kisiSayisi : 1;
    const kisiBasi = toplamTutar / kisi;

    setSonuc({
      toplamTutar,
      kisiBasi,
      toplamLitre
    });
  };

  const handleClear = () => {
    setMesafe('');
    setTuketim('');
    setLitreFiyati('');
    setKisiSayisi('');
    setSonuc(null);
    setError(null);
  };

  const handleCopy = () => {
    if (!sonuc) return;
    const text = `Toplam Yakıt Tüketimi: ${sonuc.toplamLitre.toFixed(2)} L | Toplam Maliyet: ${sonuc.toplamTutar.toFixed(2)} ₺ | Kişi Başı: ${sonuc.kisiBasi.toFixed(2)} ₺`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* 1. BREADCRUMB */}
      <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <Link to="/" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Ana Sayfa</Link>
        <ChevronRight size={14} />
        <Link to="/kategori/finans" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors capitalize">Finans</Link>
        <ChevronRight size={14} />
        <span className="text-slate-800 dark:text-slate-300">Araç Yakıt Maliyeti Hesaplama</span>
      </div>

      {/* 2. BAŞLIK VE AÇIKLAMA */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Araç Yakıt Maliyeti Hesaplama 2026 - Ücretsiz ve Hızlı Sonuçlar</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Yol mesafesi, ortalama yakıt tüketimi ve güncel yakıt litre fiyatını girerek seyahatinizin toplam maliyetini ve yolcular arasındaki paylaşım tutarını kolayca hesaplayın.
        </p>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      {/* HESAPLAMA ARACI KAPSAYICISI */}
      <div className="calculator-container mb-8 relative border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-8 mt-8">
        <div className="absolute -top-3.5 left-4 sm:left-8 bg-[#eef2f7] dark:bg-slate-950 px-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ToolIcon name="finans" size={20} className="text-[#0056b3] dark:text-blue-400" />
            Yakıt Hesaplama Aracı
          </h2>
        </div>

        {/* 3. ANA UYGULAMA ALANI */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          
          {/* SOL: Girdi Formu */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                Seyahat Bilgileri
              </h2>
              <button 
                onClick={handleClear}
                className="text-[12px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer">
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
                  Yol Mesafesi (km) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  value={mesafe}
                  onChange={(e) => {
                    setMesafe(e.target.value === '' ? '' : Number(e.target.value));
                    setError(null);
                  }}
                  placeholder="Örn: 450" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  100 km'de Ortalama Tüketim (Litre) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  step="0.1"
                  value={tuketim}
                  onChange={(e) => {
                    setTuketim(e.target.value === '' ? '' : Number(e.target.value));
                    setError(null);
                  }}
                  placeholder="Örn: 7.5" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  Güncel Yakıt Litre Fiyatı (TL) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  value={litreFiyati}
                  onChange={(e) => {
                    setLitreFiyati(e.target.value === '' ? '' : Number(e.target.value));
                    setError(null);
                  }}
                  placeholder="Örn: 42.50" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  Yolcu / Kişi Sayısı (Paylaşım İçin)
                </label>
                <input 
                  type="number" 
                  min="1"
                  value={kisiSayisi}
                  onChange={(e) => {
                    setKisiSayisi(e.target.value === '' ? '' : Number(e.target.value));
                    setError(null);
                  }}
                  placeholder="Örn: 1" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all"
                />
              </div>

              <button 
                onClick={handleCalculate}
                className="w-full bg-[#0056b3] hover:bg-[#004494] text-white font-bold rounded-xl py-3.5 mt-2 transition-all shadow-sm active:scale-[0.98] cursor-pointer">
                Yolculuk Maliyetini Hesapla
              </button>
            </div>
          </div>

          {/* SAĞ: Sonuç Paneli */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 md:p-8 flex-1 relative overflow-hidden shadow-lg border border-black/5 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-white mb-6">Hesaplama Sonucu</h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">Toplam Yakıt Miktarı</span>
                    <div className="text-2xl font-black text-slate-800 dark:text-white">
                      {sonuc !== null ? `${sonuc.toplamLitre.toFixed(2)} Litre` : "---"}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">Toplam Seyahat Maliyeti</span>
                    <div className="text-3xl font-black text-[#0056b3] dark:text-blue-400">
                      {sonuc !== null ? `${sonuc.toplamTutar.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺` : "---"}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">Kişi Başına Düşen Tutar</span>
                    <div className="text-2xl font-black text-slate-900 dark:text-white">
                      {sonuc !== null ? `${sonuc.kisiBasi.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺` : "---"}
                    </div>
                  </div>
                </div>

                {sonuc !== null && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-black/5 dark:border-white/5 mb-4">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-sm">Seyahat Özeti</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Girilen bilgilere göre seyahat maliyeti başarıyla hesaplanmıştır.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <button 
                  onClick={handleCopy}
                  disabled={sonuc === null}
                  className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white border border-black/5 dark:border-transparent font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all backdrop-blur-sm disabled:opacity-50 cursor-pointer">
                  <Copy size={16} /> {copied ? 'Kopyalandı!' : 'Sonucu Kopyala'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      {/* 4. SEO & BİLGİLENDİRME ALANI (SSS, Açıklama, Formül) */}
      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Araç Yakıt Maliyeti Hesaplama Rehberi ve Sıkça Sorulan Sorular
        </h3>

        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-6 leading-relaxed">
          <div>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-2">Araç Yakıt Maliyeti Nasıl Hesaplanır?</h4>
            <p>
              Uzun yolculuklara çıkmadan önce seyahat bütçenizi planlamak ve ortak yolculuklarda masrafları adil bir şekilde paylaşmak için yakıt hesaplaması büyük önem taşır. Toplam mesafe ve 100 kilometredeki ortalama yakıt tüketimi bilindiğinde toplam harcanacak yakıt miktarı ve güncel litre fiyatı ile toplam seyahat masrafı kolayca bulunur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-2">Şehir İçi ve Şehir Dışı Yakıt Tüketimi Farkı</h4>
              <p>
                Şehir içi dur-kalk trafiği ve düşük vites kullanımları motorun daha fazla yakıt harcamasına neden olurken, sabit hızla ilerlenen uzun yolculuklarda ortalama tüketim genellikle düşer.
              </p>
            </div>
            <div>
              <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-2">LPG ve Dizel Maliyet Hesaplaması</h4>
              <p>
                Benzinli araçların yanı sıra LPG veya dizel yakıt kullanan araçlar için de güncel litre fiyatlarını girerek doğru maliyet sonuçları elde edebilirsiniz.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Kullanılan Formüller</h4>
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Toplam Litre Formülü:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  Toplam Litre = (Mesafe × 100 km Ortalama Tüketim) / 100
                </div>
              </div>
              <div className="pt-2">
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Toplam Tutar ve Kişi Başı Formülü:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  Toplam Tutar = Toplam Litre × Yakıt Litre Fiyatı <br />
                  Kişi Başı = Toplam Tutar / Yolcu Sayısı
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular</h4>
            <div className="space-y-4">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Seyahat masrafını yolcularla nasıl paylaşabilirim?</h5>
                <p>Araç hesaplama aracımızda "Yolcu / Kişi Sayısı" alanına toplam kişi sayısını yazarak kişi başına düşen seyahat ücretini otomatik olarak hesaplayabilirsiniz.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. BENZER ARAÇLAR */}
      
      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Araç Yakıt Maliyeti Hesaplama Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              Araç Yakıt Maliyeti Hesaplama aracını kullanmak son derece basit ve kullanıcı dostudur. İlgili form alanlarına elinizdeki verileri eksiksiz ve doğru bir şekilde girdiğinizden emin olun. Tüm alanları doldurduktan sonra "Hesapla" butonuna tıklayarak sonuçları anında görüntüleyebilirsiniz. Aracımız, girdiğiniz değerleri anlık olarak işler ve herhangi bir sayfaya yönlendirme yapmadan, bulunduğunuz ekran üzerinde size en net ve kesin verileri sunar. İhtiyaç duyduğunuz her an bu aracı tamamen ücretsiz olarak kullanabilir, dilerseniz sonuçları kopyalayarak farklı platformlarda kolayca paylaşabilirsiniz. Zaman kaybetmeden, en karmaşık hesaplamaları bile saniyeler içinde tamamlamanın ayrıcalığını yaşayın.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Araç Yakıt Maliyeti Hesaplama Nedir ve Nasıl Hesaplanır?</h4>
            <p>
              Araç Yakıt Maliyeti Hesaplama, kullanıcıların günlük hayatta veya profesyonel iş süreçlerinde sıklıkla ihtiyaç duyduğu matematiksel veya istatistiksel hesaplamaları pratik bir şekilde çözmek amacıyla geliştirilmiş kapsamlı bir dijital araçtır. Geleneksel yöntemlerle yapıldığında hata payı yüksek olan ve uzun zaman alan bu tür işlemler, gelişmiş altyapımız sayesinde otomatik olarak hatasız bir biçimde gerçekleştirilir. 
            </p>
            <p className="mt-4">
              Hesaplama arka planda, genel kabul görmüş evrensel formüller, en güncel yasal mevzuatlar veya resmi olarak açıklanmış standart oranlar kullanılarak yapılmaktadır. Veriler sisteme girildiği anda, algoritma bu güncel parametreleri referans alarak verilerinizi analiz eder ve sonuçları net bir şekilde ekranınıza yansıtır. Finansal, istatistiksel veya gündelik hesaplamalar fark etmeksizin her daim doğru ve güvenilir bilgiye ulaşmanız hedeflenmektedir. Bu aracı kullanarak iş akışınızı hızlandırabilir ve hata payını sıfıra indirebilirsiniz.
            </p>
          </section>

          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular (SSS)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Araç Yakıt Maliyeti Hesaplama aracı ücretli midir?</h5>
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
      <RelatedTools category="finans" currentToolId="yakit-maliyeti-hesaplama" />

      {/* SORUMLULUK REDDİ */}
      <div className="mt-8">
        <Disclaimer category="finans" />
      </div>
    </div>
  );
}
