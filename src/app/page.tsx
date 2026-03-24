'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ClientProvider from '@/components/ClientProvider';
import BlacksmithingTab from '@/components/BlacksmithingTab';
import JewelcraftingTab from '@/components/JewelcraftingTab';

type Tab = 'blacksmithing' | 'jewelcrafting';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('blacksmithing');

  return (
    <ClientProvider>
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Header />

      {/* Tab Navigation */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-1 -mb-px">
            <button
              onClick={() => setActiveTab('blacksmithing')}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'blacksmithing'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
              }`}
            >
              Blacksmithing
            </button>
            <button
              onClick={() => setActiveTab('jewelcrafting')}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'jewelcrafting'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
              }`}
            >
              Jewelcrafting
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'blacksmithing' && <BlacksmithingTab />}
        {activeTab === 'jewelcrafting' && <JewelcraftingTab />}
      </main>
    </div>
    </ClientProvider>
  );
}
