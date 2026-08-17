/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Home } from './pages/Home';
import { AllTools } from './pages/AllTools';
import { CategoryView } from './pages/CategoryView';
import { OrnekSablon } from './pages/OrnekSablon';
import { GuncelVeriler } from './pages/GuncelVeriler';
import { CorporatePage } from './pages/corporate/CorporatePage';
import { NotFound } from './pages/NotFound';
import { AdminStatusCheck } from './pages/AdminStatusCheck';
import { tools } from './data/tools';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="tum-araclar" element={<AllTools />} />
          <Route path="kategori/:id" element={<CategoryView />} />
          <Route path="sablon" element={<OrnekSablon />} />
          
          {/* Admin Routes */}
          <Route path="admin/denetim" element={<AdminStatusCheck />} />
          <Route path="admin/piyasa-verileri" element={<GuncelVeriler />} />
          
          <Route path="kurumsal/hakkimizda" element={<CorporatePage title="Hakkımızda" />} />
          <Route path="kurumsal/iletisim" element={<CorporatePage title="İletişim" />} />
          <Route path="kurumsal/gizlilik-politikasi" element={<CorporatePage title="Gizlilik Politikası" />} />
          <Route path="kurumsal/kullanim-sartlari" element={<CorporatePage title="Kullanım Şartları" />} />
          <Route path="kurumsal/kvkk" element={<CorporatePage title="KVKK Aydınlatma Metni" />} />

          {tools.filter(tool => tool.component).map((tool) => {
            const ToolComponent = tool.component!;
            return (
              <React.Fragment key={tool.id}>
                <Route
                  path={tool.path.replace(/^\//, '')}
                  element={
                    <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-500">Yükleniyor...</div>}>
                      <ToolComponent />
                    </Suspense>
                  }
                />
              </React.Fragment>
            );
          })}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
