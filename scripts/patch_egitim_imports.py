import re

content = open("src/data/tools.ts").read()

imports_to_add = """
const YksPuanHesaplama = lazy(() => import('../tools/egitim/YksPuanHesaplama'));
const KpssPuanHesaplama = lazy(() => import('../tools/egitim/KpssPuanHesaplama'));
const TakdirTesekkurHesaplama = lazy(() => import('../tools/egitim/TakdirTesekkurHesaplama'));
const NotOrtalamasiHesaplama = lazy(() => import('../tools/egitim/NotOrtalamasiHesaplama'));
"""

idx = content.find("export const tools: Tool[] = [")
if idx != -1:
    content = content[:idx] + imports_to_add + "\n" + content[idx:]

content = content.replace("id: 'yks-puan-hesaplama',\n    title: 'YKS Puan Hesaplama',\n    description: 'TYT, AYT ve YDT sınav puanlarınızı hesaplayın.',\n    categoryId: 'egitim',\n    keywords: ['yks', 'tyt', 'ayt', 'puan', 'üniversite'],\n    icon: 'mezuniyet',\n    path: '/egitim/yks-puan-hesaplama',\n    component: YuzdeHesaplama,", "id: 'yks-puan-hesaplama',\n    title: 'YKS Puan Hesaplama',\n    description: 'TYT, AYT ve YDT sınav puanlarınızı hesaplayın.',\n    categoryId: 'egitim',\n    keywords: ['yks', 'tyt', 'ayt', 'puan', 'üniversite'],\n    icon: 'mezuniyet',\n    path: '/egitim/yks-puan-hesaplama',\n    component: YksPuanHesaplama,")
content = content.replace("id: 'kpss-puan-hesaplama',\n    title: 'KPSS Puan Hesaplama',\n    description: 'Önlisans, lisans ve ortaöğretim KPSS puanı hesaplayın.',\n    categoryId: 'egitim',\n    keywords: ['kpss', 'memur', 'puan', 'sınav'],\n    icon: 'kpss',\n    path: '/egitim/kpss-puan-hesaplama',\n    component: YuzdeHesaplama,", "id: 'kpss-puan-hesaplama',\n    title: 'KPSS Puan Hesaplama',\n    description: 'Önlisans, lisans ve ortaöğretim KPSS puanı hesaplayın.',\n    categoryId: 'egitim',\n    keywords: ['kpss', 'memur', 'puan', 'sınav'],\n    icon: 'kpss',\n    path: '/egitim/kpss-puan-hesaplama',\n    component: KpssPuanHesaplama,")
content = content.replace("id: 'takdir-tesekkur-hesaplama',\n    title: 'Takdir Teşekkür Hesaplama',\n    description: 'Karne notunuzla belge durumunuzu öğrenin.',\n    categoryId: 'egitim',\n    keywords: ['karne', 'takdir', 'teşekkür', 'okul', 'not'],\n    icon: 'belge',\n    path: '/egitim/takdir-tesekkur-hesaplama',\n    component: YuzdeHesaplama,", "id: 'takdir-tesekkur-hesaplama',\n    title: 'Takdir Teşekkür Hesaplama',\n    description: 'Karne notunuzla belge durumunuzu öğrenin.',\n    categoryId: 'egitim',\n    keywords: ['karne', 'takdir', 'teşekkür', 'okul', 'not'],\n    icon: 'belge',\n    path: '/egitim/takdir-tesekkur-hesaplama',\n    component: TakdirTesekkurHesaplama,")
content = content.replace("id: 'not-ortalamasi-hesaplama',\n    title: 'Not Ortalaması Hesaplama',\n    description: 'Dönem ve genel not ortalamanızı hesaplayın.',\n    categoryId: 'egitim',\n    keywords: ['not', 'ortalama', 'gno', 'ano', 'üniversite'],\n    icon: 'not',\n    path: '/egitim/not-ortalamasi-hesaplama',\n    component: YuzdeHesaplama,", "id: 'not-ortalamasi-hesaplama',\n    title: 'Not Ortalaması Hesaplama',\n    description: 'Dönem ve genel not ortalamanızı hesaplayın.',\n    categoryId: 'egitim',\n    keywords: ['not', 'ortalama', 'gno', 'ano', 'üniversite'],\n    icon: 'not',\n    path: '/egitim/not-ortalamasi-hesaplama',\n    component: NotOrtalamasiHesaplama,")

open("src/data/tools.ts", "w").write(content)
