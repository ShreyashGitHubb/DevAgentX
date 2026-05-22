import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ShieldAlert, Cpu, Check, Copy, Clock, Server, Eye, Play, GitBranch, Zap, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

const RECENT_CONTEXTS = [
  { name: 'auth_service.py', time: '2h ago' },
  { name: 'api_v2_migration/', time: '5h ago' }
];

export default function WorkspaceView({ status, setStatus, routedAgent, setRoutedAgent, response, setResponse, onAnalyze, isLoading }) {
  const [input, setInput] = useState('');
  const [selectedTask, setSelectedTask] = useState('explain');
  const [copied, setCopied] = useState(false);
  const [showThinking, setShowThinking] = useState(true);
  
  // Follow-up chat state
  const [chatHistory, setChatHistory] = useState([]);
  const [followUpText, setFollowUpText] = useState('');
  const [isSendingFollowUp, setIsSendingFollowUp] = useState(false);

  const textareaRef = useRef(null);
  const chatBottomRef = useRef(null);

  // Auto-scroll chat response when it grows
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  const handleSubmit = (taskName) => {
    if (!input.trim() || isLoading) return;
    setChatHistory([]); // Reset follow-ups
    onAnalyze(input, taskName || selectedTask);
  };

  const loadDemo = (type) => {
    if (type === 'simple') {
      setInput(`function add(a, b) {
  return a + b;
}`);
      setSelectedTask('explain');
    } else if (type === 'buggy') {
      setInput(`// Calculate Fibonacci recursively
function fib(n) {
  if (n <= 1) return n;
  // Bug: No base case limits or optimization check
  return fib(n - 1) + fib(n - 2);
}

// Infinite recursion risk for large values
console.log(fib(50));`);
      setSelectedTask('debug');
    } else if (type === 'nested') {
      setInput(`function findPairs(numbers, target) {
  let results = [];
  // Nested O(N^2) loops
  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers.length; j++) {
      if (numbers[i] + numbers[j] === target) {
        results.push([numbers[i], numbers[j]]);
      }
    }
  }
  return results;
}`);
      setSelectedTask('optimize');
    } else {
      setInput('https://github.com/google/jax');
      setSelectedTask('readme');
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFollowUpSubmit = async (e) => {
    e.preventDefault();
    if (!followUpText.trim() || isSendingFollowUp) return;

    const userMessage = followUpText.trim();
    setFollowUpText('');
    setChatHistory((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsSendingFollowUp(true);

    try {
      // Send message to api
      const res = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // We compile a system state context for the follow up
        body: JSON.stringify({
          input: `Original context code:\n${input}\n\nFollow-up question:\n${userMessage}`,
          task: selectedTask,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}`);
      }

      const data = await res.json();
      setChatHistory((prev) => [...prev, { role: 'agent', content: data.output }]);
    } catch (err) {
      console.error(err);
      setChatHistory((prev) => [
        ...prev,
        { role: 'agent', content: `**Error**: Failed to contact agent. ${err.message}` },
      ]);
    } finally {
      setIsSendingFollowUp(false);
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setResponse(null);
    setRoutedAgent(null);
    setChatHistory([]);
  };

  // Determine line/character count
  const linesCount = input.split('\n').length;
  const charsCount = input.length;

  // ----------------------------------------------------
  // VIEW RENDER 1: Bento Input Form
  // ----------------------------------------------------
  if (status === 'idle' || status === 'input') {
    return (
      <div className="w-full max-w-6xl mx-auto px-margin-desktop py-8 animate-in fade-in duration-500">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <h2 className="font-display-lg text-[40px] md:text-[48px] text-on-surface font-extrabold mb-4 leading-tight">
            Orchestrate Your <span className="text-primary-container">Codebase</span>
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto opacity-80">
            Paste snippets, drop repository links, or describe the architectural shift you need. DevAgentX Nano and Super are ready to execute.
          </p>
        </div>

        {/* Demo trigger bar */}
        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={() => loadDemo('simple')}
            className="text-xs px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant/40 text-on-surface-variant hover:text-primary hover:border-primary-container transition"
          >
            Demo: Simple Code
          </button>
          <button
            onClick={() => loadDemo('buggy')}
            className="text-xs px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant/40 text-on-surface-variant hover:text-error hover:border-error transition"
          >
            Demo: Recursive Bug
          </button>
          <button
            onClick={() => loadDemo('nested')}
            className="text-xs px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant/40 text-on-surface-variant hover:text-tertiary hover:border-tertiary-container transition"
          >
            Demo: Complex Loop
          </button>
          <button
            onClick={() => loadDemo('readme')}
            className="text-xs px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant/40 text-on-surface-variant hover:text-secondary hover:border-secondary transition"
          >
            Demo: Git Repository
          </button>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Main textarea */}
          <div className="lg:col-span-3 glass-panel rounded-xl p-1 relative group electric-glow-nano transition-shadow duration-500">
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <span className="bg-primary/10 text-primary-container px-2 py-1 rounded text-[10px] font-label-caps uppercase border border-primary/20 font-semibold">
                Nano Engine
              </span>
              <span className="material-symbols-outlined text-primary-container text-sm cursor-help" title="Routing is automatically calculated by length & content keywords">
                info
              </span>
            </div>
            
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-80 border-none rounded-lg p-6 font-code-md text-code-md resize-none focus:ring-1 focus:ring-primary-container/50 placeholder:text-outline-variant/60 outline-none"
              style={{
                backgroundColor: 'var(--surface-container-lowest)',
                color: 'var(--on-surface)',
              }}
              placeholder="// Paste your code here or enter a GitHub URL...&#10;// Select an operation on the right to compile and analyze..."
            />
            
            <div className="absolute bottom-4 right-4 font-code-md text-[11px] text-outline-variant pointer-events-none">
              UTF-8 | LF | {linesCount} Lines | {charsCount} Chars
            </div>
          </div>

          {/* Action sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <button
              onClick={() => { setSelectedTask('explain'); handleSubmit('explain'); }}
              disabled={isLoading || !input.trim()}
              className="group flex flex-col items-start p-4 rounded-xl border border-outline-variant bg-surface-container-high hover:border-primary-container transition-all text-left w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-primary-container mb-2 group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
              <span className="font-label-caps text-label-caps text-on-surface font-bold">Explain</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant opacity-60 mt-1">Architectural analysis</span>
            </button>

            <button
              onClick={() => { setSelectedTask('debug'); handleSubmit('debug'); }}
              disabled={isLoading || !input.trim()}
              className="group flex flex-col items-start p-4 rounded-xl border border-outline-variant bg-surface-container-high hover:border-error transition-all text-left w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-error mb-2 group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>
                bug_report
              </span>
              <span className="font-label-caps text-label-caps text-on-surface font-bold">Debug</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant opacity-60 mt-1">Trace and fix issues</span>
            </button>

            <button
              onClick={() => { setSelectedTask('optimize'); handleSubmit('optimize'); }}
              disabled={isLoading || !input.trim()}
              className="group flex flex-col items-start p-4 rounded-xl border border-outline-variant bg-surface-container-high hover:border-tertiary-container transition-all text-left w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-tertiary-container mb-2 group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>
                speed
              </span>
              <span className="font-label-caps text-label-caps text-on-surface font-bold">Optimize</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant opacity-60 mt-1">Runtime & efficiency</span>
            </button>

            <button
              onClick={() => { setSelectedTask('readme'); handleSubmit('readme'); }}
              disabled={isLoading || !input.trim()}
              className="group flex flex-col items-start p-4 rounded-xl border border-outline-variant bg-surface-container-high hover:border-secondary transition-all text-left w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-secondary mb-2 group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>
                description
              </span>
              <span className="font-label-caps text-label-caps text-on-surface font-bold">Generate README</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant opacity-60 mt-1">Professional docs</span>
            </button>
          </div>
        </div>

        {/* Bottom context row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 opacity-80 mb-20">
          <div className="p-6 rounded-xl border border-outline-variant/30 bg-surface-container/50">
            <h4 className="font-label-caps text-label-caps text-primary-container mb-3 flex items-center">
              <span className="material-symbols-outlined text-sm mr-2">history</span> 
              Recent Context
            </h4>
            <ul className="space-y-3 font-label-sm text-label-sm text-on-surface-variant">
              {RECENT_CONTEXTS.map((rc, idx) => (
                <li key={idx} className="flex justify-between hover:text-on-surface cursor-pointer">
                  <span>{rc.name}</span>
                  <span className="opacity-40">{rc.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-xl border border-outline-variant/30 bg-surface-container/50">
            <h4 className="font-label-caps text-label-caps text-secondary mb-3 flex items-center">
              <span className="material-symbols-outlined text-sm mr-2">rocket_launch</span> 
              Agent Health
            </h4>
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Nano Throughput</span>
              <span className="text-tertiary-container font-code-md text-xs">99.8%</span>
            </div>
            <div className="w-full bg-surface-variant h-1 rounded-full mt-2">
              <div className="bg-tertiary-container h-full rounded-full" style={{ width: '99.8%' }}></div>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-outline-variant/30 bg-surface-container/50">
            <h4 className="font-label-caps text-label-caps text-outline mb-3 flex items-center">
              <span className="material-symbols-outlined text-sm mr-2">cloud_sync</span> 
              Source Control
            </h4>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              3 Repositories linked. Auto-sync active for <span className="text-primary-container">main-branch</span>.
            </p>
          </div>
        </div>

        {/* Floating action button */}
        <div className="fixed bottom-8 right-8 group z-50">
          <button 
            onClick={() => loadDemo('simple')}
            className="w-14 h-14 bg-primary-container text-on-primary rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-2xl">bolt</span>
          </button>
          <div className="absolute bottom-full right-0 mb-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-surface-container-high border border-outline-variant p-3 rounded-lg whitespace-nowrap text-label-sm font-label-sm">
              Quick Load Demo
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW RENDER 2: Routing Tracer (Running Loader)
  // ----------------------------------------------------
  if (status !== 'completed' && status !== 'idle' && status !== 'input') {
    // Tracer active logic
    const isInputActive = status === 'input';
    const isScanActive = ['nano-classifying', 'routing', 'executing-nano', 'executing-super'].includes(status);
    const isRouterActive = ['routing', 'executing-nano', 'executing-super'].includes(status);
    const isNanoExec = status === 'executing-nano';
    const isSuperExec = status === 'executing-super';

    return (
      <div className="w-full h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-8 bg-surface-container-lowest relative overflow-hidden animate-in fade-in duration-300">
        <div className="absolute inset-0 grid-lines pointer-events-none opacity-40"></div>
        
        {/* Tracer title */}
        <div className="text-center z-10 mb-8">
          <h2 className="font-display-lg text-[32px] text-on-surface flex items-center justify-center gap-3">
            <GitBranch className="w-8 h-8 text-primary-container animate-pulse" />
            Decision Routing Tracer
          </h2>
          <p className="text-sm text-outline mt-1 font-code-md">
            Nemotron Router Pipeline Execution Details
          </p>
        </div>

        {/* Visualizer Flow panel */}
        <div className="w-full max-w-4xl glass-panel rounded-xl p-8 z-10 flex flex-col items-center">
          <div className="w-full relative bg-black/60 rounded-2xl border border-outline-variant/30 p-6 overflow-hidden min-h-[300px] flex items-center justify-center">
            
            {/* SVG Connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="glow-cyan-grad" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.2"></stop>
                  <stop offset="50%" stopColor="#00f0ff" stopOpacity="1"></stop>
                  <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.2"></stop>
                </linearGradient>
                <linearGradient id="glow-violet-grad" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#d0bcff" stopOpacity="0.2"></stop>
                  <stop offset="50%" stopColor="#d0bcff" stopOpacity="1"></stop>
                  <stop offset="100%" stopColor="#d0bcff" stopOpacity="0.2"></stop>
                </linearGradient>
              </defs>

              {/* Path 1: Input to Scan */}
              <path 
                className={isScanActive ? "animate-flow-cyan" : ""}
                d="M 120,150 L 260,150" 
                fill="none" 
                stroke={isScanActive ? "url(#glow-cyan-grad)" : "#111827"} 
                strokeWidth="2.5"
              />
              
              {/* Path 2: Scan to Router */}
              <path 
                className={isRouterActive ? "animate-flow-cyan" : ""}
                d="M 380,150 L 500,150" 
                fill="none" 
                stroke={isRouterActive ? "url(#glow-cyan-grad)" : "#111827"} 
                strokeWidth="2.5"
              />

              {/* Path 3a: Router to Nano Executor */}
              <path 
                className={isNanoExec ? "animate-flow-cyan" : ""}
                d="M 580,150 C 650,150 670,80 740,80" 
                fill="none" 
                stroke={isNanoExec ? "url(#glow-cyan-grad)" : "#111827"} 
                strokeWidth="2.5"
              />

              {/* Path 3b: Router to Super Agent */}
              <path 
                className={isSuperExec ? "animate-flow-violet" : ""}
                d="M 580,150 C 650,150 670,220 740,220" 
                fill="none" 
                stroke={isSuperExec ? "url(#glow-violet-grad)" : "#111827"} 
                strokeWidth="2.5"
              />
            </svg>

            {/* Render Nodes */}
            <div className="relative w-full flex justify-between items-center px-4 h-60">
              
              {/* Node 1: Input */}
              <div className={`glass-panel p-4 w-32 rounded-lg flex flex-col items-center text-center gap-2 border transition-all duration-300 ${
                isInputActive ? 'border-primary-container glow-cyan bg-primary/10' : 'opacity-80'
              }`}>
                <span className="material-symbols-outlined text-primary-container text-2xl">input</span>
                <span className="font-label-caps text-[10px] text-on-surface">Input Ingestion</span>
              </div>

              {/* Node 2: Nano Scan */}
              <div className={`glass-panel p-4 w-36 rounded-lg flex flex-col items-center text-center gap-2 border transition-all duration-300 ${
                isScanActive ? 'border-primary-container glow-cyan bg-primary/10' : 'opacity-30'
              }`}>
                <span className="material-symbols-outlined text-primary-container text-2xl animate-pulse">psychology</span>
                <span className="font-label-caps text-[10px] text-primary-container">Nano AST Scan</span>
              </div>

              {/* Node 3: Router */}
              <div className={`glass-panel p-4 w-32 rounded-lg flex flex-col items-center text-center gap-2 border transition-all duration-300 ${
                isRouterActive ? 'border-primary-container glow-cyan bg-primary/10' : 'opacity-30'
              }`}>
                <span className="material-symbols-outlined text-on-surface text-2xl">alt_route</span>
                <span className="font-label-caps text-[10px] text-on-surface">Router Logic</span>
              </div>

              {/* Branching outputs */}
              <div className="flex flex-col justify-between h-full py-6">
                {/* Branch Nano */}
                <div className={`glass-panel p-4 w-40 rounded-lg flex flex-col items-center text-center gap-2 border transition-all duration-300 ${
                  isNanoExec ? 'border-primary-container glow-cyan bg-primary/10' : 'opacity-30'
                }`}>
                  <span className="material-symbols-outlined text-primary-container text-2xl">bolt</span>
                  <span className="font-label-caps text-[10px] text-on-surface">Nano Executor</span>
                </div>

                {/* Branch Super */}
                <div className={`glass-panel p-4 w-44 rounded-lg flex flex-col items-center text-center gap-2 border transition-all duration-300 ${
                  isSuperExec ? 'border-secondary glow-violet bg-secondary/15' : 'opacity-30'
                }`}>
                  <span className="material-symbols-outlined text-secondary text-2xl animate-spin" style={{ animationDuration: '3s' }}>auto_awesome</span>
                  <span className="font-label-caps text-[10px] text-secondary font-bold">Super Agent (LLM)</span>
                </div>
              </div>

            </div>
          </div>

          {/* Running Status Log Text */}
          <div className="mt-6 flex items-center gap-3 bg-surface-container-low px-6 py-3 rounded-full border border-outline-variant">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-container"></span>
            </span>
            <span className="font-code-md text-xs text-on-surface-variant">
              {status === 'nano-classifying' && 'Nano Agent analyzing AST structures & query patterns...'}
              {status === 'routing' && 'Router Agent calculating routing destination...'}
              {status === 'executing-nano' && 'Executing fast-track Nano AST template executor...'}
              {status === 'executing-super' && 'Super Agent reasoning core active. Synthesizing deep reply...'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW RENDER 3: Split Pane Results
  // ----------------------------------------------------
  const originalCodeLines = input.split('\n');
  const responseData = response || {};

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col bg-surface-container-lowest animate-in fade-in duration-500 overflow-hidden">
      
      {/* 2-Column Split Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: Original Input Code */}
        <section className="flex-1 border-r border-outline-variant flex flex-col bg-surface-container-lowest">
          <div className="h-10 border-b border-outline-variant px-4 flex items-center justify-between bg-surface-container-low">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-outline">description</span>
              <span className="font-code-md text-code-md text-on-surface-variant font-semibold">
                {input.startsWith('http') ? 'repository_link.txt' : 'input_query.py'}
              </span>
            </div>
            
            {/* New analysis trigger */}
            <button
              onClick={handleReset}
              className="text-xs px-2.5 py-0.5 rounded border border-outline-variant bg-surface-container-high hover:border-primary-container text-on-surface-variant hover:text-primary transition flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-xs">refresh</span>
              New Query
            </button>
          </div>

          <div className="flex-1 overflow-auto p-6 bg-black font-code-md text-code-md">
            <pre className="text-on-surface-variant leading-relaxed select-text">
              {originalCodeLines.map((line, i) => (
                <div key={i} className="flex hover:bg-slate-900/40">
                  <span className="w-8 text-right pr-4 text-outline-variant select-none opacity-45">{i + 1}</span>
                  <span className="text-slate-300 font-code-md">{line || ' '}</span>
                </div>
              ))}
            </pre>
          </div>
        </section>

        {/* Right Panel: Agent Response */}
        <section className="flex-1 flex flex-col bg-surface overflow-hidden">
          <div className="h-10 border-b border-outline-variant px-4 flex items-center justify-between bg-surface-container-low select-none">
            <div className="flex items-center gap-2">
              <span 
                className={`material-symbols-outlined text-[16px] ${
                  routedAgent === 'super' ? 'text-on-secondary-container' : 'text-primary-container'
                }`}
              >
                {routedAgent === 'super' ? 'auto_awesome' : 'bolt'}
              </span>
              <span 
                className={`font-code-md text-code-md font-semibold ${
                  routedAgent === 'super' ? 'text-on-secondary-container' : 'text-primary-container'
                }`}
              >
                agent_response.md
              </span>
            </div>
            <span className="font-label-sm text-[10px] text-outline px-2 border border-outline-variant rounded select-none">
              {routedAgent === 'super' ? 'VIOLET-PROTOCOL' : 'CYAN-PROTOCOL'}
            </span>
          </div>

          <div className="flex-1 overflow-auto p-6 space-y-6">
            
            {/* Routing Insight Badge Card */}
            <div className={`glass-panel p-4 rounded-xl border-l-4 relative overflow-hidden ${
              routedAgent === 'super' 
                ? 'super-glow border-l-secondary bg-secondary/5' 
                : 'nano-glow border-l-primary-container bg-primary-container/5'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    routedAgent === 'super' ? 'bg-secondary-container/20 text-secondary' : 'bg-primary-container/20 text-primary-container'
                  }`}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {routedAgent === 'super' ? 'psychology' : 'bolt'}
                    </span>
                  </div>
                  <div>
                    <h4 className={`font-headline-sm text-body-lg font-bold ${
                      routedAgent === 'super' ? 'text-on-secondary-container' : 'text-primary-container'
                    }`}>
                      Handled by: {routedAgent === 'super' ? 'Super Agent' : 'Nano Agent'}
                    </h4>
                    <p className="text-xs text-outline mt-0.5">
                      Reason: {responseData.reason || 'Calculated operational constraints met.'}
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] font-label-caps px-2 py-1 rounded border ${
                  routedAgent === 'super' 
                    ? 'text-secondary border-secondary/20 bg-secondary/10' 
                    : 'text-primary-container border-primary/20 bg-primary/10'
                }`}>
                  {routedAgent === 'super' ? 'L3 REASONING' : 'L1 RULE'}
                </span>
              </div>
            </div>

            {/* macOS Style Console for Thinking CoT (Only if Super and Thinking text exists) */}
            {routedAgent === 'super' && responseData.thinking && (
              <div className="rounded-xl overflow-hidden border border-secondary/15 shadow-lg shadow-black/40">
                <div className="flex items-center justify-between px-5 py-3 bg-surface-container-highest/60 border-b border-outline-variant/30">
                  <div className="flex items-center gap-1.5 select-none">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block"></span>
                    <span className="text-[11px] font-code-md text-outline ml-2">super-agent-cot.log</span>
                  </div>
                  <button
                    onClick={() => setShowThinking(!showThinking)}
                    className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-secondary hover:text-secondary-container transition"
                  >
                    <span className="material-symbols-outlined text-xs">
                      {showThinking ? 'visibility_off' : 'visibility'}
                    </span>
                    {showThinking ? 'Hide Trace' : 'Show Trace'}
                  </button>
                </div>
                
                {showThinking && (
                  <div className="p-5 bg-black/80 font-code-md text-[11px] leading-relaxed text-slate-400 max-h-60 overflow-y-auto whitespace-pre-wrap relative select-text">
                    <LogTraceHighlighter logText={responseData.thinking} />
                    <span className="inline-block w-1.5 h-3 bg-secondary ml-1 animate-pulse"></span>
                  </div>
                )}
              </div>
            )}

            {/* Agent Markdown Content Box */}
            <div className="glass-panel p-6 rounded-xl space-y-4">
              <div className="flex justify-between items-center mb-2 border-b border-outline-variant/30 pb-3">
                <div className="flex items-center gap-2 text-primary-container">
                  <span className="material-symbols-outlined text-[20px]">info</span>
                  <span className="font-label-caps uppercase tracking-wider">Analysis Complete</span>
                </div>
                <button
                  onClick={() => handleCopy(responseData.output || '')}
                  className="flex items-center gap-1.5 text-xs text-outline hover:text-primary transition px-2.5 py-1 rounded bg-surface-container-high border border-outline-variant/40"
                >
                  {copied ? (
                    <>
                      <span className="material-symbols-outlined text-xs text-[#4edea3]">check</span>
                      <span className="text-[#4edea3]">Copied</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-xs">content_copy</span>
                      <span>Copy Output</span>
                    </>
                  )}
                </button>
              </div>

              {/* Render output text */}
              <div className="text-on-surface leading-relaxed text-sm select-text">
                <MarkdownParser text={responseData.output || ''} />
              </div>

              {/* Follow-up chat histories */}
              {chatHistory.length > 0 && (
                <div className="mt-6 border-t border-outline-variant/30 pt-6 space-y-4">
                  {chatHistory.map((chat, idx) => (
                    <div 
                      key={idx} 
                      className={`flex flex-col gap-2 p-4 rounded-xl border ${
                        chat.role === 'user' 
                          ? 'bg-surface-container-high border-outline-variant/40 items-end ml-12' 
                          : 'bg-surface-container border-outline-variant/20 items-start mr-12'
                      }`}
                    >
                      <span className="font-label-caps text-[10px] text-outline uppercase tracking-wider">
                        {chat.role === 'user' ? 'You' : 'Agent response'}
                      </span>
                      <div className="text-sm text-slate-300 w-full select-text">
                        <MarkdownParser text={chat.content} />
                      </div>
                    </div>
                  ))}
                  <div ref={chatBottomRef} />
                </div>
              )}

              {/* Card actions */}
              <div className="pt-4 border-t border-outline-variant flex gap-4 select-none">
                <button 
                  onClick={() => alert("Refactoring recommendations merged into code workspace context.")}
                  className="flex-1 py-2 px-4 rounded border border-secondary text-secondary font-label-caps hover:bg-secondary/10 transition-colors flex items-center justify-center gap-2 text-xs font-bold"
                >
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  Apply Refactor
                </button>
                <button 
                  onClick={() => {
                    setFollowUpText("Can you walk me through the concurrency safety details step-by-step?");
                  }}
                  className="flex-1 py-2 px-4 rounded border border-outline-variant text-on-surface-variant font-label-caps hover:bg-surface-variant transition-colors flex items-center justify-center gap-2 text-xs font-bold"
                >
                  <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                  Discuss Logic
                </button>
              </div>
            </div>

            {/* Performance telemetry statistics */}
            <div className="grid grid-cols-2 gap-4 select-none">
              <div className="glass-panel p-4 rounded-xl">
                <p className="text-outline font-label-caps text-[10px] mb-1">Latency Delta</p>
                <p className="text-tertiary-fixed-dim font-headline-sm text-[24px] font-bold">
                  {routedAgent === 'super' ? '-120ms' : '-15ms'}
                </p>
              </div>
              <div className="glass-panel p-4 rounded-xl">
                <p className="text-outline font-label-caps text-[10px] mb-1">Compute Load</p>
                <p className="text-secondary font-headline-sm text-[24px] font-bold">
                  {routedAgent === 'super' ? 'Medium' : 'Low'}
                </p>
              </div>
            </div>

          </div>

          {/* Follow-up chat interaction input bar */}
          <div className="p-4 bg-surface-container-low border-t border-outline-variant">
            <form onSubmit={handleFollowUpSubmit} className="relative flex items-center">
              <input 
                value={followUpText}
                onChange={(e) => setFollowUpText(e.target.value)}
                disabled={isSendingFollowUp}
                className="w-full border border-outline-variant rounded-lg py-3 px-12 focus:ring-1 focus:ring-secondary focus:border-secondary outline-none font-body-md placeholder-outline-variant/60 text-sm disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--surface-container-lowest)',
                  color: 'var(--on-surface)',
                }}
                placeholder={isSendingFollowUp ? "Agent writing..." : "Ask Agent a follow-up..."}
                type="text"
              />
              <span className="material-symbols-outlined absolute left-4 text-outline">smart_toy</span>
              <div className="absolute right-3 flex items-center gap-2">
                <kbd className="text-[10px] font-code-md bg-surface-container-highest px-1.5 py-0.5 rounded text-outline border border-outline-variant select-none">
                  Enter
                </kbd>
                <button 
                  type="submit"
                  disabled={!followUpText.trim() || isSendingFollowUp}
                  className="bg-secondary text-on-secondary w-8 h-8 rounded flex items-center justify-center hover:brightness-110 active:scale-95 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </div>
            </form>
          </div>
        </section>
        
      </div>
    </div>
  );
}

// ----------------------------------------------------
// HELPER COMPONENTS FOR MARKDOWN & LOGS
// ----------------------------------------------------
function LogTraceHighlighter({ logText }) {
  const lines = logText.split('\n');
  return (
    <code>
      {lines.map((line, idx) => {
        const stepMatch = line.match(/^(\[Step \d+\])(.*)/);
        if (stepMatch) {
          return (
            <div key={idx} className="mb-1">
              <span className="text-secondary font-bold">{stepMatch[1]}</span>
              <span className="text-slate-300">{stepMatch[2]}</span>
            </div>
          );
        }
        if (line.includes('↳') || line.trim().startsWith('-')) {
          return (
            <div key={idx} className="text-slate-400 pl-4 mb-0.5">
              <span className="text-[#00f0ff] font-bold">↳</span> {line.replace(/^[-\s↳\s]*/, '')}
            </div>
          );
        }
        return <div key={idx} className="mb-0.5 text-slate-400">{line}</div>;
      })}
    </code>
  );
}

function MarkdownParser({ text }) {
  const parts = text.split(/(```[\s\S]*?```)/g);
  return (
    <div className="space-y-4">
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          const lang = match ? match[1] : '';
          const code = match ? match[2] : part.slice(3, -3);

          if (lang === 'diff') {
            const lines = code.split('\n');
            return (
              <div key={index} className="my-4 rounded-xl border border-outline-variant bg-black overflow-hidden font-code-md text-xs md:text-sm shadow-lg">
                <div className="bg-surface-container-high px-4 py-2 text-xs text-outline border-b border-outline-variant uppercase font-semibold flex justify-between">
                  <span>Patch Comparison (Unified Diff)</span>
                  <span className="text-[9px] bg-secondary/20 text-secondary px-1.5 py-0.5 rounded font-bold">Super Agent recommendation</span>
                </div>
                <pre className="p-2 overflow-x-auto bg-[#04060b]">
                  <code className="block min-w-full">
                    {lines.map((line, i) => {
                      const isAdded = line.startsWith('+');
                      const isRemoved = line.startsWith('-');
                      
                      let rowClass = 'px-4 py-0.5 block ';
                      if (isAdded) rowClass += 'bg-emerald-950/30 text-emerald-300 border-l-2 border-emerald-500 font-semibold';
                      else if (isRemoved) rowClass += 'bg-rose-950/20 text-rose-300 border-l-2 border-rose-500 opacity-80';
                      else rowClass += 'text-slate-400 opacity-60';

                      return (
                        <span key={i} className={rowClass}>
                          {line}
                        </span>
                      );
                    })}
                  </code>
                </pre>
              </div>
            );
          }

          return (
            <div key={index} className="my-4 rounded-xl border border-outline-variant bg-black overflow-hidden font-code-md text-sm shadow-md">
              <div className="bg-surface-container-high px-4 py-2 text-xs text-outline border-b border-outline-variant uppercase font-semibold flex justify-between">
                <span>{lang || 'code'} block</span>
              </div>
              <pre className="p-4 overflow-x-auto text-primary-container font-code-md text-xs md:text-sm bg-black/60">
                <code>{code}</code>
              </pre>
            </div>
          );
        } else {
          return <RichTextRenderer key={index} text={part} />;
        }
      })}
    </div>
  );
}

function RichTextRenderer({ text }) {
  const lines = text.split('\n');
  const elements = [];
  let listItems = [];
  let tableRows = [];

  const flushList = (key) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${key}`} className="list-disc pl-6 space-y-1.5 my-3 text-on-surface-variant text-sm">
          {listItems.map((item, idx) => <li key={idx} dangerouslySetInnerHTML={{ __html: parseInlineStyles(item) }} />)}
        </ul>
      );
      listItems = [];
    }
  };

  const flushTable = (key) => {
    if (tableRows.length > 0) {
      const cells = tableRows.map(row => row.split('|').map(c => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1));
      const headers = cells[0];
      const bodyRows = cells.slice(2);

      elements.push(
        <div key={`table-${key}`} className="my-4 overflow-x-auto rounded-xl border border-outline-variant/60 shadow-md">
          <table className="min-w-full divide-y divide-outline-variant text-left text-sm">
            <thead className="bg-surface-container-high font-semibold text-on-surface">
              <tr>
                {headers.map((h, idx) => (
                  <th key={idx} className="px-4 py-3 text-xs uppercase tracking-wider text-on-surface font-bold" dangerouslySetInnerHTML={{ __html: parseInlineStyles(h) }} />
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40 bg-surface-container-low/40">
              {bodyRows.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-surface-variant/40">
                  {row.map((cell, cellIdx) => (
                    <td key={cellIdx} className="px-4 py-2.5 text-on-surface-variant font-code-md text-xs" dangerouslySetInnerHTML={{ __html: parseInlineStyles(cell) }} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('### ')) {
      flushList(i);
      flushTable(i);
      elements.push(
        <h3 key={i} className="text-base font-bold text-on-surface mt-6 mb-3 flex items-center gap-2 border-b border-outline-variant pb-2">
          {line.replace('### ', '')}
        </h3>
      );
    } else if (line.startsWith('#### ')) {
      flushList(i);
      flushTable(i);
      elements.push(
        <h4 key={i} className="text-sm font-semibold text-on-surface-variant mt-4 mb-2">
          {line.replace('#### ', '')}
        </h4>
      );
    } else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      flushTable(i);
      listItems.push(line.trim().replace(/^[-*]\s+/, ''));
    } else if (line.trim().startsWith('|')) {
      flushList(i);
      tableRows.push(line);
    } else if (line.trim() === '') {
      flushList(i);
      flushTable(i);
    } else {
      flushList(i);
      flushTable(i);
      elements.push(
        <p key={i} className="text-on-surface-variant text-sm leading-relaxed my-2" dangerouslySetInnerHTML={{ __html: parseInlineStyles(line) }} />
      );
    }
  }

  flushList('end');
  flushTable('end');

  return <div className="space-y-1">{elements}</div>;
}

function parseInlineStyles(str) {
  let formatted = str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bold **word**
  formatted = formatted.replace(/\*\*([\s\S]*?)\*\*/g, '<strong class="text-on-surface font-bold">$1</strong>');
  
  // Inline code `code`
  formatted = formatted.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-black/60 border border-outline-variant/40 text-secondary font-code-md text-xs">$1</code>');

  return formatted;
}
