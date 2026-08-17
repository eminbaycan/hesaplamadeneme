import re

content = open("src/data/tools.ts").read()

imports_to_add = """
const VkiHesaplama = lazy(() => import('../tools/saglik/VkiHesaplama'));
const KaloriHesaplama = lazy(() => import('../tools/saglik/KaloriHesaplama'));
"""

idx = content.find("export const tools: Tool[] = [")
if idx != -1:
    content = content[:idx] + imports_to_add + "\n" + content[idx:]

content = content.replace("id: 'vki-hesaplama',\n    title: 'VKİ Hesaplama',\n    description: 'Vücut kitle indeksinizi ve ideal kilonuzu öğrenin.',\n    categoryId: 'saglik',\n    keywords: ['vki', 'kilo', 'boy', 'ideal kilo', 'sağlık'],\n    icon: 'saglik',\n    path: '/saglik/vki-hesaplama',\n    component: YuzdeHesaplama,", "id: 'vki-hesaplama',\n    title: 'VKİ Hesaplama',\n    description: 'Vücut kitle indeksinizi ve ideal kilonuzu öğrenin.',\n    categoryId: 'saglik',\n    keywords: ['vki', 'kilo', 'boy', 'ideal kilo', 'sağlık'],\n    icon: 'saglik',\n    path: '/saglik/vki-hesaplama',\n    component: VkiHesaplama,")
content = content.replace("id: 'kalori-hesaplama',\n    title: 'Kalori Hesaplama',\n    description: 'Günlük ihtiyacınız olan kalori miktarını öğrenin.',\n    categoryId: 'saglik',\n    keywords: ['kalori', 'diyet', 'metabolizma', 'sağlık'],\n    icon: 'kalori',\n    path: '/saglik/kalori-hesaplama',\n    component: YuzdeHesaplama,", "id: 'kalori-hesaplama',\n    title: 'Kalori Hesaplama',\n    description: 'Günlük ihtiyacınız olan kalori miktarını öğrenin.',\n    categoryId: 'saglik',\n    keywords: ['kalori', 'diyet', 'metabolizma', 'sağlık'],\n    icon: 'kalori',\n    path: '/saglik/kalori-hesaplama',\n    component: KaloriHesaplama,")

open("src/data/tools.ts", "w").write(content)
