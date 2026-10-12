import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, FastForward, CheckCircle2, AlertTriangle, Zap, Volume2 } from 'lucide-react';
import { SimulationStep } from '../types';
import { playSuccessBeep } from '../utils/audioAlert';

interface ArduinoSimulatorProps {
  steps: SimulationStep[];
  currentChallengeTitle?: string;
  groupNumber?: number;
  onCodeReset?: () => void;
}

export const ArduinoSimulator: React.FC<ArduinoSimulatorProps> = ({
  steps,
  currentChallengeTitle,
  groupNumber
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [timeRemainingMs, setTimeRemainingMs] = useState<number>(0);
  const [manualOverride, setManualOverride] = useState(false);
  
  // Manual LED state when paused
  const [manualRed, setManualRed] = useState(false);
  const [manualYellow, setManualYellow] = useState(false);
  const [manualGreen, setManualGreen] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalTickRef = useRef<NodeJS.Timeout | null>(null);

  const activeStep = steps[currentStepIndex] || {
    ledRed: false,
    ledGreen: false,
    ledYellow: false,
    durationMs: 1000,
    description: 'Siap dijalankan'
  };

  const isRed = manualOverride ? manualRed : (isRunning ? activeStep.ledRed : false);
  const isYellow = manualOverride ? manualYellow : (isRunning ? activeStep.ledYellow : false);
  const isGreen = manualOverride ? manualGreen : (isRunning ? activeStep.ledGreen : false);

  // Run simulation sequence
  useEffect(() => {
    if (!isRunning || steps.length === 0 || manualOverride) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalTickRef.current) clearInterval(intervalTickRef.current);
      return;
    }

    const step = steps[currentStepIndex];
    if (!step) return;

    const actualDuration = Math.max(150, step.durationMs / speedMultiplier);
    setTimeRemainingMs(actualDuration);

    const tickInterval = 50;
    const startTimestamp = Date.now();

    intervalTickRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimestamp;
      const left = Math.max(0, actualDuration - elapsed);
      setTimeRemainingMs(left);
    }, tickInterval);

    timerRef.current = setTimeout(() => {
      clearInterval(intervalTickRef.current!);
      setCurrentStepIndex((prev) => (prev + 1) % steps.length);
    }, actualDuration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalTickRef.current) clearInterval(intervalTickRef.current);
    };
  }, [isRunning, currentStepIndex, steps, speedMultiplier, manualOverride]);

  const handleTogglePlay = () => {
    if (manualOverride) {
      setManualOverride(false);
    }
    if (!isRunning) {
      playSuccessBeep();
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setManualOverride(false);
    setCurrentStepIndex(0);
    setTimeRemainingMs(0);
  };

  const handleManualToggle = (color: 'red' | 'yellow' | 'green') => {
    setIsRunning(false);
    setManualOverride(true);
    if (color === 'red') setManualRed(!manualRed);
    if (color === 'yellow') setManualYellow(!manualYellow);
    if (color === 'green') setManualGreen(!manualGreen);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Simulation Top Bar */}
      <div className="bg-[#1E3A5F] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <div>
            <h3 className="font-semibold text-sm tracking-wide">
              Virtual Arduino Uno & Breadboard Simulator
            </h3>
            <p className="text-xs text-slate-300">
              {currentChallengeTitle 
                ? `Menguji: Kelompok ${groupNumber || 1} - ${currentChallengeTitle}` 
                : 'Traffic Light 3-LED (Pin 3: Merah, Pin 4: Hijau, Pin 5: Kuning)'}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Speed selector */}
          <div className="flex items-center bg-white/10 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setSpeedMultiplier(0.5)}
              className={`px-2 py-1 rounded transition-colors ${speedMultiplier === 0.5 ? 'bg-[#F97316] text-white font-medium' : 'text-slate-200 hover:text-white'}`}
              title="Kecepatan lambat (0.5x)"
            >
              0.5x
            </button>
            <button
              onClick={() => setSpeedMultiplier(1)}
              className={`px-2 py-1 rounded transition-colors ${speedMultiplier === 1 ? 'bg-[#F97316] text-white font-medium' : 'text-slate-200 hover:text-white'}`}
              title="Kecepatan normal (1x)"
            >
              1x
            </button>
            <button
              onClick={() => setSpeedMultiplier(2)}
              className={`px-2 py-1 rounded transition-colors ${speedMultiplier === 2 ? 'bg-[#F97316] text-white font-medium' : 'text-slate-200 hover:text-white'}`}
              title="Kecepatan cepat (2x)"
            >
              2x
            </button>
          </div>

          <button
            onClick={handleTogglePlay}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-[#F97316] hover:bg-orange-600 text-white shadow-sm'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isRunning ? 'Jeda (Pause)' : 'Jalankan (Run)'}</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
            title="Reset ke awal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Main Visual Board Canvas */}
      <div className="p-6 bg-slate-900 text-slate-100 min-h-[380px] flex flex-col justify-between select-none relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
            backgroundSize: '16px 16px'
          }}
        />

        {/* Top Status & Timing Indicator */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 backdrop-blur border border-slate-700 rounded-lg px-4 py-2.5 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Status Siklus:</span>
            <span className="font-mono font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
              {manualOverride ? 'Manual Uji Pin' : (isRunning ? `Langkah ${currentStepIndex + 1}/${steps.length}` : 'Menunggu Run')}
            </span>
            <span className="text-slate-300 font-mono">
              {manualOverride 
                ? 'Klik tombol uji LED di bawah' 
                : (isRunning ? activeStep.description : 'Tekan tombol Jalankan (Run)')}
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono">
            <span className="text-slate-400">Sisa Delay:</span>
            <span className="text-amber-300 font-semibold tabular-nums text-sm">
              {isRunning ? `${(timeRemainingMs / 1000).toFixed(1)}s` : '0.0s'}
            </span>
          </div>
        </div>

        {/* Board & Breadboard Layout */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 items-center">
          {/* Virtual Arduino Uno (Left 7 cols) */}
          <div className="lg:col-span-7 bg-[#00878F] rounded-2xl p-5 border-2 border-[#006e75] shadow-xl relative overflow-hidden text-slate-900">
            {/* Board branding */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-white text-[#00878F] flex items-center justify-center font-bold text-xs">∞</div>
                  <span className="font-bold text-base tracking-wider text-white">ARDUINO</span>
                  <span className="text-xs font-semibold px-1.5 py-0.5 bg-yellow-400 text-slate-950 rounded">UNO R3</span>
                </div>
                <div className="text-[10px] text-teal-100 font-mono mt-0.5">ATmega328P · 16.0 MHz Microcontroller</div>
              </div>

              {/* USB Port & Power Jack */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-7 bg-slate-300 rounded border border-slate-400 flex items-center justify-center text-[9px] font-mono text-slate-700 shadow-inner">
                  USB-B
                </div>
                <div className="w-6 h-6 rounded-full bg-red-600 border border-red-700 text-white text-[8px] flex items-center justify-center font-bold shadow">
                  RST
                </div>
              </div>
            </div>

            {/* Microcontroller Chip */}
            <div className="my-3 mx-auto w-44 bg-slate-950 rounded border border-slate-700 py-2 px-3 text-center shadow-md">
              <div className="text-[9px] font-mono text-slate-400 tracking-wider">ATMEL ATMEGA328P-PU</div>
              <div className="flex justify-between mt-1 px-1">
                <div className="flex gap-1">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1 bg-slate-400 rounded-xs"></div>
                  ))}
                </div>
                <div className="flex gap-1">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1 bg-slate-400 rounded-xs"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Board Status LEDs */}
            <div className="flex items-center gap-4 text-[10px] font-mono text-white mb-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"></div>
                <span>ON</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-amber-400 shadow-[0_0_6px_#f59e0b]' : 'bg-slate-600'}`}></div>
                <span>TX</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-amber-400 shadow-[0_0_6px_#f59e0b]' : 'bg-slate-600'}`}></div>
                <span>RX</span>
              </div>
            </div>

            {/* Digital Pins Header Bar */}
            <div className="bg-slate-900 text-white rounded-lg p-2.5 text-xs font-mono">
              <div className="text-[10px] text-teal-300 font-semibold mb-1 flex justify-between">
                <span>DIGITAL PINS (PWM ~)</span>
                <span>GND</span>
              </div>
              <div className="flex justify-between items-center text-[10px] border-t border-slate-800 pt-1.5">
                <span className="text-slate-500">0</span>
                <span className="text-slate-500">1</span>
                <span className="text-slate-500">2</span>
                
                {/* Active Pin 3 - Red */}
                <div className="flex flex-col items-center">
                  <span className={`font-bold transition-colors ${isRed ? 'text-red-400' : 'text-slate-300'}`}>~3</span>
                  <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[8px] transition-all ${
                    isRed ? 'bg-red-500 border-red-300 text-white shadow-[0_0_8px_#ef4444]' : 'bg-slate-800 border-slate-600 text-slate-400'
                  }`}>
                    R
                  </div>
                  <span className="text-[8px] text-red-300 font-bold mt-0.5">RED</span>
                </div>

                {/* Active Pin 4 - Green */}
                <div className="flex flex-col items-center">
                  <span className={`font-bold transition-colors ${isGreen ? 'text-emerald-400' : 'text-slate-300'}`}>4</span>
                  <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[8px] transition-all ${
                    isGreen ? 'bg-emerald-500 border-emerald-300 text-white shadow-[0_0_8px_#10b981]' : 'bg-slate-800 border-slate-600 text-slate-400'
                  }`}>
                    G
                  </div>
                  <span className="text-[8px] text-emerald-300 font-bold mt-0.5">GRN</span>
                </div>

                {/* Active Pin 5 - Yellow */}
                <div className="flex flex-col items-center">
                  <span className={`font-bold transition-colors ${isYellow ? 'text-amber-400' : 'text-slate-300'}`}>~5</span>
                  <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[8px] transition-all ${
                    isYellow ? 'bg-amber-400 border-amber-200 text-slate-950 shadow-[0_0_8px_#fbbf24]' : 'bg-slate-800 border-slate-600 text-slate-400'
                  }`}>
                    Y
                  </div>
                  <span className="text-[8px] text-amber-300 font-bold mt-0.5">YEL</span>
                </div>

                <span className="text-slate-500">6</span>
                <span className="text-slate-500">7</span>
                <span className="text-slate-500">8</span>
                <span className="text-slate-500">9</span>
                
                {/* Ground Pin */}
                <div className="flex flex-col items-center">
                  <span className="text-slate-300 font-bold">GND</span>
                  <div className="w-3.5 h-3.5 rounded bg-slate-950 border border-slate-500 text-slate-300 flex items-center justify-center text-[8px]">
                    ⏚
                  </div>
                  <span className="text-[8px] text-slate-400 mt-0.5">GRD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Virtual Breadboard & 3 Traffic Light LEDs (Right 5 cols) */}
          <div className="lg:col-span-5 bg-slate-100 rounded-2xl p-5 border border-slate-300 text-slate-900 shadow-xl flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3 border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-[#1E3A5F] tracking-wide uppercase flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#F97316]" />
                Breadboard Traffic Light
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Resistor: 220Ω</span>
            </div>

            {/* Traffic Light Housing */}
            <div className="bg-slate-900 rounded-2xl p-4 border-2 border-slate-800 shadow-inner flex flex-col items-center gap-3 my-2 max-w-[200px] mx-auto w-full">
              {/* RED LED */}
              <div className="flex items-center gap-3 w-full justify-between px-2">
                <div className="relative">
                  <div
                    className={`w-12 h-12 rounded-full border-2 transition-all duration-150 flex items-center justify-center ${
                      isRed
                        ? 'bg-red-600 border-red-300 shadow-[0_0_24px_#ef4444] scale-105'
                        : 'bg-red-950/80 border-red-900 opacity-60'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full ${isRed ? 'bg-red-200' : 'bg-red-900/50'}`}></div>
                  </div>
                  {isRed && (
                    <div className="absolute -inset-1 rounded-full border border-red-400/40 animate-ping pointer-events-none"></div>
                  )}
                </div>
                <div className="text-left font-mono">
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    <span>LED MERAH</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Pin 3 (~PWM)</div>
                  <div className={`text-[10px] font-bold ${isRed ? 'text-red-400' : 'text-slate-500'}`}>
                    {isRed ? 'HIGH (ON)' : 'LOW (OFF)'}
                  </div>
                </div>
              </div>

              {/* YELLOW LED */}
              <div className="flex items-center gap-3 w-full justify-between px-2">
                <div className="relative">
                  <div
                    className={`w-12 h-12 rounded-full border-2 transition-all duration-150 flex items-center justify-center ${
                      isYellow
                        ? 'bg-amber-400 border-yellow-200 shadow-[0_0_24px_#f59e0b] scale-105'
                        : 'bg-yellow-950/80 border-yellow-900 opacity-60'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full ${isYellow ? 'bg-yellow-100' : 'bg-yellow-900/50'}`}></div>
                  </div>
                  {isYellow && (
                    <div className="absolute -inset-1 rounded-full border border-yellow-300/40 animate-ping pointer-events-none"></div>
                  )}
                </div>
                <div className="text-left font-mono">
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    <span>LED KUNING</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Pin 5 (~PWM)</div>
                  <div className={`text-[10px] font-bold ${isYellow ? 'text-amber-400' : 'text-slate-500'}`}>
                    {isYellow ? 'HIGH (ON)' : 'LOW (OFF)'}
                  </div>
                </div>
              </div>

              {/* GREEN LED */}
              <div className="flex items-center gap-3 w-full justify-between px-2">
                <div className="relative">
                  <div
                    className={`w-12 h-12 rounded-full border-2 transition-all duration-150 flex items-center justify-center ${
                      isGreen
                        ? 'bg-emerald-500 border-emerald-200 shadow-[0_0_24px_#10b981] scale-105'
                        : 'bg-emerald-950/80 border-emerald-900 opacity-60'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full ${isGreen ? 'bg-emerald-100' : 'bg-emerald-900/50'}`}></div>
                  </div>
                  {isGreen && (
                    <div className="absolute -inset-1 rounded-full border border-emerald-300/40 animate-ping pointer-events-none"></div>
                  )}
                </div>
                <div className="text-left font-mono">
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    <span>LED HIJAU</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Pin 4 (Digital)</div>
                  <div className={`text-[10px] font-bold ${isGreen ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {isGreen ? 'HIGH (ON)' : 'LOW (OFF)'}
                  </div>
                </div>
              </div>
            </div>

            {/* Manual Pin Testing Buttons */}
            <div className="mt-3 pt-2.5 border-t border-slate-200 text-center">
              <div className="text-[11px] text-slate-600 font-medium mb-1.5">
                Uji Coba Manual Tiap Pin (Debugging Cepat):
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => handleManualToggle('red')}
                  className={`py-1 px-2 rounded text-[11px] font-semibold transition-all ${
                    isRed 
                      ? 'bg-red-600 text-white shadow-sm' 
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Pin 3 (R)
                </button>
                <button
                  onClick={() => handleManualToggle('yellow')}
                  className={`py-1 px-2 rounded text-[11px] font-semibold transition-all ${
                    isYellow 
                      ? 'bg-amber-500 text-white shadow-sm' 
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Pin 5 (Y)
                </button>
                <button
                  onClick={() => handleManualToggle('green')}
                  className={`py-1 px-2 rounded text-[11px] font-semibold transition-all ${
                    isGreen 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Pin 4 (G)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Step Progression Bar */}
        <div className="relative z-10 bg-slate-800/90 rounded-lg p-3 border border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <span>Rangkaian Langkah Eksekusi (Sequential Execution)</span>
            </span>
            <span className="font-mono text-slate-400">
              Total {steps.length} langkah terdeteksi
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
            {steps.slice(0, 8).map((step, idx) => {
              const isCurrent = isRunning && currentStepIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setIsRunning(false);
                    setCurrentStepIndex(idx);
                  }}
                  className={`p-2 rounded text-left transition-all border ${
                    isCurrent
                      ? 'bg-[#1E3A5F] border-[#F97316] text-white shadow-sm ring-1 ring-[#F97316]'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span>#{idx + 1}</span>
                    <span className="tabular-nums font-semibold text-amber-400">{(step.durationMs / 1000).toFixed(1)}s</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${step.ledRed ? 'bg-red-500' : 'bg-slate-700'}`}></span>
                    <span className={`w-2 h-2 rounded-full ${step.ledYellow ? 'bg-yellow-400' : 'bg-slate-700'}`}></span>
                    <span className={`w-2 h-2 rounded-full ${step.ledGreen ? 'bg-emerald-500' : 'bg-slate-700'}`}></span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
