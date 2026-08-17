import React, { useState, useEffect } from 'react';
import { ChevronRight, RefreshCw, Copy, Info, AlertCircle, Sparkles, Shuffle, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToolIcon } from '../../components/icons/ToolIcon';
import { AdSlot } from '../../components/ads/AdSlot';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { RelatedTools } from '../../components/tools/RelatedTools';

export default function RastgeleSayiHesaplama() {
  const [minInput, setMinInput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [maxInput, setMaxInput] = useState<string>('');
  const [countInput, setCountInput] = useState<string>('');
  const [allowDuplicates, setAllowDuplicates] = useState<boolean>(false);
  const [sortType, setSortType] = useState<'none' | 'asc' | 'desc'>('none');
  const [outputFormat, setOutputFormat] = useState<'comma' | 'space' | 'list'>('comma');

  const [generatedNumbers, setGeneratedNumbers] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generateNumbers = () => {
    const min = parseInt(minInput, 10);
    const max = parseInt(maxInput, 10);
    const count = parseInt(countInput, 10);

    if (isNaN(min) || isNaN(max) || isNaN(count)) {
      setError("Lütfen geçerli tam sayılar giriniz.");
      return;
    }

    if (min > max) {
      setError("Minimum değer, maksimum değerden büyük olamaz.");
      return;
    }

    if (count <= 0) {
      setError("Adet en az 1 olmalıdır.");
      return;
    }

    if (count > 500) {
      setError("Performans için tek seferde en fazla 500 sayı oluşturulabilir.");
      return;
    }

    const range = max - min + 1;
    if (!allowDuplicates && count > range) {
      setError(`Tekrarsız durumda ${range} sayı arasından ${count} adet benzersiz sayı üretilemez. Lütfen adedi azaltın veya 'Tekrarlı Sayılar' seçeneğini işaretleyin.`);
      return;
    }

    setError(null);

    const tempNumbers: number[] = [];
    if (!allowDuplicates) {
      // Benzersiz üretim (Fisher-Yates shuffle benzeyeni veya Set tabanlı)
      const uniqueSet = new Set<number>();
      while (uniqueSet.size < count) {
        const rand = Math.floor(Math.random() * (max - min + 1)) + min;
        uniqueSet.add(rand);
      }
      tempNumbers.push(...Array.from(uniqueSet));
    } else {
      // Tekrarlı üretim
      for (let i = 0; i < count; i++) {
        const rand = Math.floor(Math.random() * (max - min + 1)) + min;
        tempNumbers.push(rand);
      }
    }

    // Sıralama
    if (sortType === 'asc') {
      tempNumbers.sort((a, b) => a - b);
    } else if (sortType === 'desc') {
      tempNumbers.sort((a, b) => b - a);
    }

    setGeneratedNumbers(tempNumbers);
  };

  useEffect(() => {
    generateNumbers();
  }, []); // Generate once on load

  const handleClear = () => {
    setMinInput('1');
    setMaxInput('100');
    setCountInput('5');
    setAllowDuplicates(false);
    setSortType('none');
    setOutputFormat('comma');
    setError(null);
    setGeneratedNumbers([]);
  };

  const getFormattedOutput = (): string => {
    if (outputFormat === 'comma') {
      return generatedNumbers.join(', ');
    } else if (outputFormat === 'space') {
      return generatedNumbers.join(' ');
    } else {
      return generatedNumbers.map((n, idx) => `${idx + 1}. sayı: ${n}`).join('\n');
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* 1. BREADCRUMB */}
      <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <Link to="/" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Ana Sayfa</Link>
        <ChevronRight size={14} />
        <Link to="/kategori/matematik" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors capitalize">Matematik</Link>
        <ChevronRight size={14} />
        <span className="text-slate-800 dark:text-slate-300">Rastgele Sayı Hesaplama</span>
      </div>

      {/* 2. BAŞLIK VE AÇIKLAMA */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Rastgele Sayı Hesaplama ve Üretici 2026 - Ücretsiz ve Hızlı Sonuçlar</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Belirlediğiniz aralıkta, benzersiz veya tekrarlı rastgele sayılar üretin. Sıralama ve farklı çıktı formatlarıyla projelerinizde veya çekilişlerinizde kullanın.
        </p>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      {/* HESAPLAMA KAPSAYICISI */}
      <div className="calculator-container mb-8 relative border-4 border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-8 mt-8">
        <div className="absolute -top-4 left-4 sm:left-8 bg-[#eef2f7] dark:bg-slate-950 px-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shuffle size={20} className="text-[#0056b3] dark:text-blue-400" />
            Rastgele Sayı Üretici
          </h2>
        </div>

        {/* 3. ANA UYGULAMA ALANI */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          {/* SOL: Kontroller */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                Seçenekler
              </h3>
              <button onClick={handleClear} className="text-[12px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1.5 transition-colors">
                <RefreshCw size={12} /> Sıfırla
              </button>
            </div>

            {error && (
              <div className="mb-5 p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl flex items-center gap-3 text-sm font-semibold border border-rose-100 dark:border-rose-800">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Aralık */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Min Değer</label>
                  <input placeholder="Örn: 1"
                    type="number"
                    value={minInput}
                    onChange={(e) => setMinInput(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-slate-800 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Max Değer</label>
                  <input placeholder="Örn: 100"
                    type="number"
                    value={maxInput}
                    onChange={(e) => setMaxInput(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-slate-800 dark:text-white font-bold"
                  />
                </div>
              </div>

              {/* Adet */}
              <div>
                <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Kaç Adet Sayı?</label>
                <input placeholder="Örn: 5"
                  type="number"
                  value={countInput}
                  onChange={(e) => setCountInput(e.target.value)}
                  min="1"
                  max="500"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-slate-800 dark:text-white font-bold"
                />
              </div>

              {/* Tekrarlı Switch */}
              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-black/5 dark:border-white/5">
                  <input
                    type="checkbox"
                    checked={allowDuplicates}
                    onChange={(e) => setAllowDuplicates(e.target.checked)}
                    className="w-4 h-4 text-[#0056b3] rounded border-slate-300 focus:ring-[#0056b3]"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Aynı Sayılar Tekrar Edebilsin
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      İşaretlenmezse tüm sayılar benzersiz olur
                    </span>
                  </div>
                </label>
              </div>

              {/* Sıralama */}
              <div>
                <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Sıralama</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSortType('none')}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      sortType === 'none'
                        ? 'bg-[#0056b3] text-white border-[#0056b3]'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Karışık
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortType('asc')}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      sortType === 'asc'
                        ? 'bg-[#0056b3] text-white border-[#0056b3]'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Artan
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortType('desc')}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      sortType === 'desc'
                        ? 'bg-[#0056b3] text-white border-[#0056b3]'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Azalan
                  </button>
                </div>
              </div>

              {/* Çıktı Formatı */}
              <div>
                <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Çıktı Formatı</label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-slate-800 dark:text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 focus:border-[#0056b3]"
                >
                  <option value="comma">Virgülle Ayrılmış (1, 2, 3)</option>
                  <option value="space">Boşlukla Ayrılmış (1 2 3)</option>
                  <option value="list">Alt Alta Liste</option>
                </select>
              </div>

              {/* Üret Butonu */}
              <button
                onClick={generateNumbers}
                className="w-full bg-gradient-to-r from-[#0056b3] to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Shuffle size={18} /> Sayıları Üret
              </button>
            </div>
          </div>

          {/* SAĞ: Sonuçlar */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 flex-1 relative overflow-hidden shadow-lg border border-black/5 dark:border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4 border-b border-black/5 dark:border-white/5 pb-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">ÜRETİLEN SAYILAR</h3>
              </div>

              {generatedNumbers.length > 0 ? (
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  {/* Sayı Bulut Gridi (Görsel Zenginlik) */}
                  <div className="flex flex-wrap gap-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border max-h-[180px] overflow-y-auto">
                    {generatedNumbers.map((num, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center justify-center min-w-[40px] h-[40px] px-2.5 rounded-xl font-bold font-mono bg-white dark:bg-slate-900 text-slate-800 dark:text-white border shadow-sm transition-all hover:scale-110"
                      >
                        {num}
                      </span>
                    ))}
                  </div>

                  {/* Kopyalamaya Uygun Çıktı */}
                  <div className="flex-1 flex flex-col">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Düz Metin Çıktısı</span>
                    <textarea
                      readOnly
                      value={getFormattedOutput()}
                      rows={6}
                      className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-3 font-mono text-sm text-slate-700 dark:text-slate-300 focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={() => {
    navigator.clipboard.writeText(getFormattedOutput());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }}
  className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white border border-black/5 dark:border-transparent font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all backdrop-blur-sm active:scale-[0.98] text-sm"
  >
  {copied ? <Check size={16} className="text-emerald-500 transition-transform scale-110" /> : <Copy size={16} />}
  {copied ? 'Sonuç Kopyalandı!' : 'Tümünü Kopyala'}
                  </button>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400">
                  Sayı üretmek için soldaki butona basın.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      {/* 4. SEO & BİLGİLENDİRME ALANI */}
      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Rastgele Sayı Üretimi Nedir?
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Rastgelelik Tanımı</h4>
            <p>
              Bir sayı dizisinde, sıradaki sayının daha önceki sayılara bağlı olarak tahmin edilemez olması durumuna <strong>rastgele sayı üretimi</strong> (Random Number Generation - RNG) denir. Bilgisayarlar genellikle pseudo-random (yalancı rastgele) algoritmalar kullanarak sayılar üretir. Bu sayılar istatistiksel açıdan eşit dağılımlıdır ve günlük çekilişler, oyunlar veya test senaryoları için tamamen yeterlidir.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3 font-semibold">Benzersiz (Tekrarsız) ve Tekrarlı Üretim</h4>
            <p>
              Çekiliş veya grup eşleştirmeleri yaparken genellikle her sayının bir kez çıkması matches (`tekrarsız`). Ancak zarların atılması gibi olasılık deneylerinde veya her seçimin bağımsız olduğu durumlarda aynı sayıların tekrar çıkabilmesi (`tekrarlı`) istenir.
            </p>
          </section>

          
          <div className="pt-2">
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Kullanılan Formüller:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  Rastgele Sayı = Min + (Random(0,1) × (Max - Min))
                </div>
              </div>
            </div>
          </div>
          
          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4 font-semibold">Sıkça Sorulan Sorular (FAQ)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2 font-semibold">Rastgele sayılar güvenli midir?</h5>
                <p>Bu araç standart bilgisayar kütüphanelerini kullanarak hızlı sayılar üretir. Kriptografik veya şifreleme anahtarı üretimi gibi yüksek güvenlikli finansal işlemler için değil, oyun, çekiliş, ders ve karar verme durumları için tasarlanmıştır.</p>
              </div>
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2 font-semibold">Olasılık dağılımı nasıldır?</h5>
                <p>Üretilen tüm tam sayılar eşit olasılığa sahiptir (Düzgün Dağılım - Uniform Distribution). Dolayısıyla her sayının çıkma ihtimali birbiriyle tamamen aynıdır.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* 5. DİĞER ARAÇLAR */}
      
      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Rastgele Sayı Hesaplama ve Üretici Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              Rastgele Sayı Hesaplama ve Üretici aracını kullanmak son derece basit ve kullanıcı dostudur. İlgili form alanlarına elinizdeki verileri eksiksiz ve doğru bir şekilde girdiğinizden emin olun. Tüm alanları doldurduktan sonra "Hesapla" butonuna tıklayarak sonuçları anında görüntüleyebilirsiniz. Aracımız, girdiğiniz değerleri anlık olarak işler ve herhangi bir sayfaya yönlendirme yapmadan, bulunduğunuz ekran üzerinde size en net ve kesin verileri sunar. İhtiyaç duyduğunuz her an bu aracı tamamen ücretsiz olarak kullanabilir, dilerseniz sonuçları kopyalayarak farklı platformlarda kolayca paylaşabilirsiniz. Zaman kaybetmeden, en karmaşık hesaplamaları bile saniyeler içinde tamamlamanın ayrıcalığını yaşayın.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Rastgele Sayı Hesaplama ve Üretici Nedir ve Nasıl Hesaplanır?</h4>
            <p>
              Rastgele Sayı Hesaplama ve Üretici, kullanıcıların günlük hayatta veya profesyonel iş süreçlerinde sıklıkla ihtiyaç duyduğu matematiksel veya istatistiksel hesaplamaları pratik bir şekilde çözmek amacıyla geliştirilmiş kapsamlı bir dijital araçtır. Geleneksel yöntemlerle yapıldığında hata payı yüksek olan ve uzun zaman alan bu tür işlemler, gelişmiş altyapımız sayesinde otomatik olarak hatasız bir biçimde gerçekleştirilir. 
            </p>
            <p className="mt-4">
              Hesaplama arka planda, genel kabul görmüş evrensel formüller, en güncel yasal mevzuatlar veya resmi olarak açıklanmış standart oranlar kullanılarak yapılmaktadır. Veriler sisteme girildiği anda, algoritma bu güncel parametreleri referans alarak verilerinizi analiz eder ve sonuçları net bir şekilde ekranınıza yansıtır. Finansal, istatistiksel veya gündelik hesaplamalar fark etmeksizin her daim doğru ve güvenilir bilgiye ulaşmanız hedeflenmektedir. Bu aracı kullanarak iş akışınızı hızlandırabilir ve hata payını sıfıra indirebilirsiniz.
            </p>
          </section>

          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular (SSS)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Rastgele Sayı Hesaplama ve Üretici aracı ücretli midir?</h5>
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
      <RelatedTools category="matematik" currentToolId="rastgele-sayi-hesaplama" />

      {/* 6. SORUMLULUK REDDİ */}
      <Disclaimer category="matematik" />
    </div>
  );
}
