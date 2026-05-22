import React from 'react';
import { Play, Cpu, GitBranch, Zap, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

export default function Visualizer({ status, routedAgent }) {
  // Determine if a node is currently active / glowing
  const isNodeActive = (node) => {
    switch (status) {
      case 'input':
        return node === 'input';
      case 'nano-classifying':
        return ['input', 'scan'].includes(node);
      case 'routing':
        return ['input', 'scan', 'router'].includes(node);
      case 'executing-nano':
        return ['input', 'scan', 'router', 'exec-nano'].includes(node);
      case 'executing-super':
        return ['input', 'scan', 'router', 'exec-super'].includes(node);
      case 'completed':
        if (routedAgent === 'nano') {
          return ['input', 'scan', 'router', 'exec-nano', 'output'].includes(node);
        }
        return ['input', 'scan', 'router', 'exec-super', 'output'].includes(node);
      default:
        return false;
    }
  };

  // Determine if a connection path is currently active / flowing
  const isPathActive = (fromNode, toNode) => {
    if (status === 'idle') return false;

    if (fromNode === 'input' && toNode === 'scan') {
      return ['nano-classifying', 'routing', 'executing-nano', 'executing-super', 'completed'].includes(status);
    }
    if (fromNode === 'scan' && toNode === 'router') {
      return ['routing', 'executing-nano', 'executing-super', 'completed'].includes(status);
    }
    if (fromNode === 'router' && toNode === 'exec-nano') {
      return ['executing-nano', 'completed'].includes(status) && routedAgent === 'nano';
    }
    if (fromNode === 'router' && toNode === 'exec-super') {
      return ['executing-super', 'completed'].includes(status) && routedAgent === 'super';
    }
    if (fromNode === 'exec-nano' && toNode === 'output') {
      return status === 'completed' && routedAgent === 'nano';
    }
    if (fromNode === 'exec-super' && toNode === 'output') {
      return status === 'completed' && routedAgent === 'super';
    }
    return false;
  };

  // Return user-friendly label for current routing state
  const getStatusText = () => {
    switch (status) {
      case 'input':
        return { text: 'Ingesting workspace snippet...', color: 'text-blue-400' };
      case 'nano-classifying':
        return { text: 'Nano Agent performing AST regex checks...', color: 'text-emerald-400' };
      case 'routing':
        return { text: 'Router Agent calculating complexity bounds...', color: 'text-purple-400' };
      case 'executing-nano':
        return { text: 'Executing local Nano pipeline (Fast-track)...', color: 'text-emerald-400 animate-pulse' };
      case 'executing-super':
        return { text: 'Spinning up Super Agent reasoning (Gemini API)...', color: 'text-purple-400 animate-pulse' };
      case 'completed':
        return { text: 'Routing complete! Response delivered.', color: 'text-pink-400' };
      default:
        return { text: 'System standing by...', color: 'text-slate-500' };
    }
  };

  const currentStatus = getStatusText();

  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:border-slate-800">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 tracking-tight">
            <GitBranch className="w-5 h-5 text-purple-400" />
            Decision Routing Tracer
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time pipeline flow (NVIDIA Nemotron Routing Emulation)
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-slate-950 border border-slate-900 ${currentStatus.color}`}>
          {currentStatus.text}
        </div>
      </div>

      {/* SVG Canvas Flowchart (Perfect alignments across all screens) */}
      <div className="w-full relative bg-slate-950/70 rounded-2xl border border-slate-900/60 p-2 overflow-hidden">
        
        {/* Ambient Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c101c_1px,transparent_1px),linear-gradient(to_bottom,#0c101c_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-40" />

        <svg className="w-full h-auto block" viewBox="0 0 900 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Neon Glow Filters */}
          <defs>
            <filter id="neon-glow-blue" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="neon-glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="neon-glow-purple" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ================= BACKGROUND PATHS (INACTIVE STATE) ================= */}
          <path d="M 80,120 L 240,120" stroke="#111827" strokeWidth="3" />
          <path d="M 240,120 L 430,120" stroke="#111827" strokeWidth="3" />
          <path d="M 430,120 C 510,120 540,60 640,60" stroke="#111827" strokeWidth="3" />
          <path d="M 430,120 C 510,120 540,180 640,180" stroke="#111827" strokeWidth="3" />
          <path d="M 640,60 C 730,60 760,120 820,120" stroke="#111827" strokeWidth="3" />
          <path d="M 640,180 C 730,180 760,120 820,120" stroke="#111827" strokeWidth="3" />

          {/* ================= ACTIVE PATHS (FLOW ANIMATION) ================= */}
          {/* Input -> Scan */}
          <path
            d="M 80,120 L 240,120"
            stroke={isPathActive('input', 'scan') ? '#3b82f6' : 'transparent'}
            strokeWidth="3"
            strokeDasharray="6 6"
            className="animate-flow-dash"
            filter="url(#neon-glow-blue)"
          />

          {/* Scan -> Router */}
          <path
            d="M 240,120 L 430,120"
            stroke={isPathActive('scan', 'router') ? '#10b981' : 'transparent'}
            strokeWidth="3"
            strokeDasharray="6 6"
            className="animate-flow-dash"
            filter="url(#neon-glow-emerald)"
          />

          {/* Router -> Nano Executor */}
          <path
            d="M 430,120 C 510,120 540,60 640,60"
            stroke={isPathActive('router', 'exec-nano') ? '#10b981' : 'transparent'}
            strokeWidth="3"
            strokeDasharray="6 6"
            className="animate-flow-dash"
            filter="url(#neon-glow-emerald)"
          />

          {/* Router -> Super Executor */}
          <path
            d="M 430,120 C 510,120 540,180 640,180"
            stroke={isPathActive('router', 'exec-super') ? '#a855f7' : 'transparent'}
            strokeWidth="3"
            strokeDasharray="6 6"
            className="animate-flow-dash"
            filter="url(#neon-glow-purple)"
          />

          {/* Nano Executor -> Output */}
          <path
            d="M 640,60 C 730,60 760,120 820,120"
            stroke={isPathActive('exec-nano', 'output') ? '#10b981' : 'transparent'}
            strokeWidth="3"
            strokeDasharray="6 6"
            className="animate-flow-dash"
            filter="url(#neon-glow-emerald)"
          />

          {/* Super Executor -> Output */}
          <path
            d="M 640,180 C 730,180 760,120 820,120"
            stroke={isPathActive('exec-super', 'output') ? '#a855f7' : 'transparent'}
            strokeWidth="3"
            strokeDasharray="6 6"
            className="animate-flow-dash"
            filter="url(#neon-glow-purple)"
          />

          {/* ================= FLOWCHART NODES ================= */}
          {/* Node 1: Input */}
          <foreignObject x="40" y="80" width="80" height="80">
            <div className={`w-full h-full rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 ${
              isNodeActive('input')
                ? 'bg-blue-950/70 border-blue-500 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)]'
                : 'bg-slate-900/60 border-slate-800 text-slate-500'
            }`}>
              <Play className="w-5 h-5 fill-current" />
              <span className="text-[9px] font-bold uppercase tracking-wider mt-1.5">Input</span>
            </div>
          </foreignObject>

          {/* Node 2: Scan */}
          <foreignObject x="190" y="80" width="100" height="80">
            <div className={`w-full h-full rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 ${
              isNodeActive('scan')
                ? 'bg-emerald-950/70 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                : 'bg-slate-900/60 border-slate-800 text-slate-500'
            }`}>
              <Cpu className="w-5 h-5" />
              <span className="text-[9px] font-bold uppercase tracking-wider mt-1.5">Nano Scan</span>
            </div>
          </foreignObject>

          {/* Node 3: Router */}
          <foreignObject x="380" y="70" width="100" height="100">
            <div className="w-full h-full flex items-center justify-center relative">
              {/* Rotated diamond shape background */}
              <div className={`absolute w-16 h-16 rotate-45 border transition-all duration-300 ${
                isNodeActive('router')
                  ? 'bg-purple-950/70 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                  : 'bg-slate-900/60 border-slate-800'
              }`} />
              {/* Content overlay */}
              <div className={`relative z-10 flex flex-col items-center transition-colors duration-300 ${
                isNodeActive('router') ? 'text-purple-400' : 'text-slate-500'
              }`}>
                <GitBranch className="w-5 h-5" />
                <span className="text-[9px] font-bold uppercase tracking-wider mt-1.5">Router</span>
              </div>
            </div>
          </foreignObject>

          {/* Node 4 (Top): Nano Executor */}
          <foreignObject x="585" y="25" width="110" height="70">
            <div className={`w-full h-full rounded-xl flex flex-col items-center justify-center border transition-all duration-300 ${
              isNodeActive('exec-nano')
                ? 'bg-emerald-950/70 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                : 'bg-slate-900/60 border-slate-800 text-slate-500'
            }`}>
              <div className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                <span className="text-[9.5px] font-extrabold uppercase tracking-wider">Nano Agent</span>
              </div>
              <span className="text-[8px] opacity-75 mt-0.5">Rule-based 15ms</span>
            </div>
          </foreignObject>

          {/* Node 4 (Bottom): Super Executor */}
          <foreignObject x="585" y="145" width="110" height="70">
            <div className={`w-full h-full rounded-xl flex flex-col items-center justify-center border transition-all duration-300 ${
              isNodeActive('exec-super')
                ? 'bg-purple-950/70 border-purple-500 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                : 'bg-slate-900/60 border-slate-800 text-slate-500'
            }`}>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-[9.5px] font-extrabold uppercase tracking-wider">Super Agent</span>
              </div>
              <span className="text-[8px] opacity-75 mt-0.5">LLM Reasoning</span>
            </div>
          </foreignObject>

          {/* Node 5: Output */}
          <foreignObject x="780" y="80" width="80" height="80">
            <div className={`w-full h-full rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 ${
              isNodeActive('output')
                ? 'bg-pink-950/70 border-pink-500 text-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.4)]'
                : 'bg-slate-900/60 border-slate-800 text-slate-500'
            }`}>
              <CheckCircle className="w-5 h-5" />
              <span className="text-[9px] font-bold uppercase tracking-wider mt-1.5">Output</span>
            </div>
          </foreignObject>
        </svg>

      </div>
    </div>
  );
}
