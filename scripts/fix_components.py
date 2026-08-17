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

for tool_path_id, component in replacements.items():
    # Find the object with path ending in tool_path_id and replace its component
    pattern = r"(path:\s*'/[^']*/" + tool_path_id + r"',\s*component:\s*)YuzdeHesaplama"
    content = re.sub(pattern, r"\g<1>" + component, content)

open("src/data/tools.ts", "w").write(content)
