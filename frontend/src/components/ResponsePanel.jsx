import React, { useState } from 'react';
import { Terminal, ShieldAlert, Cpu, Check, Copy, ChevronDown, ChevronUp, Clock, Server, Eye } from 'lucide-react';

export default function ResponsePanel({ response }) {
  const [copied, setCopied] = useState(false);
  const [showThinking, setShowThinking] = useState(true);

  if (!response) {
    return (
      <div className="glass-panel rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[350px] relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-slate-800/10 rounded-full blur-3xl pointer-events-none" />
        <Terminal className="w-14 h-14 text-slate-700 mb-4 animate-pulse" />
        <h3 className="text-base font-bold text-slate-300 tracking-wide">Awaiting Operations Queue</h3>
        <p className="text-sm text-slate-500 max-w-sm mt-1.5 leading-relaxed">
          Select a developer target activity and submit. The copilot routing tracer will log decision-making metrics.
        </p>
      </div>
    );
  }

  const { agent, reason, output, thinking, metadata } = response;

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Routing Routing Metadata Panel */}
      <div className={`rounded-2xl border p-5 flex flex-col md:flex-row justify-between gap-4 transition-all duration-300 relative overflow-hidden ${
        agent === 'super'
          ? 'bg-purple-950/15 border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.05)]'
          : 'bg-emerald-950/15 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]'
      }`}>
        {/* Glow source */}
        <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl pointer-events-none ${
          agent === 'super' ? 'bg-purple-500/10' : 'bg-emerald-500/10'
        }`} />

        <div className="flex gap-4 relative z-10">
          <div className={`p-3 rounded-xl h-fit flex items-center justify-center text-white ${
            agent === 'super' ? 'bg-purple-600 shadow-lg shadow-purple-600/30' : 'bg-emerald-600 shadow-lg shadow-emerald-600/30'
          }`}>
            {agent === 'super' ? <Server className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-wide">
                Decision: {agent === 'super' ? 'Escalated to Super Agent' : 'Fast-Tracked to Nano Agent'}
              </h3>
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                agent === 'super'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {agent === 'super' ? 'LLM Reasoning' : 'Local AST Rules'}
              </span>
            </div>
            <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">{reason}</p>
          </div>
        </div>
        
        {/* Performance metrics */}
        <div className="flex md:flex-col justify-between md:justify-center border-t md:border-t-0 md:border-l border-slate-800/80 pt-3.5 md:pt-0 md:pl-5 gap-2 text-xs text-slate-400 min-w-[140px] relative z-10">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Latency: <strong className="text-white">{metadata?.speed || 'N/A'}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Server className="w-3.5 h-3.5 text-slate-500" />
            <span>Engine: <strong className="text-white truncate max-w-[90px] inline-block align-bottom">{metadata?.engine || 'Local AST'}</strong></span>
          </div>
        </div>
      </div>

      {/* Step-by-Step Reasoning (Chain of Thought for Super Agent) */}
      {agent === 'super' && thinking && (
        <div className="rounded-2xl overflow-hidden border border-purple-500/10 shadow-lg shadow-black/40">
          <div className="flex items-center justify-between px-5 py-3 bg-slate-950/90 border-b border-slate-900">
            {/* macOS Style Console controls */}
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block"></span>
              <span className="text-[11px] font-mono text-slate-500 ml-2">super-agent-cot.log</span>
            </div>
            <button
              onClick={() => setShowThinking(!showThinking)}
              className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-purple-400 hover:text-purple-300 transition"
            >
              <Eye className="w-3.5 h-3.5" />
              {showThinking ? 'Hide Trace' : 'Show Trace'}
            </button>
          </div>
          
          {showThinking && (
            <div className="p-5 bg-[#070913] font-mono text-[11px] leading-relaxed text-slate-400 max-h-60 overflow-y-auto whitespace-pre-wrap relative">
              {/* Scanlines visual effect */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] pointer-events-none opacity-20" />
              
              <LogHighlighter logText={thinking} />
              
              {/* Pulsing blinking caret */}
              <span className="inline-block w-1.5 h-3 bg-purple-500 ml-1 animate-pulse" style={{ animationDuration: '0.8s' }}></span>
            </div>
          )}
        </div>
      )}

      {/* Output Panel */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-xl shadow-black/35">
        <div className="flex justify-between items-center px-6 py-4 bg-slate-900/40 border-b border-slate-900">
          <h3 className="text-sm font-bold text-white tracking-wide">Execution Response Payload</h3>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-slate-800 border border-transparent hover:border-slate-700 bg-slate-900/30"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        <div className="p-6 overflow-x-auto text-slate-300 prose prose-invert max-w-none">
          <MarkdownRenderer markdown={output} />
        </div>
      </div>
    </div>
  );
}

/**
 * Highlights key terms inside the Terminal Thinking Logs (Step numbers, variables, outcomes).
 */
function LogHighlighter({ logText }) {
  const lines = logText.split('\n');

  return (
    <code>
      {lines.map((line, idx) => {
        let element = line;
        
        // Highlight "[Step X]" tags
        const stepMatch = line.match(/^(\[Step \d+\])(.*)/);
        if (stepMatch) {
          const stepTag = stepMatch[1];
          const remainingText = stepMatch[2];
          
          return (
            <div key={idx} className="mb-1">
              <span className="text-purple-400 font-bold">{stepTag}</span>
              <span className="text-slate-300">{remainingText}</span>
            </div>
          );
        }

        // Highlight nested list bullets
        if (line.startsWith('   -')) {
          return (
            <div key={idx} className="text-slate-400 pl-4 mb-0.5">
              <span className="text-cyan-500 font-bold">↳</span> {line.replace('   -', '')}
            </div>
          );
        }

        return <div key={idx} className="mb-0.5 text-slate-400">{element}</div>;
      })}
    </code>
  );
}

/**
 * A highly tailored custom Markdown parser designed specifically to render AI responses,
 * including lists, tables, warnings, tip blocks, and custom diff color coding.
 */
function MarkdownRenderer({ markdown = '' }) {
  if (!markdown) return null;

  // Split content by code blocks to isolate code from normal markdown text
  const parts = markdown.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-4">
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          // Parse code block
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          const lang = match ? match[1] : '';
          const code = match ? match[2] : part.slice(3, -3);

          if (lang === 'diff') {
            return <DiffBlock key={index} code={code} />;
          }

          return (
            <div key={index} className="my-4 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden font-mono text-sm shadow-md">
              <div className="bg-slate-900/60 px-4 py-2 text-xs text-slate-400 border-b border-slate-800/60 uppercase font-semibold flex justify-between">
                <span>{lang || 'code'} codeblock</span>
                <span className="text-[10px] text-indigo-400 opacity-80">Syntactically Safe</span>
              </div>
              <pre className="p-4 overflow-x-auto text-emerald-300 font-mono text-xs md:text-sm bg-slate-950/80">
                <code>{code}</code>
              </pre>
            </div>
          );
        } else {
          // Render plain markdown text (headers, lists, tables, callouts)
          return <RichText key={index} text={part} />;
        }
      })}
    </div>
  );
}

/**
 * Custom line-by-line renderer for unified diff formats.
 * Colors deleted lines red, added lines green, and centers formatting.
 */
function DiffBlock({ code }) {
  const lines = code.split('\n');

  return (
    <div className="my-4 rounded-xl border border-slate-800/80 bg-slate-950/80 overflow-hidden font-mono text-xs md:text-sm shadow-lg">
      <div className="bg-slate-900/60 px-4 py-2 text-xs text-slate-400 border-b border-slate-900 uppercase font-semibold flex justify-between">
        <span>Patch Comparison (Unified Diff)</span>
        <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-bold">Super Agent recommendation</span>
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

/**
 * Standard text parser for headings, bullet points, alerts, and tables.
 */
function RichText({ text }) {
  const lines = text.split('\n');
  const renderedElements = [];
  let listItems = [];
  let tableRows = [];
  let inAlert = false;
  let alertType = ''; // NOTE, TIP, WARNING, IMPORTANT, CAUTION
  let alertContent = [];

  const flushList = (key) => {
    if (listItems.length > 0) {
      renderedElements.push(
        <ul key={`ul-${key}`} className="list-disc pl-6 space-y-1.5 my-3 text-slate-300 text-sm">
          {listItems.map((item, idx) => <li key={idx} dangerouslySetInnerHTML={{ __html: inlineStyles(item) }} />)}
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

      renderedElements.push(
        <div key={`table-${key}`} className="my-4 overflow-x-auto rounded-xl border border-slate-900 shadow-md">
          <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
            <thead className="bg-slate-900/60 font-semibold text-slate-200">
              <tr>
                {headers.map((h, idx) => (
                  <th key={idx} className="px-4 py-3 text-xs uppercase tracking-wider" dangerouslySetInnerHTML={{ __html: inlineStyles(h) }} />
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 bg-slate-950/20">
              {bodyRows.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-slate-900/10">
                  {row.map((cell, cellIdx) => (
                    <td key={cellIdx} className="px-4 py-2.5 text-slate-300 font-mono text-xs" dangerouslySetInnerHTML={{ __html: inlineStyles(cell) }} />
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

  const flushAlert = (key) => {
    if (inAlert) {
      let alertClass = 'p-4 rounded-xl my-4 border text-sm ';
      if (alertType === 'WARNING') alertClass += 'bg-amber-950/10 border-amber-500/30 text-amber-300';
      else if (alertType === 'IMPORTANT') alertClass += 'bg-rose-950/10 border-rose-500/30 text-rose-300';
      else if (alertType === 'TIP') alertClass += 'bg-emerald-950/10 border-emerald-500/30 text-emerald-300';
      else alertClass += 'bg-blue-950/10 border-blue-500/30 text-blue-300';

      renderedElements.push(
        <div key={`alert-${key}`} className={alertClass}>
          <div className="font-bold flex items-center gap-1.5 mb-1.5 uppercase text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
            {alertType}
          </div>
          <div className="leading-relaxed opacity-95" dangerouslySetInnerHTML={{ __html: inlineStyles(alertContent.join(' ')) }} />
        </div>
      );
      alertContent = [];
      inAlert = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith('> [!')) {
      flushList(i);
      flushTable(i);
      const match = line.match(/>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);
      if (match) {
        inAlert = true;
        alertType = match[1].toUpperCase();
        continue;
      }
    }

    if (inAlert) {
      if (line.trim().startsWith('>')) {
        alertContent.push(line.replace(/^>\s*/, ''));
        continue;
      } else {
        flushAlert(i);
      }
    }

    if (line.startsWith('### ')) {
      flushList(i);
      flushTable(i);
      renderedElements.push(
        <h3 key={i} className="text-base font-bold text-white mt-6 mb-3 flex items-center gap-2 border-b border-slate-900 pb-2">
          {line.replace('### ', '')}
        </h3>
      );
    } else if (line.startsWith('#### ')) {
      flushList(i);
      flushTable(i);
      renderedElements.push(
        <h4 key={i} className="text-sm font-semibold text-slate-200 mt-4 mb-2">
          {line.replace('#### ', '')}
        </h4>
      );
    } 
    else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      flushTable(i);
      listItems.push(line.trim().replace(/^[-*]\s+/, ''));
    }
    else if (line.trim().startsWith('|')) {
      flushList(i);
      tableRows.push(line);
    }
    else if (line.trim() === '') {
      flushList(i);
      flushTable(i);
      flushAlert(i);
    } 
    else {
      flushList(i);
      flushTable(i);
      renderedElements.push(
        <p key={i} className="text-slate-300 text-sm leading-relaxed my-2" dangerouslySetInnerHTML={{ __html: inlineStyles(line) }} />
      );
    }
  }

  flushList('end');
  flushTable('end');
  flushAlert('end');

  return <div className="space-y-1">{renderedElements}</div>;
}

function inlineStyles(str) {
  let formatted = str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  formatted = formatted.replace(/\*\*([\s\S]*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>');
  formatted = formatted.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-indigo-300 font-mono text-xs">$1</code>');

  return formatted;
}
