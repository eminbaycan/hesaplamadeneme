import React, { useState } from 'react';
import { ChevronRight, RefreshCw, Copy, Info, AlertCircle, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToolIcon } from '../../components/icons/ToolIcon';
import { AdSlot } from '../../components/ads/AdSlot';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { RelatedTools } from '../../components/tools/RelatedTools';

export default function KdvHesaplama() {
  const [tutar, setTutar] = useState<number | ''>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [oran, setOran] = useState<number>(20);
  const [hesapTuru, setHesapTuru] = useState<'haricten-dahile' | 'dahilden-harice'>('haricten-dahile');
  
  const [sonuc, setSonuc] = useState<{
    haric: number;
    kdvTutar: number;
    dahil: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hesapla = () => {
    if (tutar === '') {
      setError("*Lütfen tutar giriniz.");
      setSonuc(null);
      return;
    }
    if (tutar <= 0) {
      setError("*Tutar 0'dan büyük olmalıdır.");
      setSonuc(null);
      return;
    }
    setError(null);
    
    const t = Number(tutar);
    let haric = 0;
    let kdvTutar = 0;
    let dahil = 0;
    
    if (hesapTuru === 'haricten-dahile') {
      haric = t;
      kdvTutar = t * (oran / 100);
      dahil = t + kdvTutar;
    } else {
      dahil = t;
      haric = t / (1 + (oran / 100));
      kdvTutar = dahil - haric;
    }
    
    setSonuc({
      haric,
      kdvTutar,
      dahil
    });
  };

  const temizle = () => {
    setTutar('');
    setOran(20);
    setHesapTuru('haricten-dahile');
    setSonuc(null);
    setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <Link to="/" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Ana Sayfa</Link>
        <ChevronRight size={14} />
        <Link to="/kategori/finans" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors capitalize">Finans</Link>
        <ChevronRight size={14} />
        <span className="text-slate-800 dark:text-slate-300">KDV Hesaplama</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">KDV Hesaplama 2026 - KDV Dahil ve Hariç Bulma Aracı</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          KDV dahil veya KDV hariç tutarları güncel (%1, %10, %20) oranlar üzerinden hızlıca hesaplayın.
        </p>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      <div className="calculator-container mb-8 relative border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-8 mt-8">
        <div className="absolute -top-3.5 left-4 sm:left-8 bg-[#eef2f7] dark:bg-slate-950 px-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ToolIcon name="hesap-makinesi" size={20} className="text-[#0056b3] dark:text-blue-400" />
            KDV Hesaplama
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                Bilgileri Girin
              </h2>
              <button onClick={temizle} className="text-[12px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1.5 transition-colors">
                <RefreshCw size={12} /> Temizle
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mb-6">
              <button 
                onClick={() => { setHesapTuru('haricten-dahile'); setSonuc(null); }}
                className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors border ${hesapTuru === 'haricten-dahile' ? 'bg-[#0056b3] text-white border-[#0056b3]' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-black/10 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >
                KDV Hariç ➔ Dahil
              </button>
              <button 
                onClick={() => { setHesapTuru('dahilden-harice'); setSonuc(null); }}
                className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors border ${hesapTuru === 'dahilden-harice' ? 'bg-[#0056b3] text-white border-[#0056b3]' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-black/10 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >
                KDV Dahil ➔ Hariç
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
                  Tutar (TL) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  value={tutar}
                  onChange={(e) => {
                    setTutar(e.target.value === '' ? '' : Number(e.target.value));
                    setError(null);
                  }}
                  placeholder="Örn: 1000" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  KDV Oranı (%) <span className="text-red-500">*</span>
                </label>
                <select
                  value={oran}
                  onChange={(e) => setOran(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all"
                >
                  <option value={20}>%20</option>
                  <option value={10}>%10</option>
                  <option value={1}>%1</option>
                </select>
              </div>
              
              <button onClick={hesapla} className="w-full bg-[#0056b3] hover:bg-[#004494] text-white font-bold rounded-xl py-3.5 mt-2 transition-all shadow-sm active:scale-[0.98]">
                Hesapla
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 md:p-8 flex-1 relative overflow-hidden shadow-lg border border-black/5 dark:border-slate-800">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8 opacity-90">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-white">Sonuç</h3>
                </div>

                <div className="flex-1 flex flex-col justify-center gap-6">
                  {sonuc !== null ? (
                    <>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs mb-1 font-bold uppercase">KDV Hariç Tutar</p>
                        <div className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white">
                          {sonuc.haric.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs mb-1 font-bold uppercase">KDV Tutarı (%{oran})</p>
                        <div className="text-xl font-bold tracking-tighter text-rose-600 dark:text-rose-400">
                          {sonuc.kdvTutar.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL
                        </div>
                      </div>
                      <div className="pt-4 border-t border-black/10 dark:border-white/10">
                        <p className="text-slate-500 dark:text-slate-400 text-xs mb-1 font-bold uppercase">KDV Dahil Tutar</p>
                        <div className="text-4xl font-black tracking-tighter text-[#0056b3] dark:text-blue-400">
                          {sonuc.dahil.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} <span className="text-2xl text-slate-500">TL</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-slate-400">Hesaplama sonucu burada gösterilecek</div>
                  )}
                </div>

                <button 
                  onClick={() => {
                    if (sonuc !== null) {
                      const text = `KDV Hariç: ${sonuc.haric.toFixed(2)} TL | KDV Tutarı: ${sonuc.kdvTutar.toFixed(2)} TL | KDV Dahil: ${sonuc.dahil.toFixed(2)} TL`;
                      navigator.clipboard.writeText(text);
                    }
                  }}
                  className="w-full mt-8 bg-slate-50 hover:bg-slate-100 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white border border-black/5 dark:border-transparent font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all backdrop-blur-sm"
                >
                  {copied ? <Check size={16} className="text-emerald-500 transition-transform scale-110" /> : <Copy size={16} />}
                  {copied ? 'Sonuç Kopyalandı!' : 'Sonucu Kopyala'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          KDV Hesaplama Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              KDV hesaplama aracımızı kullanmak oldukça kolay ve pratiktir. İlk adım olarak, işlem yapmak istediğiniz tutar bilgisini ilgili alana eksiksiz bir şekilde girmelisiniz. Ardından, Türkiye'deki geçerli vergi dilimlerine uygun olarak sunulan %1, %10 veya %20 oranlarından işleminize uygun olanı seçmelisiniz. Son olarak, girdiğiniz tutarın "KDV Dahil" mi yoksa "KDV Hariç" mi olduğuna karar vererek "KDV Hariç ➔ Dahil" veya "KDV Dahil ➔ Hariç" seçeneklerinden birini belirleyin ve Hesapla butonuna basın. Aracımız anlık olarak çalışarak size ödenecek olan net KDV tutarını, kdv hariç ve dahil tutarları anında listeleyecektir. İşlem sonrası elde ettiğiniz bu değerleri isterseniz kolayca kopyalayabilir, faturalarınızda veya muhasebe kayıtlarınızda doğrudan kullanabilirsiniz.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">KDV Nedir ve Nasıl Hesaplanır?</h4>
            <p>
              Katma Değer Vergisi (KDV), bir malın veya hizmetin ilk üretim aşamasından son tüketiciye ulaşmasına kadar geçen süreçteki her aşamada ürüne veya hizmete katılan değer üzerinden alınan dolaylı bir vergidir. Türkiye'deki yasal düzenlemelere göre işletmeler, sattıkları mal veya hizmet üzerinden hesaplanan bu vergiyi devlete ödemekle yükümlüdür. KDV tutarı hesaplanırken, mal veya hizmetin net değeri ile kanunların belirlemiş olduğu vergi oranı çarpılır. Örneğin, KDV hariç tutarı belirli olan bir ürün için KDV dahil fiyatı bulmak istediğinizde, ürün bedeli ile oran üzerinden elde edilen çarpanı (örneğin %20 için 1.20) çarparak sonuca ulaşabilirsiniz. Tersine bir işlemde, KDV dahil fiyattan KDV hariç fiyatı bulmak için ise ürün fiyatını söz konusu çarpana bölmek yeterlidir. Doğru KDV hesaplaması yapmak, ticari hayatın sorunsuz devam etmesi ve yasal yaptırımlarla karşılaşılmaması adına hem işletmeler hem de tüketiciler için büyük bir önem taşımaktadır.
            </p>
          </section>

          <div className="pt-2">
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Kullanılan Formüller:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  KDV Dahil Hesaplama = Tutar x (1 + (Oran/100))
                  <br/>
                  KDV Hariç Hesaplama = Tutar / (1 + (Oran/100))
                </div>
              </div>
            </div>
          </div>
          
          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">2026 KDV Oranları nelerdir?</h5>
                <p>Türkiye'de güncel olarak KDV oranları üç temel dilime ayrılmış durumdadır. Genel oran %20 olarak uygulanırken, bazı temel gıda ve tekstil ürünleri gibi mal ve hizmetlerde %10 oranında indirimli KDV uygulanmaktadır. En temel tüketim maddeleri olan ekmek, un gibi yiyecek ürünlerinde ise KDV oranı en düşük dilim olan %1 olarak hesaplanmaktadır.</p>
              </div>
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Faturamda KDV tutarını nasıl ayrı gösteririm?</h5>
                <p>Fatura veya makbuz keserken hizmet veya malın brüt bedelini değil, öncelikle KDV hariç net bedelini yazmalısınız. Ardından satırdaki işlem için geçerli olan KDV oranını ve bu orana denk gelen KDV tutarını eklemelisiniz. Aracımız sayesinde hesapladığınız "KDV Tutarı" ve "KDV Hariç Tutar" değerlerini faturanızın ilgili alanlarına doğrudan yazarak hatasız bir şekilde fatura düzenleyebilirsiniz.</p>
              </div>
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">KDV hariç fiyattan KDV dahil fiyat nasıl bulunur?</h5>
                <p>KDV hariç fiyatı verilen bir ürünün KDV dahil fiyatını bulmak için, KDV hariç fiyat ürünün geçerli olduğu KDV oranı ile çarpılır. Elde edilen KDV tutarı, KDV hariç fiyata eklenerek toplam fiyata ulaşılır. Aracımız bu işlemi otomatik olarak gerçekleştirir.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <RelatedTools category="finans" currentToolId="kdv-hesaplama" />
      <Disclaimer category="finans" />
    </div>
  );
}
