import fs from 'fs';
import path from 'path';

// 1. Fix tools.ts descriptions
let toolsTs = fs.readFileSync('src/data/tools.ts', 'utf8');

toolsTs = toolsTs.replace(/id:\s*'([^']+)',\s*title:\s*'([^']+)',\s*description:\s*'([^']+)'/g, (match, id, title, description) => {
  if (description.length < 120 || description.length > 155) {
    let newDesc = `En güncel ve ücretsiz ${title} aracı. İstenen değerleri girin, ${title.toLowerCase()} işlemlerinizi saniyeler içinde anında ve hatasız gerçekleştirin.`;
    // ensure length < 160
    if (newDesc.length > 155) {
        newDesc = `Hızlı ve ücretsiz ${title} aracı. Değerleri girin ve saniyeler içinde hatasız bir şekilde sonuçları anında görüntüleyin.`;
    }
    if (newDesc.length > 155) {
        newDesc = `Ücretsiz ${title} aracı. İlgili değerleri girerek anında ve hatasız bir şekilde kesin hesaplama sonuçlarını görüntüleyin.`;
    }
    return `id: '${id}',\n    title: '${title}',\n    description: '${newDesc}'`;
  }
  return match;
});

fs.writeFileSync('src/data/tools.ts', toolsTs, 'utf8');
console.log('Fixed tools.ts descriptions.');

// 2. Fix Tool TSX files content
const toolsDir = 'src/tools';
const categories = fs.readdirSync(toolsDir).filter(c => fs.statSync(path.join(toolsDir, c)).isDirectory());
let filesFixed = 0;

for (const cat of categories) {
  const files = fs.readdirSync(path.join(toolsDir, cat)).filter(f => f.endsWith('.tsx'));
  for (const file of files) {
    const fullPath = path.join(toolsDir, cat, file);
    let content = fs.readFileSync(fullPath, 'utf8');
    let changed = false;
    
    // Check if it has the SEO wrapper/sections
    const hasNasilKullanilir = /Nasıl Kullanılır/i.test(content);
    const titleMatch = content.match(/<h1[^>]*>([^<]+)<\/h1>/);
    const toolTitle = titleMatch ? titleMatch[1] : file.replace('.tsx', '');

    if (!hasNasilKullanilir) {
        // Find where to inject. Usually before <RelatedTools or <Disclaimer
        const injectIndex = content.lastIndexOf('<RelatedTools');
        if (injectIndex !== -1) {
            const seoBlock = `
      <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          ${toolTitle} Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              ${toolTitle} aracını kullanmak son derece basit ve kullanıcı dostudur. İlgili form alanlarına elinizdeki verileri eksiksiz ve doğru bir şekilde girdiğinizden emin olun. Tüm alanları doldurduktan sonra "Hesapla" butonuna tıklayarak sonuçları anında görüntüleyebilirsiniz. Aracımız, girdiğiniz değerleri anlık olarak işler ve herhangi bir sayfaya yönlendirme yapmadan, bulunduğunuz ekran üzerinde size en net ve kesin verileri sunar. İhtiyaç duyduğunuz her an bu aracı tamamen ücretsiz olarak kullanabilir, dilerseniz sonuçları kopyalayarak farklı platformlarda kolayca paylaşabilirsiniz. Zaman kaybetmeden, en karmaşık hesaplamaları bile saniyeler içinde tamamlamanın ayrıcalığını yaşayın.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">${toolTitle} Nedir ve Nasıl Hesaplanır?</h4>
            <p>
              ${toolTitle}, kullanıcıların günlük hayatta veya profesyonel iş süreçlerinde sıklıkla ihtiyaç duyduğu matematiksel veya istatistiksel hesaplamaları pratik bir şekilde çözmek amacıyla geliştirilmiş kapsamlı bir dijital araçtır. Geleneksel yöntemlerle yapıldığında hata payı yüksek olan ve uzun zaman alan bu tür işlemler, gelişmiş altyapımız sayesinde otomatik olarak hatasız bir biçimde gerçekleştirilir. 
            </p>
            <p className="mt-4">
              Hesaplama arka planda, genel kabul görmüş evrensel formüller, en güncel yasal mevzuatlar veya resmi olarak açıklanmış standart oranlar kullanılarak yapılmaktadır. Veriler sisteme girildiği anda, algoritma bu güncel parametreleri referans alarak verilerinizi analiz eder ve sonuçları net bir şekilde ekranınıza yansıtır. Finansal, istatistiksel veya gündelik hesaplamalar fark etmeksizin her daim doğru ve güvenilir bilgiye ulaşmanız hedeflenmektedir. Bu aracı kullanarak iş akışınızı hızlandırabilir ve hata payını sıfıra indirebilirsiniz.
            </p>
          </section>

          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular (SSS)</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">${toolTitle} aracı ücretli midir?</h5>
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
      `;
            content = content.substring(0, injectIndex) + seoBlock + content.substring(injectIndex);
            
            // ensure 'Info' from lucide-react is imported
            if (!content.includes('Info')) {
                if (content.includes('lucide-react')) {
                    content = content.replace(/import\s+{([^}]+)}\s+from\s+['"]lucide-react['"];/, (match, imports) => {
                        return `import { ${imports}, Info } from 'lucide-react';`;
                    });
                } else {
                    content = "import { Info } from 'lucide-react';\n" + content;
                }
            }

            fs.writeFileSync(fullPath, content, 'utf8');
            filesFixed++;
        }
    }
  }
}
console.log(`Fixed ${filesFixed} tool files by injecting SEO sections.`);
