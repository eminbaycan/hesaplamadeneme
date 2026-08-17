import React, { useState, useEffect } from 'react';
import { ChevronRight, RefreshCw, Copy, Info, AlertCircle, Sparkles, Languages, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdSlot } from '../../components/ads/AdSlot';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { RelatedTools } from '../../components/tools/RelatedTools';

export default function SayiOkunusuHesaplama() {
  const [numberInput, setNumberInput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [resultText, setResultText] = useState<string>('');
  const [romanText, setRomanText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const units = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'];
  const tens = ['', 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'yetmiş', 'seksen', 'doksan'];
  const groups = ['', 'bin', 'milyon', 'milyar', 'trilyon', 'katrilyon', 'kentilyon', 'sekstilyon', 'septilyon'];

  // Convert Roman Numeral
  const toRoman = (num: number): string => {
    if (num <= 0 || num > 3999) return 'Roma rakamı karşılığı 1-3999 arası sayılar için geçerlidir.';
    const romanMap: [number, string][] = [
      [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
      [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
      [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
    ];
    let result = '';
    let remaining = num;
    for (const [val, char] of romanMap) {
      while (remaining >= val) {
        result += char;
        remaining -= val;
      }
    }
    return result;
  };

  // Convert 3-digit group to Turkish text
  const convertThreeDigits = (num: number): string => {
    let text = '';
    const hundreds = Math.floor(num / 100);
    const tenVal = Math.floor((num % 100) / 10);
    const unitVal = num % 10;

    if (hundreds > 0) {
      if (hundreds === 1) {
        text += 'yüz ';
      } else {
        text += units[hundreds] + ' yüz ';
      }
    }

    if (tenVal > 0) {
      text += tens[tenVal] + ' ';
    }

    if (unitVal > 0) {
      text += units[unitVal] + ' ';
    }

    return text.trim();
  };

  // Main converter function
  const convertNumberToTurkish = (input: string): string => {
    const cleaned = input.trim();
    if (!cleaned) return '';

    // Handle negative
    let isNegative = false;
    let numberPart = cleaned;
    if (cleaned.startsWith('-')) {
      isNegative = true;
      numberPart = cleaned.substring(1);
    }

    // Check decimals
    const parts = numberPart.split(/[,.]/);
    if (parts.length > 2) {
      throw new Error('Geçersiz sayı formatı. En fazla bir adet virgül veya nokta kullanabilirsiniz.');
    }

    const integerPart = parts[0];
    const decimalPart = parts[1] || '';

    if (!/^\d+$/.test(integerPart) || (decimalPart && !/^\d+$/.test(decimalPart))) {
      throw new Error('Lütfen sadece sayısal karakterler giriniz.');
    }

    if (integerPart.length > 27) {
      throw new Error('Çok büyük bir sayı girdiniz. Maksimum 27 basamağa kadar desteklenmektedir.');
    }

    // Convert integer part
    let intVal = BigInt(integerPart);
    if (intVal === 0n) {
      return isNegative ? 'eksi sıfır' : 'sıfır';
    }

    let words = '';
    let groupIdx = 0;
    let tempPart = integerPart;

    while (tempPart.length > 0) {
      const sliceLen = tempPart.length % 3 || 3;
      const groupStr = tempPart.substring(0, sliceLen);
      tempPart = tempPart.substring(sliceLen);

      const groupNum = parseInt(groupStr, 10);
      const groupName = groups[Math.floor((tempPart.length) / 3)];

      if (groupNum > 0) {
        let groupText = convertThreeDigits(groupNum);
        
        // "bir bin" control: in Turkish, we say "bin", not "bir bin" for thousands group
        if (groupNum === 1 && groupName === 'bin') {
          words += 'bin ';
        } else {
          words += groupText + ' ' + groupName + ' ';
        }
      }
    }

    words = words.replace(/\s+/g, ' ').trim();

    // Convert decimal part if exists
    let decimalWords = '';
    if (decimalPart && parseInt(decimalPart, 10) > 0) {
      // Find the scale name (onda, yüzde, binde, on binde...)
      const scalePower = decimalPart.length;
      let scaleName = '';
      if (scalePower === 1) scaleName = 'onda';
      else if (scalePower === 2) scaleName = 'yüzde';
      else if (scalePower === 3) scaleName = 'binde';
      else if (scalePower === 4) scaleName = 'on binde';
      else if (scalePower === 5) scaleName = 'yüz binde';
      else if (scalePower === 6) scaleName = 'milyonda';
      else scaleName = `10 üzeri ${scalePower}da`;

      // Convert decimal digits to words
      let decWords = '';
      let tempDec = decimalPart;
      while (tempDec.length > 0) {
        const sliceLen = tempDec.length % 3 || 3;
        const groupStr = tempDec.substring(0, sliceLen);
        tempDec = tempDec.substring(sliceLen);
        const groupNum = parseInt(groupStr, 10);
        const groupName = groups[Math.floor((tempDec.length) / 3)];

        if (groupNum > 0) {
          let groupText = convertThreeDigits(groupNum);
          if (groupNum === 1 && groupName === 'bin') {
            decWords += 'bin ';
          } else {
            decWords += groupText + ' ' + groupName + ' ';
          }
        }
      }
      decWords = decWords.replace(/\s+/g, ' ').trim();
      decimalWords = ' tam ' + scaleName + ' ' + decWords;
    }

    let finalSpelling = (isNegative ? 'eksi ' : '') + words + decimalWords;
    return finalSpelling.replace(/\s+/g, ' ').trim();
  };

  const handleCalculate = () => {
    try {
      setError(null);
      const output = convertNumberToTurkish(numberInput);
      setResultText(output);

      // Roman Numeral Conversion (only for integers within 1-3999 range)
      const parsed = parseFloat(numberInput);
      if (!isNaN(parsed) && parsed > 0 && parsed <= 3999 && Number.isInteger(parsed)) {
        setRomanText(toRoman(parsed));
      } else {
        setRomanText('');
      }
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu.');
      setResultText('');
      setRomanText('');
    }
  };

  useEffect(() => {
    handleCalculate();
  }, [numberInput]);

  const handleClear = () => {
    setNumberInput('');
    setResultText('');
    setRomanText('');
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
        <span className="text-slate-800 dark:text-slate-300">Sayı Okunuşu Hesaplama</span>
      </div>

      {/* 2. BAŞLIK VE AÇIKLAMA */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 font-black">Sayı Okunuşu Hesaplama 2026 - Ücretsiz ve Hızlı Sonuçlar</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Girdiğiniz herhangi bir tam, ondalık veya negatif sayının Türkçe dilindeki doğru okunuşunu, yazılış kurallarını ve varsa Roma rakamı karşılığını saniyeler içinde öğrenin.
        </p>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      {/* HESAPLAMA KAPSAYICISI */}
      <div className="calculator-container mb-8 relative border-4 border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-8 mt-8">
        <div className="absolute -top-4 left-4 sm:left-8 bg-[#eef2f7] dark:bg-slate-950 px-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-bold">
            <Languages size={20} className="text-[#0056b3] dark:text-blue-400" />
            Sayıyı Metne Çevirici
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          {/* SOL PANEL */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase">
                Girdiler
              </h3>
              <button onClick={handleClear} className="text-[12px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1.5 transition-colors">
                <RefreshCw size={12} /> Temizle
              </button>
            </div>

            {error && (
              <div className="mb-5 p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl flex items-center gap-3 text-sm font-semibold border border-rose-100 dark:border-rose-800">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase">
                  Sayı Giriniz
                </label>
                <input
                  type="text"
                  value={numberInput}
                  onChange={(e) => setNumberInput(e.target.value)}
                  placeholder="Örn: 1234,56 veya -987"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 focus:border-[#0056b3]"
                />
              </div>

              <div className="pt-2">
                <span className="block text-[11px] font-bold text-slate-400 uppercase mb-2">Hızlı Örnekler</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setNumberInput('1000000')}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-black/5 dark:border-white/5"
                  >
                    1 Milyon
                  </button>
                  <button
                    type="button"
                    onClick={() => setNumberInput('1923')}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-black/5 dark:border-white/5"
                  >
                    Cumhuriyet Yılı (1923)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNumberInput('0,75')}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-black/5 dark:border-white/5"
                  >
                    Sıfır tam yüzde yetmiş beş (0,75)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNumberInput('-450')}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-black/5 dark:border-white/5"
                  >
                    Eksi Değer (-450)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SAĞ PANEL */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 flex-1 relative overflow-hidden shadow-lg border border-black/5 dark:border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4 border-b border-black/5 dark:border-white/5 pb-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">TÜRKÇE OKUNUŞU</h3>
              </div>

              {resultText ? (
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <div className="bg-emerald-50/60 dark:bg-emerald-900/10 border border-emerald-100/60 dark:border-emerald-900/20 p-5 rounded-2xl flex-1 flex flex-col justify-center">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Doğru Yazılış</span>
                    <div className="text-xl sm:text-2xl font-black text-emerald-800 dark:text-emerald-400 leading-relaxed break-words capitalize">
                      {resultText}
                    </div>
                  </div>

                  {romanText && (
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase block">Roma Rakamı Karşılığı</span>
                        <div className="text-xl font-bold font-serif text-[#0056b3] dark:text-blue-400 mt-1">
                          {romanText}
                        </div>
                      </div>
                      <span className="text-xs text-slate-400">Romen Rakamı</span>
                    </div>
                  )}

                  <button
                    onClick={() => {
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }}
  className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white border border-black/5 dark:border-transparent font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all backdrop-blur-sm active:scale-[0.98] text-sm"
  >
  {copied ? <Check size={16} className="text-emerald-500 transition-transform scale-110" /> : <Copy size={16} />}
  {copied ? 'Sonuç Kopyalandı!' : 'Yazılışı Kopyala'}
                  </button>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 flex-1 flex items-center justify-center">
                  Lütfen geçerli bir sayı giriniz.
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
          Sayıların Okunuş Kuralları Nelerdir?
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3 font-semibold">Yazım Kuralları</h4>
            <p>
              Türkçe imla kurallarına göre sayılar harflerle yazılırken her bir kelimenin <strong>ayrı yazılması</strong> esastır. Örneğin, <code>"yüz yirmi üç"</code> şeklinde yazılmalıdır; birleşik yazım (yüzyirmiüç) sadece çek, senet ve bankacılık belgelerinde suistimalleri önlemek amacıyla kullanılır.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3 font-semibold">Ondalık Sayıların Okunuşu</h4>
            <p>
              Ondalık sayıların yazımında tam kısımdan sonra gelen kısım basamak sayısına göre okunur:
            </p>
            <ul className="space-y-2 pl-4 list-disc">
              <li>Virgülden sonra 1 basamak varsa: <strong>Onda</strong> (Örn: 0,5 = Sıfır tam onda beş)</li>
              <li>Virgülden sonra 2 basamak varsa: <strong>Yüzde</strong> (Örn: 0,12 = Sıfır tam yüzde on iki)</li>
              <li>Virgülden sonra 3 basamak varsa: <strong>Binde</strong> (Örn: 0,005 = Sıfır tam binde beş)</li>
            </ul>
          </section>

          
          <div className="pt-2">
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Kullanılan Formüller:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  Sayısal değerin her üçlü basamak grubuna (Birler, Binler, Milyonlar vb.) ayrılması ve rakamların sözlüksel karşılıklarının birleştirilmesi algoritması.
                </div>
              </div>
            </div>
          </div>
          
          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4 font-semibold">Sıkça Sorulan Sorular (FAQ)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2 font-semibold">Sıfırdan küçük sayılar (Negatif) nasıl yazılır?</h5>
                <p>Negatif sayıların okunuşu yapılırken sayının en soluna "eksi" kelimesi getirilir ve ardındaki sayı kuralına göre aynen okunur.</p>
              </div>
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2 font-semibold">"Bin" kelimesinin önüne neden "bir" gelmez?</h5>
                <p>Türkçe konuşma ve yazma geleneğinde, bin sayısı doğrudan "bin" olarak okunur, başına "bir bin" getirilmez. Ancak "milyon" gibi daha büyük gruplar için "bir milyon", "bir milyar" gibi başlangıç kelimesi kullanılmak durumundadır.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* 5. DİĞER ARAÇLAR */}
      
      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Sayı Okunuşu Hesaplama Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              Sayı Okunuşu Hesaplama aracını kullanmak son derece basit ve kullanıcı dostudur. İlgili form alanlarına elinizdeki verileri eksiksiz ve doğru bir şekilde girdiğinizden emin olun. Tüm alanları doldurduktan sonra "Hesapla" butonuna tıklayarak sonuçları anında görüntüleyebilirsiniz. Aracımız, girdiğiniz değerleri anlık olarak işler ve herhangi bir sayfaya yönlendirme yapmadan, bulunduğunuz ekran üzerinde size en net ve kesin verileri sunar. İhtiyaç duyduğunuz her an bu aracı tamamen ücretsiz olarak kullanabilir, dilerseniz sonuçları kopyalayarak farklı platformlarda kolayca paylaşabilirsiniz. Zaman kaybetmeden, en karmaşık hesaplamaları bile saniyeler içinde tamamlamanın ayrıcalığını yaşayın.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Sayı Okunuşu Hesaplama Nedir ve Nasıl Hesaplanır?</h4>
            <p>
              Sayı Okunuşu Hesaplama, kullanıcıların günlük hayatta veya profesyonel iş süreçlerinde sıklıkla ihtiyaç duyduğu matematiksel veya istatistiksel hesaplamaları pratik bir şekilde çözmek amacıyla geliştirilmiş kapsamlı bir dijital araçtır. Geleneksel yöntemlerle yapıldığında hata payı yüksek olan ve uzun zaman alan bu tür işlemler, gelişmiş altyapımız sayesinde otomatik olarak hatasız bir biçimde gerçekleştirilir. 
            </p>
            <p className="mt-4">
              Hesaplama arka planda, genel kabul görmüş evrensel formüller, en güncel yasal mevzuatlar veya resmi olarak açıklanmış standart oranlar kullanılarak yapılmaktadır. Veriler sisteme girildiği anda, algoritma bu güncel parametreleri referans alarak verilerinizi analiz eder ve sonuçları net bir şekilde ekranınıza yansıtır. Finansal, istatistiksel veya gündelik hesaplamalar fark etmeksizin her daim doğru ve güvenilir bilgiye ulaşmanız hedeflenmektedir. Bu aracı kullanarak iş akışınızı hızlandırabilir ve hata payını sıfıra indirebilirsiniz.
            </p>
          </section>

          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular (SSS)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Sayı Okunuşu Hesaplama aracı ücretli midir?</h5>
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
      <RelatedTools category="matematik" currentToolId="sayi-okunusu-hesaplama" />

      {/* 6. SORUMLULUK REDDİ */}
      <Disclaimer category="matematik" />
    </div>
  );
}
