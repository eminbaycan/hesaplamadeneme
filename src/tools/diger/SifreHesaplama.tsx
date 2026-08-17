import React, { useState, useEffect } from 'react';
import { ChevronRight, RefreshCw, Copy, Info, KeyRound, Check, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToolIcon } from '../../components/icons/ToolIcon';
import { AdSlot } from '../../components/ads/AdSlot';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { RelatedTools } from '../../components/tools/RelatedTools';

export default function SifreHesaplama() {
  const [length, setLength] = useState<number>(16);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [password, setPassword] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const generatePassword = () => {
    let charset = '';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (charset === '') {
      setPassword('');
      return;
    }

    let retVal = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; ++i) {
      retVal += charset.charAt(array[i] % charset.length);
    }
    setPassword(retVal);
    setCopied(false);
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Entropi (Güvenlik Gücü) Hesaplama: log2(charset_size^length)
  let charsetSize = 0;
  if (includeLowercase) charsetSize += 26;
  if (includeUppercase) charsetSize += 26;
  if (includeNumbers) charsetSize += 10;
  if (includeSymbols) charsetSize += 30;

  const entropy = charsetSize > 0 ? Math.round(length * Math.log2(charsetSize)) : 0;
  let strengthLabel = 'Zayıf';
  let strengthColor = 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border-rose-200';
  if (entropy > 80) {
    strengthLabel = 'Mükemmel (Kırılamaz)';
    strengthColor = 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200';
  } else if (entropy > 60) {
    strengthLabel = 'Çok Güçlü';
    strengthColor = 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 border-blue-200';
  } else if (entropy > 40) {
    strengthLabel = 'Orta';
    strengthColor = 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border-amber-200';
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <Link to="/" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors">Ana Sayfa</Link>
        <ChevronRight size={14} />
        <Link to="/kategori/diger" className="hover:text-[#0056b3] dark:hover:text-blue-400 transition-colors capitalize">Diğer</Link>
        <ChevronRight size={14} />
        <span className="text-slate-800 dark:text-slate-300">Şifre Oluşturucu ve Güç Hesaplama</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Güçlü Şifre Oluşturucu 2026 - Şifre Güvenlik ve Entropi Hesaplama</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Kriptografik olarak güvenli, kırılması imkansız rastgele şifreler üretin ve bit cinsinden şifre gücünü anında hesaplayın.
        </p>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      <div className="calculator-container mb-8 relative border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-8 mt-8">
        <div className="absolute -top-3.5 left-4 sm:left-8 bg-[#eef2f7] dark:bg-slate-950 px-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ToolIcon name="diger" size={20} className="text-[#0056b3] dark:text-blue-400" />
            Şifre Üretici
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <KeyRound size={18} className="text-[#0056b3] dark:text-blue-400" />
                Şifre Tercihleri
              </h2>
              <button 
                onClick={generatePassword}
                className="text-[12px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw size={12} /> Yeniden Üret
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Şifre Uzunluğu: <span className="text-[#0056b3] dark:text-blue-400 font-black text-base">{length}</span> Karakter
                  </label>
                </div>
                <input 
                  type="range"
                  min="6"
                  max="64"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0056b3]"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-semibold mt-1">
                  <span>6 (Kısa)</span>
                  <span>16 (Standart)</span>
                  <span>32 (Güçlü)</span>
                  <span>64 (Maksimum)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-black/5 dark:border-white/5 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={includeUppercase}
                    onChange={(e) => setIncludeUppercase(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0056b3] focus:ring-blue-500 accent-[#0056b3]"
                  />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Büyük Harfler (A-Z)</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-black/5 dark:border-white/5 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={includeLowercase}
                    onChange={(e) => setIncludeLowercase(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0056b3] focus:ring-blue-500 accent-[#0056b3]"
                  />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Küçük Harfler (a-z)</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-black/5 dark:border-white/5 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0056b3] focus:ring-blue-500 accent-[#0056b3]"
                  />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Rakamlar (0-9)</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-black/5 dark:border-white/5 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0056b3] focus:ring-blue-500 accent-[#0056b3]"
                  />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Özel Semboller (!@#$%)</span>
                </label>
              </div>

              <button 
                onClick={generatePassword}
                className="w-full bg-[#0056b3] hover:bg-[#004494] text-white font-bold rounded-xl py-3.5 mt-2 transition-all shadow-sm active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} /> Yeni Şifre Üret
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 md:p-8 flex-1 relative shadow-lg border border-black/5 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-white mb-4">Üretilen Güvenli Şifre</h3>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border border-black/10 dark:border-white/10 rounded-2xl mb-4">
                  <p className="font-mono text-base sm:text-lg break-all select-all font-bold text-slate-800 dark:text-white leading-relaxed">
                    {password || 'En az bir karakter türü seçiniz'}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between ${strengthColor}`}>
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck size={16} /> Şifre Gücü:
                    </span>
                    <span>{strengthLabel}</span>
                  </div>

                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 px-1 font-medium">
                    <span>Entropi Gücü:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{entropy} bit</strong>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 px-1 font-medium">
                    <span>Karakter Havuzu:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{charsetSize} Karakter</strong>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleCopy}
                disabled={!password}
                className="w-full mt-6 bg-slate-50 hover:bg-slate-100 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                {copied ? 'Şifre Kopyalandı!' : 'Şifreyi Kopyala'}
              </button>
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
          Güçlü Şifre Oluşturma ve Entropi Rehberi
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Kişisel hesaplarınızı siber saldırılara, sözlük ve kaba kuvvet (brute-force) denemelerine karşı korumak için en az 12-16 karakterden oluşan karmaşık şifreler kullanmanız önerilir.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Şifre Hesaplama Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              Şifre Hesaplama ve Oluşturucu aracını kullanmak son derece kolaydır. İhtiyacınıza göre şifre uzunluğunu kaydırıcı (slider) ile 6 ile 64 karakter arasında belirleyin. Ardından büyük harf, küçük harf, rakam ve özel sembol seçeneklerinden istediklerinizi işaretleyin. Sistem, cihazınızın yerel kriptografik rastgele sayı üreticisini kullanarak anında kırılması imkansız bir şifre üretir. Oluşturulan şifreyi "Şifreyi Kopyala" butonuna basarak kopyalayabilir ve hesaplarınızda güvenle kullanabilirsiniz.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Şifre Hesaplama Nedir ve Nasıl Hesaplanır?</h4>
            <p>
              Şifre gücü hesaplama, bir parolanın matematiksel karmaşıklığını (bilgi entropisini) ölçen bir siber güvenlik algoritmasıdır. Entropi, olası karakter kombinasyonlarının sayısına bağlı olarak bit cinsinden ifade edilir. 
            </p>
            <p className="mt-4">
              Örneğin yalnızca küçük harflerden oluşan 8 karakterli bir şifrenin entropisi oldukça düşüktür ve modern bilgisayarlar tarafından saniyeler içinde kırılabilir. Ancak büyük harf, rakam ve sembol içeren 16 karakterli bir şifrenin entropisi 100 bitin üzerine çıkar ve süper bilgisayarlarla bile trilyonlarca yılda kırılamaz hale gelir.
            </p>
          </section>

          <div className="pt-2">
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Kullanılan Formüller:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  Karakter Havuzu Boyutu (N) = Seçili Harf + Rakam + Sembol Sayısı <br />
                  Şifre Entropisi (Bit) = Uzunluk (L) × log2(N) <br />
                  Toplam Kombinasyon Sayısı = N^L
                </div>
              </div>
            </div>
          </div>

          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular (SSS)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Üretilen şifreler sunucuya kaydediliyor mu?</h5>
                <p>Hayır. Şifreler tamamen tarayıcınızın kendi istemci tarafındaki Web Cryptography API (window.crypto) standardı ile üretilir. Hiçbir şifre hiçbir sunucuya iletilmez veya veritabanında saklanmaz.</p>
              </div>
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">İdeal bir şifre kaç karakter olmalıdır?</h5>
                <p>Güvenlik uzmanları, standart kullanıcı hesapları için en az 12-16 karakter, finansal ve kurumsal hesaplar için ise 16-24 karakter uzunluğunda şifrelerin kullanılmasını tavsiye etmektedir.</p>
              </div>
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Şifre oluşturucu aracı ücretsiz midir?</h5>
                <p>Evet, şifre üretici ve güç hesaplayıcı aracımız tamamen ücretsizdir ve dilediğiniz sıklıkta kullanabilirsiniz.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <RelatedTools category="diger" currentToolId="sifre-hesaplama" />
      <div className="mt-8">
        <Disclaimer category="diger" />
      </div>
    </div>
  );
}
