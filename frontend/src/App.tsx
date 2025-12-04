import { useState } from 'react';
import './App.css';
import { RoutesTab } from './adapters/ui/components/RoutesTab';
import { CompareTab } from './adapters/ui/components/CompareTab';
import { BankingTab } from './adapters/ui/components/BankingTab';
import { PoolingTab } from './adapters/ui/components/PoolingTab';

const tabs = [
  { id: 'routes', label: 'Routes', component: <RoutesTab /> },
  { id: 'compare', label: 'Compare', component: <CompareTab /> },
  { id: 'banking', label: 'Banking', component: <BankingTab /> },
  { id: 'pooling', label: 'Pooling', component: <PoolingTab /> },
] as const;

function App() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]['id']>('routes');

  const currentTab = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight via-slate-950 to-midnight px-4 py-10 text-white md:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-3xl bg-white/10 p-8 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">FuelEU Maritime</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Compliance &amp; Banking Control Tower
          </h1>
          <p className="mt-3 max-w-3xl text-white/70">
            Monitor voyage KPIs, benchmark against FuelEU intensity targets, and execute Article 20
            banking or Article 21 pooling decisions with confidence.
          </p>
        </header>

        <nav className="flex flex-wrap gap-3 rounded-2xl bg-white/10 p-2 text-sm font-semibold text-white/70">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 rounded-xl px-4 py-2 transition ${
                activeTab === tab.id ? 'bg-white text-slate-900 shadow-lg' : 'hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <main>{currentTab.component}</main>
      </div>
    </div>
  );
}

export default App;
