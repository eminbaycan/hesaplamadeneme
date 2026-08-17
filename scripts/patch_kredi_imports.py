import re

content = open("src/data/tools.ts").read()

# Ekle: Kredi importları
imports_to_add = """
const IhtiyacKredisi = lazy(() => import('../tools/kredi/IhtiyacKredisi'));
const KonutKredisi = lazy(() => import('../tools/kredi/KonutKredisi'));
const TasitKredisi = lazy(() => import('../tools/kredi/TasitKredisi'));
"""

idx = content.find("export const tools: Tool[] = [")
if idx != -1:
    content = content[:idx] + imports_to_add + "\n" + content[idx:]
    
content = content.replace("id: 'ihtiyac-kredisi',\n    title: 'İhtiyaç Kredisi Hesaplama',\n    description: 'İhtiyaç kredisi faiz ve taksitlerini hesaplayın.',\n    categoryId: 'kredi',\n    keywords: ['kredi', 'ihtiyaç', 'taksit', 'faiz'],\n    icon: 'ihtiyac',\n    path: '/kredi/ihtiyac-kredisi',\n    component: YuzdeHesaplama,", "id: 'ihtiyac-kredisi',\n    title: 'İhtiyaç Kredisi Hesaplama',\n    description: 'İhtiyaç kredisi faiz ve taksitlerini hesaplayın.',\n    categoryId: 'kredi',\n    keywords: ['kredi', 'ihtiyaç', 'taksit', 'faiz'],\n    icon: 'ihtiyac',\n    path: '/kredi/ihtiyac-kredisi',\n    component: IhtiyacKredisi,")
content = content.replace("id: 'konut-kredisi',\n    title: 'Konut Kredisi Hesaplama',\n    description: 'Konut kredisi faiz ve taksitlerini hesaplayın.',\n    categoryId: 'kredi',\n    keywords: ['kredi', 'konut', 'ev', 'taksit', 'faiz'],\n    icon: 'konut',\n    path: '/kredi/konut-kredisi',\n    component: YuzdeHesaplama,", "id: 'konut-kredisi',\n    title: 'Konut Kredisi Hesaplama',\n    description: 'Konut kredisi faiz ve taksitlerini hesaplayın.',\n    categoryId: 'kredi',\n    keywords: ['kredi', 'konut', 'ev', 'taksit', 'faiz'],\n    icon: 'konut',\n    path: '/kredi/konut-kredisi',\n    component: KonutKredisi,")
content = content.replace("id: 'tasit-kredisi',\n    title: 'Taşıt Kredisi Hesaplama',\n    description: 'Taşıt kredisi faiz ve taksitlerini hesaplayın.',\n    categoryId: 'kredi',\n    keywords: ['kredi', 'taşıt', 'araba', 'taksit', 'faiz'],\n    icon: 'tasit',\n    path: '/kredi/tasit-kredisi',\n    component: YuzdeHesaplama,", "id: 'tasit-kredisi',\n    title: 'Taşıt Kredisi Hesaplama',\n    description: 'Taşıt kredisi faiz ve taksitlerini hesaplayın.',\n    categoryId: 'kredi',\n    keywords: ['kredi', 'taşıt', 'araba', 'taksit', 'faiz'],\n    icon: 'tasit',\n    path: '/kredi/tasit-kredisi',\n    component: TasitKredisi,")

open("src/data/tools.ts", "w").write(content)
