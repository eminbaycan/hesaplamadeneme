export const taxRates = {
  sgkCalisan: 0.14,
  sgkIsveren: 0.155,
  issizlikCalisan: 0.01,
  issizlikIsveren: 0.02,
  gelirVergisi: 0.15,
  damgaVergisi: 0.00759,
  kidemTavani: 41828.40,
};

export function getSavedTaxRates() {
  const saved = localStorage.getItem('customTaxRates');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
  }
  return taxRates;
}

export const marketData = {
  taxRates,
  updatedAt: '2026-08-14',
  source: 'Resmi Gazete / Mevzuat'
};
