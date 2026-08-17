import React, { useState, useEffect } from 'react';
import { tools } from '../data/tools';
import { CheckCircle, XCircle, RefreshCw, ShieldAlert, AlertTriangle, Info, X, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tool } from '../types';

// @ts-ignore
const rawToolFiles = import.meta.glob('/src/tools/**/*.tsx', { query: '?raw', import: 'default' });

const toolDataSources: Record<string, { source: string; date: string }> = {
  'maas-hesaplama': { source: 'GİB / SGK Mevzuat & Vergi Dilimleri', date: '2026-08-14' },
  'zekat-hesaplama': { source: 'Canlı Altın & Gümüş API (Gold-API / ExchangeRate)', date: 'Canlı / Anlık' },
  'kidem-tazminati-hesaplama': { source: 'Bakanlık Kıdem Tavanı & Damga Vergisi', date: '2026-08-14' },
  'kira-artis-orani-hesaplama': { source: 'TÜİK 12 Aylık TÜFE Ortalaması', date: '2026-08-14' },
  'kira-bedeli-artis-hesaplama': { source: 'TÜİK TÜFE / Yasal Kira Artış Tavanı', date: '2026-08-14' },
  'mtv-hesaplama': { source: 'GİB MTV Güncel Tarifesi ve Yaş/Hacim Tablosu', date: '2026-08-14' },
  'vergi-dilimi-hesaplama': { source: 'GİB Gelir Vergisi Dilim ve Oranları', date: '2026-08-14' },
  'tapu-harci-hesaplama': { source: 'Tapu Kadastro Harç Oranları ve Döner Sermaye', date: '2026-08-14' },
  'serbest-meslek-makbuzu-hesaplama': { source: 'GİB Stopaj ve KDV Oranları', date: '2026-08-14' },
  'mevduat-faizi-hesaplama': { source: 'TCMB / Banka Faiz & Stopaj Oranları', date: '2026-08-14' },
  'bes-getiri-hesaplama': { source: 'SEDDK / %30 Devlet Katkısı ve Emeklilik Fon Oranları', date: '2026-08-14' },
  'altin-yatirim-hesaplama': { source: 'Serbest Piyasa & Kapalıçarşı Altın Fiyatları', date: '2026-08-14' },
  'doviz-maliyeti-hesaplama': { source: 'TCMB / Bankalararası Döviz Kurları', date: '2026-08-14' },
  'hisse-senedi-hesaplama': { source: 'Borsa İstanbul (BIST) & SPK Komisyon Oranları', date: '2026-08-14' },
  'kripto-kar-zarar-hesaplama': { source: 'Kripto Varlık ve Borsa Verileri', date: '2026-08-14' },
  'enflasyon-hesaplama': { source: 'TÜİK TÜFE Fiyat Endeksleri', date: '2026-08-14' },
  'kredi-karti-asgari-hesaplama': { source: 'BDDK Asgari Ödeme Oranları ve Faizleri', date: '2026-08-14' },
  'tasit-kredisi-hesaplama': { source: 'BDDK / Banka Kredi Faiz ve Vergi Oranları', date: '2026-08-14' },
  'ihtiyac-kredisi': { source: 'Banka İhtiyaç Kredisi Faiz & KKDF/BSMV Oranları', date: '2026-08-14' },
  'konut-kredisi': { source: 'Banka Konut Kredisi Faiz Oranları & BSMV Muafiyeti', date: '2026-08-14' },
  'kdv-hesaplama': { source: 'GİB Yasal KDV Oranları (%1, %10, %20)', date: '2026-08-14' },
  'elektrik-faturasi-hesaplama': { source: 'EPDK Elektrik Tarifesi ve Kademeleri', date: '2026-08-14' },
  'dogalgaz-faturasi-hesaplama': { source: 'BOTAŞ Doğalgaz m3 Tarifeleri', date: '2026-08-14' },
  'su-faturasi-hesaplama': { source: 'Belediye Su Tarifesi ve ÇTV Bedelleri', date: '2026-08-14' },
  'yakit-maliyeti-hesaplama': { source: 'EPDK Akaryakıt Litre Fiyatları', date: '2026-08-14' },
  'yillik-izin-ucreti-hesaplama': { source: '4857 Sayılı İş Kanunu İzin Katsayıları', date: '2026-08-14' },
  'bilesik-faiz-hesaplama': { source: 'Bileşik Faiz ve Getiri Parametreleri', date: '2026-08-14' },
  'yatirim-getirisi-hesaplama': { source: 'Finansal ROI ve Getiri Parametreleri', date: '2026-08-14' },
  'yks-puan-hesaplama': { source: 'ÖSYM YKS Katsayı ve Standart Puan Verileri', date: '2026-08-01' },
  'kpss-puan-hesaplama': { source: 'ÖSYM KPSS Katsayı ve Standart Puan Verileri', date: '2026-08-01' },
};

interface ToolStatus {
  id: string;
  title: string;
  category: string;
  path: string;
  hasDisclaimer: boolean;
  hasFAQ: boolean;
  hasDescription: boolean;
  hasValidSeoMeta: boolean;
  wordCount: number;
  hasFormula: boolean;
  hasRelatedTools: boolean;
  keywords?: string[];
  error?: string;
  addedAt?: string;
  updatedAt?: string;
  version?: string;
  isExternalData?: boolean;
  dataSource?: string;
  lastFetched?: string;
}

export function AdminStatusCheck() {
  const [statuses, setStatuses] = useState<ToolStatus[]>([]);
  const [allStatuses, setAllStatuses] = useState<ToolStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [selectedToolInfo, setSelectedToolInfo] = useState<ToolStatus | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'custom' | 'standard' | 'missing'>('all');

  const checkTools = async () => {
    setLoading(true);
    
    const results: ToolStatus[] = [];
    for (const tool of tools) {
      try {
        const expectedFileName = tool.path.split('/').pop()?.replace(/-/g, '') || ''; 
        
        let fileContent = '';
        let matchedPath = Object.keys(rawToolFiles).find(path =>
            path.toLowerCase().includes(tool.id.replace(/-/g, '').toLowerCase()) ||
            path.toLowerCase().includes(expectedFileName.toLowerCase())
        );

        if (matchedPath) {
          const mod = await rawToolFiles[matchedPath]();
          fileContent = typeof mod === 'string' ? mod : ((mod as any)?.default || '');
        }

        const dataInfo = toolDataSources[tool.id];
        const usesCodeData = fileContent ? (
          fileContent.includes('taxRates') || 
          fileContent.includes('marketData') || 
          fileContent.includes('fetch(') || 
          fileContent.includes('localStorage')
        ) : false;

        const isExternalData = !!dataInfo || usesCodeData;
        const dataSource = dataInfo?.source || (usesCodeData ? 'Özel Veri / Mevzuat' : undefined);
        const lastFetched = dataInfo?.date || (usesCodeData ? '2026-08-14' : undefined);

        if (!fileContent) {
          results.push({
            id: tool.id,
            title: tool.title,
            category: tool.categoryId,
            path: tool.path,
            hasDisclaimer: false,
            hasFAQ: false,
            hasDescription: false,
            hasValidSeoMeta: false,
            wordCount: 0,
            hasFormula: false,
            hasRelatedTools: false,
            error: "Dosya bulunamadı",
            keywords: [],
            addedAt: tool.addedAt,
            updatedAt: tool.updatedAt,
            version: tool.version,
            isExternalData,
            dataSource,
            lastFetched,
          });
          continue;
        }

        results.push({
          id: tool.id,
          title: tool.title,
          category: tool.categoryId,
          path: tool.path,
          hasDisclaimer: fileContent.includes('<Disclaimer') || fileContent.includes('Sorumluluk Reddi'),
          hasFAQ: fileContent.includes('Sıkça Sorulan Sorular') || fileContent.includes('SSS'),
          hasDescription: fileContent.includes('Nedir ve Nasıl') || fileContent.includes('Hakkında Her Şey') || fileContent.includes('Nasıl Kullanılır'),
          hasFormula: fileContent.includes('Kullanılan Formüller') || fileContent.includes('Formülü:'),
          hasValidSeoMeta: (tool.description?.length >= 130 && tool.description?.length <= 150),
          wordCount: fileContent.split(/\s+/).length,
          hasRelatedTools: fileContent.includes('<RelatedTools') || fileContent.includes('Diğer Araçlar') || fileContent.includes('Benzer Araçlar'),
          keywords: tool.keywords || [],
          addedAt: tool.addedAt,
          updatedAt: tool.updatedAt,
          version: tool.version,
          isExternalData,
          dataSource,
          lastFetched,
        });

      } catch (error) {
        const dataInfo = toolDataSources[tool.id];
        results.push({
          id: tool.id,
          title: tool.title,
          category: tool.categoryId,
          path: tool.path,
          hasDisclaimer: false,
          hasFAQ: false,
          hasDescription: false,
          hasValidSeoMeta: false,
          wordCount: 0,
          hasFormula: false,
          hasRelatedTools: false,
          error: "Okuma hatası",
          keywords: [],
          addedAt: tool.addedAt,
          updatedAt: tool.updatedAt,
          version: tool.version,
          isExternalData: !!dataInfo,
          dataSource: dataInfo?.source,
          lastFetched: dataInfo?.date,
        });
      }
    }
    setAllStatuses(results);
    setLastCheck(new Date());
    setLoading(false);
  };

  useEffect(() => {
    const filtered = allStatuses.filter((t) => {
      const isAllGood = t.hasDisclaimer && t.hasValidSeoMeta && t.wordCount >= 300 && t.hasFAQ && t.hasDescription && t.hasFormula && t.hasRelatedTools && (t.keywords || []).length >= 6;
      const isMissing = !!t.error || !isAllGood;

      const matchesSearch = 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (searchQuery.toLowerCase() === 'eksik' && isMissing) ||
        (searchQuery.toLowerCase() === 'özel' && t.isExternalData) ||
        (searchQuery.toLowerCase() === 'standart' && !t.isExternalData);

      if (!matchesSearch) return false;
      if (activeFilter === 'custom') return !!t.isExternalData;
      if (activeFilter === 'standard') return !t.isExternalData;
      if (activeFilter === 'missing') return isMissing;
      return true;
    });
    setStatuses(filtered);
  }, [searchQuery, activeFilter, allStatuses]);

  useEffect(() => {
    checkTools();
  }, []);

  const getStatusIcon = (status: boolean) => {
    return status 
      ? <CheckCircle className="text-emerald-500 mx-auto" size={18} />
      : <XCircle className="text-rose-500 mx-auto" size={18} />;
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="text-[#0056b3] dark:text-blue-400" />
            Sistem İçerik Denetimi
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Tüm araçların SEO ve standart içerik kurallarına (SSS, Açıklama, Sorumluluk Reddi) uyup uymadığını denetler.</p>
        </div>
        <button 
          onClick={checkTools} 
          disabled={loading}
          className="bg-[#0056b3] hover:bg-[#004494] text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all disabled:opacity-50 shrink-0"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          {loading ? "Denetleniyor..." : "Yeniden Denetle"}
        </button>
      </div>

      {/* SEO UYUM VE DENETİM REHBERİ */}
      <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-5 mb-8">
        <h2 className="text-sm font-bold text-blue-950 dark:text-blue-300 flex items-center gap-1.5 mb-3">
          <Info size={16} /> SEO & İçerik Denetim Standartları
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-400">
          <div className="space-y-1">
            <span className="font-semibold text-slate-800 dark:text-slate-300 block">Meta Description (Açıklama) Kuralları:</span>
            <p>Meta açıklamaları Google standartlarına en yüksek uyumu sağlamak için tam olarak <strong className="text-blue-700 dark:text-blue-400">130 – 150 karakter</strong> uzunluğunda olmalıdır.</p>
          </div>
          <div className="space-y-1">
            <span className="font-semibold text-slate-800 dark:text-slate-300 block">Araç Sayfası Metin Yapısı (300 – 500 Kelime):</span>
            <p>Arama motoru optimizasyonu (SEO) için araç sayfalarında aşağıdaki bölümler eksiksiz bulunmalı ve <strong className="text-blue-700 dark:text-blue-400">her bir madde/bölüm en az 50 – 100 kelime</strong> uzunluğunda detaylandırılmalıdır:</p>
            <ul className="list-disc pl-4 space-y-0.5 mt-1 text-[11px]">
              <li>Nasıl Kullanılır? & Hesaplama Rehberi <span className="text-blue-600 dark:text-blue-400 font-medium">(En az 50-100 kelime)</span></li>
              <li>Hesaplama Nedir ve Nasıl Hesaplanır? <span className="text-blue-600 dark:text-blue-400 font-medium">(En az 50-100 kelime)</span></li>
              <li>Kullanılan Formüller ve Matematiksel Mantık <span className="text-blue-600 dark:text-blue-400 font-medium">(En az 50-100 kelime)</span></li>
              <li>Sıkça Sorulan Sorular (SSS) <span className="text-blue-600 dark:text-blue-400 font-medium">(En az 50-100 kelime)</span></li>
              <li>Sorumluluk Reddi ve Bilgilendirme <span className="text-blue-600 dark:text-blue-400 font-medium">(En az 50-100 kelime)</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Araç adı veya kategori ile ara..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 shrink-0">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1 shrink-0">Filtrele:</span>
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border shrink-0 ${
              activeFilter === 'all'
                ? 'bg-[#0056b3] text-white border-[#0056b3] shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            Tümü ({allStatuses.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('custom')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 shrink-0 ${
              activeFilter === 'custom'
                ? 'bg-[#10b981] text-white border-[#10b981] shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${activeFilter === 'custom' ? 'bg-white' : 'bg-emerald-500'}`}></span>
            Özel ({allStatuses.filter(t => t.isExternalData).length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('standard')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 shrink-0 ${
              activeFilter === 'standard'
                ? 'bg-slate-700 text-white border-slate-700 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            Standart ({allStatuses.filter(t => !t.isExternalData).length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('missing')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 shrink-0 ${
              activeFilter === 'missing'
                ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${activeFilter === 'missing' ? 'bg-white' : 'bg-rose-500'}`}></span>
            Eksik ({allStatuses.filter(t => !!t.error || !(t.hasDisclaimer && t.hasValidSeoMeta && t.wordCount >= 300 && t.hasFAQ && t.hasDescription && t.hasFormula && t.hasRelatedTools && (t.keywords || []).length >= 6)).length})
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Kategori</th>
                <th className="px-4 py-3 font-semibold">Veri Tipi</th>
                <th className="px-4 py-3 font-semibold">Araç Adı</th>
                <th className="px-3 py-3 font-semibold text-center">Örnek</th>
                <th className="px-3 py-3 font-semibold text-center">S. Reddi</th>
                <th className="px-3 py-3 font-semibold text-center">SSS</th>
                <th className="px-3 py-3 font-semibold text-center">Açıklama</th>
                <th className="px-3 py-3 font-semibold text-center">Formül</th>
                <th className="px-3 py-3 font-semibold text-center">Keywords</th>
                <th className="px-4 py-3 font-semibold text-center">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {statuses.map((tool) => {
                const isAllGood = tool.hasDisclaimer && tool.hasValidSeoMeta && tool.wordCount >= 300 && tool.hasFAQ && tool.hasDescription && tool.hasFormula && tool.hasRelatedTools && (tool.keywords || []).length >= 6;
                const isMissing = !!tool.error || !isAllGood;
                
                return (
                  <tr key={tool.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">
                        {tool.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 min-h-[24px]">
                        {tool.isExternalData ? (
                          <span 
                            className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800" 
                            title={tool.dataSource ? `Özel Veri: ${tool.dataSource}` : "Özel Veri Kullanıyor"}
                          >
                            Özel
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            Standart
                          </span>
                        )}
                        {isMissing && (
                          <span 
                            className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800/30" 
                            title={tool.error ? `Eksik: ${tool.error}` : "Eksik İçerik, Metalar veya Keywords Var"}
                          >
                            EKSİK
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <span>{tool.title}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">{getStatusIcon(tool.hasRelatedTools)}</td>
                    <td className="px-3 py-3">{getStatusIcon(tool.hasDisclaimer)}</td>
                    <td className="px-3 py-3">{getStatusIcon(tool.hasFAQ)}</td>
                    <td className="px-3 py-3">{getStatusIcon(tool.hasDescription)}</td>
                    <td className="px-3 py-3">{getStatusIcon(tool.hasFormula)}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center" title={`${(tool.keywords || []).length} anahtar kelime`}>
                        {(tool.keywords || []).length >= 6 
                          ? <CheckCircle className="text-emerald-500" size={18} />
                          : <XCircle className="text-rose-500" size={18} />}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <Link 
                          to={tool.path} 
                          className="text-[#0056b3] hover:text-[#004494] dark:text-blue-400 dark:hover:text-blue-300 font-medium text-xs flex items-center gap-1"
                        >
                          Git
                        </Link>
                        <button
                          onClick={() => setSelectedToolInfo(tool)}
                          className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                          title="Sürüm ve Tarih Bilgisi"
                        >
                          <Info size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {statuses.length === 0 && !loading && (
          <div className="p-8 text-center text-slate-500">
            Hiç araç bulunamadı veya henüz denetlenmedi.
          </div>
        )}
      </div>

      {/* PİYASA VERİLERİNE GİT */}
      <div className="mt-8 flex justify-end">
        <Link 
          to="/admin/piyasa-verileri"
          className="text-[#0056b3] dark:text-blue-400 font-semibold flex items-center gap-2 hover:underline"
        >
          <Coins size={18} /> Piyasa Verilerini Yönet
        </Link>
      </div>
      
      {lastCheck && (
        <div className="mt-4 text-right text-xs text-slate-500 dark:text-slate-500">
          Son Denetim: {lastCheck.toLocaleTimeString('tr-TR')}
        </div>
      )}

      {/* BILGI MODALI */}
      {selectedToolInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">{selectedToolInfo.title}</h3>
              <button 
                onClick={() => setSelectedToolInfo(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 sm:p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block">Araç Kodu (ID)</label>
                <div className="text-sm font-medium text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-700">
                  {selectedToolInfo.id}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block">Kategori</label>
                <div className="text-sm font-medium text-slate-800 dark:text-slate-200 capitalize">
                  {selectedToolInfo.category}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block">Eklenme</label>
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {selectedToolInfo.addedAt ? new Date(selectedToolInfo.addedAt).toLocaleDateString('tr-TR') : 'Bilinmiyor'}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block">Güncellenme</label>
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {selectedToolInfo.updatedAt ? new Date(selectedToolInfo.updatedAt).toLocaleDateString('tr-TR') : 'Henüz Güncellenmedi'}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block">Versiyon</label>
                <div className="text-sm font-medium text-[#0056b3] dark:text-blue-400 inline-flex bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-800/50">
                  {selectedToolInfo.version || 'v1.0.0'}
                </div>
              </div>
              {selectedToolInfo.isExternalData && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block">Veri Kaynağı & Tarihi</label>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    {selectedToolInfo.dataSource} - {selectedToolInfo.lastFetched}
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => setSelectedToolInfo(null)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white font-medium rounded-xl py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
