import os

template = """import React, { useState } from 'react';
import { ChevronRight, RefreshCw, Copy, Info, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToolIcon } from '../../components/icons/ToolIcon';
import { AdSlot } from '../../components/ads/AdSlot';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { RelatedTools } from '../../components/tools/RelatedTools';

export default function {COMPONENT_NAME}() {
  const [tutar, setTutar] = useState<number | ''>('');
  const [vade, setVade] = useState<number | ''>('');
  const [faizOrani, setFaizOrani] = useState<number | ''>('');
  
  const [sonuc, setSonuc] = useState<{
    aylikTaksit: number;
    toplamGeriOdeme: number;
    toplamFaiz: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hesapla = () => {
    if (tutar === '' || vade === '' || faizOrani === '') {
      setError("*Lütfen tüm alanları doldurun.");
      setSonuc(null);
      return;
    }
    if (tutar <= 0 || vade <= 0 || faizOrani <= 0) {
      setError("*Tüm değerler 0'dan büyük olmalıdır.");
      setSonuc(null);
      return;
    }
    setError(null);
    
    const P = Number(tutar);
    const n = Number(vade);
    const r = Number(faizOrani) / 100; // Aylık faiz
    
    let aylikTaksit = 0;
    
    if (r === 0) {
      aylikTaksit = P / n;
    } else {
      aylikTaksit = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
    
    const toplamGeriOdeme = aylikTaksit * n;
    const toplamFaiz = toplamGeriOdeme - P;

    setSonuc({
      aylikTaksit,
      toplamGeriOdeme,
      toplamFaiz
    });
  };

  const temizle = () => {
    setTutar('');
    setVade('');
    setFaizOrani('');
    setSonuc(null);
    setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <Link to="/" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Ana Sayfa</Link>
        <ChevronRight size={14} />
        <Link to="/kategori/kredi" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors capitalize">Kredi</Link>
        <ChevronRight size={14} />
        <span className="text-slate-800 dark:text-slate-300">{TITLE}</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">{TITLE}</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          {DESCRIPTION}
        </p>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      <div className="calculator-container mb-8 relative border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-8 mt-8">
        <div className="absolute -top-3.5 left-4 sm:left-8 bg-[#eef2f7] dark:bg-slate-950 px-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ToolIcon name="hesap-makinesi" size={20} className="text-[#0056b3] dark:text-blue-400" />
            {TITLE}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                Kredi Detayları
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
                  Kredi Tutarı (TL) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  value={tutar}
                  onChange={(e) => {
                    setTutar(e.target.value === '' ? '' : Number(e.target.value));
                    setError(null);
                  }}
                  placeholder="Örn: 50000" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  Vade (Ay) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  value={vade}
                  onChange={(e) => {
                    setVade(e.target.value === '' ? '' : Number(e.target.value));
                    setError(null);
                  }}
                  placeholder="Örn: 36" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  Aylık Faiz Oranı (%) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  value={faizOrani}
                  onChange={(e) => {
                    setFaizOrani(e.target.value === '' ? '' : Number(e.target.value));
                    setError(null);
                  }}
                  placeholder="Örn: 2.5" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-700 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all"
                />
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
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-white">Geri Ödeme Planı Özeti</h3>
                </div>

                <div className="flex-1 flex flex-col justify-center gap-6">
                  {sonuc !== null ? (
                    <>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs mb-1 font-bold uppercase">Aylık Taksit Tutarı</p>
                        <div className="text-4xl font-black tracking-tighter text-[#0056b3] dark:text-blue-400">
                          {sonuc.aylikTaksit.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} <span className="text-2xl text-slate-500">TL</span>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-black/10 dark:border-white/10">
                        <p className="text-slate-500 dark:text-slate-400 text-xs mb-1 font-bold uppercase">Toplam Geri Ödeme</p>
                        <div className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white">
                          {sonuc.toplamGeriOdeme.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs mb-1 font-bold uppercase">Toplam Faiz Tutarı</p>
                        <div className="text-xl font-bold tracking-tighter text-rose-600 dark:text-rose-400">
                          {sonuc.toplamFaiz.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-slate-400">Detayları görmek için değerleri girin</div>
                  )}
                </div>

                <button 
                  onClick={() => {
                    if (sonuc !== null) {
                      const text = `Aylık Taksit: ${sonuc.aylikTaksit.toFixed(2)} TL | Toplam Ödeme: ${sonuc.toplamGeriOdeme.toFixed(2)} TL | Toplam Faiz: ${sonuc.toplamFaiz.toFixed(2)} TL`;
                      navigator.clipboard.writeText(text);
                    }
                  }}
                  className="w-full mt-8 bg-slate-50 hover:bg-slate-100 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white border border-black/5 dark:border-transparent font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all backdrop-blur-sm"
                >
                  <Copy size={16} /> Sonucu Kopyala
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
          {TITLE} Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              Çekmek istediğiniz kredi tutarını, aylık vade sayısını ve bankanın size sunduğu aylık faiz oranını ilgili alanlara girin. "Hesapla" butonuna bastığınızda aylık taksit tutarınızı, toplam geri ödeme tutarınızı ve toplam faiz maliyetinizi anında öğrenebilirsiniz.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">{TITLE} Nedir ve Nasıl Hesaplanır?</h4>
            <p>
              {LONG_DESC}
            </p>
          </section>

          <div className="pt-2">
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Kullanılan Formüller (Sabit Taksitli Kredi):</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  Aylık Taksit = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
                  <br/><br/>
                  P = Kredi Tutarı, r = Aylık Faiz Oranı, n = Vade Sayısı
                </div>
                <p className="text-xs mt-2 text-slate-500">Not: Bankalar BSMV ve KKDF gibi vergileri veya tahsis ücretlerini ayrıca yansıtabilir.</p>
              </div>
            </div>
          </div>
          
          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Bu sonuçlar kesin midir?</h5>
                <p>Aracımız standart sabit taksitli tüketici kredisi formülünü kullanır. Bankanızın uygulayabileceği ek vergiler (BSMV, KKDF), dosya masrafları ve sigorta bedelleri nedeniyle küçük farklar oluşabilir.</p>
              </div>
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Vadeyi uzatmak mantıklı mı?</h5>
                <p>Vade uzadıkça aylık taksit tutarı düşer ancak toplam ödenecek faiz miktarı artar. Ödeme gücünüze göre en optimum vadeyi seçmek önemlidir.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <RelatedTools category="kredi" currentToolId="{TOOL_ID}" />
      <Disclaimer category="kredi" />
    </div>
  );
}
"""

ihtiyac = template.replace("{COMPONENT_NAME}", "IhtiyacKredisi")\
                  .replace("{TITLE}", "İhtiyaç Kredisi Hesaplama")\
                  .replace("{DESCRIPTION}", "Kişisel ihtiyaçlarınız için çekeceğiniz kredinin aylık taksitlerini, toplam geri ödeme miktarını ve faiz yükünü anında hesaplayın.")\
                  .replace("{LONG_DESC}", "İhtiyaç kredisi, tüketicilerin kişisel ihtiyaçlarını karşılamak amacıyla bankalardan veya finans kuruluşlarından temin ettikleri kredidir. Bu hesaplama aracı, sabit taksitli kredi hesaplama formülü kullanarak, aylık taksitleri eşit olarak böler.")\
                  .replace("{TOOL_ID}", "ihtiyac-kredisi")

konut = template.replace("{COMPONENT_NAME}", "KonutKredisi")\
                .replace("{TITLE}", "Konut Kredisi Hesaplama")\
                .replace("{DESCRIPTION}", "Ev satın almak için kullanacağınız konut kredisinin (mortgage) geri ödeme planını, taksitlerini ve toplam maliyetini kolayca öğrenin.")\
                .replace("{LONG_DESC}", "Konut kredisi (mortgage), tüketicilerin ev satın almak için gayrimenkulü ipotek göstererek bankalardan kullandıkları uzun vadeli finansmandır. Genellikle diğer kredi türlerine göre daha düşük faiz oranlarına ve uzun vadeli ödeme planlarına sahiptir.")\
                .replace("{TOOL_ID}", "konut-kredisi")

tasit = template.replace("{COMPONENT_NAME}", "TasitKredisi")\
                .replace("{TITLE}", "Taşıt Kredisi Hesaplama")\
                .replace("{DESCRIPTION}", "Yeni veya 2. el araç alımlarınızda kullanacağınız taşıt kredisinin aylık ödeme planını ve faiz detaylarını hesaplayın.")\
                .replace("{LONG_DESC}", "Taşıt kredisi, sıfır veya ikinci el otomobil, ticari araç veya motosiklet alımlarını finanse etmek için kullanılan bireysel bir kredi türüdür. Araç genellikle kredi süresi boyunca banka tarafından rehin alınır.")\
                .replace("{TOOL_ID}", "tasit-kredisi")

with open("src/tools/kredi/IhtiyacKredisi.tsx", "w") as f: f.write(ihtiyac)
with open("src/tools/kredi/KonutKredisi.tsx", "w") as f: f.write(konut)
with open("src/tools/kredi/TasitKredisi.tsx", "w") as f: f.write(tasit)
