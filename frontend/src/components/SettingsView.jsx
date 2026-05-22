import React, { useState } from 'react';

export default function SettingsView() {
  const [apiKey, setApiKey] = useState('••••••••••••••••••••••••••••••••••••');
  const [threshold, setThreshold] = useState(50);
  const [forceLocal, setForceLocal] = useState(false);
  const [activeModel, setActiveModel] = useState('gemini-2.5-flash');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] relative bg-surface-container-lowest overflow-hidden flex flex-col p-8 overflow-y-auto">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#00f0ff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />

      <div className="relative z-10 max-w-3xl w-full mx-auto space-y-8 pb-12">
        {/* Title */}
        <div>
          <h2 className="font-display-lg text-[32px] text-on-surface flex items-center gap-3">
            <span className="material-symbols-outlined text-[36px] text-primary-container">settings</span>
            Control Console
          </h2>
          <p className="text-sm text-outline mt-1 font-code-md">
            Manage router thresholds, model orchestrators, and keys.
          </p>
        </div>

        {isSaved && (
          <div className="p-4 rounded-xl border border-tertiary-container/30 bg-tertiary/10 text-tertiary-fixed-dim text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <span className="material-symbols-outlined">check_circle</span>
            <div>
              <p className="font-semibold">Configurations Saved Successfully</p>
              <p className="text-xs opacity-80 mt-0.5">Router pipelines have been re-initialized with new criteria.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Card 1: Core Routing parameters */}
          <div className="glass-panel p-6 rounded-xl space-y-6">
            <h3 className="font-label-caps text-label-caps text-primary-container flex items-center gap-2 border-b border-outline-variant/30 pb-3">
              <span className="material-symbols-outlined text-lg">alt_route</span>
              Router Calibration
            </h3>

            {/* Threshold Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-on-surface flex items-center gap-1.5">
                  Nano-to-Super Threshold
                  <span className="material-symbols-outlined text-outline text-sm cursor-help" title="Character length above which requests will be elevated to the Super Agent reasoning layer.">info</span>
                </label>
                <span className="text-xs font-code-md px-2 py-0.5 rounded bg-surface-container-high border border-outline-variant text-primary-container font-bold">
                  {threshold} characters
                </span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="500" 
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary-container"
              />
              <div className="flex justify-between text-[10px] text-outline">
                <span>10 (Aggressive Super Elevation)</span>
                <span>500 (Strict Local Nano Processing)</span>
              </div>
            </div>

            {/* Toggle Simulator */}
            <div className="flex items-center justify-between pt-2">
              <div className="space-y-1 pr-6">
                <label className="text-sm font-semibold text-on-surface flex items-center gap-1.5">
                  Force Local Simulator
                </label>
                <p className="text-xs text-outline">
                  Bypass the Express API calls completely and simulate response models locally.
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setForceLocal(!forceLocal)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  forceLocal ? 'bg-primary-container' : 'bg-surface-container-highest'
                }`}
              >
                <span 
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-surface shadow ring-0 transition duration-200 ease-in-out ${
                    forceLocal ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Card 2: AI Credentials */}
          <div className="glass-panel p-6 rounded-xl space-y-6">
            <h3 className="font-label-caps text-label-caps text-secondary flex items-center gap-2 border-b border-outline-variant/30 pb-3">
              <span className="material-symbols-outlined text-lg">vpn_key</span>
              AI Orchestrator Credentials
            </h3>

            {/* Select Model */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface block">
                Super Agent LLM Orchestrator
              </label>
              <select 
                value={activeModel}
                onChange={(e) => setActiveModel(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 font-code-md text-sm text-on-surface focus:ring-1 focus:ring-secondary focus:border-secondary outline-none"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended - Balanced)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep Reasoning)</option>
                <option value="nvidia-nemotron-3">Nemotron-3-8B-Instruct (Experimental)</option>
              </select>
            </div>

            {/* API Key */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface block">
                Gemini API Key
              </label>
              <div className="relative">
                <input 
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-3 pl-4 pr-12 font-code-md text-sm text-on-surface focus:ring-1 focus:ring-secondary focus:border-secondary outline-none"
                  placeholder="Enter AI API Key..."
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline select-none">
                  lock
                </span>
              </div>
              <p className="text-[10px] text-outline italic">
                Keys are stored in local environment registers (.env) and never uploaded to public servers.
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 justify-end">
            <button 
              type="button"
              onClick={() => {
                setApiKey('••••••••••••••••••••••••••••••••••••');
                setThreshold(50);
                setForceLocal(false);
                setActiveModel('gemini-2.5-flash');
              }}
              className="py-2.5 px-6 rounded-lg border border-outline-variant text-on-surface-variant font-label-caps hover:bg-surface-variant transition-colors text-xs font-bold"
            >
              Reset to Defaults
            </button>
            <button 
              type="submit"
              className="py-2.5 px-8 rounded-lg bg-primary-container text-on-primary font-label-caps hover:brightness-110 active:scale-95 transition-all text-xs font-bold"
            >
              Save Configurations
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
