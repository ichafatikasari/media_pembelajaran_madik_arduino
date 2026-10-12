/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  HELIOS_CHALLENGES, 
  POLARIS_CHALLENGES, 
  BLANK_STARTER_CODE_3, 
  BLANK_STARTER_CODE_4 
} from './data/challenges';
import { GroupChallenge, ModuleSeries } from './types';
import { compileArduinoCode, ParseResult } from './utils/arduinoCompiler';
import { playSchoolChime, playSuccessBeep, playErrorBeep } from './utils/audioAlert';
import { HardwareGuideModal } from './components/HardwareGuideModal';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  Copy, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  Code2, 
  Lightbulb,
  Usb,
  Eraser,
  FileCode,
  ArrowRight,
  Sparkles,
  Layers,
  HelpCircle
} from 'lucide-react';

export default function App() {
  // Tab Series: 'helios' (3 Lampu: Merah, Kuning, Hijau) vs 'polaris' (4 Lampu: Merah, Kuning, Hijau, Biru)
  const [activeSeries, setActiveSeries] = useState<ModuleSeries>('helios');
  const [selectedGroup, setSelectedGroup] = useState<number>(1);

  // Active challenges list based on series
  const activeChallenges = activeSeries === 'helios' ? HELIOS_CHALLENGES : POLARIS_CHALLENGES;
  const currentChallenge: GroupChallenge = 
    activeChallenges.find((c) => c.groupNumber === selectedGroup) || activeChallenges[0];

  // Editor code & compilation state
  const [code, setCode] = useState<string>(() => currentChallenge.starterCode);
  const [parseResult, setParseResult] = useState<ParseResult>(() =>
    compileArduinoCode(currentChallenge.starterCode, currentChallenge)
  );
  const [copied, setCopied] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showHardwareGuide, setShowHardwareGuide] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  // Classroom Timer state (default 10 minutes)
  const [timerSeconds, setTimerSeconds] = useState<number>(10 * 60);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [timerFinished, setTimerFinished] = useState<boolean>(false);

  // Virtual simulator playback state
  const [isSimRunning, setIsSimRunning] = useState<boolean>(false);
  const [simStepIndex, setSimStepIndex] = useState<number>(0);
  const [simTimeRemaining, setSimTimeRemaining] = useState<number>(0);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);

  // Web Serial API state for physical Arduino USB testing
  const [serialConnected, setSerialConnected] = useState<boolean>(false);
  const serialPortRef = useRef<any>(null);

  // Helper to show brief toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2400);
  };

  // Switch Series (Helios 3-LED vs Polaris 4-LED)
  const handleSelectSeries = (series: ModuleSeries) => {
    setActiveSeries(series);
    const targetChallenges = series === 'helios' ? HELIOS_CHALLENGES : POLARIS_CHALLENGES;
    const targetCh = targetChallenges.find((c) => c.groupNumber === selectedGroup) || targetChallenges[0];
    setCode(targetCh.starterCode);
    const result = compileArduinoCode(targetCh.starterCode, targetCh);
    setParseResult(result);
    setIsSimRunning(false);
    setSimStepIndex(0);
    setShowHint(false);
    triggerToast(
      series === 'helios' 
        ? '✦ Membuka Seri Helios (Trio Lumina · 3 Lampu)' 
        : '✦ Membuka Seri Polaris (Tetra Lumina · 4 Lampu)'
    );
  };

  // Switch challenge group (1 - 10)
  const handleSelectGroup = (groupNum: number) => {
    setSelectedGroup(groupNum);
    const ch = activeChallenges.find((c) => c.groupNumber === groupNum) || activeChallenges[0];
    setCode(ch.starterCode);
    const result = compileArduinoCode(ch.starterCode, ch);
    setParseResult(result);
    setIsSimRunning(false);
    setSimStepIndex(0);
    setShowHint(false);
  };

  // Code change in textarea
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    const result = compileArduinoCode(newCode, currentChallenge);
    setParseResult(result);
  };

  // Direct test in web
  const handleVerifyAndRun = () => {
    const result = compileArduinoCode(code, currentChallenge);
    setParseResult(result);
    if (result.isValid && result.simpleErrorNotes.length === 0) {
      playSuccessBeep();
      setIsSimRunning(true);
      setSimStepIndex(0);
      triggerToast('✅ Kodingan Lolos Verifikasi & Lampu Menyala!');
    } else {
      playErrorBeep();
      setIsSimRunning(false);
      triggerToast('⚠️ Masih Ada Kesalahan yang Perlu Diperbaiki');
    }
  };

  // Clear editor for coding completely from scratch (Instant & non-blocking)
  const handleClearCode = () => {
    handleCodeChange('');
    setIsSimRunning(false);
    triggerToast('🗑️ Editor Berhasil Dikosongkan! Silakan ketik dari awal.');
  };

  // Reset to starter skeleton with only empty `#define ` lines (Instant & non-blocking)
  const handleResetSkeleton = () => {
    const skeleton = activeSeries === 'helios' ? BLANK_STARTER_CODE_3 : BLANK_STARTER_CODE_4;
    handleCodeChange(skeleton);
    setIsSimRunning(false);
    triggerToast(
      activeSeries === 'helios' 
        ? '📄 Kerangka 3-LED Berhasil Dimuat (#define kosong).' 
        : '📄 Kerangka 4-LED Berhasil Dimuat (#define kosong).'
    );
  };

  // Copy code to paste into Arduino IDE
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    triggerToast('📋 Kodingan Disalin ke Clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Load solution code
  const handleLoadSolution = () => {
    handleCodeChange(currentChallenge.solutionCode);
    triggerToast('💡 Kunci Solusi Berhasil Dimuat!');
  };

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            setTimerFinished(true);
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
  }, [timerActive, timerSeconds]);

  // Simulator step execution effect
  const steps = parseResult.steps;
  const currentStep = steps[simStepIndex] || {
    ledRed: false,
    ledGreen: false,
    ledYellow: false,
    ledBlue: false,
    durationMs: 1000,
    description: 'Menunggu Pengujian'
  };

  useEffect(() => {
    if (!isSimRunning || steps.length === 0) return;

    const step = steps[simStepIndex];
    if (!step) return;

    const dur = Math.max(150, step.durationMs / speedMultiplier);
    setSimTimeRemaining(dur);

    const tickInterval = 50;
    const start = Date.now();
    const tickTimer = setInterval(() => {
      const elapsed = Date.now() - start;
      setSimTimeRemaining(Math.max(0, dur - elapsed));
    }, tickInterval);

    const stepTimer = setTimeout(() => {
      clearInterval(tickTimer);
      setSimStepIndex((prev) => (prev + 1) % steps.length);
    }, dur);

    return () => {
      clearTimeout(stepTimer);
      clearInterval(tickTimer);
    };
  }, [isSimRunning, simStepIndex, steps, speedMultiplier]);

  const assigned = currentChallenge.assignedPins;
  const detected = parseResult.detectedPins;

  // Stream pin states to physical Arduino via Web Serial if connected
  useEffect(() => {
    if (!serialConnected || !serialPortRef.current || !isSimRunning) return;

    const sendSerialPins = async () => {
      try {
        if (!serialPortRef.current.writable) return;
        const writer = serialPortRef.current.writable.getWriter();
        const encoder = new TextEncoder();

        const commands: string[] = [];
        if (assigned.red !== undefined) {
          commands.push(`${assigned.red}:${currentStep.ledRed ? 1 : 0}`);
        }
        if (assigned.yellow !== undefined) {
          commands.push(`${assigned.yellow}:${currentStep.ledYellow ? 1 : 0}`);
        }
        if (assigned.green !== undefined) {
          commands.push(`${assigned.green}:${currentStep.ledGreen ? 1 : 0}`);
        }
        if (assigned.blue !== undefined) {
          commands.push(`${assigned.blue}:${currentStep.ledBlue ? 1 : 0}`);
        }

        for (const cmd of commands) {
          await writer.write(encoder.encode(cmd + '\n'));
        }
        writer.releaseLock();
      } catch (err) {
        console.warn('Serial write error:', err);
      }
    };

    sendSerialPins();
  }, [serialConnected, isSimRunning, currentStep, assigned]);

  // Connect Physical Arduino via Web Serial API directly from browser
  const handleConnectSerial = async () => {
    if (!('serial' in navigator)) {
      alert('Gunakan Google Chrome atau Microsoft Edge untuk menghubungkan USB Arduino langsung dari browser!');
      return;
    }

    try {
      const port = await (navigator as any).serial.requestPort();
      await port.open({ baudRate: 9600 });
      serialPortRef.current = port;
      setSerialConnected(true);
      playSuccessBeep();
      triggerToast('🔌 Arduino Fisik Berhasil Terhubung!');
      setShowHardwareGuide(true);
    } catch (err: any) {
      if (err.name !== 'NotFoundError') {
        console.warn('Serial error:', err);
      }
    }
  };

  const timerMin = Math.floor(timerSeconds / 60);
  const timerSec = timerSeconds % 60;

  // Active LEDs in simulation
  const isRed = isSimRunning ? currentStep.ledRed : false;
  const isYellow = isSimRunning ? currentStep.ledYellow : false;
  const isGreen = isSimRunning ? currentStep.ledGreen : false;
  const isBlue = isSimRunning ? Boolean(currentStep.ledBlue) : false;

  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 16) }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#1E3A5F] font-['Poppins'] flex flex-col relative">
      {/* TOAST NOTIFIKASI AKSI */}
      {toastMessage && (
        <div className="fixed top-18 right-6 z-50 bg-[#1E3A5F] text-white border-2 border-[#F97316] px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#F97316]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER: Hijau Toska (#0D9488) & Kuning/Orange (#F97316) */}
      <header className="bg-[#0D9488] text-white border-b-4 border-[#F97316] sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Logo CodePath */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-teal-950/40 px-2.5 py-1 rounded-lg border border-teal-400/40">
              <span className="text-[#FBBF24] font-mono font-black text-lg">
                &lt; /&gt;
              </span>
              <span className="font-bold text-base tracking-tight text-white">
                CodePath
              </span>
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide text-white flex items-center gap-1.5">
                <span>Laboratorium Praktik Arduino Uno</span>
                <span className="bg-[#F97316] text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
                  Kelas 12
                </span>
              </h1>
              <p className="text-[11px] text-teal-100 font-medium">
                Tantangan Urutan Nyala & Pin Hardware · Siswa Mengoding dari Awal
              </p>
            </div>
          </div>

          {/* TIMER SESI */}
          <div className="flex items-center gap-3 bg-teal-950/70 border border-teal-400/40 rounded-xl px-3.5 py-1.5">
            <div className="flex items-center gap-1.5 text-xs text-teal-200">
              <Clock className="w-4 h-4 text-[#FBBF24]" />
              <span className="font-medium hidden sm:inline">Waktu Praktik:</span>
            </div>

            <span
              className={`font-mono font-bold text-lg tabular-nums ${
                timerFinished
                  ? 'text-red-400 animate-pulse'
                  : timerSeconds < 180
                  ? 'text-amber-300'
                  : 'text-[#FBBF24]'
              }`}
            >
              {String(timerMin).padStart(2, '0')}:{String(timerSec).padStart(2, '0')}
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setTimerActive(!timerActive)}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                  timerActive
                    ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                    : 'bg-[#F97316] text-white hover:bg-orange-600'
                }`}
              >
                {timerActive ? 'Jeda' : 'Mulai'}
              </button>

              <button
                onClick={() => {
                  setTimerActive(false);
                  setTimerSeconds(10 * 60);
                  setTimerFinished(false);
                  triggerToast('Waktu direset ke 10 Menit');
                }}
                className="p-1 rounded text-teal-200 hover:text-white"
                title="Reset Waktu (10 Menit)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Action Buttons: Panduan Fisik & USB Direct Connection */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHardwareGuide(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#F97316] hover:bg-orange-600 text-white shadow-xs transition-all cursor-pointer"
              title="Buka panduan agar lampu fisik di alat praktikum menyala"
            >
              <Lightbulb className="w-3.5 h-3.5 text-white" />
              <span>Panduan Lampu Fisik</span>
            </button>

            <button
              onClick={handleConnectSerial}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
                serialConnected
                  ? 'bg-emerald-600 border-emerald-400 text-white'
                  : 'bg-teal-900 border-teal-700 text-teal-100 hover:text-white'
              }`}
            >
              <Usb className="w-3.5 h-3.5 text-[#FBBF24]" />
              <span className="hidden md:inline">
                {serialConnected ? 'USB Terhubung' : 'Sambungkan USB Fisik'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* 2 TAB TINGKAT/MODUL DENGAN NAMA KLASIK ESTETIK (HELIOS & POLARIS) */}
      <div className="bg-white border-b-2 border-teal-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <Layers className="w-4 h-4 text-[#0D9488]" />
            <span className="hidden sm:inline">PILIH JALUR MODUL:</span>
          </div>

          {/* DUA BUTTON TAB KLASIK & ESTETIK: SERI HELIOS VS SERI POLARIS */}
          <div className="flex items-center gap-2">
            {/* TAB 1: SERI HELIOS (3 LED) */}
            <button
              onClick={() => handleSelectSeries('helios')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                activeSeries === 'helios'
                  ? 'bg-[#0D9488] text-white border-[#0D9488] shadow-xs ring-2 ring-teal-200'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-teal-50 hover:text-[#0D9488]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#FBBF24]"></span>
              <span>Seri Helios</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                activeSeries === 'helios' ? 'bg-teal-900/40 text-teal-100' : 'bg-slate-200 text-slate-600'
              }`}>
                Trio Lumina · 3 LED
              </span>
            </button>

            {/* TAB 2: SERI POLARIS (4 LED) */}
            <button
              onClick={() => handleSelectSeries('polaris')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                activeSeries === 'polaris'
                  ? 'bg-[#1E3A5F] text-white border-[#1E3A5F] shadow-xs ring-2 ring-blue-200'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-[#1E3A5F]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#38BDF8]"></span>
              <span>Seri Polaris</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                activeSeries === 'polaris' ? 'bg-blue-950/50 text-blue-200' : 'bg-slate-200 text-slate-600'
              }`}>
                Tetra Lumina · 4 LED
              </span>
            </button>
          </div>

          <div className="text-[11px] font-medium text-slate-500 hidden md:block">
            {activeSeries === 'helios' 
              ? '☀️ Spektrum 3 Warna: Merah · Kuning · Hijau (10 Kelompok)' 
              : '🌟 Spektrum 4 Warna: Merah · Kuning · Hijau · Biru (10 Kelompok)'}
          </div>
        </div>
      </div>

      {/* PILIH 10 KELOMPOK DALAM MODUL TERPILIH */}
      <div className="bg-[#F8FAFC] border-b border-teal-100 px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#0D9488]">
            <span className="w-2 h-2 rounded-full bg-[#F97316]"></span>
            <span>KELOMPOK {activeSeries === 'helios' ? 'HELIOS' : 'POLARIS'} (1 - 10):</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
              const isSelected = selectedGroup === num;
              return (
                <button
                  key={num}
                  onClick={() => handleSelectGroup(num)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                    isSelected
                      ? activeSeries === 'helios'
                        ? 'bg-[#0D9488] text-white shadow-xs ring-2 ring-[#F97316]'
                        : 'bg-[#1E3A5F] text-white shadow-xs ring-2 ring-[#38BDF8]'
                      : 'bg-white text-slate-700 hover:bg-teal-50 border border-slate-200'
                  }`}
                >
                  Kelompok {num}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN WORKSPACE AREA */}
      <main className="max-w-7xl w-full mx-auto p-4 sm:p-5 flex-1 space-y-4">
        {/* KARTU MISI: TARGET PIN & TARGET URUTAN WARNA LAMPU */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border-2 border-teal-100 shadow-xs space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-white text-xs font-bold px-2 py-0.5 rounded ${
                  activeSeries === 'helios' ? 'bg-[#0D9488]' : 'bg-[#1E3A5F]'
                }`}>
                  Kelompok {currentChallenge.groupNumber} ({activeSeries === 'helios' ? '3 LED' : '4 LED'})
                </span>
                <h2 className="font-bold text-base text-slate-900">
                  {currentChallenge.title}
                </h2>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {currentChallenge.story}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100"
              >
                <Lightbulb className="w-3.5 h-3.5 text-[#F97316]" />
                <span>{showHint ? 'Tutup Petunjuk' : 'Petunjuk'}</span>
              </button>

              <button
                onClick={handleLoadSolution}
                className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
                title="Buka solusi kodingan referensi"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                <span>Solusi</span>
              </button>
            </div>
          </div>

          {/* TARGET URUTAN WARNA & TARGET PIN KELOMPOK */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {/* Box 1: Target Urutan Warna Lampu */}
            <div className="bg-teal-50/70 border-2 border-teal-200 p-3 rounded-xl space-y-2">
              <span className="text-[11px] font-bold text-[#0D9488] uppercase tracking-wide block">
                🎯 Target Urutan Nyala Lampu:
              </span>
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                {currentChallenge.colorSequence.map((color, idx) => (
                  <React.Fragment key={idx}>
                    <span
                      className={`px-3 py-1 rounded-lg border shadow-xs flex items-center gap-1.5 ${
                        color === 'Merah'
                          ? 'bg-red-500 text-white border-red-600'
                          : color === 'Kuning'
                          ? 'bg-amber-400 text-slate-950 border-amber-500'
                          : color === 'Hijau'
                          ? 'bg-emerald-500 text-white border-emerald-600'
                          : 'bg-blue-600 text-white border-blue-700'
                      }`}
                    >
                      <span>{idx + 1}.</span>
                      <span>{color}</span>
                    </span>
                    {idx < currentChallenge.colorSequence.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Box 2: Target Colok Pin Hardware */}
            <div className="bg-amber-50/70 border-2 border-amber-200 p-3 rounded-xl space-y-2">
              <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wide block">
                🔌 Target Colok Pin Kabel Jumper:
              </span>
              <div className={`grid gap-2 text-xs ${activeSeries === 'polaris' ? 'grid-cols-4' : 'grid-cols-3'}`}>
                {assigned.red !== undefined && (
                  <div className="bg-white p-2 rounded-lg border border-red-200 text-center">
                    <span className="text-[10px] text-slate-500 block">LED Merah</span>
                    <span className="font-mono font-black text-red-600 text-sm">Pin {assigned.red}</span>
                  </div>
                )}
                {assigned.yellow !== undefined && (
                  <div className="bg-white p-2 rounded-lg border border-amber-200 text-center">
                    <span className="text-[10px] text-slate-500 block">LED Kuning</span>
                    <span className="font-mono font-black text-amber-600 text-sm">Pin {assigned.yellow}</span>
                  </div>
                )}
                {assigned.green !== undefined && (
                  <div className="bg-white p-2 rounded-lg border border-emerald-200 text-center">
                    <span className="text-[10px] text-slate-500 block">LED Hijau</span>
                    <span className="font-mono font-black text-emerald-600 text-sm">Pin {assigned.green}</span>
                  </div>
                )}
                {assigned.blue !== undefined && (
                  <div className="bg-white p-2 rounded-lg border border-blue-200 text-center">
                    <span className="text-[10px] text-slate-500 block">LED Biru</span>
                    <span className="font-mono font-black text-blue-600 text-sm">Pin {assigned.blue}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Petunjuk / Clue jika dibuka */}
          {showHint && (
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-950 space-y-1">
              <div className="font-bold text-[#F97316]">💡 Petunjuk Mengoding:</div>
              {currentChallenge.hints.map((h, i) => (
                <div key={i} className="pl-2">• {h}</div>
              ))}
            </div>
          )}
        </div>

        {/* DUA PANEL UTAMA: SIMULATOR & EDITOR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* PANEL KIRI: SIMULATOR LAMPU (5 COLS) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-teal-100 shadow-xs p-4 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between border-b border-teal-100 pb-2">
              <div className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-[#0D9488]" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#0D9488]">
                  Simulator Lampu LED Real-Time
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {Object.values(assigned).filter((v) => v !== undefined).length} LED
              </span>
            </div>

            {/* Lampu Virtual */}
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex flex-col items-center gap-2.5">
              {/* MERAH */}
              {assigned.red !== undefined && (
                <div className="flex items-center justify-between w-full max-w-[280px] bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-full border transition-all flex items-center justify-center ${
                        isRed
                          ? 'bg-red-600 border-red-300 shadow-[0_0_20px_#ef4444]'
                          : 'bg-red-950/60 border-red-900 opacity-40'
                      }`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full ${isRed ? 'bg-red-100' : 'bg-red-900/30'}`}></div>
                    </div>
                    <div className="text-xs font-bold text-white">
                      MERAH (Pin {detected.red || assigned.red})
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${isRed ? 'bg-red-900 text-red-200' : 'bg-slate-800 text-slate-500'}`}>
                    {isRed ? 'ON' : 'OFF'}
                  </span>
                </div>
              )}

              {/* KUNING */}
              {assigned.yellow !== undefined && (
                <div className="flex items-center justify-between w-full max-w-[280px] bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-full border transition-all flex items-center justify-center ${
                        isYellow
                          ? 'bg-amber-400 border-yellow-200 shadow-[0_0_20px_#f59e0b]'
                          : 'bg-yellow-950/60 border-yellow-900 opacity-40'
                      }`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full ${isYellow ? 'bg-yellow-100' : 'bg-yellow-900/30'}`}></div>
                    </div>
                    <div className="text-xs font-bold text-white">
                      KUNING (Pin {detected.yellow || assigned.yellow})
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${isYellow ? 'bg-amber-900 text-amber-200' : 'bg-slate-800 text-slate-500'}`}>
                    {isYellow ? 'ON' : 'OFF'}
                  </span>
                </div>
              )}

              {/* HIJAU */}
              {assigned.green !== undefined && (
                <div className="flex items-center justify-between w-full max-w-[280px] bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-full border transition-all flex items-center justify-center ${
                        isGreen
                          ? 'bg-emerald-500 border-emerald-200 shadow-[0_0_20px_#10b981]'
                          : 'bg-emerald-950/60 border-emerald-900 opacity-40'
                      }`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full ${isGreen ? 'bg-emerald-100' : 'bg-emerald-900/30'}`}></div>
                    </div>
                    <div className="text-xs font-bold text-white">
                      HIJAU (Pin {detected.green || assigned.green})
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${isGreen ? 'bg-emerald-900 text-emerald-200' : 'bg-slate-800 text-slate-500'}`}>
                    {isGreen ? 'ON' : 'OFF'}
                  </span>
                </div>
              )}

              {/* BIRU */}
              {assigned.blue !== undefined && (
                <div className="flex items-center justify-between w-full max-w-[280px] bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-full border transition-all flex items-center justify-center ${
                        isBlue
                          ? 'bg-blue-500 border-blue-200 shadow-[0_0_20px_#3b82f6]'
                          : 'bg-blue-950/60 border-blue-900 opacity-40'
                      }`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full ${isBlue ? 'bg-blue-100' : 'bg-blue-900/30'}`}></div>
                    </div>
                    <div className="text-xs font-bold text-white">
                      BIRU (Pin {detected.blue || assigned.blue})
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${isBlue ? 'bg-blue-900 text-blue-200' : 'bg-slate-800 text-slate-500'}`}>
                    {isBlue ? 'ON' : 'OFF'}
                  </span>
                </div>
              )}
            </div>

            {/* Sisa delay */}
            <div className="bg-teal-50 p-2 rounded-lg border border-teal-200 text-[11px] flex justify-between items-center font-mono">
              <span className="text-slate-600 font-medium">
                {isSimRunning ? currentStep.description : 'Simulator berhenti'}
              </span>
              <span className="font-bold text-[#F97316]">
                {isSimRunning ? `${(simTimeRemaining / 1000).toFixed(1)}s` : '0.0s'}
              </span>
            </div>

            {/* Kontrol Run/Pause */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsSimRunning(!isSimRunning)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                  isSimRunning
                    ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                    : 'bg-[#0D9488] text-white hover:bg-teal-700'
                }`}
              >
                {isSimRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isSimRunning ? 'Jeda' : 'Jalankan'}</span>
              </button>

              <button
                onClick={() => {
                  setIsSimRunning(false);
                  setSimStepIndex(0);
                }}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
                title="Reset simulasi"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setSpeedMultiplier(speedMultiplier === 1 ? 2 : 1)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-teal-50 border border-teal-200 text-[#0D9488]"
              >
                {speedMultiplier}x
              </button>
            </div>

            {/* TIPS BANTUAN LAMPU FISIK */}
            <button
              type="button"
              onClick={() => setShowHardwareGuide(true)}
              className="w-full p-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg text-amber-950 text-[11px] font-semibold flex items-center justify-between gap-1.5 transition-all text-left cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-[#F97316] shrink-0" />
                <span>Lampu fisik di meja belum menyala?</span>
              </div>
              <span className="text-[#0D9488] font-bold flex items-center gap-0.5 shrink-0">
                Lihat Solusi <ArrowRight className="w-3 h-3" />
              </span>
            </button>
          </div>

          {/* PANEL KANAN: EDITOR KODINGAN DARI AWAL (7 COLS) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-teal-100 shadow-xs p-4 flex flex-col justify-between space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-teal-100 pb-2">
              <div className="flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-[#0D9488]" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#0D9488]">
                  Editor Arduino C++ (Ketik dari Awal)
                </h3>
              </div>

              {/* ACTION BUTTONS: KOSONGKAN, KERANGKA, SALIN */}
              <div className="flex items-center gap-1.5 text-xs">
                {/* TOMBOL KOSONGKAN (Langsung merubah tanpa dialog browser yang terblokir) */}
                <button
                  type="button"
                  onClick={handleClearCode}
                  className="px-2.5 py-1 text-slate-600 hover:text-red-600 text-xs font-semibold rounded bg-slate-100 hover:bg-red-50 border border-slate-200 hover:border-red-200 flex items-center gap-1 transition-all"
                  title="Kosongkan editor untuk mengetik dari nol"
                >
                  <Eraser className="w-3.5 h-3.5 text-red-500" />
                  <span>Kosongkan</span>
                </button>

                {/* TOMBOL KERANGKA (Memuat #define kosong tanpa nama warna) */}
                <button
                  type="button"
                  onClick={handleResetSkeleton}
                  className="px-2.5 py-1 text-slate-600 hover:text-[#0D9488] text-xs font-semibold rounded bg-slate-100 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 flex items-center gap-1 transition-all"
                  title="Muat kerangka dasar #define kosong"
                >
                  <FileCode className="w-3.5 h-3.5 text-[#0D9488]" />
                  <span>Kerangka</span>
                </button>

                {/* TOMBOL SALIN */}
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 px-3 py-1 rounded text-xs font-bold bg-[#F97316] hover:bg-orange-600 text-white transition-all shadow-xs"
                  title="Salin untuk dipaste ke Arduino IDE di laptop"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
            </div>

            {/* Area Editor */}
            <div className="relative bg-slate-950 rounded-lg border border-slate-800 overflow-hidden flex min-h-[300px]">
              <div className="w-9 bg-slate-900 border-r border-slate-800 text-slate-500 font-mono text-xs text-right pr-2 py-3 select-none leading-6">
                {lineNumbers.map((num) => (
                  <div key={num}>{num}</div>
                ))}
              </div>

              <textarea
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="// Ketik kodingan Arduino dari awal di sini..."
                spellCheck={false}
                aria-label="Editor Kode Arduino"
                className="flex-1 bg-slate-950 text-emerald-400 font-mono text-xs sm:text-sm p-3 leading-6 resize-none focus:outline-hidden border-none"
                style={{ tabSize: 2 }}
              />
            </div>

            {/* Tombol Uji Langsung */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <span className="text-[11px] text-slate-500">
                Ketik nama lampu dan nomor pin setelah kata <code className="text-teal-700 bg-teal-50 px-1 rounded font-bold">#define</code>
              </span>

              <button
                type="button"
                onClick={handleVerifyAndRun}
                className="w-full sm:w-auto px-5 py-2 rounded-lg text-xs font-bold bg-[#0D9488] hover:bg-teal-700 text-white transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4 text-[#FBBF24]" />
                <span>Uji Kodingan Sekarang</span>
              </button>
            </div>
          </div>
        </div>

        {/* KOTAK CATATAN KESALAHAN (RINGKAS & TO THE POINT) */}
        <div className="rounded-xl border p-4 shadow-xs transition-all bg-white">
          {parseResult.simpleErrorNotes.length > 0 ? (
            /* ADA KESALAHAN */
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-red-600 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                <span>Catatan yang Masih Perlu Diperbaiki:</span>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs space-y-1.5">
                {parseResult.simpleErrorNotes.map((err, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-red-900">
                    <span className="text-red-500 font-bold">•</span>
                    <span>{err}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* SUDAH BENAR / LULUS */
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900">
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  Kodingan Kelompok {currentChallenge.groupNumber} ({activeSeries === 'helios' ? 'Seri Helios' : 'Seri Polaris'}) sudah benar! Pin dan urutan warna lampu sesuai target.
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className="px-4 py-1.5 rounded-lg bg-[#F97316] hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Tersalin!' : 'Salin ke Arduino IDE'}</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-teal-100 py-3 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-1">
          <span className="font-semibold text-[#0D9488]">CodePath Arduino Lab</span>
          <span>Praktik 10 Kelompok · Seri Helios (3 LED) & Seri Polaris (4 LED) · Pin & Urutan Berbeda</span>
        </div>
      </footer>

      {/* MODAL PANDUAN LAMPU FISIK */}
      <HardwareGuideModal
        isOpen={showHardwareGuide}
        onClose={() => setShowHardwareGuide(false)}
        assignedPins={assigned}
        activeSeries={activeSeries}
      />
    </div>
  );
}
