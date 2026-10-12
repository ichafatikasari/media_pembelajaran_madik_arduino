import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Bell, Maximize2, Minimize2, Volume2, Plus, Minus } from 'lucide-react';
import { playSchoolChime } from '../utils/audioAlert';

export const ClassroomTimer: React.FC = () => {
  const [totalSeconds, setTotalSeconds] = useState(10 * 60); // 10 minutes default
  const [remainingSeconds, setRemainingSeconds] = useState(10 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            setIsFinished(true);
            playSchoolChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, remainingSeconds]);

  const toggleTimer = () => {
    if (isFinished) {
      setIsFinished(false);
      setRemainingSeconds(totalSeconds);
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsFinished(false);
    setRemainingSeconds(totalSeconds);
  };

  const adjustMinutes = (deltaMin: number) => {
    const newTotal = Math.max(60, totalSeconds + deltaMin * 60);
    setTotalSeconds(newTotal);
    if (!isActive) {
      setRemainingSeconds(newTotal);
    } else {
      setRemainingSeconds((prev) => Math.max(0, prev + deltaMin * 60));
    }
  };

  const handleTestBell = () => {
    playSchoolChime();
  };

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const progressPercent = Math.max(0, Math.min(100, ((totalSeconds - remainingSeconds) / totalSeconds) * 100));

  const toggleFullscreenMode = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm transition-all ${
        isFullscreen ? 'p-10 flex flex-col justify-center items-center h-screen bg-slate-950 text-white' : 'p-6'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 w-full max-w-2xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1E3A5F] text-[#F97316] flex items-center justify-center font-bold">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className={`font-bold ${isFullscreen ? 'text-xl text-white' : 'text-sm text-[#1E3A5F]'}`}>
              Timer Sesi Praktik & Tantangan Kelas 12
            </h3>
            <p className="text-xs text-slate-500">
              Alokasi waktu pengerjaan 10 kelompok praktikum di laboratorium
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTestBell}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Uji bunyi bel sekolah"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Uji Bel</span>
          </button>

          <button
            onClick={toggleFullscreenMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Tampilkan layar penuh / proyektor"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? 'Kecilkan' : 'Proyektor'}</span>
          </button>
        </div>
      </div>

      {/* Main Countdown Display */}
      <div className="text-center my-4 w-full max-w-2xl">
        <div
          className={`font-mono font-bold tracking-tight select-none tabular-nums ${
            isFinished
              ? 'text-red-500 animate-bounce text-6xl sm:text-7xl'
              : remainingSeconds < 300
              ? 'text-amber-500 text-6xl sm:text-7xl'
              : isFullscreen
              ? 'text-white text-7xl sm:text-8xl'
              : 'text-[#1E3A5F] text-6xl sm:text-7xl'
          }`}
        >
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div className="text-xs text-slate-500 mt-2 font-medium">
          {isFinished ? (
            <span className="text-red-600 font-bold uppercase tracking-wider text-sm">
              ⏰ Waktu Sesi Praktik Telah Habis! Silakan Kumpulkan Hasil.
            </span>
          ) : isActive ? (
            <span>Sesi Praktik Sedang Berjalan · Seluruh Kelompok Bekerja</span>
          ) : (
            <span>Timer Dijeda · Siap Dimulai</span>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full mt-5 overflow-hidden border border-slate-200">
          <div
            className={`h-full transition-all duration-300 ${
              remainingSeconds < 300 ? 'bg-amber-500' : 'bg-[#F97316]'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-6 w-full max-w-2xl">
        <div className="flex items-center gap-1">
          <button
            onClick={() => adjustMinutes(-5)}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
            title="Kurangi 5 Menit"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-mono text-slate-600 px-2">± 5 Menit</span>
          <button
            onClick={() => adjustMinutes(5)}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
            title="Tambah 5 Menit"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={toggleTimer}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm ${
            isActive
              ? 'bg-amber-500 hover:bg-amber-600 text-white'
              : 'bg-[#F97316] hover:bg-orange-600 text-white'
          }`}
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{isActive ? 'Jeda Timer' : 'Mulai Timer'}</span>
        </button>

        <button
          onClick={resetTimer}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
