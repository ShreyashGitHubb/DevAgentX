import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import WorkspaceView from './components/WorkspaceView';
import ArchitectureView from './components/ArchitectureView';
import SettingsView from './components/SettingsView';

const BACKEND_URL = 'http://localhost:5000';

export default function App() {
  const [activeTab, setActiveTab] = useState('workspace'); // 'workspace' | 'architecture' | 'settings'
  const [status, setStatus] = useState('idle'); // 'idle' | 'input' | 'nano-classifying' | 'routing' | 'executing-nano' | 'executing-super' | 'completed'
  const [routedAgent, setRoutedAgent] = useState(null); // 'nano' | 'super'
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleAnalyze = async (input, task) => {
    setIsLoading(true);
    setError(null);
    setResponse(null);
    setRoutedAgent(null);

    // Phase 1: Ingest input
    setStatus('input');
    await delay(600);

    // Phase 2: Nano Agent classifies
    setStatus('nano-classifying');
    await delay(700);

    // Phase 3: Route decision
    setStatus('routing');
    await delay(500);

    try {
      const res = await fetch(`${BACKEND_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input, task }),
      });

      if (!res.ok) {
        throw new Error(`HTTP Error: Status ${res.status}`);
      }

      const data = await res.json();
      
      // Determine destination agent
      const destinationAgent = data.agent; // 'nano' | 'super'
      setRoutedAgent(destinationAgent);

      // Phase 4: Execute on selected agent
      if (destinationAgent === 'nano') {
        setStatus('executing-nano');
        await delay(600);
      } else {
        setStatus('executing-super');
        // Give some extra delay to simulate LLM thinking time
        await delay(1200);
      }

      // Phase 5: Complete & deliver
      setResponse(data);
      setStatus('completed');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to communicate with DevAgentX Core Server.');
      setStatus('idle');
    } finally {
      setIsLoading(false);
    }
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  return (
    <div className="min-h-screen bg-background text-on-surface flex font-body-md overflow-hidden relative">
      
      {/* Shared Sidebar Component */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Right Side Content Panel */}
      <div className="flex-1 flex flex-col ml-16 md:ml-64 min-h-screen overflow-hidden relative">
        
        {/* Shared Top Bar Component */}
        <Topbar status={status} routedAgent={routedAgent} theme={theme} toggleTheme={toggleTheme} />

        {/* Dynamic Inner Tab Router Container */}
        <main className={`flex-1 pt-16 bg-surface-container-lowest relative ${
          activeTab === 'workspace' && (status === 'idle' || status === 'input') 
            ? 'overflow-y-auto' 
            : 'overflow-hidden'
        }`}>
          {activeTab === 'workspace' && (
            <WorkspaceView
              status={status}
              setStatus={setStatus}
              routedAgent={routedAgent}
              setRoutedAgent={setRoutedAgent}
              response={response}
              setResponse={setResponse}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'architecture' && (
            <ArchitectureView />
          )}

          {activeTab === 'settings' && (
            <SettingsView />
          )}

          {/* Connection Error Banner */}
          {error && (
            <div className="absolute top-20 right-6 z-50 max-w-sm p-4 rounded-xl border border-error-container/30 bg-error-container/20 text-error flex items-start gap-3 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
              <span className="material-symbols-outlined shrink-0">warning</span>
              <div>
                <p className="font-bold">Express Server Offline</p>
                <p className="text-xs opacity-90 mt-0.5">{error}</p>
                <p className="text-[10px] opacity-75 mt-2 font-code-md">
                  Ensure the Express server on port 5000 is active.
                </p>
              </div>
              <button 
                onClick={() => setError(null)}
                className="text-on-surface-variant hover:text-white ml-auto"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          )}
        </main>
      </div>

    </div>
  );
}
