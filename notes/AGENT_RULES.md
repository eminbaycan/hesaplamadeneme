# AGENT_RULES.md

## 1. Yeni Araç (Tool) Ekleme Kuralları
*   **Şablon Bazı:** Tüm yeni araçlar **mutlaka** `src/pages/OrnekSablon.tsx` dosyası temel alınarak oluşturulacaktır.
*   **Zorunlu Alanlar:** Formlardaki zorunlu alanlar `*` simgesi ile belirtilecek ve bu yıldızlar **kırmızı renkli (`text-rose-500`)** olacaktır. Alanın altına `* Doldurulması zorunlu alanlar.` ibaresi eklenecektir. Form gönderilmeden önce alanların boş olup olmadığı kontrol edilecek ve boşsa modern bir hata mesajı kutusu gösterilecektir.
*   **SEO ve Bilgilendirme:** Sayfa üstü açıklamaları ve sayfa altı SSS bölümleri, siteye organik trafik çekecek, anahtar kelime odaklı ve kullanıcıyı bilgilendirici şekilde yazılacaktır.
*   **Formül Bölümü:** Eğer hesaplamanın bir matematiksel formülü varsa, sayfa sonunda "Kullanılan Formüller" başlığı altında, kod bloğu içerisinde açık bir şekilde belirtilecektir.
*   **Benzer Araçlar:** Sayfa sonunda mutlaka `RelatedTools` bileşeni ile 3 adet benzer araç önerilecektir. Eğer benzer araç yoksa, siteden rastgele 3 farklı dinamik araç getirilecektir.
*   **Sonuç Açıklaması:** Hesaplama sonucunun hemen altında "Bu sonuç ne anlama gelir?" başlıklı, sonucun neyi ifade ettiğini açıklayan bilgilendirici bir kutucuk eklenecektir.
*   **Sürüm Takibi:** Her aracın içine bir metadata bloğu eklenecektir. Bu blokta `created_at` (oluşturulma tarihi) ve `updated_at` (son güncellenme tarihi) bilgileri tutulacaktır.

## 2. Araç Güncelleme Kuralları
*   **Güncel/Yeni Etiketi:** Eğer bir araç son 10 güncelleme/ekleme içerisindeyse, listeleme alanlarında "Yeni" veya "Güncel" ibaresiyle etiketlenecektir.
*   **Veri Güncelliği:** Eğer araç içerisinde zamanla değişebilecek değerler (örn: dolar kuru, vergi dilimleri, faiz oranları) varsa; bu değerlerin yanında açıkça hangi yıla veya tarihe ait olduğu belirtilecektir (Örn: "2026 Vergi Dilimleri" veya "01.08.2026 sonrası geçerli").

## 3. Sorumluluk Reddi (Disclaimer) Kuralları
*   **Domain Uyumu:** Her araç için özel olarak domain'e uygun (hukuk, tıp, mühendislik, finans, matematik vb.) sorumluluk reddi metni yazılacaktır.
*   **Uzman Tavsiyesi:** Metin içerisinde mutlaka, karmaşık veya profesyonel işlemler için o alanın uzmanına (örneğin hukuk için avukat, sağlık için doktor, finans için mali müşavir vb.) danışılması gerektiği net bir dille vurgulanacaktır.

## 4. Arama Varyasyonu (Search Keywords) Standardı
*   **Kapsam:** Sisteme eklenen her yeni hesaplama aracı için, aracın temel ismine ek olarak en az 6 adet farklı arama varyasyonu (synonym/keyword) oluşturulacaktır.
*   **Yapı:** Bu varyasyonlar, aracın `metadata` veya bir merkezi `toolsConfig.ts` dosyası içerisinde `searchKeywords: string[]` dizisi olarak tanımlanacaktır.
*   **Arama Algoritması (Partial Match):** Arama özelliği, kullanıcı girdisini tam kelime olarak değil, içerilen metin (substring) olarak işleyecektir. Örneğin, "değer" aratıldığında "Katma Değer Vergisi" gibi içerisinde bu kelimeyi barındıran tüm araçlar listelenecektir. Bu nedenle `searchKeywords` tanımlanırken bu esneklik göz önünde bulundurulacaktır.
*   **Hedef:** Kullanıcının uygulamadaki arama çubuğuna, aracın ana ismini yazmasa bile, konuyla alakalı farklı kelimeler veya kelime parçaları yazdığında en alakalı aracın öne çıkması sağlanacaktır.

## 5. Hesaplama Analiz ve Bilgilendirme Standardı
*   **Kapsam:** Sonuç paneli (Result Panel) içerisinde, ana sonucun hemen altında mutlaka bir **"Bu sonuç ne anlama gelir?"** bilgilendirme kutusu bulunacaktır.
*   **Yapı ve İçerik:**
    *   Bu kutu, ana sonucun altındaki ayrı bir blokta (açık renkli arka planla) sunulacaktır.
    *   **İşlevsel Dinamiklik:** İçerik, hesaplama türüne göre **iki formatta** düzenlenecektir:
        1.  **Dinamik Veri Odaklı (Örn: Yüzde):** Hesaplanan sonucun farklı kombinasyonlarını (artışlı/azalışlı/yüzdelik vb.) listeleyen yapılar.
        2.  **Kavramsal Odaklı (Örn: Alan/Hacim):** Hesaplanan değerin matematiksel veya fiziksel olarak ne ifade ettiğini basit bir dille açıklayan, kullanıcıyı eğiten kısa cümleler.
*   **Amaç:** Kullanıcıya sadece bir "sayı" vermek değil, sonucun arka planındaki mantığı ve değerleri anında sunarak deneyimi tamamlamaktır.

## 6. SEO ve İçerik Hacmi (Thin Content Önleme) Standardı
Google "Thin Content" (Zayıf İçerik) cezasından kaçınmak ve zengin sonuçlar elde etmek için aşağıdaki sınırlar kesinlikle uygulanacaktır:
*   **Meta Title (Başlık):** `tools.ts` içerisindeki `title` alanı 50-60 karakter (max 65) olacak şekilde yazılacaktır.
*   **Meta Description (Açıklama):** `tools.ts` içerisindeki `description` alanı 120-155 karakter (max 160) olacak şekilde yazılacaktır.
*   **URL (Slug):** Kısa ve anahtar kelime odaklı olacaktır (Örn: `/kategori-adi/arac-adi`).
*   **Sayfa İçi İçerik (Minimum 300-500 Kelime):** Hesaplama sayfasının alt (bilgilendirme) kısmı kesinlikle aşağıdaki hiyerarşide ve uzunlukta doldurulacaktır:
    1. **Nasıl Kullanılır?** (75-100 kelime)
    2. **Nedir ve Nasıl Hesaplanır?** Formüllerin, arka planın veya yasal çerçevenin açıklaması (150-200 kelime)
    3. **Sıkça Sorulan Sorular (SSS)** 2-3 adet soru (100-150 kelime)
*   Araç (Form/Hesaplama kutusu) her zaman sayfanın en üstünde yer alacaktır.

## 7. Bileşen (Component) Mimarisi ve Kod Optimizasyonu
Sayfalarda tekrar eden, kod kalabalığına (dosya boyutuna) sebep olan UI blokları (örneğin: Sorumluluk Reddi, Google Reklamları vb.) her sayfada ham HTML olarak yazılmamalıdır.
*   **Sorumluluk Reddi:** Her aracın en altına `<Disclaimer category="kategori-adi" />` ( `import { Disclaimer } from '../../components/tools/Disclaimer';` ile) eklenmelidir.
*   **Reklam Alanları:** Kesinlikle `<AdSlot format="horizontal" />` vb. hazır bileşenler kullanılmalıdır.
*   Amaç, her sayfanın olabildiğince hafif, temiz (en az satır/kod) ve performanslı yüklenmesini sağlamaktır.