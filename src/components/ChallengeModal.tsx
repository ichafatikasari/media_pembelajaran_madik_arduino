import React, { useState } from 'react';
import { GroupChallenge } from '../types';
import { 
  X, 
  HelpCircle, 
  Key, 
  CheckCircle2, 
  Copy, 
  Check, 
  Play, 
  Users, 
  AlertTriangle, 
  Lightbulb, 
  Code2, 
  Lock,
  Unlock
} from 'lucide-react';

interface ChallengeModalProps {
  challenge: GroupChallenge;
  onClose: () => void;
  onLoadIntoSimulator: (challenge: GroupChallenge) => void;
  isTeacherMode: boolean;
}

export const ChallengeModal: React.FC<ChallengeModalProps> = ({
  challenge,
  onClose,
  onLoadIntoSimulator,
  isTeacherMode
}) => {
  const [copied, setCopied] = useState(false);
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [showSolution, setShowSolution] = useState(isTeacherMode);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleHint = (index: number) => {
    if (revealedHints.includes(index)) {
      setRevealedHints(revealedHints.filter((i) => i !== index));
    } else {
      setRevealedHints([...revealedHints, index]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col my-8">
        {/* Modal Header */}
        <div className="sticky top-0 bg-[#1E3A5F] text-white px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#F97316] text-white flex items-center justify-center font-bold text-sm shadow">
              {challenge.groupNumber}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">{challenge.title}</h3>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">
                  {challenge.category}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Tantangan Praktik Kelompok {challenge.groupNumber} · Tingkat: {challenge.difficulty}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Story & Mission Section */}
          <div className="space-y-3">
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl">
              <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-[#F97316]" />
                Latar Belakang Studi Kasus
              </h4>
              <p className="text-xs text-amber-900 leading-relaxed">
                {challenge.story}
              </p>
            </div>

            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl">
              <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#1E3A5F]" />
                Tugas Misi Kelompok
              </h4>
              <p className="text-xs text-blue-900 leading-relaxed font-medium">
                {challenge.mission}
              </p>
            </div>
          </div>

          {/* 4 Student Roles & Allocation */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h4 className="text-xs font-bold text-[#1E3A5F] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#F97316]" />
              Pembagian Tugas 4 Anggota Siswa (Role Distribution)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <div className="font-bold text-[#1E3A5F] flex items-center justify-between">
                  <span>1. Lead Programmer</span>
                  <span className="text-[10px] text-[#F97316] font-mono">{challenge.defaultStudents.leadCoder}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Mengetik, memodifikasi delay, dan mengunggah kode di Arduino IDE.
                </div>
              </div>

              <div className="bg-white p-2.5 rounded border border-slate-200">
                <div className="font-bold text-[#1E3A5F] flex items-center justify-between">
                  <span>2. Wiring Specialist</span>
                  <span className="text-[10px] text-[#F97316] font-mono">{challenge.defaultStudents.wiringSpecialist}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Memasang jumper pin 3, 4, 5, resistor 220Ω, dan merapikan breadboard.
                </div>
              </div>

              <div className="bg-white p-2.5 rounded border border-slate-200">
                <div className="font-bold text-[#1E3A5F] flex items-center justify-between">
                  <span>3. Bug Hunter & Tester</span>
                  <span className="text-[10px] text-[#F97316] font-mono">{challenge.defaultStudents.bugHunter}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Mencari titik koma (;) hilang, memeriksa compiler error, dan stopwatch timing.
                </div>
              </div>

              <div className="bg-white p-2.5 rounded border border-slate-200">
                <div className="font-bold text-[#1E3A5F] flex items-center justify-between">
                  <span>4. Presenter & Notulen</span>
                  <span className="text-[10px] text-[#F97316] font-mono">{challenge.defaultStudents.presenter}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Mencatat perubahan kode dan mendemonstrasikan hasil ke guru.
                </div>
              </div>
            </div>
          </div>

          {/* Starter Code Box */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#1E3A5F] flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-[#F97316]" />
                Kode Awal Tantangan (Starter Code)
              </span>
              <button
                onClick={() => handleCopy(challenge.starterCode)}
                className="flex items-center gap-1 px-2.5 py-1 text-xs rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
            <pre className="bg-slate-950 text-slate-200 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800 max-h-56">
              {challenge.starterCode}
            </pre>
          </div>

          {/* Progressive Hints */}
          <div>
            <h4 className="text-xs font-bold text-[#1E3A5F] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Petunjuk Bertahap (Hints)
            </h4>
            <div className="space-y-2">
              {challenge.hints.map((hint, idx) => {
                const isRevealed = revealedHints.includes(idx);
                return (
                  <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleHint(idx)}
                      className="w-full px-3.5 py-2 text-left bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-medium text-slate-700 transition-colors"
                    >
                      <span>Petunjuk #{idx + 1}</span>
                      <span className="text-[10px] text-[#F97316]">
                        {isRevealed ? 'Sembunyikan' : 'Buka Petunjuk'}
                      </span>
                    </button>
                    {isRevealed && (
                      <div className="p-3 text-xs bg-white text-slate-600 border-t border-slate-100 leading-relaxed">
                        {hint}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Success Criteria */}
          <div>
            <h4 className="text-xs font-bold text-[#1E3A5F] uppercase tracking-wider mb-2">
              Kriteria Keberhasilan Praktik
            </h4>
            <div className="space-y-1.5">
              {challenge.successCriteria.map((crit, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{crit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Solution Key for Teachers */}
          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1E3A5F] flex items-center gap-1">
                  <Key className="w-4 h-4 text-amber-600" />
                  Kunci Jawaban & Solusi Guru
                </span>
                {!isTeacherMode && (
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                    Mode Guru
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="text-xs text-[#F97316] hover:underline font-medium flex items-center gap-1"
              >
                {showSolution ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                <span>{showSolution ? 'Tutup Kunci Jawaban' : 'Buka Kunci Jawaban'}</span>
              </button>
            </div>

            {showSolution && (
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-3">
                <p className="text-xs text-emerald-900 leading-relaxed">
                  <strong>Penjelasan Konseptual:</strong> {challenge.explanation}
                </p>
                <div>
                  <div className="text-xs font-semibold text-emerald-950 mb-1">
                    Kode Solusi Lengkap:
                  </div>
                  <pre className="bg-slate-900 text-emerald-300 p-3 rounded-lg text-xs font-mono overflow-x-auto leading-relaxed border border-emerald-800">
                    {challenge.solutionCode}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          >
            Tutup
          </button>

          <button
            onClick={() => {
              onLoadIntoSimulator(challenge);
              onClose();
            }}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold bg-[#F97316] hover:bg-orange-600 text-white shadow-sm transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Muat & Uji di Simulator Virtual</span>
          </button>
        </div>
      </div>
    </div>
  );
};
