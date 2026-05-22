import React, { useState } from 'react';
import { Terminal, Code, Cpu, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

const TASKS = [
  { id: 'explain', name: 'Explain Code', desc: 'Detailed code explanation', icon: Code, color: 'from-blue-500 to-cyan-500' },
  { id: 'debug', name: 'Find Bugs', desc: 'Identify logical errors', icon: ShieldAlert, color: 'from-red-500 to-rose-500' },
  { id: 'optimize', name: 'Optimize Code', desc: 'Boost logic & complexity', icon: Cpu, color: 'from-amber-500 to-yellow-500' },
  { id: 'readme', name: 'Generate README', desc: 'Draft GitHub description', icon: Terminal, color: 'from-purple-500 to-indigo-500' }
];

export default function InputArea({ onSubmit, isLoading }) {
  const [input, setInput] = useState('');
  const [task, setTask] = useState('explain');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSubmit(input, task);
  };

  const loadDemo = (type) => {
    if (type === 'simple') {
      setInput(`function add(a, b) {
  return a + b;
}`);
      setTask('explain');
    } else if (type === 'buggy') {
      setInput(`// Calculate Fibonacci recursively
function fib(n) {
  if (n <= 1) return n;
  // Bug: No base case limits or optimization check
  return fib(n - 1) + fib(n - 2);
}

// Infinite recursion risk for large values
console.log(fib(50));`);
      setTask('debug');
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
      setTask('optimize');
    } else {
      setInput('https://github.com/google/jax');
      setTask('readme');
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:border-slate-800">
      {/* Decorative backdrop light */}
      <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
          <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
          Input Workspace
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => loadDemo('simple')}
            className="text-xs px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
          >
            Demo: Simple
          </button>
          <button
            onClick={() => loadDemo('buggy')}
            className="text-xs px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
          >
            Demo: Buggy Code
          </button>
          <button
            onClick={() => loadDemo('nested')}
            className="text-xs px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
          >
            Demo: Complex Loop
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your code snippet or Enter a Repository Link here..."
            className="w-full h-48 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-mono text-sm resize-none"
          />
        </div>

        {/* Task selection */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Select Operation Route
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {TASKS.map((t) => {
              const Icon = t.icon;
              const isSelected = task === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTask(t.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${
                    isSelected
                      ? `bg-slate-900 border-purple-500/50 ring-1 ring-purple-500/30`
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${t.color} text-white`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-xs text-slate-400 line-clamp-1">{t.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`w-full py-3.5 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
              !input.trim() || isLoading
                ? 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20 active:scale-[0.99]'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Analyzing & Routing Task...
              </>
            ) : (
              <>
                <Terminal className="w-5 h-5" />
                Compile and Run Code
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
