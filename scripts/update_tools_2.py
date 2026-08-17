import os

# BASIT FAIZ HESAPLAMA
content = open('src/tools/matematik/BasitFaizHesaplama.tsx').read()
content = content.replace(
    'Sıkça Sorulan Sorular ve Bilgiler',
    'Basit Faiz Hakkında Her Şey ve Sıkça Sorulan Sorular'
)
content = content.replace(
    '<h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-2">Basit faiz nedir?</h4>',
    """<h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-2">Nasıl Kullanılır?</h4>
            <p className="mb-4">
              Anaparanızı, faiz oranını ve süreyi girerek "Hesapla" butonuna tıklamanız yeterlidir. Sonuçlar anında görüntülenecektir.
            </p>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-2">Basit faiz nedir?</h4>"""
)
open('src/tools/matematik/BasitFaizHesaplama.tsx', 'w').write(content)


# ALAN HESAPLAMA
content = open('src/tools/matematik/AlanHesaplama.tsx').read()
content = content.replace(
    'Alan Hesaplama Hakkında ve Sıkça Sorulan Sorular',
    'Alan Hesaplama Hakkında Her Şey ve Sıkça Sorulan Sorular'
)
content = content.replace(
    '<h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-2">Alan hesaplama nedir?</h4>',
    """<h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-2">Nasıl Kullanılır?</h4>
            <p className="mb-4">
              Hesaplamak istediğiniz şekli seçin ve gerekli kenar uzunluklarını/ölçülerini girin. Hesapla butonuna tıkladığınızda sonuç anında ekranda gösterilir.
            </p>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-2">Alan hesaplama nedir?</h4>"""
)
open('src/tools/matematik/AlanHesaplama.tsx', 'w').write(content)

# CEVRE HESAPLAMA
content = open('src/tools/matematik/CevreHesaplama.tsx').read()
content = content.replace(
    'Çevre Hesaplama Hakkında ve Sıkça Sorulan Sorular',
    'Çevre Hesaplama Hakkında Her Şey ve Sıkça Sorulan Sorular'
)
content = content.replace(
    '<h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-2">Çevre hesaplama nedir?</h4>',
    """<h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-2">Nasıl Kullanılır?</h4>
            <p className="mb-4">
              Hesaplamak istediğiniz şekli seçin ve ilgili uzunlukları girin. Aracımız seçtiğiniz şeklin çevresini saniyeler içinde hatasız hesaplayacaktır.
            </p>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-2">Çevre hesaplama nedir?</h4>"""
)
open('src/tools/matematik/CevreHesaplama.tsx', 'w').write(content)

# YUZDE HESAPLAMA
content = open('src/tools/matematik/YuzdeHesaplama.tsx').read()
content = content.replace(
    '<h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular</h4>',
    """<h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Kullanılan Formüller</h4>
            <div className="space-y-6 bg-slate-50 dark:bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-black/5 dark:border-white/5 mb-6">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Yüzde Formülü:</div>
                <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 px-4 py-2.5 rounded-xl font-mono text-sm text-[#0056b3] dark:text-blue-400 mb-2 overflow-x-auto">
                  A'nın %B'si = (A x B) / 100
                </div>
              </div>
            </div>
            <h4 className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-4">Sıkça Sorulan Sorular</h4>"""
)
open('src/tools/matematik/YuzdeHesaplama.tsx', 'w').write(content)
