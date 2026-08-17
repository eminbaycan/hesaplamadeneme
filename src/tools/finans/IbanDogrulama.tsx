import React, { useState } from 'react';
import { ChevronRight, RefreshCw, Copy, Info, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToolIcon } from '../../components/icons/ToolIcon';
import { AdSlot } from '../../components/ads/AdSlot';
import { Disclaimer } from '../../components/tools/Disclaimer';
import { RelatedTools } from '../../components/tools/RelatedTools';

// Türkiye'deki popüler bankaların 5 haneli banka kodları ve isimleri
const TURKISH_BANKS: { [key: string]: string } = {
  '00010': 'T.C. Ziraat Bankası',
  '00012': 'Türkiye Halk Bankası',
  '00015': 'Türkiye Vakıflar Bankası (VakıfBank)',
  '00032': 'Türk Ekonomi Bankası (TEB)',
  '00046': 'Akbank',
  '00062': 'Garanti BBVA',
  '00064': 'Türkiye İş Bankası',
  '00067': 'Yapı Kredi Bankası',
  '00099': 'ING Bank',
  '00111': 'QNB Finansbank',
  '00123': 'HSBC Bank',
  '00125': 'DenizBank',
  '00146': 'Odeabank',
  '00203': 'Albaraka Türk Katılım Bankası',
  '00205': 'Kuveyt Türk Katılım Bankası',
  '00206': 'Türkiye Finans Katılım Bankası',
  '00209': 'Vakıf Katılım Bankası',
  '00210': 'Ziraat Katılım Bankası',
};

// Ülke kodları ve standart IBAN uzunlukları
const IBAN_LENGTHS: { [key: string]: number } = {
  'TR': 26, 'AL': 28, 'AD': 24, 'AT': 20, 'AZ': 28, 'BH': 22, 'BE': 16,
  'BA': 20, 'BG': 22, 'HR': 21, 'CY': 28, 'CZ': 24, 'DK': 18, 'EE': 20,
  'FO': 18, 'FI': 18, 'FR': 27, 'GE': 22, 'DE': 22, 'GI': 23, 'GR': 27,
  'GL': 18, 'HU': 28, 'IS': 26, 'IE': 22, 'IL': 23, 'IT': 27, 'JO': 30,
  'KZ': 20, 'XK': 20, 'KW': 30, 'LV': 21, 'LB': 28, 'LI': 21, 'LT': 20,
  'LU': 20, 'MK': 19, 'MT': 31, 'MR': 27, 'MU': 30, 'MD': 24, 'MC': 27,
  'ME': 22, 'NL': 18, 'NO': 15, 'PK': 24, 'PS': 29, 'PL': 28, 'PT': 25,
  'QA': 29, 'RO': 24, 'SM': 27, 'SA': 24, 'RS': 22, 'SK': 24, 'SI': 19,
  'ES': 24, 'SE': 24, 'CH': 21, 'TN': 24, 'AE': 23, 'GB': 22, 'VG': 24
};

export default function IbanDogrulama() {
  const [ibanInput, setIbanInput] = useState<string>('');
  const [sonuc, setSonuc] = useState<{
    isValid: boolean;
    cleanIban: string;
    formattedIban: string;
    countryCode: string;
    bankName: string;
    checkDigits: string;
    bankCode: string;
    accountNumber: string;
    errorMessage?: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  // Giriş yapıldıkça boşlukları otomatik düzenleyen fonksiyon (Kullanıcı kolaylığı için)
  const handleIbanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    
    // Maksimum uzunluk (en uzun IBAN Malta'da 31 hane)
    if (value.length > 31) {
      value = value.substring(0, 31);
    }

    setIbanInput(value);
    setSonuc(null); // Giriş değişince eski sonucu sıfırla
  };

  const getFormattedInput = () => {
    return ibanInput.replace(/(.{4})/g, '$1 ').trim();
  };

  const dogrula = () => {
    const clean = ibanInput.replace(/\s+/g, '').toUpperCase();

    if (!clean) {
      setSonuc({
        isValid: false,
        cleanIban: '',
        formattedIban: '',
        countryCode: '',
        bankName: '',
        checkDigits: '',
        bankCode: '',
        accountNumber: '',
        errorMessage: 'Lütfen bir IBAN giriniz.'
      });
      return;
    }

    const country = clean.substring(0, 2);
    const expectedLength = IBAN_LENGTHS[country];

    // Ülke kodu kontrolü
    if (!/^[A-Z]{2}$/.test(country)) {
      setSonuc({
        isValid: false,
        cleanIban: clean,
        formattedIban: clean.replace(/(.{4})/g, '$1 ').trim(),
        countryCode: country,
        bankName: 'Bilinmiyor',
        checkDigits: '',
        bankCode: '',
        accountNumber: '',
        errorMessage: 'IBAN geçerli bir ülke koduyla başlamalıdır (Örn: TR).'
      });
      return;
    }

    // Uzunluk kontrolü
    if (expectedLength === undefined) {
      setSonuc({
        isValid: false,
        cleanIban: clean,
        formattedIban: clean.replace(/(.{4})/g, '$1 ').trim(),
        countryCode: country,
        bankName: 'Bilinmiyor',
        checkDigits: '',
        bankCode: '',
        accountNumber: '',
        errorMessage: `${country} kodlu ülke için geçerli bir IBAN uzunluğu tanımlı değil.`
      });
      return;
    }

    if (clean.length !== expectedLength) {
      setSonuc({
        isValid: false,
        cleanIban: clean,
        formattedIban: clean.replace(/(.{4})/g, '$1 ').trim(),
        countryCode: country,
        bankName: 'Bilinmiyor',
        checkDigits: '',
        bankCode: '',
        accountNumber: '',
        errorMessage: `${country} için beklenen IBAN uzunluğu ${expectedLength} hanedir. Girdiğiniz: ${clean.length} hane.`
      });
      return;
    }

    // MOD 97 Doğrulama Algoritması
    // 1. İlk 4 karakteri sona al
    const rearranged = clean.substring(4) + clean.substring(0, 4);
    
    // 2. Harfleri sayılara dönüştür (A=10, B=11, ... Z=35)
    let numericString = '';
    for (let i = 0; i < rearranged.length; i++) {
      const char = rearranged[i];
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) { // A-Z arası
        numericString += (code - 55).toString();
      } else {
        numericString += char;
      }
    }

    // BigInt kullanarak 97 ile modülosunu al
    let isValid = false;
    try {
      const ibanBigInt = BigInt(numericString);
      isValid = (ibanBigInt % 97n) === 1n;
    } catch (e) {
      isValid = false;
    }

    // Türkiye IBAN'ı ise detayları ayıkla
    let bankName = 'Bilinmiyor / Yurtdışı';
    let bankCode = '';
    let accountNumber = '';
    const checkDigits = clean.substring(2, 4);

    if (country === 'TR' && clean.length === 26) {
      bankCode = clean.substring(4, 9);
      bankName = TURKISH_BANKS[bankCode] || 'Bilinmeyen Türk Bankası';
      accountNumber = clean.substring(10);
    } else {
      accountNumber = clean.substring(4);
    }

    setSonuc({
      isValid,
      cleanIban: clean,
      formattedIban: clean.replace(/(.{4})/g, '$1 ').trim(),
      countryCode: country,
      bankName,
      checkDigits,
      bankCode,
      accountNumber,
      errorMessage: isValid ? undefined : 'IBAN numarası Mod-97 doğrulama testinden geçemedi. Lütfen rakamları kontrol edin.'
    });
  };

  const temizle = () => {
    setIbanInput('');
    setSonuc(null);
  };

  const kopyala = () => {
    if (!sonuc) return;
    navigator.clipboard.writeText(sonuc.formattedIban);
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
        <span className="text-slate-800 dark:text-slate-300">IBAN Doğrulama</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">IBAN Doğrulama 2026 - Ücretsiz Araç</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Uluslararası standartlarda (ISO 13616) MOD-97 algoritması ile IBAN doğruluğunu kontrol edin, hangi bankaya ait olduğunu ve hesap numarasını anında çözümleyin.
        </p>
      </div>

      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      <div className="calculator-container mb-8 relative border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-8 mt-8">
        <div className="absolute -top-3.5 left-4 sm:left-8 bg-[#eef2f7] dark:bg-slate-950 px-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ToolIcon name="finans" size={20} className="text-[#0056b3] dark:text-blue-400" />
            IBAN Doğrulayıcı
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                IBAN Bilgisi Girin
              </h2>
              <button onClick={temizle} className="text-[12px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1.5 transition-colors">
                <RefreshCw size={12} /> Temizle
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  IBAN Numarası <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={getFormattedInput()}
                    onChange={handleIbanChange}
                    placeholder="Örn: TR89 0001 ..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3.5 text-slate-700 dark:text-white font-mono text-base tracking-widest focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 dark:focus:ring-blue-500/30 focus:border-[#0056b3] dark:focus:border-blue-500 transition-all uppercase"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-normal">
                  Sadece harf ve rakamlar kabul edilir. Boşluklar otomatik eklenir ve temizlenir.
                </p>
              </div>

              <button
                onClick={dogrula}
                className="w-full bg-[#0056b3] hover:bg-[#004494] text-white font-bold rounded-xl py-3.5 mt-2 transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
              >
                IBAN Sorgula & Doğrula
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 md:p-8 flex-1 relative overflow-hidden shadow-lg border border-black/5 dark:border-slate-800 flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-4 border-b border-black/5 dark:border-white/5 pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">ANALİZ SONUCU</h3>
                </div>

                <div className="flex-1 flex flex-col justify-center gap-4 my-4">
                  {sonuc !== null ? (
                    <>
                      {sonuc.isValid ? (
                        <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/60 rounded-xl text-emerald-800 dark:text-emerald-300 text-sm font-semibold">
                          <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>Bu IBAN Biçimsel Olarak Tamamen Geçerlidir.</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/60 rounded-xl text-rose-800 dark:text-rose-400 text-xs font-semibold">
                          <ShieldAlert size={20} className="text-rose-600 dark:text-rose-400 shrink-0" />
                          <div className="flex flex-col">
                            <span>Geçersiz IBAN!</span>
                            <span className="text-[10px] font-normal mt-0.5 opacity-90">{sonuc.errorMessage}</span>
                          </div>
                        </div>
                      )}

                      <div className="space-y-3.5 mt-2">
                        <div>
                          <p className="text-slate-400 text-[10px] mb-0.5 font-bold uppercase">Düzenlenmiş IBAN</p>
                          <div className="text-sm font-mono tracking-wider font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg border border-black/5">
                            {sonuc.formattedIban || '-'}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-slate-400 text-[10px] mb-0.5 font-bold uppercase">Ülke</p>
                            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                              {sonuc.countryCode || '-'} (ISO 3166)
                            </div>
                          </div>
                          <div>
                            <p className="text-slate-400 text-[10px] mb-0.5 font-bold uppercase">Kontrol Rakamı</p>
                            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                              {sonuc.checkDigits || '-'}
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-slate-400 text-[10px] mb-0.5 font-bold uppercase">Banka Adı</p>
                          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {sonuc.bankName}
                          </div>
                        </div>

                        {sonuc.bankCode && (
                          <div>
                            <p className="text-slate-400 text-[10px] mb-0.5 font-bold uppercase">Banka Kodu</p>
                            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                              {sonuc.bankCode}
                            </div>
                          </div>
                        )}

                        <div>
                          <p className="text-slate-400 text-[10px] mb-0.5 font-bold uppercase">Müşteri Hesap Numarası</p>
                          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono break-all bg-slate-50/50 dark:bg-slate-800/20 p-2 rounded border border-black/5">
                            {sonuc.accountNumber || '-'}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-[#eef2f7] dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle2 className="text-slate-400 dark:text-slate-500" size={20} />
                      </div>
                      <p className="text-slate-400 dark:text-slate-500 text-sm">
                        Doğrulamak için IBAN girip sorgulamayı başlatın.
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
                    {copied ? 'Kopyalandı!' : 'IBAN Kopyala'}
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
            <h4 className="text-[15px] font-bold text-slate-800 dark:text-slate-200 mb-2">IBAN Modulo-97 (MOD-97) denetimi nedir?</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Her geçerli IBAN, yazım hatalarını ve eksik basamakları engellemek için kendi içinde bir matematik doğrulaması barındırır. IBAN haneleri belirli bir sıraya göre sayısallaştırılıp 97'ye bölündüğünde kalanın her zaman **1** çıkması gerekir. Bu sayede hatalı bir basamak girildiğinde sistem transfer işlemine başlamadan hatayı anında yakalar.
            </p>
          </div>
          <div>
            <h4 className="text-[15px] font-bold text-slate-800 dark:text-slate-200 mb-2">Bu araç ile sorgulanan IBAN'daki bakiye veya ad soyad öğrenilebilir mi?</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Hayır, IBAN doğrulama işlemi tamamen biçimsel ve algoritmiktir. Kişisel Verilerin Korunması Kanunu (KVKK) ve bankacılık gizlilik yasaları gereği, bir IBAN'ın kime ait olduğunu, bakiye bilgisini veya aktif olup olmadığını sadece resmi bankacılık uygulamaları üzerinden görebilirsiniz.
            </p>
          </div>
          <div>
            <h4 className="text-[15px] font-bold text-slate-800 dark:text-slate-200 mb-2">Türkiye'de IBAN uzunluğu kaç hanedir?</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Türkiye Cumhuriyeti sınırlarında kullanılan tüm IBAN numaraları istisnasız **26** hane uzunluğundadır. Ülke kodu olan `TR` ile başlar, 2 kontrol rakamı, 5 hane banka kodu ve 17 hane müşteri hesap numarasından (rezerv tek hane dahil) oluşur.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-slate-50 dark:bg-slate-900/40 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/60">
        <h4 className="text-[15px] font-bold text-slate-800 dark:text-slate-200 mb-2">Algoritma Özeti</h4>
        <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
          1. IBAN'ın ilk 4 karakteri (Ülke kodu ve kontrol basamakları) sona kaydırılır. <br />
          2. Tüm harfler sayısal karşılığıyla (A=10, ..., Z=35) değiştirilir. <br />
          3. Oluşan bu devasa sayı 97'ye bölünür. Kalan (Mod 97) tam olarak 1 ise IBAN yapısı doğrudur.
        </p>
      </div>



      <div className="mt-8">
        
      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          IBAN Doğrulama Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              IBAN Doğrulama aracını kullanmak son derece basit ve kullanıcı dostudur. İlgili form alanlarına elinizdeki verileri eksiksiz ve doğru bir şekilde girdiğinizden emin olun. Tüm alanları doldurduktan sonra "Hesapla" butonuna tıklayarak sonuçları anında görüntüleyebilirsiniz. Aracımız, girdiğiniz değerleri anlık olarak işler ve herhangi bir sayfaya yönlendirme yapmadan, bulunduğunuz ekran üzerinde size en net ve kesin verileri sunar. İhtiyaç duyduğunuz her an bu aracı tamamen ücretsiz olarak kullanabilir, dilerseniz sonuçları kopyalayarak farklı platformlarda kolayca paylaşabilirsiniz. Zaman kaybetmeden, en karmaşık hesaplamaları bile saniyeler içinde tamamlamanın ayrıcalığını yaşayın.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">IBAN Doğrulama Nedir ve Nasıl Hesaplanır?</h4>
            <p>
              IBAN Doğrulama, kullanıcıların günlük hayatta veya profesyonel iş süreçlerinde sıklıkla ihtiyaç duyduğu matematiksel veya istatistiksel hesaplamaları pratik bir şekilde çözmek amacıyla geliştirilmiş kapsamlı bir dijital araçtır. Geleneksel yöntemlerle yapıldığında hata payı yüksek olan ve uzun zaman alan bu tür işlemler, gelişmiş altyapımız sayesinde otomatik olarak hatasız bir biçimde gerçekleştirilir. 
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
                  IBAN Doğrulama Algoritması (MOD 97-10 ISO 7064): IBAN içindeki harfler sayısal değere çevrilir ve tüm dizi 97'ye bölünür. Kalan 1 ise IBAN geçerlidir.
                </div>
              </div>
            </div>
          </div>
          
          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular (SSS)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">IBAN Doğrulama aracı ücretli midir?</h5>
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
      <RelatedTools category="finans" currentToolId="iban-dogrulama" />

      <div className="mt-8">
        <Disclaimer />
      </div>
      </div>
    </div>
  );
}
