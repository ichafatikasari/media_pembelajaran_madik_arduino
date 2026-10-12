import React, { useState } from 'react';
import { GROUP_CHALLENGES } from '../data/challenges';
import { Printer, FileText, CheckSquare, Users, Cpu, ArrowLeft } from 'lucide-react';

export const PrintableWorksheets: React.FC = () => {
  const [selectedGroupToPrint, setSelectedGroupToPrint] = useState<number | 'all'>('all');

  const challengesToDisplay =
    selectedGroupToPrint === 'all'
      ? GROUP_CHALLENGES
      : GROUP_CHALLENGES.filter((c) => c.groupNumber === selectedGroupToPrint);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1E3A5F] text-[#F97316] flex items-center justify-center font-bold">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#1E3A5F]">
              Lembar Kerja Siswa (LKS) & Kartu Tantangan Cetak
            </h2>
            <p className="text-xs text-slate-500">
              Format siap cetak (A4) untuk dibagikan ke 10 meja kelompok saat praktikum dimulai
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-600">Pilih Kartu:</span>
            <select
              value={selectedGroupToPrint}
              onChange={(e) => setSelectedGroupToPrint(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              aria-label="Pilih Kartu Kelompok untuk Dicetak"
              className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs"
            >
              <option value="all">Semua Kelompok (1 - 10)</option>
              {GROUP_CHALLENGES.map((ch) => (
                <option key={ch.groupNumber} value={ch.groupNumber}>
                  Kelompok {ch.groupNumber} ({ch.title.slice(0, 20)}...)
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#F97316] hover:bg-orange-600 text-white transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Kartu Tugas (Print)</span>
          </button>
        </div>
      </div>

      {/* Cards container */}
      <div className="space-y-8">
        {challengesToDisplay.map((ch) => (
          <div
            key={ch.groupNumber}
            className="bg-white rounded-xl p-6 border-2 border-slate-300 shadow-sm print:border-black print:p-6 print:break-after-page"
          >
            {/* Header LKS */}
            <div className="border-b-2 border-slate-900 pb-4 mb-4 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#1E3A5F] text-white font-bold px-2 py-0.5 rounded text-xs">
                    LEMBAR KERJA SISWA (LKS)
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    Praktik Mikrokontroler Arduino Uno Kelas XII
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Kelompok {ch.groupNumber}: {ch.title}
                </h3>
                <div className="text-xs text-slate-500">
                  Kategori: <strong>{ch.category}</strong> · Tingkat: <strong>{ch.difficulty}</strong>
                </div>
              </div>

              {/* Group Name & Score Box */}
              <div className="border border-slate-400 rounded p-2 text-right min-w-[140px]">
                <div className="text-[10px] uppercase font-semibold text-slate-500">Nilai Akhir:</div>
                <div className="text-2xl font-bold font-mono text-slate-800 h-8 flex items-center justify-end">
                  ______ / 100
                </div>
                <div className="text-[9px] text-slate-400">Paraf Guru: ____________</div>
              </div>
            </div>

            {/* Student Roles Matrix */}
            <div className="bg-slate-50 p-3 rounded border border-slate-200 mb-4 print:bg-transparent">
              <div className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#F97316]" />
                Anggota Tim Kelompok {ch.groupNumber} (Tuliskan Nama Siswa):
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="border-b border-dotted border-slate-400 pb-1">
                  <span className="font-semibold text-slate-600 block text-[10px]">1. Lead Programmer:</span>
                  <span className="text-slate-900">{ch.defaultStudents.leadCoder}</span>
                </div>
                <div className="border-b border-dotted border-slate-400 pb-1">
                  <span className="font-semibold text-slate-600 block text-[10px]">2. Wiring Specialist:</span>
                  <span className="text-slate-900">{ch.defaultStudents.wiringSpecialist}</span>
                </div>
                <div className="border-b border-dotted border-slate-400 pb-1">
                  <span className="font-semibold text-slate-600 block text-[10px]">3. Bug Hunter / QA:</span>
                  <span className="text-slate-900">{ch.defaultStudents.bugHunter}</span>
                </div>
                <div className="border-b border-dotted border-slate-400 pb-1">
                  <span className="font-semibold text-slate-600 block text-[10px]">4. Presenter / Notulen:</span>
                  <span className="text-slate-900">{ch.defaultStudents.presenter}</span>
                </div>
              </div>
            </div>

            {/* Story & Mission Box */}
            <div className="space-y-3 mb-4 text-xs leading-relaxed text-slate-800">
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded">
                <div className="font-semibold text-amber-950 mb-0.5">📌 Kasus / Cerita Masalah:</div>
                <p>{ch.story}</p>
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded">
                <div className="font-semibold text-blue-950 mb-0.5">🎯 Misi Kelompok yang Harus Diselesaikan:</div>
                <p>{ch.mission}</p>
              </div>
            </div>

            {/* Starter Code Box */}
            <div className="mb-4">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                <span>Kode Program yang Diberikan (Ketik di Arduino IDE):</span>
                <span className="text-[10px] text-slate-500 font-mono">Pin 3: Merah | Pin 4: Hijau | Pin 5: Kuning</span>
              </div>
              <pre className="bg-slate-900 text-slate-100 p-3 rounded text-[11px] font-mono overflow-x-auto leading-5 border border-slate-700 print:bg-slate-100 print:text-black print:border-black">
                {ch.starterCode}
              </pre>
            </div>

            {/* Checklists for Student & Verification */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 border border-slate-200 rounded">
                <div className="font-bold text-slate-800 mb-2">Checklist Keberhasilan Siswa:</div>
                <ul className="space-y-1.5">
                  {ch.successCriteria.map((c, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 border border-slate-200 rounded">
                <div className="font-bold text-slate-800 mb-2">Catatan Observasi Kelompok:</div>
                <div className="space-y-2 text-[11px] text-slate-500">
                  <div className="border-b border-slate-300 pb-1">Letak error yang ditemukan: ____________________</div>
                  <div className="border-b border-slate-300 pb-1">Solusi perbaikan kode: ________________________</div>
                  <div className="border-b border-slate-300 pb-1">Hasil pengujian lampu LED: [ ] Tepat [ ] Belum</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
