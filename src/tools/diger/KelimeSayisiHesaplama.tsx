import React, { useState } from 'react';
import { ChevronRight, RefreshCw, Copy, Info, AlignLeft, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToolIcon } from '../../components/icons/ToolIcon';
import { AdSlot } from '../../components/ads/AdSlot';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { RelatedTools } from '../../components/tools/RelatedTools';

export default function KelimeSayisiHesaplama() {
  const [metin, setMetin] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const temizMetin = metin.trim();
  const kelimeSayisi = temizMetin === '' ? 0 : temizMetin.split(/\s+/).length;
  const karakterSayisi = metin.length;
  const bosluksuzKarakter = metin.replace(/\s/g, '').length;
  const cumleSayisi = temizMetin === '' ? 0 : (metin.match(/[.!?]+(?:\s|$)/g) || []).length || (temizMetin.length > 0 ? 1 : 0);
  const paragrafSayisi = temizMetin === '' ? 0 : metin.split(/\n+/).filter(p => p.trim().length > 0).length;
  const tahminiOkumaSuresiDk = Math.max(1, Math.ceil(kelimeSayisi / 200));

  const handleClear = () => {
    setMetin('');
    setCopied(false);
  };

  const handleCopy = () => {
    if (!metin) return;
    const text = `Kelime Sayısı: ${kelimeSayisi} | Karakter Sayısı: ${karakterSayisi} | Boşluksuz: ${bosluksuzKarakter} | Cümle: ${cumleSayisi} | Paragraf: ${paragrafSayisi}`;
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
        <span className="text-slate-800 dark:text-slate-300">Kelime Sayısı Hesaplama</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Kelime Sayısı Hesaplama 2026 - Karakter ve Cümle Sayacı</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Metinlerinizin kelime, karakter, boşluksuz karakter, cümle ve paragraf sayısını anlık ve ücretsiz olarak analiz edin.
        </p>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      <div className="calculator-container mb-8 relative border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-8 mt-8">
        <div className="absolute -top-3.5 left-4 sm:left-8 bg-[#eef2f7] dark:bg-slate-950 px-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ToolIcon name="diger" size={20} className="text-[#0056b3] dark:text-blue-400" />
            Metin Analiz Sayacı
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <AlignLeft size={18} className="text-[#0056b3] dark:text-blue-400" />
                Metninizi Yapıştırın veya Yazın
              </h2>
              <button 
                onClick={handleClear}
                className="text-[12px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw size={12} /> Temizle
              </button>
            </div>

            <div className="space-y-4">
              <textarea
                value={metin}
                onChange={(e) => setMetin(e.target.value)}
                placeholder="Örn: Analiz etmek istediğiniz metni, makaleyi, tezi veya denemeyi bu alana yapıştırın ya da yazmaya başlayın..."
                rows={8}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3.5 text-slate-700 dark:text-white font-normal focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all resize-y text-sm leading-relaxed"
              />
              
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium pt-1">
                <span>Tahmini Okuma Süresi: <strong className="text-slate-800 dark:text-slate-200">{kelimeSayisi > 0 ? `~${tahminiOkumaSuresiDk} dk` : '0 dk'}</strong></span>
                <span>{karakterSayisi} Karakter</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 md:p-8 flex-1 relative shadow-lg border border-black/5 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-white mb-5">Metin İstatistikleri</h3>
                
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-3.5 bg-blue-50/60 dark:bg-blue-900/20 border border-blue-100/60 dark:border-blue-800/40 rounded-2xl text-center">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-0.5">Kelime Sayısı</span>
                    <span className="text-2xl font-black text-[#0056b3] dark:text-blue-400">{kelimeSayisi.toLocaleString('tr-TR')}</span>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-black/5 dark:border-white/5 rounded-2xl text-center">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-0.5">Toplam Karakter</span>
                    <span className="text-2xl font-black text-slate-800 dark:text-white">{karakterSayisi.toLocaleString('tr-TR')}</span>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-black/5 dark:border-white/5 rounded-2xl text-center">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-0.5">Boşluksuz</span>
                    <span className="text-xl font-extrabold text-slate-700 dark:text-slate-200">{bosluksuzKarakter.toLocaleString('tr-TR')}</span>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-black/5 dark:border-white/5 rounded-2xl text-center">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-0.5">Cümle Sayısı</span>
                    <span className="text-xl font-extrabold text-slate-700 dark:text-slate-200">{cumleSayisi.toLocaleString('tr-TR')}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-black/5 dark:border-white/5 rounded-2xl flex justify-between items-center mb-4">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Paragraf Sayısı</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white">{paragrafSayisi}</span>
                </div>
              </div>

              <div>
                <button 
                  onClick={handleCopy}
                  disabled={kelimeSayisi === 0}
                  className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                  {copied ? 'Sonuçlar Kopyalandı!' : 'İstatistikleri Kopyala'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Kelime ve Karakter Sayacı Rehberi
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Akademik makaleler, tezler, ödevler, SEO blog yazıları, sosyal medya gönderileri ve çeviri metinlerinde kelime veya karakter sınırlarını anlık olarak takip etmek için bu aracı kullanabilirsiniz.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Kelime Sayısı Hesaplama Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              Kelime Sayısı Hesaplama aracını kullanmak son derece pratik ve zahmetsizdir. İncelemek istediğiniz metni doğrudan metin kutusuna yapıştırabilir veya klavyenizle yazmaya başlayabilirsiniz. Siz metin girdikçe sistem anlık olarak kelime, karakter, boşluksuz karakter, cümle ve paragraf sayılarını hesaplar. Herhangi bir butona basmanıza gerek kalmadan tüm analizler eşzamanlı olarak ekranınızda güncellenir. İhtiyaç duyduğunuzda "İstatistikleri Kopyala" butonuna basarak metin verilerini tek tıkla panonuza alabilirsiniz.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Kelime Sayısı Hesaplama Nedir ve Nasıl Hesaplanır?</h4>
            <p>
              Kelime Sayısı Hesaplama, yazarların, öğrencilerin, içerik üreticilerinin ve dijital pazarlamacıların metin hacimlerini optimize etmelerini sağlayan temel bir analiz aracıdır. Özellikle Twitter, Instagram veya Google Meta açıklamaları gibi belirli karakter limitlerinin bulunduğu platformlarda ya da belirli kelime kotalarına sahip akademik çalışmalarda metin uzunluğunu doğru tespit etmek kritik öneme sahiptir.
            </p>
            <p className="mt-4">
              Hesaplama algoritması, metin içerisindeki boşluk karakterlerini (space, tab, yeni satır) ayrıştırıcı kabul ederek bağımsız kelime gruplarını sayar. Karakter sayısı ise metindeki harf, rakam, noktalama işareti ve sembollerin toplamını temsil eder. Ayrıca ortalama bir yetişkinin dakikada 200-250 kelime okuduğu kabul edilerek yaklaşık okuma süresi de hesaplanmaktadır.
            </p>
          </section>

          <div className="pt-2">
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Kullanılan Formüller:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  Kelime Sayısı = Metin içerisindeki boşluklarla ayrılmış sözcük öbeklerinin toplam adedi. <br />
                  Tahmini Okuma Süresi (Dk) = Toplam Kelime Sayısı / 200 (Ortalama yetişkin okuma hızı).
                </div>
              </div>
            </div>
          </div>

          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular (SSS)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Metin gizliliğim güvende mi?</h5>
                <p>Evet, girdiğiniz hiçbir metin sunucularımıza gönderilmez veya saklanmaz. Tüm analiz işlemleri tamamen tarayıcınızın kendi belleğinde (istemci tarafında) anlık olarak işlenir.</p>
              </div>
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Boşluksuz karakter sayısı neden önemlidir?</h5>
                <p>Çeviri sektöründe (tercüme büroları) ve bazı resmi yazışmalarda fiyatlandırma veya kabul kriterleri genellikle boşluksuz 1000 karakter birimi üzerinden belirlenir.</p>
              </div>
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Kelime sayacı aracı ücretsiz midir?</h5>
                <p>Platformumuzda sunulan kelime ve karakter sayacı dahil olmak üzere tüm araçlarımız sınırsız ve %100 ücretsizdir.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <RelatedTools category="diger" currentToolId="kelime-sayisi-hesaplama" />
      <div className="mt-8">
        <Disclaimer category="diger" />
      </div>
    </div>
  );
}
