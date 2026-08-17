import fs from 'fs';

let content = fs.readFileSync('src/tools/finans/KdvHesaplama.tsx', 'utf8');

// Replace Nasıl Kullanılır
content = content.replace(
  /Nasıl Kullanılır\?<\/h4>\s*<p>[\s\S]*?<\/p>/,
  `Nasıl Kullanılır?</h4>
            <p>
              KDV hesaplama aracımızı kullanmak oldukça kolay ve pratiktir. İlk adım olarak, işlem yapmak istediğiniz tutar bilgisini ilgili alana eksiksiz bir şekilde girmelisiniz. Ardından, Türkiye'deki geçerli vergi dilimlerine uygun olarak sunulan %1, %10 veya %20 oranlarından işleminize uygun olanı seçmelisiniz. Son olarak, girdiğiniz tutarın "KDV Dahil" mi yoksa "KDV Hariç" mi olduğuna karar vererek "KDV Hariç ➔ Dahil" veya "KDV Dahil ➔ Hariç" seçeneklerinden birini belirleyin ve Hesapla butonuna basın. Aracımız anlık olarak çalışarak size ödenecek olan net KDV tutarını, kdv hariç ve dahil tutarları anında listeleyecektir. İşlem sonrası elde ettiğiniz bu değerleri isterseniz kolayca kopyalayabilir, faturalarınızda veya muhasebe kayıtlarınızda doğrudan kullanabilirsiniz.
            </p>`
);

// Replace KDV Nedir
content = content.replace(
  /KDV Nedir ve Nasıl Hesaplanır\?<\/h4>\s*<p>[\s\S]*?<\/p>/,
  `KDV Nedir ve Nasıl Hesaplanır?</h4>
            <p>
              Katma Değer Vergisi (KDV), bir malın veya hizmetin ilk üretim aşamasından son tüketiciye ulaşmasına kadar geçen süreçteki her aşamada ürüne veya hizmete katılan değer üzerinden alınan dolaylı bir vergidir. Türkiye'deki yasal düzenlemelere göre işletmeler, sattıkları mal veya hizmet üzerinden hesaplanan bu vergiyi devlete ödemekle yükümlüdür. KDV tutarı hesaplanırken, mal veya hizmetin net değeri ile kanunların belirlemiş olduğu vergi oranı çarpılır. Örneğin, KDV hariç tutarı belirli olan bir ürün için KDV dahil fiyatı bulmak istediğinizde, ürün bedeli ile oran üzerinden elde edilen çarpanı (örneğin %20 için 1.20) çarparak sonuca ulaşabilirsiniz. Tersine bir işlemde, KDV dahil fiyattan KDV hariç fiyatı bulmak için ise ürün fiyatını söz konusu çarpana bölmek yeterlidir. Doğru KDV hesaplaması yapmak, ticari hayatın sorunsuz devam etmesi ve yasal yaptırımlarla karşılaşılmaması adına hem işletmeler hem de tüketiciler için büyük bir önem taşımaktadır.
            </p>`
);

// Replace SSS
content = content.replace(
  /<section className="pt-4 border-t border-black\/5 dark:border-white\/5">[\s\S]*?<\/section>/,
  `<section className="pt-4 border-t border-black/5 dark:border-white/5">
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
          </section>`
);

// Replace the main title to match the one user provided exactly
content = content.replace(
    /KDV Hesaplama<\/h1>/,
    'KDV Hesaplama 2026 - KDV Dahil ve Hariç Bulma Aracı</h1>'
);

fs.writeFileSync('src/tools/finans/KdvHesaplama.tsx', content, 'utf8');
console.log("KDV Hesaplama patched.");
