import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export function AppLayout() {
  return (
    <div className="min-h-screen w-full bg-[#eef2f7] dark:bg-slate-950 font-sans flex flex-col text-[#2d3436] dark:text-slate-200 transition-colors">
      <Header />
      <main className="flex-1 flex flex-col w-full">
        <section className="flex-1 p-4 lg:p-8 w-full max-w-7xl mx-auto">
          <Outlet />
        </section>
        <Footer />
      </main>
    </div>
  );
}
