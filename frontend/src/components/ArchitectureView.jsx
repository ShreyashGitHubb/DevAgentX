import React, { useState, useEffect, useRef } from 'react';

const INITIAL_LOGS = [
  { time: '13:30:01', type: 'SUCCESS', msg: 'System listeners synchronized.' },
  { time: '13:30:03', type: 'INFO', msg: 'Core routing thresholds loaded: 50 chars.' },
  { time: '13:30:05', type: 'INFO', msg: 'Express agent-router listening on port 5000.' }
];

export default function ArchitectureView() {
  const [zoom, setZoom] = useState(1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStep, setActiveStep] = useState(null); // 'input' | 'nano' | 'router' | 'executor-nano' | 'executor-super'
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [simulationBranch, setSimulationBranch] = useState(null); // 'nano' | 'super'

  const logsEndRef = useRef(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Live log simulation when not running play simulations
  useEffect(() => {
    if (isSimulating) return;

    const mockLogs = [
      { type: 'INFO', msg: 'Buffer synchronized.' },
      { type: 'WARN', msg: 'Latency spike in Nano core detected.' },
      { type: 'INFO', msg: 'Router policy checked.' },
      { type: 'SUCCESS', msg: 'Model checkpoint validation passed.' },
      { type: 'INFO', msg: 'Cleaning AST cache keys.' }
    ];

    const interval = setInterval(() => {
      const randomLog = mockLogs[Math.floor(Math.random() * mockLogs.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];

      setLogs((prev) => {
        const updated = [...prev, { time: timeStr, ...randomLog }];
        if (updated.length > 15) {
          return updated.slice(1);
        }
        return updated;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const addLog = (type, msg) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setLogs((prev) => {
      const updated = [...prev, { time: timeStr, type, msg }];
      if (updated.length > 20) {
        return updated.slice(1);
      }
      return updated;
    });
  };

  const handleRunSim = () => {
    if (isSimulating) return;

    setIsSimulating(true);
    setLogs([]);
    const branch = Math.random() > 0.5 ? 'super' : 'nano';
    setSimulationBranch(branch);

    // Timeline steps
    // Step 1: Input Ingestion
    setActiveStep('input');
    setTimeout(() => {
      addLog('INFO', 'User payload received at endpoint /api/analyze');
      addLog('INFO', 'Payload details: payload_depth=3, format=raw_text');
    }, 100);

    // Step 2: Classifier
    setTimeout(() => {
      setActiveStep('nano');
      addLog('INFO', 'Initiating Nano Agent AST classifier scan...');
      addLog('INFO', `Classifying code patterns (AST node count: 18)...`);
    }, 1200);

    // Step 3: Router
    setTimeout(() => {
      setActiveStep('router');
      addLog('INFO', 'Routing logic evaluation: calculating constraints.');
      if (branch === 'super') {
        addLog('SUPER', 'Threshold rule triggered: Input exceeds 50 chars or requires deep analysis.');
      } else {
        addLog('NANO', 'Threshold rule triggered: Lightweight request suitable for Nano executor.');
      }
    }, 2400);

    // Step 4: Branch execution
    setTimeout(() => {
      if (branch === 'super') {
        setActiveStep('executor-super');
        addLog('SUPER', 'Allocating reasoning cores for Super Agent elevation...');
        addLog('INFO', 'Super Agent reasoning core: Active.');
      } else {
        setActiveStep('executor-nano');
        addLog('NANO', 'Routing to fast-track Nano Executor (Local ruleset)...');
      }
    }, 3600);

    // Step 5: Complete
    setTimeout(() => {
      if (branch === 'super') {
        addLog('SUCCESS', 'Super Agent completed. Formatted markdown summary generated in 1.2s.');
      } else {
        addLog('SUCCESS', 'Nano Agent completed. Parsed results returned in 0.15s.');
      }
      setActiveStep(null);
      setIsSimulating(false);
    }, 5000);
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.7));

  return (
    <div className="w-full h-[calc(100vh-4rem)] relative bg-surface-container-lowest overflow-hidden flex flex-col md:flex-row items-center justify-center p-4">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#00f0ff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />

      {/* Main Flowchart Area */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden">
        
        {/* Dynamic Zoom Wrapper */}
        <div 
          className="relative w-full max-w-5xl flex justify-between items-center h-[500px] transition-transform duration-300"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* SVG Overlay for Paths */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            {/* Path 1: User Input -> Classifier (Nano Agent) */}
            <path 
              className={activeStep === 'input' || activeStep === 'nano' ? 'animate-flow-cyan' : ''} 
              d="M 170,250 L 330,250" 
              fill="none" 
              stroke={activeStep === 'input' || activeStep === 'nano' ? 'url(#gradient-cyan-active)' : '#334155'} 
              strokeWidth="2.5"
            />
            
            {/* Path 2: Classifier -> Router */}
            <path 
              className={activeStep === 'nano' || activeStep === 'router' ? 'animate-flow-cyan' : ''} 
              d="M 520,250 L 670,250" 
              fill="none" 
              stroke={activeStep === 'nano' || activeStep === 'router' ? 'url(#gradient-cyan-active)' : '#334155'} 
              strokeWidth="2.5"
            />
            
            {/* Path 3a: Router -> Nano Output Executor (Branch Up) */}
            <path 
              className={activeStep === 'router' && simulationBranch === 'nano' || activeStep === 'executor-nano' ? 'animate-flow-cyan' : ''} 
              d="M 830,250 C 910,250 910,130 990,130" 
              fill="none" 
              stroke={activeStep === 'router' && simulationBranch === 'nano' || activeStep === 'executor-nano' ? 'url(#gradient-cyan-active)' : '#334155'} 
              strokeWidth="2.5"
            />
            
            {/* Path 3b: Router -> Super Agent (Branch Down) */}
            <path 
              className={activeStep === 'router' && simulationBranch === 'super' || activeStep === 'executor-super' ? 'animate-flow-violet' : ''} 
              d="M 830,250 C 910,250 910,370 990,370" 
              fill="none" 
              stroke={activeStep === 'router' && simulationBranch === 'super' || activeStep === 'executor-super' ? 'url(#gradient-violet-active)' : '#334155'} 
              strokeWidth="2.5"
            />
            
            <defs>
              <linearGradient id="gradient-cyan-active" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.2"></stop>
                <stop offset="50%" stopColor="#00f0ff" stopOpacity="1"></stop>
                <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.2"></stop>
              </linearGradient>
              <linearGradient id="gradient-violet-active" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="#d0bcff" stopOpacity="0.2"></stop>
                <stop offset="50%" stopColor="#d0bcff" stopOpacity="1"></stop>
                <stop offset="100%" stopColor="#d0bcff" stopOpacity="0.2"></stop>
              </linearGradient>
            </defs>
          </svg>

          {/* Node 1: User Input */}
          <div className={`glass-panel p-5 w-40 rounded-xl flex flex-col items-center text-center gap-3 transition-all duration-300 hover:scale-105 ${
            activeStep === 'input' ? 'border-primary-container glow-cyan bg-primary/10' : ''
          }`}>
            <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary-container">
              <span className="material-symbols-outlined text-[24px]">input</span>
            </div>
            <div>
              <p className="font-label-caps text-[11px] text-on-surface">User Input</p>
              <p className="text-[9px] text-on-surface-variant mt-0.5">Prompt Ingestion</p>
            </div>
            <div className="w-full bg-surface-container-lowest rounded py-1 px-2 border border-outline-variant/30">
              <code className="text-[8px] font-code-md text-tertiary">POST /api/analyze</code>
            </div>
          </div>

          {/* Node 2: Nano Agent (Classifier) */}
          <div className={`glass-panel p-5 w-44 rounded-xl flex flex-col items-center text-center gap-3 transition-all duration-300 hover:scale-105 ${
            activeStep === 'nano' ? 'node-active-cyan glow-cyan' : ''
          }`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              activeStep === 'nano' ? 'bg-primary/20 text-primary-container' : 'bg-surface-container-highest text-primary-container'
            }`}>
              <span className={`material-symbols-outlined text-[24px] ${activeStep === 'nano' ? 'animate-pulse' : ''}`}>psychology</span>
            </div>
            <div>
              <p className="font-label-caps text-[11px] text-primary-container">Nano Agent</p>
              <p className="text-[9px] text-on-surface-variant mt-0.5">(Classifier)</p>
            </div>
            <div className="text-[10px] font-code-md text-on-surface-variant leading-tight">
              {activeStep === 'nano' ? 'Analyzing intent...' : 'Idle'}
            </div>
          </div>

          {/* Node 3: Router */}
          <div className={`glass-panel p-5 w-40 rounded-xl flex flex-col items-center text-center gap-3 transition-all duration-300 hover:scale-105 ${
            activeStep === 'router' ? 'border-primary-container glow-cyan bg-primary/10' : ''
          }`}>
            <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface">
              <span className="material-symbols-outlined text-[24px]">alt_route</span>
            </div>
            <div>
              <p className="font-label-caps text-[11px] text-on-surface">Router</p>
              <p className="text-[9px] text-on-surface-variant mt-0.5">Decision Logic</p>
            </div>
            <div className="flex flex-col gap-0.5 w-full text-[9px] text-left px-1.5 border-t border-outline-variant/30 pt-1.5 mt-1">
              <div className="flex justify-between"><span>&gt; 50 chars</span> <span className="text-secondary font-bold">SUPER</span></div>
              <div className="flex justify-between"><span>&lt; 50 chars</span> <span className="text-primary-container font-bold">NANO</span></div>
            </div>
          </div>

          {/* Right Side: Branching Nodes */}
          <div className="flex flex-col justify-between h-full py-12 z-10">
            {/* Node 4a: Nano Output Executor */}
            <div className={`glass-panel p-5 w-44 rounded-xl flex flex-col items-center text-center gap-3 transition-all duration-300 hover:scale-105 ${
              activeStep === 'executor-nano' ? 'node-active-cyan glow-cyan' : 'opacity-40 border-dashed'
            }`}>
              <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined text-[24px]">bolt</span>
              </div>
              <div>
                <p className="font-label-caps text-[11px] text-on-surface-variant">Nano Executor</p>
                <p className="text-[9px] mt-0.5 text-on-surface-variant">Low Latency Path</p>
              </div>
            </div>

            {/* Node 4b: Super Agent (Deep Reasoning) */}
            <div className={`glass-panel p-5 w-48 rounded-xl flex flex-col items-center text-center gap-3 transition-all duration-300 hover:scale-105 ${
              activeStep === 'executor-super' ? 'node-active-violet glow-violet translate-x-2' : 'opacity-40'
            }`}>
              <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary glow-violet">
                <span className="material-symbols-outlined text-[28px]">auto_awesome</span>
              </div>
              <div>
                <p className="font-label-caps text-[11px] text-secondary font-bold">Super Agent</p>
                <p className="text-[9px] text-on-surface-variant mt-0.5">Deep Reasoning</p>
              </div>
              <div className="w-full h-1 bg-surface-container-lowest rounded overflow-hidden mt-1">
                <div 
                  className={`h-full bg-gradient-to-r from-primary-container to-secondary transition-all ${
                    activeStep === 'executor-super' ? 'w-2/3 animate-pulse' : 'w-0'
                  }`}
                />
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Float Inspector Overlay (Live Logs - Bottom Left) */}
      <div className="absolute bottom-6 left-6 glass-panel p-4 rounded-xl w-80 border-l-4 border-primary-container shadow-2xl z-20">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-label-caps text-label-caps text-primary-container flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">terminal</span>
            Live Logs
          </h3>
          {isSimulating && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary-container/25 text-primary-container border border-primary-container/40 animate-pulse uppercase font-semibold">
              Simulating
            </span>
          )}
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {logs.map((log, idx) => (
            <div key={idx} className="flex gap-2 text-[10px] font-code-md leading-relaxed">
              <span className="text-on-surface-variant select-none">{log.time}</span>
              <span 
                className={`font-semibold shrink-0 select-none ${
                  log.type === 'SUCCESS' ? 'text-tertiary-fixed-dim' : 
                  log.type === 'WARN' ? 'text-error' : 
                  log.type === 'SUPER' ? 'text-secondary' : 
                  log.type === 'NANO' ? 'text-primary-container' : 'text-outline'
                }`}
              >
                [{log.type}]
              </span>
              <span className="text-on-surface text-left select-text">{log.msg}</span>
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      </div>

      {/* Control Bar (Bottom Center) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 glass-panel p-2 rounded-full shadow-2xl z-20">
        <button 
          onClick={handleZoomOut}
          className="p-2 hover:bg-surface-variant rounded-full text-on-surface-variant hover:text-primary-container transition-all"
          title="Zoom Out"
        >
          <span className="material-symbols-outlined">zoom_out</span>
        </button>
        <span className="text-[10px] font-code-md text-outline-variant px-1 select-none">
          {Math.round(zoom * 100)}%
        </span>
        <button 
          onClick={handleZoomIn}
          className="p-2 hover:bg-surface-variant rounded-full text-on-surface-variant hover:text-primary-container transition-all"
          title="Zoom In"
        >
          <span className="material-symbols-outlined">zoom_in</span>
        </button>
        <div className="w-[1px] h-6 bg-outline-variant mx-1"></div>
        <button 
          onClick={handleRunSim}
          disabled={isSimulating}
          className="px-4 py-1.5 bg-primary-container text-on-primary rounded-full font-label-caps text-label-caps flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[16px]">
            {isSimulating ? 'sync' : 'play_arrow'}
          </span>
          {isSimulating ? 'Running' : 'Run Sim'}
        </button>
      </div>
    </div>
  );
}
