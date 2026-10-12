import React from 'react';
import { Cpu, Lock, Unlock, Sparkles, BookOpen, Clock, Award, Printer, Shield } from 'lucide-react';

export type ActiveTab = 'challenges' | 'simulator' | 'wiring' | 'timer' | 'rubric' | 'print';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isTeacherMode: boolean;
  onToggleTeacherMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  isTeacherMode,
  onToggleTeacherMode
}) => {
  return (
    <header className="bg-[#1E3A5F] text-white border-b border-slate-700 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Brand Zone - CodePath with orange < /> logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => onSelectTab('challenges')}>
            <span className="text-[#F97316] font-mono font-black text-xl tracking-tighter">
              &lt; /&gt;
            </span>
            <span className="font-bold text-lg tracking-tight text-white font-['Poppins']">
              CodePath
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-600 text-xs text-slate-300">
            <span>Arduino Lab XII</span>
            <span className="text-slate-500">·</span>
            <span className="text-teal-300">Traffic Light & LED Challenge</span>
          </div>
        </div>

        {/* Navigation Links Zone */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
          <button
            onClick={() => onSelectTab('challenges')}
            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'challenges'
                ? 'bg-white/15 text-white font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            10 Tantangan Kelompok
          </button>

          <button
            onClick={() => onSelectTab('simulator')}
            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'bg-white/15 text-white font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Simulator & Editor
          </button>

          <button
            onClick={() => onSelectTab('wiring')}
            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'wiring'
                ? 'bg-white/15 text-white font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Skema Wiring
          </button>

          <button
            onClick={() => onSelectTab('timer')}
            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'timer'
                ? 'bg-white/15 text-white font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Timer Praktik
          </button>

          <button
            onClick={() => onSelectTab('rubric')}
            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'rubric'
                ? 'bg-white/15 text-white font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Penilaian Guru
          </button>

          <button
            onClick={() => onSelectTab('print')}
            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'print'
                ? 'bg-white/15 text-white font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Cetak LKS
          </button>
        </nav>

        {/* Action Zone: Teacher Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTeacherMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
              isTeacherMode
                ? 'bg-[#F97316] text-white hover:bg-orange-600'
                : 'bg-white/10 text-slate-200 hover:bg-white/20 hover:text-white'
            }`}
            title="Buka kunci jawaban dan solusi lengkap untuk guru"
          >
            {isTeacherMode ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">
              {isTeacherMode ? 'Mode Guru (Kunci Terbuka)' : 'Mode Siswa'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <div className="md:hidden flex overflow-x-auto px-4 py-2 border-t border-slate-700 gap-1 text-xs">
        <button
          onClick={() => onSelectTab('challenges')}
          className={`px-2.5 py-1.5 rounded whitespace-nowrap ${
            activeTab === 'challenges' ? 'bg-[#F97316] text-white font-semibold' : 'text-slate-300'
          }`}
        >
          10 Tantangan
        </button>
        <button
          onClick={() => onSelectTab('simulator')}
          className={`px-2.5 py-1.5 rounded whitespace-nowrap ${
            activeTab === 'simulator' ? 'bg-[#F97316] text-white font-semibold' : 'text-slate-300'
          }`}
        >
          Simulator
        </button>
        <button
          onClick={() => onSelectTab('wiring')}
          className={`px-2.5 py-1.5 rounded whitespace-nowrap ${
            activeTab === 'wiring' ? 'bg-[#F97316] text-white font-semibold' : 'text-slate-300'
          }`}
        >
          Wiring
        </button>
        <button
          onClick={() => onSelectTab('timer')}
          className={`px-2.5 py-1.5 rounded whitespace-nowrap ${
            activeTab === 'timer' ? 'bg-[#F97316] text-white font-semibold' : 'text-slate-300'
          }`}
        >
          Timer
        </button>
        <button
          onClick={() => onSelectTab('rubric')}
          className={`px-2.5 py-1.5 rounded whitespace-nowrap ${
            activeTab === 'rubric' ? 'bg-[#F97316] text-white font-semibold' : 'text-slate-300'
          }`}
        >
          Penilaian
        </button>
        <button
          onClick={() => onSelectTab('print')}
          className={`px-2.5 py-1.5 rounded whitespace-nowrap ${
            activeTab === 'print' ? 'bg-[#F97316] text-white font-semibold' : 'text-slate-300'
          }`}
        >
          LKS Cetak
        </button>
      </div>
    </header>
  );
};
