import re

content = open("src/data/tools.ts").read()

replacements = {
    "tasit-kredisi": "TasitKredisi",
    "kdv-hesaplama": "KdvHesaplama",
    "maas-hesaplama": "MaasHesaplama",
    "yks-puan": "YksPuanHesaplama",
    "kpss-puan": "KpssPuanHesaplama",
    "takdir-tesekkur": "TakdirTesekkurHesaplama",
    "not-ortalamasi": "NotOrtalamasiHesaplama",
    "vki-hesaplama": "VkiHesaplama",
    "gunluk-kalori": "KaloriHesaplama"
}

# The previous script might not have matched if the path didn't start with the category.
# Since we now see the exact paths, let's fix them manually for certainty:

content = content.replace("component: YuzdeHesaplama", "component: YksPuanHesaplama", 1) if "path: '/sinav/yks-puan'" in content else content

