import re

content = open("src/data/tools.ts").read()

imports_to_add = """
const KdvHesaplama = lazy(() => import('../tools/finans/KdvHesaplama'));
const MaasHesaplama = lazy(() => import('../tools/finans/MaasHesaplama'));
"""

idx = content.find("export const tools: Tool[] = [")
if idx != -1:
    content = content[:idx] + imports_to_add + "\n" + content[idx:]

content = content.replace("id: 'kdv-hesaplama',\n    title: 'KDV Hesaplama',\n    description: 'KDV dahil ve hariç tutarları hesaplayın.',\n    categoryId: 'finans',\n    keywords: ['kdv', 'vergi', 'finans', 'hesaplama'],\n    icon: 'kdv',\n    path: '/finans/kdv-hesaplama',\n    component: YuzdeHesaplama,", "id: 'kdv-hesaplama',\n    title: 'KDV Hesaplama',\n    description: 'KDV dahil ve hariç tutarları hesaplayın.',\n    categoryId: 'finans',\n    keywords: ['kdv', 'vergi', 'finans', 'hesaplama'],\n    icon: 'kdv',\n    path: '/finans/kdv-hesaplama',\n    component: KdvHesaplama,")
content = content.replace("id: 'maas-hesaplama',\n    title: 'Maaş Hesaplama',\n    description: 'Brütten nete, netten brüte maaş hesaplayın.',\n    categoryId: 'finans',\n    keywords: ['maaş', 'brüt', 'net', 'sgk', 'vergi'],\n    icon: 'maas',\n    path: '/finans/maas-hesaplama',\n    component: YuzdeHesaplama,", "id: 'maas-hesaplama',\n    title: 'Maaş Hesaplama',\n    description: 'Brütten nete, netten brüte maaş hesaplayın.',\n    categoryId: 'finans',\n    keywords: ['maaş', 'brüt', 'net', 'sgk', 'vergi'],\n    icon: 'maas',\n    path: '/finans/maas-hesaplama',\n    component: MaasHesaplama,")

open("src/data/tools.ts", "w").write(content)
