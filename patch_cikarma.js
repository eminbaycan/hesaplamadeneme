const fs = require('fs');
let content = fs.readFileSync('src/tools/matematik/CikarmaHesaplama.tsx', 'utf8');

// Add imports
content = content.replace("import { Link } from 'react-router-dom';", "import { Link } from 'react-router-dom';\nimport { RelatedTools } from '../../components/tools/RelatedTools';\nimport { Disclaimer } from '../../components/tools/Disclaimer';");

// Update SEO Section
const oldSeo = `<div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">`;
const newSeo = `<div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-4">
          <Info className="text-[#0056b3] dark:text-blue-400 shrink-0" size={24} /> 
          Çıkarma İşlemi Hakkında Her Şey ve Sıkça Sorulan Sorular
        </h3>
        
        <div className="prose prose-sm md:prose-base max-w-none text-slate-600 dark:text-slate-400 space-y-8 leading-relaxed">
          
          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Nasıl Kullanılır?</h4>
            <p>
              Çıkarma hesaplama aracımız ile iki sayı arasındaki farkı saniyeler içerisinde bulabilirsiniz. "Eksilen (1. Sayı)" kısmına ana değerinizi, "Çıkan (2. Sayı)" kısmına ise çıkarmak istediğiniz değeri girin ve hesapla butonuna basın.
            </p>
          </section>

          <section>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-3">Çıkarma İşlemi Nedir ve Nasıl Hesaplanır?</h4>
            <p>
              Çıkarma işlemi, matematikteki dört temel işlemden biridir. Verilen bir değerden (Eksilen), başka bir değerin (Çıkan) eksiltilmesi sonucunda elde edilen kalan miktarın (Fark) bulunmasını sağlar.
            </p>
          </section>

          <div className="pt-2">
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Kullanılan Formüller:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  Eksilen - Çıkan = Fark
                </div>
              </div>
            </div>
          </div>
          
          <section className="pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Eksilen sayı, çıkan sayıdan küçük olabilir mi?</h5>
                <p>Evet olabilir, bu durumda işlemin sonucu negatif (eksi değerli) bir sayı çıkacaktır. Aracımız negatif sonuçları da desteklemektedir.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      <RelatedTools category="matematik" currentToolId="cikarma-hesaplama" />
      <Disclaimer category="matematik" />
    </div>
  );
}`;

content = content.substring(0, content.indexOf(oldSeo)) + newSeo;

fs.writeFileSync('src/tools/matematik/CikarmaHesaplama.tsx', content);
