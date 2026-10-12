import React, { useState, useEffect } from 'react';
import { GROUP_CHALLENGES } from '../data/challenges';
import { GroupEvaluation } from '../types';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Printer, 
  RotateCcw, 
  Save, 
  Edit3, 
  Users, 
  Download,
  Search,
  Filter
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'codepath_arduino_evaluations_v1';

export const Scoreboard: React.FC = () => {
  const [evaluations, setEvaluations] = useState<GroupEvaluation[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    // Initialize default evaluations for all 10 groups
    return GROUP_CHALLENGES.map((ch) => ({
      groupNumber: ch.groupNumber,
      groupName: `Kelompok ${ch.groupNumber}`,
      students: { ...ch.defaultStudents },
      wiringScore: 23,
      codingScore: 32,
      functionScore: 23,
      teamworkScore: 14,
      notes: 'Rangkaian rapi, siswa memahami letak fungsi delay.',
      status: 'Lulus' as const,
      completedAt: 'Hari ini'
    }));
  });

  const [selectedGroup, setSelectedGroup] = useState<number>(1);
  const [saveToast, setSaveToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(evaluations));
  }, [evaluations]);

  const handleScoreChange = (
    groupNum: number, 
    field: 'wiringScore' | 'codingScore' | 'functionScore' | 'teamworkScore', 
    val: number
  ) => {
    setEvaluations((prev) =>
      prev.map((item) => {
        if (item.groupNumber !== groupNum) return item;
        const updated = { ...item, [field]: val };
        const total = updated.wiringScore + updated.codingScore + updated.functionScore + updated.teamworkScore;
        updated.status = total >= 75 ? 'Lulus' : 'Revisi';
        return updated;
      })
    );
  };

  const handleStudentNameChange = (
    groupNum: number,
    role: 'leadCoder' | 'wiringSpecialist' | 'bugHunter' | 'presenter',
    name: string
  ) => {
    setEvaluations((prev) =>
      prev.map((item) => {
        if (item.groupNumber !== groupNum) return item;
        return {
          ...item,
          students: {
            ...item.students,
            [role]: name
          }
        };
      })
    );
  };

  const handleNotesChange = (groupNum: number, notes: string) => {
    setEvaluations((prev) =>
      prev.map((item) => (item.groupNumber === groupNum ? { ...item, notes } : item))
    );
  };

  const handleManualSave = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(evaluations));
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResetDefaults = () => {
    if (confirm('Reset seluruh nilai kelompok ke nilai awal?')) {
      const reset = GROUP_CHALLENGES.map((ch) => ({
        groupNumber: ch.groupNumber,
        groupName: `Kelompok ${ch.groupNumber}`,
        students: { ...ch.defaultStudents },
        wiringScore: 20,
        codingScore: 28,
        functionScore: 20,
        teamworkScore: 12,
        notes: '',
        status: 'Lulus' as const
      }));
      setEvaluations(reset);
    }
  };

  const currentEval = evaluations.find((e) => e.groupNumber === selectedGroup) || evaluations[0];
  const currentTotal = currentEval.wiringScore + currentEval.codingScore + currentEval.functionScore + currentEval.teamworkScore;
  const currentChallenge = GROUP_CHALLENGES.find((c) => c.groupNumber === selectedGroup);

  const filteredEvaluations = evaluations.filter((e) => {
    const q = searchTerm.toLowerCase();
    const studentsStr = Object.values(e.students).join(' ').toLowerCase();
    return e.groupName.toLowerCase().includes(q) || studentsStr.includes(q);
  });

  // Calculate summary stats
  const totalStudents = evaluations.length * 4;
  const passedGroups = evaluations.filter((e) => (e.wiringScore + e.codingScore + e.functionScore + e.teamworkScore) >= 75).length;
  const avgClassScore = Math.round(
    evaluations.reduce((sum, e) => sum + (e.wiringScore + e.codingScore + e.functionScore + e.teamworkScore), 0) / evaluations.length
  );

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1E3A5F] text-[#F97316] flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1E3A5F]">
                Rubrik Penilaian & Rekap Nilai Praktik Kelas 12
              </h2>
              <p className="text-xs text-slate-500">
                Format evaluasi 10 kelompok (4 siswa per kelompok = 40 siswa) materi Traffic Light & LED
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 no-print">
            <button
              onClick={handleManualSave}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1E3A5F] hover:bg-slate-800 text-white transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saveToast ? 'Tersimpan!' : 'Simpan Nilai'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F97316] hover:bg-orange-600 text-white transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Rekap Nilai</span>
            </button>

            <button
              onClick={handleResetDefaults}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200"
              title="Reset ke pengaturan awal"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="text-[11px] text-slate-500 font-medium">Total Kelompok</div>
            <div className="text-xl font-bold text-[#1E3A5F] tabular-nums">10 Kelompok</div>
            <div className="text-[10px] text-slate-400">40 Siswa Kelas 12</div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
            <div className="text-[11px] text-emerald-800 font-medium">Kelompok Tuntas / Lulus</div>
            <div className="text-xl font-bold text-emerald-700 tabular-nums">{passedGroups} / 10</div>
            <div className="text-[10px] text-emerald-600">KKM Minimal: 75</div>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
            <div className="text-[11px] text-amber-800 font-medium">Perlu Revisi</div>
            <div className="text-xl font-bold text-amber-700 tabular-nums">{10 - passedGroups} Kelompok</div>
            <div className="text-[10px] text-amber-600">Perbaikan koding/wiring</div>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="text-[11px] text-blue-800 font-medium">Rata-rata Nilai Kelas</div>
            <div className="text-xl font-bold text-[#1E3A5F] tabular-nums">{avgClassScore} / 100</div>
            <div className="text-[10px] text-blue-600">Predikat: Sangat Baik</div>
          </div>
        </div>
      </div>

      {/* Main Scoring Grid: Left List + Right Detail Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 10 Groups Selector List */}
        <div className="lg:col-span-5 bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#1E3A5F]">Daftar 10 Kelompok</h3>
            <span className="text-xs text-slate-500 font-mono">Pilih untuk menilai</span>
          </div>

          <div className="space-y-2">
            {evaluations.map((item) => {
              const total = item.wiringScore + item.codingScore + item.functionScore + item.teamworkScore;
              const isSelected = item.groupNumber === selectedGroup;
              const ch = GROUP_CHALLENGES.find((c) => c.groupNumber === item.groupNumber);

              return (
                <div
                  key={item.groupNumber}
                  onClick={() => setSelectedGroup(item.groupNumber)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/60 border-[#1E3A5F] shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-xs text-[#1E3A5F] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center text-[10px]">
                        {item.groupNumber}
                      </span>
                      <span>{item.groupName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                          total >= 75
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {total} / 100
                      </span>
                      {total >= 75 ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 mt-1 truncate">
                    Misi: {ch?.title}
                  </div>

                  <div className="text-[10px] text-slate-400 mt-1">
                    Ketua/Coder: {item.students.leadCoder} · Hardware: {item.students.wiringSpecialist}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Rubric Form & Score Input for Selected Group */}
        <div className="lg:col-span-7 bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#F97316] text-white text-xs font-bold flex items-center justify-center">
                  {currentEval.groupNumber}
                </span>
                <h3 className="font-bold text-base text-[#1E3A5F]">
                  Form Penilaian Kelompok {currentEval.groupNumber}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Tantangan: <strong>{currentChallenge?.title}</strong> ({currentChallenge?.difficulty})
              </p>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold font-mono text-[#1E3A5F] tabular-nums">
                {currentTotal} <span className="text-xs text-slate-400 font-normal">/ 100</span>
              </div>
              <span
                className={`inline-block text-xs font-semibold px-2 py-0.5 rounded ${
                  currentTotal >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {currentTotal >= 75 ? '● LULUS / TUNTAS' : '▲ PERLU REVISI'}
              </span>
            </div>
          </div>

          {/* Student Names (4 Roles) */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-[#1E3A5F] uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#F97316]" />
              Data 4 Anggota Siswa (Role Praktikum)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  1. Lead Programmer (Koder Utama):
                </label>
                <input
                  type="text"
                  value={currentEval.students.leadCoder}
                  onChange={(e) => handleStudentNameChange(currentEval.groupNumber, 'leadCoder', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#F97316]"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  2. Hardware & Wiring Specialist:
                </label>
                <input
                  type="text"
                  value={currentEval.students.wiringSpecialist}
                  onChange={(e) => handleStudentNameChange(currentEval.groupNumber, 'wiringSpecialist', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#F97316]"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  3. Bug Hunter & Tester QA:
                </label>
                <input
                  type="text"
                  value={currentEval.students.bugHunter}
                  onChange={(e) => handleStudentNameChange(currentEval.groupNumber, 'bugHunter', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#F97316]"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  4. Presenter & Notulen:
                </label>
                <input
                  type="text"
                  value={currentEval.students.presenter}
                  onChange={(e) => handleStudentNameChange(currentEval.groupNumber, 'presenter', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#F97316]"
                />
              </div>
            </div>
          </div>

          {/* 4 Rubric Scoring Sliders */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#1E3A5F] uppercase tracking-wider">
              Input Skor Berdasarkan Rubrik Praktik
            </h4>

            {/* Rubric 1: Hardware Wiring */}
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="flex justify-between items-center mb-1.5">
                <div>
                  <span className="font-semibold text-xs text-[#1E3A5F]">
                    1. Rangkaian Hardware & Pinout
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Kerapian kabel jumper, polaritas LED, resistor 220Ω, Pin 3, 4, 5 tepat
                  </span>
                </div>
                <span className="text-xs font-bold font-mono text-[#F97316] bg-orange-50 px-2 py-0.5 rounded">
                  {currentEval.wiringScore} / 25
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                value={currentEval.wiringScore}
                onChange={(e) => handleScoreChange(currentEval.groupNumber, 'wiringScore', Number(e.target.value))}
                className="w-full accent-[#F97316] h-1.5 cursor-pointer"
              />
            </div>

            {/* Rubric 2: Coding & Syntax */}
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="flex justify-between items-center mb-1.5">
                <div>
                  <span className="font-semibold text-xs text-[#1E3A5F]">
                    2. Koding & Debugging Error
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Bebas syntax error, titik koma (;) tertib, pemahaman fungsi delay() & digitalWrite()
                  </span>
                </div>
                <span className="text-xs font-bold font-mono text-[#F97316] bg-orange-50 px-2 py-0.5 rounded">
                  {currentEval.codingScore} / 35
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="35"
                value={currentEval.codingScore}
                onChange={(e) => handleScoreChange(currentEval.groupNumber, 'codingScore', Number(e.target.value))}
                className="w-full accent-[#F97316] h-1.5 cursor-pointer"
              />
            </div>

            {/* Rubric 3: Function & Mission */}
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="flex justify-between items-center mb-1.5">
                <div>
                  <span className="font-semibold text-xs text-[#1E3A5F]">
                    3. Kesesuaian Misi & Cara Kerja Lampu
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Nyala lampu sesuai spesifikasi tantangan kasus (durasi detik, pola strobo, dsb.)
                  </span>
                </div>
                <span className="text-xs font-bold font-mono text-[#F97316] bg-orange-50 px-2 py-0.5 rounded">
                  {currentEval.functionScore} / 25
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                value={currentEval.functionScore}
                onChange={(e) => handleScoreChange(currentEval.groupNumber, 'functionScore', Number(e.target.value))}
                className="w-full accent-[#F97316] h-1.5 cursor-pointer"
              />
            </div>

            {/* Rubric 4: Teamwork */}
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="flex justify-between items-center mb-1.5">
                <div>
                  <span className="font-semibold text-xs text-[#1E3A5F]">
                    4. Kerja Sama Tim & Demonstrasi
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Keempat siswa aktif berperan, pembagian tugas seimbang, presentasi lugas
                  </span>
                </div>
                <span className="text-xs font-bold font-mono text-[#F97316] bg-orange-50 px-2 py-0.5 rounded">
                  {currentEval.teamworkScore} / 15
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                value={currentEval.teamworkScore}
                onChange={(e) => handleScoreChange(currentEval.groupNumber, 'teamworkScore', Number(e.target.value))}
                className="w-full accent-[#F97316] h-1.5 cursor-pointer"
              />
            </div>
          </div>

          {/* Teacher Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#1E3A5F] mb-1">
              Catatan / Masukan Guru untuk Kelompok:
            </label>
            <textarea
              value={currentEval.notes}
              onChange={(e) => handleNotesChange(currentEval.groupNumber, e.target.value)}
              placeholder="Tuliskan catatan apresiasi atau evaluasi bagi siswa..."
              rows={2}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-[#F97316]"
            />
          </div>
        </div>
      </div>

      {/* Printable Table View for Teacher Reports */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm print-only">
        <div className="text-center mb-6">
          <h1 className="text-lg font-bold text-[#1E3A5F]">REKAPITULASI NILAI PRAKTIK ARDUINO UNO</h1>
          <p className="text-xs text-slate-600">Materi: Traffic Light & LED · Kelas: XII SMK / SMA · Total: 10 Kelompok</p>
        </div>

        <table className="w-full text-xs text-left border border-slate-300">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300">
              <th className="p-2 border-r border-slate-300">Kelompok</th>
              <th className="p-2 border-r border-slate-300">Anggota Tim (4 Siswa)</th>
              <th className="p-2 border-r border-slate-300">Judul Tantangan</th>
              <th className="p-2 border-r border-slate-300 text-center">Wiring (25)</th>
              <th className="p-2 border-r border-slate-300 text-center">Coding (35)</th>
              <th className="p-2 border-r border-slate-300 text-center">Fungsi (25)</th>
              <th className="p-2 border-r border-slate-300 text-center">Tim (15)</th>
              <th className="p-2 border-r border-slate-300 text-center font-bold">Total (100)</th>
              <th className="p-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {evaluations.map((ev) => {
              const total = ev.wiringScore + ev.codingScore + ev.functionScore + ev.teamworkScore;
              const ch = GROUP_CHALLENGES.find((c) => c.groupNumber === ev.groupNumber);
              return (
                <tr key={ev.groupNumber}>
                  <td className="p-2 font-bold border-r border-slate-200">Kel. {ev.groupNumber}</td>
                  <td className="p-2 border-r border-slate-200">
                    <div>1. {ev.students.leadCoder}</div>
                    <div>2. {ev.students.wiringSpecialist}</div>
                    <div>3. {ev.students.bugHunter}</div>
                    <div>4. {ev.students.presenter}</div>
                  </td>
                  <td className="p-2 border-r border-slate-200">{ch?.title}</td>
                  <td className="p-2 text-center border-r border-slate-200">{ev.wiringScore}</td>
                  <td className="p-2 text-center border-r border-slate-200">{ev.codingScore}</td>
                  <td className="p-2 text-center border-r border-slate-200">{ev.functionScore}</td>
                  <td className="p-2 text-center border-r border-slate-200">{ev.teamworkScore}</td>
                  <td className="p-2 text-center font-bold font-mono border-r border-slate-200">{total}</td>
                  <td className="p-2 text-center font-bold">
                    {total >= 75 ? 'LULUS' : 'REVISI'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mt-8 flex justify-between text-xs text-slate-700 px-6">
          <div>
            Mengetahui,<br />
            Kepala Laboratorium
            <div className="h-14"></div>
            (.......................................................)
          </div>
          <div>
            Guru Mata Pelajaran,<br />
            Teknik Pemrograman Mikrokontroler
            <div className="h-14"></div>
            (.......................................................)
          </div>
        </div>
      </div>
    </div>
  );
};
