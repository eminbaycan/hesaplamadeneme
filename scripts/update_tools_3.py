# ALAN HESAPLAMA
content = open('src/tools/matematik/AlanHesaplama.tsx').read()
content = content.replace(
    'Sıkça Sorulan Sorular ve Bilgiler',
    'Alan Hesaplama Hakkında Her Şey ve Sıkça Sorulan Sorular'
)
open('src/tools/matematik/AlanHesaplama.tsx', 'w').write(content)

# CEVRE HESAPLAMA
content = open('src/tools/matematik/CevreHesaplama.tsx').read()
content = content.replace(
    'Sıkça Sorulan Sorular ve Bilgiler',
    'Çevre Hesaplama Hakkında Her Şey ve Sıkça Sorulan Sorular'
)
open('src/tools/matematik/CevreHesaplama.tsx', 'w').write(content)
