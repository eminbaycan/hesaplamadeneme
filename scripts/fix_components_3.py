import re

content = open("src/data/tools.ts").read()

content = content.replace(
    "path: '/sinav/yks-puan',\n    component: YuzdeHesaplama", 
    "path: '/sinav/yks-puan',\n    component: YksPuanHesaplama"
)

content = content.replace(
    "path: '/sinav/kpss-puan',\n    component: YuzdeHesaplama", 
    "path: '/sinav/kpss-puan',\n    component: KpssPuanHesaplama"
)

content = content.replace(
    "path: '/egitim/takdir-tesekkur',\n    component: YuzdeHesaplama", 
    "path: '/egitim/takdir-tesekkur',\n    component: TakdirTesekkurHesaplama"
)

content = content.replace(
    "path: '/egitim/not-ortalamasi',\n    component: YuzdeHesaplama", 
    "path: '/egitim/not-ortalamasi',\n    component: NotOrtalamasiHesaplama"
)

content = content.replace(
    "path: '/saglik/vki-hesaplama',\n    component: YuzdeHesaplama", 
    "path: '/saglik/vki-hesaplama',\n    component: VkiHesaplama"
)

content = content.replace(
    "path: '/saglik/gunluk-kalori',\n    component: YuzdeHesaplama", 
    "path: '/saglik/gunluk-kalori',\n    component: KaloriHesaplama"
)

open("src/data/tools.ts", "w").write(content)
