import React, { useState } from 'react';
import { 
  X, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  ExternalLink, 
  Zap, 
  Usb, 
  ArrowRight, 
  Info,
  Wrench,
  Sparkles
} from 'lucide-react';

interface HardwareGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignedPins: { red?: number; yellow?: number; green?: number; blue?: number };
  activeSeries: 'helios' | 'polaris';
}

export const HardwareGuideModal: React.FC<HardwareGuideModalProps> = ({
  isOpen,
  onClose,
  assignedPins,
  activeSeries
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'wiring' | 'bridge'>('upload');
  const [copiedBridge, setCopiedBridge] = useState(false);

  if (!isOpen) return null;

  const bridgeCode = `// ========================================================
// KODINGAN JEMBATAN WEB SERIAL (CUKUP UPLOAD 1x SAJA DI AWAL)
// Setelah di-upload sekali ini, SEMUA KELOMPOK bisa langsung
// menguji dan menyalakan lampu fisik LANGSUNG DARI WEB!
// ========================================================

void setup() {
  Serial.begin(9600);
  // Set semua pin digital 2 s/d 13 sebagai OUTPUT
  for (int p = 2; p <= 13; p++) {
    pinMode(p, OUTPUT);
    digitalWrite(p, LOW);
  }
}

void loop() {
  if (Serial.available() > 0) {
    int pin = Serial.parseInt(); // Membaca nomor pin
    char sep = Serial.read();     // Membaca tanda ':'
    int state = Serial.parseInt(); // Membaca 1 (HIGH) atau 0 (LOW)
    
    if (pin >= 2 && pin <= 13) {
      digitalWrite(pin, state == 1 ? HIGH : LOW);
    }
  }
}`;

  const handleCopyBridge = () => {
    navigator.clipboard.writeText(bridgeCode);
    setCopiedBridge(true);
    setTimeout(() => setCopiedBridge(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border-2 border-teal-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="bg-[#0D9488] text-white p-4 sm:p-5 flex items-start justify-between border-b-4 border-[#F97316]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-950/40 rounded-xl border border-teal-400/40">
              <Cpu className="w-6 h-6 text-[#FBBF24]" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg tracking-tight text-white flex items-center gap-2">
                <span>Kenapa Lampu Fisik Belum Menyala?</span>
              </h2>
              <p className="text-xs text-teal-100 mt-0.5">
                Panduan praktis agar lampu LED di meja praktikum menyala sempurna
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-teal-200 hover:text-white rounded-lg hover:bg-teal-700/50 transition-colors"
            title="Tutup dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PENJELASAN RINGKAS PENYEBAB UTAMA */}
        <div className="bg-amber-50 p-3 sm:p-4 border-b border-amber-200 flex items-start gap-3 text-xs text-amber-950">
          <Info className="w-5 h-5 text-[#F97316] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-amber-900 block font-bold text-xs">
              Mencolokkan kabel USB hanya mengalirkan daya listrik (5V):
            </strong>
            Chip mikrokontroler Arduino Uno (ATmega328P) bekerja secara mandiri. Program baru di web ini{' '}
            <span className="font-bold underline text-amber-950">harus di-UPLOAD ke chip Arduino</span>{' '}
            melalui software <strong>Arduino IDE</strong> di laptop agar lampu LED fisik dapat menyala!
          </div>
        </div>

        {/* TAB PILIHAN METODE */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-3 pt-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-2 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'border-[#0D9488] text-[#0D9488] bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>1. Cara Standar (Upload via Arduino IDE)</span>
          </button>

          <button
            onClick={() => setActiveTab('wiring')}
            className={`py-2 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'wiring'
                ? 'border-[#0D9488] text-[#0D9488] bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wrench className="w-4 h-4 text-amber-600" />
            <span>2. Cek Rangkaian Kabel & LED</span>
          </button>

          <button
            onClick={() => setActiveTab('bridge')}
            className={`py-2 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'bridge'
                ? 'border-[#0D9488] text-[#0D9488] bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4 text-[#F97316]" />
            <span>3. Kontrol Langsung Browser (Live Sync)</span>
          </button>
        </div>

        {/* ISI KONTEN PER TAB */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto text-xs space-y-4">
          {/* TAB 1: UPLOAD VIA ARDUINO IDE */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <span className="bg-[#0D9488] text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                  ✓
                </span>
                <span>4 Langkah Cepat Mengunggah Kodingan (Kurikulum Standar):</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Langkah 1 */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 font-bold text-[#0D9488]">
                    <span className="bg-teal-100 text-[#0D9488] px-1.5 py-0.5 rounded text-[11px]">
                      Langkah 1
                    </span>
                    <span>Salin Kodingan di Web</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Klik tombol kuning/orange bertuliskan <strong>"Salin ke Arduino IDE"</strong> di atas atau di bawah editor web ini.
                  </p>
                </div>

                {/* Langkah 2 */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 font-bold text-[#0D9488]">
                    <span className="bg-teal-100 text-[#0D9488] px-1.5 py-0.5 rounded text-[11px]">
                      Langkah 2
                    </span>
                    <span>Buka Software Arduino IDE</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Buka aplikasi <strong>Arduino IDE</strong> di laptop siswa, tekan <strong>Ctrl + A</strong> lalu <strong>Ctrl + V</strong> (Paste).
                  </p>
                </div>

                {/* Langkah 3 */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 font-bold text-[#0D9488]">
                    <span className="bg-teal-100 text-[#0D9488] px-1.5 py-0.5 rounded text-[11px]">
                      Langkah 3
                    </span>
                    <span>Pilih Port COM & Board</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Di Arduino IDE, pastikan menu <strong>Tools ➔ Board ➔ Arduino Uno</strong> dan <strong>Tools ➔ Port ➔ COM3/COM4/dst</strong> sudah dicentang.
                  </p>
                </div>

                {/* Langkah 4 */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 font-bold text-[#F97316]">
                    <span className="bg-orange-100 text-[#F97316] px-1.5 py-0.5 rounded text-[11px]">
                      Langkah 4
                    </span>
                    <span>Klik Tombol Upload (➔)</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Klik tombol panah kanan <strong>Upload</strong> di sudut kiri atas Arduino IDE. Lampu TX/RX di papan Uno akan berkedip cepat!
                  </p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Hasil: Lampu fisik langsung menyala secara otomatis!</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Setelah muncul tulisan <em>"Done uploading"</em> di Arduino IDE, lampu LED fisik di breadboard akan menyala mandiri berurutan persis seperti simulator.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: CEK KABEL & BREADBOARD */}
          {activeTab === 'wiring' && (
            <div className="space-y-3">
              <div className="font-bold text-slate-800 text-sm">
                🔍 4 Hal Paling Sering Terjadi di Meja Praktikum:
              </div>

              <div className="space-y-2.5 text-xs">
                {/* 1. Kaki LED */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <div>
                    <strong className="text-slate-900 block">Kaki LED Terbalik (Polaritas):</strong>
                    <span className="text-slate-600">
                      LED memiliki kutub: <strong>Kaki Panjang (Anoda +)</strong> harus terhubung ke Pin Arduino (Pin {assignedPins.red || 3}, {assignedPins.yellow || 6}, {assignedPins.green || 8}).{' '}
                      <strong>Kaki Pendek (Katoda -)</strong> harus terhubung ke Resistor lalu ke jalur <strong>GND</strong>. Jika terbalik, lampu tidak akan menyala sama sekali.
                    </span>
                  </div>
                </div>

                {/* 2. Jalur GND */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <div>
                    <strong className="text-slate-900 block">Kabel Ground (GND) Belum Terpasang:</strong>
                    <span className="text-slate-600">
                      Pastikan ada 1 kabel jumper hitam dari lubang pin bertuliskan <strong>GND</strong> pada papan Arduino Uno yang dicolokkan ke rel negatif (-) breadboard.
                    </span>
                  </div>
                </div>

                {/* 3. Nomor Pin */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <div>
                    <strong className="text-slate-900 block">Nomor Pin Sesuai Misi Kelompok:</strong>
                    <span className="text-slate-600">
                      Periksa apakah kabel jumper sudah menancap di pin yang sesuai:
                      {assignedPins.red !== undefined && ` Merah di Pin ${assignedPins.red},`}
                      {assignedPins.yellow !== undefined && ` Kuning di Pin ${assignedPins.yellow},`}
                      {assignedPins.green !== undefined && ` Hijau di Pin ${assignedPins.green},`}
                      {assignedPins.blue !== undefined && ` Biru di Pin ${assignedPins.blue}.`}
                    </span>
                  </div>
                </div>

                {/* 4. Resistor */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0">
                    4
                  </span>
                  <div>
                    <strong className="text-slate-900 block">Resistor 220Ω Terpasang Kuat:</strong>
                    <span className="text-slate-600">
                      Gunakan resistor 220 Ohm (Merah-Merah-Cokelat) agar arus listrik stabil dan LED menyala terang tanpa rusak.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LIVE SYNC BROWSER VIA WEB SERIAL */}
          {activeTab === 'bridge' && (
            <div className="space-y-3">
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-[#0D9488]">
                  <Sparkles className="w-4 h-4 text-[#F97316]" />
                  <span>Fitur Khusus: Kendalikan Lampu Fisik Langsung dari Browser!</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Jika Anda ingin setiap kali menekan tombol <strong>"Jalankan"</strong> di web lampu fisik di meja otomatis ikut menyala secara live, Anda cukup meng-upload kodingan jembatan berikut <strong>hanya sekali</strong> ke papan Arduino Uno:
                </p>
              </div>

              <div className="relative bg-slate-950 rounded-xl border border-slate-800 p-3 overflow-hidden">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
                  <span className="font-mono">WebSerialBridge.ino</span>
                  <button
                    onClick={handleCopyBridge}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#F97316] hover:bg-orange-600 text-white font-bold text-xs"
                  >
                    {copiedBridge ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedBridge ? 'Tersalin' : 'Salin Kodingan Jembatan'}</span>
                  </button>
                </div>
                <pre className="font-mono text-[11px] text-emerald-400 p-2 overflow-x-auto leading-5 max-h-44">
                  {bridgeCode}
                </pre>
              </div>

              <div className="text-[11px] text-slate-600 leading-relaxed space-y-1">
                <p><strong>Cara Pakai:</strong></p>
                <ol className="list-decimal pl-4 space-y-0.5">
                  <li>Upload kodingan jembatan di atas sekali ke papan Arduino lewat Arduino IDE.</li>
                  <li>Tutup Serial Monitor di Arduino IDE (agar port tidak bentrok).</li>
                  <li>Di web ini, klik tombol <strong>"Sambungkan USB Fisik"</strong> di pojok kanan atas.</li>
                  <li>Klik tombol <strong>"Jalankan"</strong> pada simulator. Lampu fisik di breadboard akan otomatis menyala mengikuti simulator secara live!</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="bg-slate-50 p-3 sm:p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-slate-500 font-medium">
            Tips: Gunakan tombol "Salin ke Arduino IDE" untuk kemudahan siswa di kelas
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0D9488] hover:bg-teal-700 text-white font-bold transition-all shadow-xs"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
