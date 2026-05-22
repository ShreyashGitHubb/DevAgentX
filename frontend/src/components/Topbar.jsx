import React from 'react';

export default function Topbar({ status, routedAgent, theme, toggleTheme }) {
  // Determine status dot styling
  const isNanoRunning = ['nano-classifying', 'routing', 'executing-nano'].includes(status);
  const isSuperRunning = ['executing-super'].includes(status);

  return (
    <header className="fixed top-0 right-0 left-16 md:left-64 h-16 bg-surface/80 backdrop-blur-xl border-b border-outline-variant flex justify-between items-center px-margin-desktop z-40 transition-all duration-300">
      
      {/* Dynamic Status Blocks */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span 
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              isNanoRunning 
                ? 'bg-primary-container shadow-[0_0_8px_#00f0ff] animate-pulse'
                : 'bg-tertiary shadow-[0_0_8px_#4edea3]'
            }`}
          />
          <span className="font-label-sm text-label-sm text-primary-container font-bold">
            Nano Status: {isNanoRunning ? 'Classifying' : 'Active'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span 
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              isSuperRunning 
                ? 'bg-[#d0bcff] shadow-[0_0_8px_#d0bcff] animate-pulse'
                : 'bg-outline'
            }`}
          />
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Super Status: {isSuperRunning ? 'Reasoning' : 'Idle'}
          </span>
        </div>
      </div>

      {/* Utilities & Profile */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden lg:flex items-center bg-surface-container-highest px-4 py-1.5 rounded-full border border-outline-variant">
          <span className="material-symbols-outlined text-on-surface-variant text-[18px] mr-2">
            search
          </span>
          <input 
            className="bg-transparent border-none text-label-sm focus:ring-0 p-0 text-on-surface w-48 placeholder-outline-variant outline-none" 
            placeholder="Search workspace..." 
            type="text"
          />
        </div>

        {/* Diagnostic Signals */}
        <div className="flex gap-4 mr-4 border-r border-outline-variant pr-4 items-center">
          <button 
            onClick={toggleTheme} 
            className="material-symbols-outlined text-on-surface-variant hover:text-primary-container transition-colors cursor-pointer focus:outline-none flex items-center justify-center" 
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </button>
          <span className="material-symbols-outlined text-on-surface-variant hover:text-primary-container transition-colors cursor-pointer" title="System Notifications">
            notifications
          </span>
          <span className="material-symbols-outlined text-on-surface-variant hover:text-primary-container transition-colors cursor-pointer" title="Process Allocator">
            memory
          </span>
          <span className="material-symbols-outlined text-on-surface-variant hover:text-primary-container transition-colors cursor-pointer" title="Reload Listeners">
            bolt
          </span>
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="font-label-sm text-label-sm text-on-surface leading-none font-semibold">
              Agent Monitor
            </p>
            <p className="text-[10px] text-outline mt-1 font-code-md">
              v4.2.0-stable
            </p>
          </div>
          <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-highest flex items-center justify-center border border-primary-container/30">
            <img 
              className="w-full h-full object-cover" 
              alt="Developer Profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAapBE0ELIsT75KVJcY82sYwvPJYIxFsb7Ov6bWoxEtzCGCQ9fg1YilCeansYwdDPDo8yYIoQUFLvcVRMRRk0fYZ2yCVyiIcfH-EkvqOfzAUemwPJLzB2QQg8w0TTtMZeTrOFZHXFfZ_hW-IfW-j47YknailJbksfsOHitsRUsx1R7vxe6GQDt_CvLDUYuY_Lj0mxmEiYA5sXXJvRCH_7ZbZhyEyan_jEETD3_QIlmZiM4iEtAVJ_Uv9zciCsXWResErXWv-t_VJ54"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
