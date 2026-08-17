import React from 'react';

export type CategorySlug = 
  | 'kredi' | 'finans' | 'sinav' | 'egitim' | 'saglik' 
  | 'matematik' | 'zaman' | 'muhasebe' | 'vergi' 
  | 'ticaret' | 'hukuk' | 'sigorta' | 'seyahat' | 'diger';

interface DisclaimerProps {
  category?: CategorySlug | string;
  customText?: string;
}

export function Disclaimer({ category = 'diger', customText }: DisclaimerProps) {
  const getDisclaimerText = () => {
    if (customText) return customText;
    
    switch (category) {
      case 'kredi':
        return "Bu platformda sunulan kredi hesaplama sonuçları (taksit, faiz, geri ödeme planı vb.) yalnızca genel bilgilendirme ve önizleme amacı taşır. Gerçek kredi kullanımında, bankaların anlık faiz oranları, tahsis ücretleri, BSMV/KKDF oranları ve kişisel kredi notunuza bağlı olarak farklılıklar oluşabilir. Kesin ödeme planı için ilgili banka veya finans kuruluşu ile iletişime geçiniz.";
      
      case 'finans':
      case 'ticaret':
        return "Bu araç tarafından sunulan finansal ve ticari hesaplama sonuçları yalnızca tahmin ve bilgilendirme amaçlıdır; kesin bir yatırım, alım-satım veya hukuki tavsiye (YTD) niteliği taşımaz. Piyasaların değişken doğası gereği kurlar, oranlar ve getiriler farklılık gösterebilir. Finansal veya ticari kararlar almadan önce resmi bir lisanslı finansal danışmana başvurmanız önemle tavsiye edilir.";
      
      case 'muhasebe':
      case 'vergi':
        return "Buradaki hesaplama ve veriler (KDV, stopaj, gelir vergisi, maaş vb.) standart formüllere dayanarak genel bilgi vermek amacıyla hazırlanmıştır. Mevzuatta, vergi dilimlerinde veya yasal oranlarda meydana gelebilecek güncellemeler nedeniyle sonuçlar değişiklik gösterebilir. Resmi bildirimler, beyannameler ve yasal yükümlülükleriniz için mutlaka bir Serbest Muhasebeci Mali Müşavir'e (SMMM) danışınız.";
      
      case 'hukuk':
        return "Bu platformdaki hesaplama sonuçları (kıdem tazminatı, ihbar tazminatı, yasal faiz, nafaka vb.) sadece bilgilendirme amacı taşımaktadır ve kesinlikle yasal bir mütalaa veya avukatlık hizmeti yerine geçmez. Kanun değişiklikleri veya mahkeme içtihatları nedeniyle gerçek sonuçlar farklı olabilir. Hukuki süreçlerinizde hak kaybına uğramamak için uzman bir avukattan destek alınız.";
      
      case 'sigorta':
        return "Bu araçla yapılan sigorta prim ve değer hesaplamaları yaklaşık veriler sunar. Poliçe detayları, kişisel risk profili, hasarsızlık indirimleri ve sigorta şirketlerinin güncel aktüeryal hesaplamaları neticesinde gerçek poliçe tutarları farklılık gösterecektir. Kesin teklifler için sigorta acenteleri ile görüşmelisiniz.";
      
      case 'saglik':
        return "Buradaki sağlık, beslenme ve fitness hesaplama verileri (VKI, kalori, ideal kilo vb.) yalnızca genel bilgi amaçlıdır ve kesinlikle profesyonel tıbbi tavsiye, teşhis veya tedavi yerine geçmez. Sağlık durumunuzla ilgili alacağınız herhangi bir kararda, diyette veya egzersiz programında mutlaka uzman bir doktora veya diyetisyene danışınız.";
      
      case 'sinav':
      case 'egitim':
        return "Puan, net ve sıralama hesaplama sonuçları, geçmiş yılların istatistikleri ve genel formüller kullanılarak elde edilen tahmini değerlerdir. Resmi sonuç belgesi niteliği taşımaz. Kesin ve resmi sonuçlar, ilgili sınavı düzenleyen kurum (ÖSYM, MEB vb.) tarafından açıklanan resmi verilerdir.";
      
      case 'matematik':
        return "Bu platformda sunulan matematiksel ve geometrik hesaplama sonuçları, genel bilgilendirme, ödev kontrolü ve eğitim amacıyla otomatik motorlar tarafından üretilir. Karmaşık yapılar, araziler veya profesyonel mühendislik/mimarlık hesaplamaları için ilgili alanın uzmanlarına danışılması önemle tavsiye edilir. Sonuçların teyidi kullanıcının sorumluluğundadır.";
      
      case 'zaman':
        return "Tarih, saat, gün farkı veya yaş hesaplamaları gibi araçların sonuçları standart takvim algoritmalarına dayanır. Kritik sözleşme bitiş tarihleri, resmi başvuru süreleri veya hukuki zaman aşımları (zamanaşımı) gibi hassas konularda manuel doğrulama yapmanız ve ilgili kuralları teyit etmeniz önerilir.";
      
      case 'seyahat':
        return "Araç yakıt, mesafe veya seyahat süresi gibi hesaplamalar ideal koşullar varsayılarak oluşturulmuştur. Gerçekte trafik yoğunluğu, yol koşulları, aracın durumu ve anlık akaryakıt fiyatları gibi faktörlere bağlı olarak sapmalar yaşanabilir.";
      
      case 'diger':
      default:
        return "Bu platformda sunulan hesaplama sonuçları, genel bilgilendirme amacıyla otomatik motorlar tarafından üretilir. Sistem hataları veya yuvarlama farklarından dolayı kesinlik garantisi verilmez ve her türlü doğrulama, teyit işlemi ile kullanım riski tamamen kullanıcının kendi sorumluluğundadır.";
    }
  };

  return (
    <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">Sorumluluk Reddi ve Bilgilendirme</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        {getDisclaimerText()}
      </p>
    </div>
  );
}

