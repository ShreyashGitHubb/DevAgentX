import React from 'react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'workspace', label: 'Workspace', icon: 'terminal' },
    { id: 'architecture', label: 'Architecture', icon: 'account_tree' },
    { id: 'settings', label: 'Settings', icon: 'settings' }
  ];

  return (
    <aside className="h-screen w-16 md:w-64 fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant flex flex-col py-panel-padding z-50 transition-all duration-300">
      {/* Branding Header */}
      <div className="px-6 mb-10">
        <h1 className="font-headline-sm text-headline-sm font-bold text-primary-container tracking-tighter hidden md:block">
          DevAgentX
        </h1>
        <h1 className="font-headline-sm text-headline-sm font-bold text-primary-container tracking-tighter block md:hidden">
          DAX
        </h1>
        <p className="font-label-caps text-[10px] text-outline uppercase tracking-widest mt-1 hidden md:block">
          Super Core Active
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group flex items-center px-6 py-3 cursor-pointer active:scale-95 transition-all ${
                isActive
                  ? 'text-primary-container border-r-2 border-primary-container bg-primary/10'
                  : 'text-on-surface-variant hover:bg-surface-variant'
              }`}
            >
              <span 
                className="material-symbols-outlined mr-4"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {tab.icon}
              </span>
              <span className="font-label-caps text-label-caps hidden md:block">
                {tab.label}
              </span>
            </div>
          );
        })}
      </nav>

      {/* Action Button */}
      <div className="px-4 mt-auto">
        <button 
          onClick={() => alert("Agent Deployed: Core agent listener listening on active dev branch.")}
          className="w-full bg-primary-container text-on-primary py-3 rounded-lg flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all text-sm font-semibold"
        >
          <span className="material-symbols-outlined text-[18px]">bolt</span>
          <span className="hidden md:block font-label-caps uppercase tracking-wider">
            Deploy Agent
          </span>
        </button>
      </div>
    </aside>
  );
}
