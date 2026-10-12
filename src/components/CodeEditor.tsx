import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Copy, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Code2, 
  Terminal, 
  FileCode, 
  Sparkles 
} from 'lucide-react';
import { compileArduinoCode, ParseResult } from '../utils/arduinoCompiler';
import { GROUP_CHALLENGES, BASE_ARDUINO_CODE } from '../data/challenges';
import { playErrorBeep, playSuccessBeep } from '../utils/audioAlert';

interface CodeEditorProps {
  initialCode?: string;
  onCodeChange?: (code: string, parseResult: ParseResult) => void;
  selectedGroupNumber?: number;
  onSelectGroup?: (groupNum: number) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode = BASE_ARDUINO_CODE,
  onCodeChange,
  selectedGroupNumber = 1,
  onSelectGroup
}) => {
  const [code, setCode] = useState<string>(initialCode);
  const [parseResult, setParseResult] = useState<ParseResult>(() => compileArduinoCode(initialCode));
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'reference'>('editor');
  const [showConsole, setShowConsole] = useState(true);

  // Sync when initialCode changes (e.g. user selected another group)
  useEffect(() => {
    setCode(initialCode);
    const res = compileArduinoCode(initialCode);
    setParseResult(res);
    if (onCodeChange) onCodeChange(initialCode, res);
  }, [initialCode]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    const res = compileArduinoCode(newCode);
    setParseResult(res);
    if (onCodeChange) onCodeChange(newCode, res);
  };

  const handleVerify = () => {
    const res = compileArduinoCode(code);
    setParseResult(res);
    if (res.isValid) {
      playSuccessBeep();
    } else {
      playErrorBeep();
    }
    setShowConsole(true);
    if (onCodeChange) onCodeChange(code, res);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadGroupStarter = (groupNum: number) => {
    const ch = GROUP_CHALLENGES.find((c) => c.groupNumber === groupNum);
    if (ch) {
      setCode(ch.starterCode);
      const res = compileArduinoCode(ch.starterCode);
      setParseResult(res);
      if (onCodeChange) onCodeChange(ch.starterCode, res);
      if (onSelectGroup) onSelectGroup(groupNum);
    }
  };

  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 18) }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
      {/* Top Header bar with Arduino IDE branding */}
      <div className="bg-[#1E3A5F] text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#00878F] flex items-center justify-center text-white font-bold text-xs shadow-sm">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">Arduino IDE C++ Editor</span>
              <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-teal-200 font-mono">
                sketch_traffic_light.ino
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Kompiler dan pemeriksa sintaksis kode Arduino Uno (C++)
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Preset Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-300 hidden md:inline">Pilih Soal:</span>
            <select
              value={selectedGroupNumber}
              onChange={(e) => handleLoadGroupStarter(Number(e.target.value))}
              aria-label="Pilih Soal Kelompok"
              className="bg-slate-800 text-white border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-[#F97316]"
            >
              {GROUP_CHALLENGES.map((ch) => (
                <option key={ch.groupNumber} value={ch.groupNumber}>
                  Kelompok {ch.groupNumber}: {ch.title.slice(0, 24)}...
                </option>
              ))}
            </select>
          </div>

          {/* Verify / Compile Button */}
          <button
            onClick={handleVerify}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#00878F] hover:bg-[#007077] text-white transition-all shadow-sm active:scale-95"
            title="Verifikasi Sintaks (Compile Check)"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verifikasi (Compile)</span>
          </button>

          {/* Copy to Arduino IDE */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F97316] hover:bg-orange-600 text-white transition-all shadow-sm active:scale-95"
            title="Salin kode untuk di-paste ke Arduino IDE"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="grid grid-cols-1 bg-slate-950 text-slate-100 min-h-[340px] relative">
        <div className="flex">
          {/* Line Numbers */}
          <div className="w-12 bg-slate-900 border-r border-slate-800 text-slate-500 font-mono text-xs text-right pr-3 py-4 select-none leading-6">
            {lineNumbers.map((num) => (
              <div key={num}>{num}</div>
            ))}
          </div>

          {/* Code Textarea */}
          <div className="flex-1 relative">
            <textarea
              value={code}
              onChange={handleTextChange}
              spellCheck={false}
              aria-label="Editor Kode Arduino C++"
              className="w-full h-full min-h-[340px] bg-slate-950 text-slate-100 font-mono text-xs sm:text-sm p-4 leading-6 resize-none focus:outline-hidden border-none"
              style={{
                tabSize: 2
              }}
            />
          </div>
        </div>
      </div>

      {/* Arduino IDE Bottom Console / Terminal Output */}
      {showConsole && (
        <div className="border-t border-slate-200 bg-slate-900 text-slate-200 font-mono text-xs">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800 text-[11px]">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-teal-400" />
              <span className="font-semibold text-slate-300">Konsol Kompiler Arduino IDE (Output)</span>
              {parseResult.isValid ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Done compiling
                </span>
              ) : (
                <span className="text-red-400 flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> Error compiling for board Arduino Uno
                </span>
              )}
            </div>
            <button
              onClick={() => setShowConsole(false)}
              className="text-slate-400 hover:text-white text-[10px]"
            >
              Tutup
            </button>
          </div>

          <div className="p-4 max-h-40 overflow-y-auto whitespace-pre-wrap leading-relaxed">
            {parseResult.isValid ? (
              <div className="text-emerald-400">
                {parseResult.rawOutput}
              </div>
            ) : (
              <div className="text-red-400">
                {parseResult.rawOutput}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Helper Tips footer */}
      <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#1E3A5F]">Tips Siswa:</span>
          <span>Perhatikan penutup titik koma (;) di tiap akhir baris perintah.</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
          <span>Pin 3: Merah</span>
          <span>·</span>
          <span>Pin 4: Hijau</span>
          <span>·</span>
          <span>Pin 5: Kuning</span>
        </div>
      </div>
    </div>
  );
};
