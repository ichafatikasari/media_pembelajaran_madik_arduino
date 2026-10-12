import React from 'react';
import { Cpu, Zap, ShieldAlert, CheckCircle2, Info, ArrowRight } from 'lucide-react';

export const WiringGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[#1E3A5F] text-[#F97316] flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#1E3A5F]">
              Panduan Skema Rangkaian & Pinout Hardware Arduino Uno
            </h2>
            <p className="text-xs text-slate-500">
              Standar perakitan kabel jumper, LED 5mm, dan resistor 220Ω di project board (breadboard)
            </p>
          </div>
        </div>

        {/* Pinout Table */}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#1E3A5F] text-white">
                <th className="py-2.5 px-3 rounded-tl-lg font-semibold">Komponen</th>
                <th className="py-2.5 px-3 font-semibold">Pin Arduino Uno</th>
                <th className="py-2.5 px-3 font-semibold">Kaki Komponen (Anoda / Katoda)</th>
                <th className="py-2.5 px-3 font-semibold">Resistor Pengaman</th>
                <th className="py-2.5 px-3 rounded-tr-lg font-semibold">Fungsi / Indikator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-semibold text-red-600 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                  LED Merah
                </td>
                <td className="py-2.5 px-3 font-mono font-bold text-slate-800">Pin 3 (PWM ~)</td>
                <td className="py-2.5 px-3">Anoda (+) Kaki Panjang ke Pin 3</td>
                <td className="py-2.5 px-3 font-mono text-slate-600">220 Ω (Katoda ke GND)</td>
                <td className="py-2.5 px-3 text-slate-600">Lampu Berhenti Lalu Lintas</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-semibold text-emerald-600 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  LED Hijau
                </td>
                <td className="py-2.5 px-3 font-mono font-bold text-slate-800">Pin 4 (Digital)</td>
                <td className="py-2.5 px-3">Anoda (+) Kaki Panjang ke Pin 4</td>
                <td className="py-2.5 px-3 font-mono text-slate-600">220 Ω (Katoda ke GND)</td>
                <td className="py-2.5 px-3 text-slate-600">Lampu Berjalan / Aman</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-semibold text-amber-600 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  LED Kuning
                </td>
                <td className="py-2.5 px-3 font-mono font-bold text-slate-800">Pin 5 (PWM ~)</td>
                <td className="py-2.5 px-3">Anoda (+) Kaki Panjang ke Pin 5</td>
                <td className="py-2.5 px-3 font-mono text-slate-600">220 Ω (Katoda ke GND)</td>
                <td className="py-2.5 px-3 text-slate-600">Lampu Transisi / Peringatan</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-semibold text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-900"></span>
                  Ground Rail
                </td>
                <td className="py-2.5 px-3 font-mono font-bold text-slate-800">Pin GND (Ground)</td>
                <td className="py-2.5 px-3">Jalur Negatif (-) Breadboard</td>
                <td className="py-2.5 px-3 font-mono text-slate-600">-</td>
                <td className="py-2.5 px-3 text-slate-600">Penutup Sirkuit Arus Bersama</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Hardware Diagram Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step-by-step assembly */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-[#1E3A5F] flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#F97316] text-white flex items-center justify-center text-xs">1</span>
            Langkah Pemasangan Hardware (Role: Wiring Specialist)
          </h3>
          <ul className="space-y-3 text-xs text-slate-700">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Hubungkan Jalur Ground:</strong> Pasang satu kabel jumper dari pin <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold">GND</code> Arduino ke rel negatif (-) warna biru di breadboard.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Tancapkan 3 Buah LED:</strong> Tancapkan LED Merah, Kuning, dan Hijau di baris breadboard terpisah. Pastikan <em>kaki panjang (Anoda +)</em> dan <em>kaki pendek (Katoda -)</em> berada di kolom lubang berbeda!
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Pasang 3 Resistor 220Ω:</strong> Hubungkan satu kaki resistor ke kaki pendek (Katoda) LED, dan kaki resistor lainnya ke rel negatif (-) ground breadboard.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Koneksikan Sinyal Digital:</strong>
                <div className="mt-1 pl-1 space-y-1 font-mono text-[11px] text-slate-600">
                  <div>· Kabel Merah: Kaki panjang LED Merah → Pin 3 Arduino</div>
                  <div>· Kabel Hijau: Kaki panjang LED Hijau → Pin 4 Arduino</div>
                  <div>· Kabel Kuning: Kaki panjang LED Kuning → Pin 5 Arduino</div>
                </div>
              </div>
            </li>
          </ul>
        </div>

        {/* Safety & Common Traps */}
        <div className="bg-amber-50 rounded-xl p-5 border border-amber-200 text-amber-900 space-y-4">
          <h3 className="font-bold text-sm text-amber-950 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#F97316]" />
            Aturan Keselamatan & Kesalahan Fatal Pemula
          </h3>
          <ul className="space-y-2.5 text-xs text-amber-900 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="font-bold text-[#F97316]">⚠️</span>
              <div>
                <strong>Wajib Gunakan Resistor 220 Ohm!</strong> Jangan pernah menghubungkan LED langsung dari pin 5V atau pin digital tanpa resistor, karena tegangan lebih akan membuat LED putus (hangus) atau merusak port mikrokontroler.
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-[#F97316]">⚠️</span>
              <div>
                <strong>Kode Warna Resistor 220Ω:</strong> Merah - Merah - Cokelat - Emas (2 - 2 - 10^1 = 220 Ohm). Pastikan gelang warnanya tidak tertukar dengan 10kΩ atau 1kΩ.
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-[#F97316]">⚠️</span>
              <div>
                <strong>Periksa Polaritas LED:</strong> Kaki panjang = Positif (Anoda), Kaki pendek / sisi rata pada badan LED = Negatif (Katoda). Jika terbalik, lampu tidak akan menyala meskipun kodingan sudah benar.
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
