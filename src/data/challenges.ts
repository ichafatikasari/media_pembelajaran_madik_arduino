import { GroupChallenge } from '../types';

export const BLANK_STARTER_CODE_3 = `#define 
#define 
#define 

void setup() {
  
}

void loop() {
  
}`;

export const BLANK_STARTER_CODE_4 = `#define 
#define 
#define 
#define 

void setup() {
  
}

void loop() {
  
}`;

export const BASE_ARDUINO_CODE = BLANK_STARTER_CODE_3;

// SERI HELIOS (3 LED: Merah, Kuning, Hijau) - 10 Kelompok
export const HELIOS_CHALLENGES: GroupChallenge[] = [
  {
    id: 1,
    series: 'helios',
    groupNumber: 1,
    title: 'Kelompok 1: Hijau ➔ Merah ➔ Kuning',
    category: 'Sequence & Logic',
    difficulty: 'Dasar',
    assignedPins: { green: 8, red: 3, yellow: 6 },
    colorSequence: ['Hijau', 'Merah', 'Kuning'],
    story: 'Ketik kodingan Arduino Uno dari awal untuk mengontrol 3 lampu LED dengan urutan menyala: Hijau, lalu Merah, lalu Kuning.',
    mission: '1. Pasang kabel jumper: Hijau ke Pin 8, Merah ke Pin 3, Kuning ke Pin 6.\n2. Tulis kodingan dari awal agar lampu menyala berurutan: HIJAU ➔ MERAH ➔ KUNING!',
    starterCode: BLANK_STARTER_CODE_3,
    solutionCode: `#define ledhijau 8
#define ledmerah 3
#define ledkuning 6

void setup() {
  pinMode(ledhijau, OUTPUT);
  pinMode(ledmerah, OUTPUT);
  pinMode(ledkuning, OUTPUT);
}

void loop() {
  digitalWrite(ledhijau, HIGH);
  delay(1000);
  digitalWrite(ledhijau, LOW);

  digitalWrite(ledmerah, HIGH);
  delay(1000);
  digitalWrite(ledmerah, LOW);

  digitalWrite(ledkuning, HIGH);
  delay(1000);
  digitalWrite(ledkuning, LOW);
}`,
    hints: [
      'Ketik nama variabel dan nomor pin setelah kata #define (contoh: ledhijau 8, ledmerah 3, ledkuning 6).',
      'Di void setup(), atur ketiga pin sebagai OUTPUT dengan pinMode().',
      'Di void loop(), nyalakan dan matikan lampu berurutan: Hijau, lalu Merah, lalu Kuning.'
    ],
    successCriteria: [
      'Pin sesuai: Hijau 8, Merah 3, Kuning 6.',
      'Urutan nyala tepat: Hijau ➔ Merah ➔ Kuning.'
    ],
    explanation: 'Urutan eksekusi program di dalam void loop() berjalan baris demi baris dari atas ke bawah, dimulai dari lampu hijau.',
    defaultStudents: {
      leadCoder: 'Ahmad Fauzi',
      wiringSpecialist: 'Bagas Pratama',
      bugHunter: 'Citra Lestari',
      presenter: 'Dinda Rahma'
    }
  },
  {
    id: 2,
    series: 'helios',
    groupNumber: 2,
    title: 'Kelompok 2: Merah ➔ Hijau ➔ Kuning',
    category: 'Sequence & Logic',
    difficulty: 'Dasar',
    assignedPins: { red: 3, yellow: 6, green: 8 },
    colorSequence: ['Merah', 'Hijau', 'Kuning'],
    story: 'Ketik kodingan Arduino Uno dari awal untuk mengontrol 3 lampu LED dengan urutan menyala: Merah, lalu Hijau, lalu Kuning.',
    mission: '1. Pasang kabel jumper: Merah ke Pin 3, Kuning ke Pin 6, Hijau ke Pin 8.\n2. Tulis kodingan dari awal agar lampu menyala berurutan: MERAH ➔ HIJAU ➔ KUNING!',
    starterCode: BLANK_STARTER_CODE_3,
    solutionCode: `#define ledred 3
#define ledyellow 6
#define ledgreen 8

void setup() {
  pinMode(ledred, OUTPUT);
  pinMode(ledyellow, OUTPUT);
  pinMode(ledgreen, OUTPUT);
}

void loop() {
  digitalWrite(ledred, HIGH);
  delay(1000);
  digitalWrite(ledred, LOW);

  digitalWrite(ledgreen, HIGH);
  delay(1000);
  digitalWrite(ledgreen, LOW);

  digitalWrite(ledyellow, HIGH);
  delay(1000);
  digitalWrite(ledyellow, LOW);
}`,
    hints: [
      'Tuliskan definisi pin setelah #define: pin 3, 6, 8.',
      'Di void setup(), set pinMode menjadi OUTPUT.',
      'Di void loop(), urutkan: Merah, Hijau, Kuning.'
    ],
    successCriteria: [
      'Pin sesuai: Merah 3, Kuning 6, Hijau 8.',
      'Urutan nyala tepat: Merah ➔ Hijau ➔ Kuning.'
    ],
    explanation: 'Fungsi digitalWrite menentukan urutan fisik lampu yang menyala di breadboard.',
    defaultStudents: {
      leadCoder: 'Eko Prasetyo',
      wiringSpecialist: 'Fajar Nugraha',
      bugHunter: 'Gita Savitri',
      presenter: 'Hadi Wijaya'
    }
  },
  {
    id: 3,
    series: 'helios',
    groupNumber: 3,
    title: 'Kelompok 3: Kuning ➔ Merah ➔ Hijau',
    category: 'Sequence & Logic',
    difficulty: 'Dasar',
    assignedPins: { red: 9, yellow: 5, green: 2 },
    colorSequence: ['Kuning', 'Merah', 'Hijau'],
    story: 'Ketik kodingan Arduino Uno dari awal untuk mengontrol 3 lampu LED dengan urutan menyala: Kuning, lalu Merah, lalu Hijau.',
    mission: '1. Pasang kabel jumper: Merah ke Pin 9, Kuning ke Pin 5, Hijau ke Pin 2.\n2. Tulis kodingan dari awal agar lampu menyala berurutan: KUNING ➔ MERAH ➔ HIJAU!',
    starterCode: BLANK_STARTER_CODE_3,
    solutionCode: `#define ledred 9
#define ledyellow 5
#define ledgreen 2

void setup() {
  pinMode(ledred, OUTPUT);
  pinMode(ledyellow, OUTPUT);
  pinMode(ledgreen, OUTPUT);
}

void loop() {
  digitalWrite(ledyellow, HIGH);
  delay(1000);
  digitalWrite(ledyellow, LOW);

  digitalWrite(ledred, HIGH);
  delay(1000);
  digitalWrite(ledred, LOW);

  digitalWrite(ledgreen, HIGH);
  delay(1000);
  digitalWrite(ledgreen, LOW);
}`,
    hints: [
      'Ketik #define dengan pin 9, 5, 2.',
      'Di void loop(), nyalakan Kuning pertama kali, lalu Merah, lalu Hijau.'
    ],
    successCriteria: [
      'Pin sesuai: Merah 9, Kuning 5, Hijau 2.',
      'Urutan nyala tepat: Kuning ➔ Merah ➔ Hijau.'
    ],
    explanation: 'Program memulai urutan dari lampu kuning terlebih dahulu sebelum merah dan hijau.',
    defaultStudents: {
      leadCoder: 'Indra Gunawan',
      wiringSpecialist: 'Jihan Nabila',
      bugHunter: 'Kevin Sanjaya',
      presenter: 'Laras Wati'
    }
  },
  {
    id: 4,
    series: 'helios',
    groupNumber: 4,
    title: 'Kelompok 4: Kuning ➔ Hijau ➔ Merah',
    category: 'Sequence & Logic',
    difficulty: 'Dasar',
    assignedPins: { red: 4, yellow: 7, green: 10 },
    colorSequence: ['Kuning', 'Hijau', 'Merah'],
    story: 'Ketik kodingan Arduino Uno dari awal untuk mengontrol 3 lampu LED dengan urutan menyala: Kuning, lalu Hijau, lalu Merah.',
    mission: '1. Pasang kabel jumper: Merah ke Pin 4, Kuning ke Pin 7, Hijau ke Pin 10.\n2. Tulis kodingan dari awal agar lampu menyala berurutan: KUNING ➔ HIJAU ➔ MERAH!',
    starterCode: BLANK_STARTER_CODE_3,
    solutionCode: `#define ledred 4
#define ledyellow 7
#define ledgreen 10

void setup() {
  pinMode(ledred, OUTPUT);
  pinMode(ledyellow, OUTPUT);
  pinMode(ledgreen, OUTPUT);
}

void loop() {
  digitalWrite(ledyellow, HIGH);
  delay(1000);
  digitalWrite(ledyellow, LOW);

  digitalWrite(ledgreen, HIGH);
  delay(1000);
  digitalWrite(ledgreen, LOW);

  digitalWrite(ledred, HIGH);
  delay(1000);
  digitalWrite(ledred, LOW);
}`,
    hints: [
      'Ketik #define dengan pin 4, 7, 10.',
      'Di void loop(), buat urutan: Kuning ON/OFF, Hijau ON/OFF, Merah ON/OFF.'
    ],
    successCriteria: [
      'Pin sesuai: Merah 4, Kuning 7, Hijau 10.',
      'Urutan nyala tepat: Kuning ➔ Hijau ➔ Merah.'
    ],
    explanation: 'Kombinasi urutan lampu terbalik menguji pemahaman struktur sekuensial program mikrokontroler.',
    defaultStudents: {
      leadCoder: 'Muhammad Rizky',
      wiringSpecialist: 'Nadia Putri',
      bugHunter: 'Oki Setiawan',
      presenter: 'Putri Handayani'
    }
  },
  {
    id: 5,
    series: 'helios',
    groupNumber: 5,
    title: 'Kelompok 5: Hijau ➔ Merah ➔ Kuning',
    category: 'Sequence & Logic',
    difficulty: 'Dasar',
    assignedPins: { red: 11, yellow: 3, green: 6 },
    colorSequence: ['Hijau', 'Merah', 'Kuning'],
    story: 'Ketik kodingan Arduino Uno dari awal untuk mengontrol 3 lampu LED dengan urutan menyala: Hijau, lalu Merah, lalu Kuning.',
    mission: '1. Pasang kabel jumper: Merah ke Pin 11, Kuning ke Pin 3, Hijau ke Pin 6.\n2. Tulis kodingan dari awal agar lampu menyala berurutan: HIJAU ➔ MERAH ➔ KUNING!',
    starterCode: BLANK_STARTER_CODE_3,
    solutionCode: `#define ledred 11
#define ledyellow 3
#define ledgreen 6

void setup() {
  pinMode(ledred, OUTPUT);
  pinMode(ledyellow, OUTPUT);
  pinMode(ledgreen, OUTPUT);
}

void loop() {
  digitalWrite(ledgreen, HIGH);
  delay(1000);
  digitalWrite(ledgreen, LOW);

  digitalWrite(ledred, HIGH);
  delay(1000);
  digitalWrite(ledred, LOW);

  digitalWrite(ledyellow, HIGH);
  delay(1000);
  digitalWrite(ledyellow, LOW);
}`,
    hints: [
      'Tuliskan pin setelah #define: 11, 3, 6.',
      'Di void loop(), mulai dari lampu Hijau terlebih dahulu, lalu Merah, lalu Kuning.'
    ],
    successCriteria: [
      'Pin sesuai: Merah 11, Kuning 3, Hijau 6.',
      'Urutan nyala tepat: Hijau ➔ Merah ➔ Kuning.'
    ],
    explanation: 'Lampu hijau mengawali siklus perulangan di dalam void loop().',
    defaultStudents: {
      leadCoder: 'Qori Iskandar',
      wiringSpecialist: 'Rian Saputra',
      bugHunter: 'Siti Aisyah',
      presenter: 'Taufik Hidayat'
    }
  },
  {
    id: 6,
    series: 'helios',
    groupNumber: 6,
    title: 'Kelompok 6: Hijau ➔ Kuning ➔ Merah',
    category: 'Sequence & Logic',
    difficulty: 'Dasar',
    assignedPins: { red: 5, yellow: 12, green: 8 },
    colorSequence: ['Hijau', 'Kuning', 'Merah'],
    story: 'Ketik kodingan Arduino Uno dari awal untuk mengontrol 3 lampu LED dengan urutan menyala: Hijau, lalu Kuning, lalu Merah.',
    mission: '1. Pasang kabel jumper: Merah ke Pin 5, Kuning ke Pin 12, Hijau ke Pin 8.\n2. Tulis kodingan dari awal agar lampu menyala berurutan: HIJAU ➔ KUNING ➔ MERAH!',
    starterCode: BLANK_STARTER_CODE_3,
    solutionCode: `#define ledred 5
#define ledyellow 12
#define ledgreen 8

void setup() {
  pinMode(ledred, OUTPUT);
  pinMode(ledyellow, OUTPUT);
  pinMode(ledgreen, OUTPUT);
}

void loop() {
  digitalWrite(ledgreen, HIGH);
  delay(1000);
  digitalWrite(ledgreen, LOW);

  digitalWrite(ledyellow, HIGH);
  delay(1000);
  digitalWrite(ledyellow, LOW);

  digitalWrite(ledred, HIGH);
  delay(1000);
  digitalWrite(ledred, LOW);
}`,
    hints: [
      'Tuliskan pin setelah #define: 5, 12, 8.',
      'Di void loop(), urutan instruksi: Hijau, Kuning, Merah.'
    ],
    successCriteria: [
      'Pin sesuai: Merah 5, Kuning 12, Hijau 8.',
      'Urutan nyala tepat: Hijau ➔ Kuning ➔ Merah.'
    ],
    explanation: 'Urutan lampu ini adalah kebalikan dari urutan lalu lintas konvensional.',
    defaultStudents: {
      leadCoder: 'Umar Bakri',
      wiringSpecialist: 'Vina Pandu',
      bugHunter: 'Wahyu Ramadhan',
      presenter: 'Xenia Aurelia'
    }
  },
  {
    id: 7,
    series: 'helios',
    groupNumber: 7,
    title: 'Kelompok 7: Merah ➔ Kuning ➔ Biru',
    category: 'Sequence & Logic',
    difficulty: 'Dasar',
    assignedPins: { red: 6, yellow: 9, blue: 13 },
    colorSequence: ['Merah', 'Kuning', 'Biru'],
    story: 'Ketik kodingan Arduino Uno dari awal untuk mengontrol 3 lampu LED: Merah, Kuning, dan Biru.',
    mission: '1. Pasang kabel jumper: Merah ke Pin 6, Kuning ke Pin 9, Biru ke Pin 13.\n2. Tulis kodingan dari awal agar 3 lampu menyala berurutan: MERAH ➔ KUNING ➔ BIRU!',
    starterCode: BLANK_STARTER_CODE_3,
    solutionCode: `#define ledred 6
#define ledyellow 9
#define ledbiru 13

void setup() {
  pinMode(ledred, OUTPUT);
  pinMode(ledyellow, OUTPUT);
  pinMode(ledbiru, OUTPUT);
}

void loop() {
  digitalWrite(ledred, HIGH);
  delay(1000);
  digitalWrite(ledred, LOW);

  digitalWrite(ledyellow, HIGH);
  delay(1000);
  digitalWrite(ledyellow, LOW);

  digitalWrite(ledbiru, HIGH);
  delay(1000);
  digitalWrite(ledbiru, LOW);
}`,
    hints: [
      'Definisikan pin 3 LED: Merah 6, Kuning 9, Biru 13.',
      'Di void setup(), atur ketiga pin sebagai OUTPUT.',
      'Di void loop(), nyalakan dan matikan 3 lampu berurutan: Merah, Kuning, Biru.'
    ],
    successCriteria: [
      'Pin sesuai: Merah 6, Kuning 9, Biru 13.',
      'Urutan 3 lampu tepat: Merah ➔ Kuning ➔ Biru.'
    ],
    explanation: 'Kombinasi warna tri-LED (Merah, Kuning, Biru) melatih adaptasi siswa dalam pemilihan kabel dan nama variabel.',
    defaultStudents: {
      leadCoder: 'Yoga Pratama',
      wiringSpecialist: 'Zahra Annisa',
      bugHunter: 'Aldo Firmansyah',
      presenter: 'Bella Safitri'
    }
  },
  {
    id: 8,
    series: 'helios',
    groupNumber: 8,
    title: 'Kelompok 8: Kuning ➔ Biru ➔ Merah',
    category: 'Sequence & Logic',
    difficulty: 'Dasar',
    assignedPins: { yellow: 7, blue: 10, red: 2 },
    colorSequence: ['Kuning', 'Biru', 'Merah'],
    story: 'Ketik kodingan Arduino Uno dari awal untuk mengontrol 3 lampu LED: Kuning, Biru, dan Merah.',
    mission: '1. Pasang kabel jumper: Kuning ke Pin 7, Biru ke Pin 10, Merah ke Pin 2.\n2. Tulis kodingan dari awal agar 3 lampu menyala berurutan: KUNING ➔ BIRU ➔ MERAH!',
    starterCode: BLANK_STARTER_CODE_3,
    solutionCode: `#define ledkuning 7
#define ledbiru 10
#define ledmerah 2

void setup() {
  pinMode(ledkuning, OUTPUT);
  pinMode(ledbiru, OUTPUT);
  pinMode(ledmerah, OUTPUT);
}

void loop() {
  digitalWrite(ledkuning, HIGH);
  delay(1000);
  digitalWrite(ledkuning, LOW);

  digitalWrite(ledbiru, HIGH);
  delay(1000);
  digitalWrite(ledbiru, LOW);

  digitalWrite(ledmerah, HIGH);
  delay(1000);
  digitalWrite(ledmerah, LOW);
}`,
    hints: [
      'Definisikan pin 3 LED: Kuning 7, Biru 10, Merah 2.',
      'Di void setup(), atur ketiga pin sebagai OUTPUT.',
      'Di void loop(), urutkan 3 lampu: Kuning ➔ Biru ➔ Merah.'
    ],
    successCriteria: [
      'Pin sesuai: Kuning 7, Biru 10, Merah 2.',
      'Urutan 3 lampu tepat: Kuning ➔ Biru ➔ Merah.'
    ],
    explanation: 'Siklus 3 lampu dengan inisiasi lampu kuning disusul biru dan merah.',
    defaultStudents: {
      leadCoder: 'Chandra Wijaya',
      wiringSpecialist: 'Dewi Sartika',
      bugHunter: 'Erlangga Putra',
      presenter: 'Febriani Putri'
    }
  },
  {
    id: 9,
    series: 'helios',
    groupNumber: 9,
    title: 'Kelompok 9: Hijau ➔ Biru ➔ Kuning',
    category: 'Sequence & Logic',
    difficulty: 'Dasar',
    assignedPins: { green: 4, blue: 8, yellow: 12 },
    colorSequence: ['Hijau', 'Biru', 'Kuning'],
    story: 'Ketik kodingan Arduino Uno dari awal untuk mengontrol 3 lampu LED: Hijau, Biru, dan Kuning.',
    mission: '1. Pasang kabel jumper: Hijau ke Pin 4, Biru ke Pin 8, Kuning ke Pin 12.\n2. Tulis kodingan dari awal agar 3 lampu menyala berurutan: HIJAU ➔ BIRU ➔ KUNING!',
    starterCode: BLANK_STARTER_CODE_3,
    solutionCode: `#define ledhijau 4
#define ledbiru 8
#define ledkuning 12

void setup() {
  pinMode(ledhijau, OUTPUT);
  pinMode(ledbiru, OUTPUT);
  pinMode(ledkuning, OUTPUT);
}

void loop() {
  digitalWrite(ledhijau, HIGH);
  delay(1000);
  digitalWrite(ledhijau, LOW);

  digitalWrite(ledbiru, HIGH);
  delay(1000);
  digitalWrite(ledbiru, LOW);

  digitalWrite(ledkuning, HIGH);
  delay(1000);
  digitalWrite(ledkuning, LOW);
}`,
    hints: [
      'Definisikan pin 3 LED: Hijau 4, Biru 8, Kuning 12.',
      'Di void setup(), atur ketiga pin sebagai OUTPUT.',
      'Di void loop(), urutkan 3 lampu: Hijau ➔ Biru ➔ Kuning.'
    ],
    successCriteria: [
      'Pin sesuai: Hijau 4, Biru 8, Kuning 12.',
      'Urutan 3 lampu tepat: Hijau ➔ Biru ➔ Kuning.'
    ],
    explanation: 'Kombinasi warna tri-LED Hijau, Biru, dan Kuning memperkuat pemahaman logika sekuensial siswa.',
    defaultStudents: {
      leadCoder: 'Gilang Ramadhan',
      wiringSpecialist: 'Hesti Purwanti',
      bugHunter: 'Irfan Maulana',
      presenter: 'Jessica Tan'
    }
  },
  {
    id: 10,
    series: 'helios',
    groupNumber: 10,
    title: 'Kelompok 10: Biru ➔ Hijau ➔ Merah',
    category: 'Sequence & Logic',
    difficulty: 'Dasar',
    assignedPins: { blue: 5, green: 11, red: 8 },
    colorSequence: ['Biru', 'Hijau', 'Merah'],
    story: 'Ketik kodingan Arduino Uno dari awal untuk mengontrol 3 lampu LED: Biru, Hijau, dan Merah.',
    mission: '1. Pasang kabel jumper: Biru ke Pin 5, Hijau ke Pin 11, Merah ke Pin 8.\n2. Tulis kodingan dari awal agar 3 lampu menyala berurutan: BIRU ➔ HIJAU ➔ MERAH!',
    starterCode: BLANK_STARTER_CODE_3,
    solutionCode: `#define ledbiru 5
#define ledhijau 11
#define ledmerah 8

void setup() {
  pinMode(ledbiru, OUTPUT);
  pinMode(ledhijau, OUTPUT);
  pinMode(ledmerah, OUTPUT);
}

void loop() {
  digitalWrite(ledbiru, HIGH);
  delay(1000);
  digitalWrite(ledbiru, LOW);

  digitalWrite(ledhijau, HIGH);
  delay(1000);
  digitalWrite(ledhijau, LOW);

  digitalWrite(ledmerah, HIGH);
  delay(1000);
  digitalWrite(ledmerah, LOW);
}`,
    hints: [
      'Definisikan pin 3 LED: Biru 5, Hijau 11, Merah 8.',
      'Di void setup(), atur ketiga pin sebagai OUTPUT.',
      'Di void loop(), urutkan 3 lampu: Biru ➔ Hijau ➔ Merah.'
    ],
    successCriteria: [
      'Pin sesuai: Biru 5, Hijau 11, Merah 8.',
      'Urutan 3 lampu tepat: Biru ➔ Hijau ➔ Merah.'
    ],
    explanation: 'Urutan 3 lampu LED dengan inisiasi warna Biru, disusul Hijau dan Merah.',
    defaultStudents: {
      leadCoder: 'Kurniawan Dwi',
      wiringSpecialist: 'Lina Marlina',
      bugHunter: 'Mirza Syarif',
      presenter: 'Nurul Hidayah'
    }
  }
];

// SERI POLARIS (4 LED: Merah, Kuning, Hijau, Biru) - 10 Kelompok
export const POLARIS_CHALLENGES: GroupChallenge[] = [
  {
    id: 101,
    series: 'polaris',
    groupNumber: 1,
    title: 'Kelompok 1: Merah ➔ Kuning ➔ Hijau ➔ Biru',
    category: 'Sequence & Logic',
    difficulty: 'Menengah',
    assignedPins: { red: 2, yellow: 4, green: 7, blue: 11 },
    colorSequence: ['Merah', 'Kuning', 'Hijau', 'Biru'],
    story: 'Ketik kodingan Arduino Uno dari awal untuk 4 lampu LED (Merah, Kuning, Hijau, Biru) dengan urutan standar.',
    mission: '1. Pasang kabel jumper: Merah ke Pin 2, Kuning ke Pin 4, Hijau ke Pin 7, Biru ke Pin 11.\n2. Tulis kodingan dari awal agar menyala berurutan: MERAH ➔ KUNING ➔ HIJAU ➔ BIRU!',
    starterCode: BLANK_STARTER_CODE_4,
    solutionCode: `#define ledred 2
#define ledyellow 4
#define ledgreen 7
#define ledbiru 11

void setup() {
  pinMode(ledred, OUTPUT);
  pinMode(ledyellow, OUTPUT);
  pinMode(ledgreen, OUTPUT);
  pinMode(ledbiru, OUTPUT);
}

void loop() {
  digitalWrite(ledred, HIGH);
  delay(1000);
  digitalWrite(ledred, LOW);

  digitalWrite(ledyellow, HIGH);
  delay(1000);
  digitalWrite(ledyellow, LOW);

  digitalWrite(ledgreen, HIGH);
  delay(1000);
  digitalWrite(ledgreen, LOW);

  digitalWrite(ledbiru, HIGH);
  delay(1000);
  digitalWrite(ledbiru, LOW);
}`,
    hints: [
      'Gunakan 4 baris #define untuk Merah (2), Kuning (4), Hijau (7), Biru (11).',
      'Atur keempat pin sebagai OUTPUT di void setup().',
      'Nyalakan bergantian di void loop(): Merah, Kuning, Hijau, Biru.'
    ],
    successCriteria: [
      'Pin sesuai: Merah 2, Kuning 4, Hijau 7, Biru 11.',
      'Urutan nyala tepat: Merah ➔ Kuning ➔ Hijau ➔ Biru.'
    ],
    explanation: 'Pengendalian 4 aktuator LED sekaligus melatih manajemen I/O mikrokontroler.',
    defaultStudents: {
      leadCoder: 'Andi Firmansyah',
      wiringSpecialist: 'Bella Oktavia',
      bugHunter: 'Candra Kusuma',
      presenter: 'Dhea Ananda'
    }
  },
  {
    id: 102,
    series: 'polaris',
    groupNumber: 2,
    title: 'Kelompok 2: Merah ➔ Biru ➔ Hijau ➔ Kuning',
    category: 'Sequence & Logic',
    difficulty: 'Menengah',
    assignedPins: { red: 3, yellow: 6, green: 8, blue: 12 },
    colorSequence: ['Merah', 'Biru', 'Hijau', 'Kuning'],
    story: 'Ketik kodingan Arduino Uno dari awal untuk 4 lampu LED dengan urutan: Merah, Biru, Hijau, lalu Kuning.',
    mission: '1. Pasang kabel jumper: Merah ke Pin 3, Kuning ke Pin 6, Hijau ke Pin 8, Biru ke Pin 12.\n2. Tulis kodingan dari awal agar menyala berurutan: MERAH ➔ BIRU ➔ HIJAU ➔ KUNING!',
    starterCode: BLANK_STARTER_CODE_4,
    solutionCode: `#define ledred 3
#define ledyellow 6
#define ledgreen 8
#define ledbiru 12

void setup() {
  pinMode(ledred, OUTPUT);
  pinMode(ledyellow, OUTPUT);
  pinMode(ledgreen, OUTPUT);
  pinMode(ledbiru, OUTPUT);
}

void loop() {
  digitalWrite(ledred, HIGH);
  delay(1000);
  digitalWrite(ledred, LOW);

  digitalWrite(ledbiru, HIGH);
  delay(1000);
  digitalWrite(ledbiru, LOW);

  digitalWrite(ledgreen, HIGH);
  delay(1000);
  digitalWrite(ledgreen, LOW);

  digitalWrite(ledyellow, HIGH);
  delay(1000);
  digitalWrite(ledyellow, LOW);
}`,
    hints: [
      'Definisikan 4 pin: Merah 3, Kuning 6, Hijau 8, Biru 12.',
      'Urutkan fungsi digitalWrite: Merah, Biru, Hijau, Kuning.'
    ],
    successCriteria: [
      'Pin sesuai: Merah 3, Kuning 6, Hijau 8, Biru 12.',
      'Urutan nyala tepat: Merah ➔ Biru ➔ Hijau ➔ Kuning.'
    ],
    explanation: 'Urutan diselingi dengan lampu biru setelah lampu merah.',
    defaultStudents: {
      leadCoder: 'Erlan Syahputra',
      wiringSpecialist: 'Fanny Maharani',
      bugHunter: 'Galih Wicaksono',
      presenter: 'Hany Safitri'
    }
  },
  {
    id: 103,
    series: 'polaris',
    groupNumber: 3,
    title: 'Kelompok 3: Biru ➔ Merah ➔ Kuning ➔ Hijau',
    category: 'Sequence & Logic',
    difficulty: 'Menengah',
    assignedPins: { red: 9, yellow: 5, green: 2, blue: 7 },
    colorSequence: ['Biru', 'Merah', 'Kuning', 'Hijau'],
    story: 'Ketik kodingan Arduino Uno dari awal untuk 4 lampu LED diawali dari lampu Biru.',
    mission: '1. Pasang kabel jumper: Merah ke Pin 9, Kuning ke Pin 5, Hijau ke Pin 2, Biru ke Pin 7.\n2. Tulis kodingan dari awal agar menyala berurutan: BIRU ➔ MERAH ➔ KUNING ➔ HIJAU!',
    starterCode: BLANK_STARTER_CODE_4,
    solutionCode: `#define ledred 9
#define ledyellow 5
#define ledgreen 2
#define ledbiru 7

void setup() {
  pinMode(ledred, OUTPUT);
  pinMode(ledyellow, OUTPUT);
  pinMode(ledgreen, OUTPUT);
  pinMode(ledbiru, OUTPUT);
}

void loop() {
  digitalWrite(ledbiru, HIGH);
  delay(1000);
  digitalWrite(ledbiru, LOW);

  digitalWrite(ledred, HIGH);
  delay(1000);
  digitalWrite(ledred, LOW);

  digitalWrite(ledyellow, HIGH);
  delay(1000);
  digitalWrite(ledyellow, LOW);

  digitalWrite(ledgreen, HIGH);
  delay(1000);
  digitalWrite(ledgreen, LOW);
}`,
    hints: [
      'Definisikan 4 pin: Merah 9, Kuning 5, Hijau 2, Biru 7.',
      'Awali void loop() dengan menyalakan lampu Biru terlebih dahulu.'
    ],
    successCriteria: [
      'Pin sesuai: Merah 9, Kuning 5, Hijau 2, Biru 7.',
      'Urutan nyala tepat: Biru ➔ Merah ➔ Kuning ➔ Hijau.'
    ],
    explanation: 'Siklus dimulai dari port pin biru.',
    defaultStudents: {
      leadCoder: 'Ilham Akbar',
      wiringSpecialist: 'Jihan Kirana',
      bugHunter: 'Kemas Rahmat',
      presenter: 'Lala Salsabila'
    }
  },
  {
    id: 104,
    series: 'polaris',
    groupNumber: 4,
    title: 'Kelompok 4: Kuning ➔ Biru ➔ Hijau ➔ Merah',
    category: 'Sequence & Logic',
    difficulty: 'Menengah',
    assignedPins: { red: 4, yellow: 8, green: 10, blue: 13 },
    colorSequence: ['Kuning', 'Biru', 'Hijau', 'Merah'],
    story: 'Ketik kodingan Arduino Uno dari awal untuk 4 lampu LED dengan urutan: Kuning, Biru, Hijau, lalu Merah.',
    mission: '1. Pasang kabel jumper: Merah ke Pin 4, Kuning ke Pin 8, Hijau ke Pin 10, Biru ke Pin 13.\n2. Tulis kodingan dari awal agar menyala berurutan: KUNING ➔ BIRU ➔ HIJAU ➔ MERAH!',
    starterCode: BLANK_STARTER_CODE_4,
    solutionCode: `#define ledred 4
#define ledyellow 8
#define ledgreen 10
#define ledbiru 13

void setup() {
  pinMode(ledred, OUTPUT);
  pinMode(ledyellow, OUTPUT);
  pinMode(ledgreen, OUTPUT);
  pinMode(ledbiru, OUTPUT);
}

void loop() {
  digitalWrite(ledyellow, HIGH);
  delay(1000);
  digitalWrite(ledyellow, LOW);

  digitalWrite(ledbiru, HIGH);
  delay(1000);
  digitalWrite(ledbiru, LOW);

  digitalWrite(ledgreen, HIGH);
  delay(1000);
  digitalWrite(ledgreen, LOW);

  digitalWrite(ledred, HIGH);
  delay(1000);
  digitalWrite(ledred, LOW);
}`,
    hints: [
      'Definisikan pin: Merah 4, Kuning 8, Hijau 10, Biru 13.',
      'Urutan di void loop(): Kuning, Biru, Hijau, Merah.'
    ],
    successCriteria: [
      'Pin sesuai: Merah 4, Kuning 8, Hijau 10, Biru 13.',
      'Urutan nyala tepat: Kuning ➔ Biru ➔ Hijau ➔ Merah.'
    ],
    explanation: 'Urutan lampu Kuning, Biru, Hijau, Merah berjalan sekuensial.',
    defaultStudents: {
      leadCoder: 'Mahendra Putra',
      wiringSpecialist: 'Nindy Paramitha',
      bugHunter: 'Omar Syarief',
      presenter: 'Priska Wulandari'
    }
  },
  {
    id: 105,
    series: 'polaris',
    groupNumber: 5,
    title: 'Kelompok 5: Hijau ➔ Merah ➔ Biru ➔ Kuning',
    category: 'Sequence & Logic',
    difficulty: 'Menengah',
    assignedPins: { red: 11, yellow: 3, green: 6, blue: 9 },
    colorSequence: ['Hijau', 'Merah', 'Biru', 'Kuning'],
    story: 'Ketik kodingan Arduino Uno dari awal untuk 4 lampu LED diawali dari lampu Hijau.',
    mission: '1. Pasang kabel jumper: Merah ke Pin 11, Kuning ke Pin 3, Hijau ke Pin 6, Biru ke Pin 9.\n2. Tulis kodingan dari awal agar menyala berurutan: HIJAU ➔ MERAH ➔ BIRU ➔ KUNING!',
    starterCode: BLANK_STARTER_CODE_4,
    solutionCode: `#define ledred 11
#define ledyellow 3
#define ledgreen 6
#define ledbiru 9

void setup() {
  pinMode(ledred, OUTPUT);
  pinMode(ledyellow, OUTPUT);
  pinMode(ledgreen, OUTPUT);
  pinMode(ledbiru, OUTPUT);
}

void loop() {
  digitalWrite(ledgreen, HIGH);
  delay(1000);
  digitalWrite(ledgreen, LOW);

  digitalWrite(ledred, HIGH);
  delay(1000);
  digitalWrite(ledred, LOW);

  digitalWrite(ledbiru, HIGH);
  delay(1000);
  digitalWrite(ledbiru, LOW);

  digitalWrite(ledyellow, HIGH);
  delay(1000);
  digitalWrite(ledyellow, LOW);
}`,
    hints: [
      'Definisikan pin: Merah 11, Kuning 3, Hijau 6, Biru 9.',
      'Mulai urutan loop dari Hijau, lalu Merah, lalu Biru, lalu Kuning.'
    ],
    successCriteria: [
      'Pin sesuai: Merah 11, Kuning 3, Hijau 6, Biru 9.',
      'Urutan nyala tepat: Hijau ➔ Merah ➔ Biru ➔ Kuning.'
    ],
    explanation: 'Variasi sekuensial 4 LED dari hijau ke kuning.',
    defaultStudents: {
      leadCoder: 'Qosim Danu',
      wiringSpecialist: 'Risti Amelia',
      bugHunter: 'Surya Kencana',
      presenter: 'Tia Monica'
    }
  },
  {
    id: 106,
    series: 'polaris',
    groupNumber: 6,
    title: 'Kelompok 6: Biru ➔ Hijau ➔ Kuning ➔ Merah',
    category: 'Sequence & Logic',
    difficulty: 'Menengah',
    assignedPins: { red: 5, yellow: 12, green: 8, blue: 3 },
    colorSequence: ['Biru', 'Hijau', 'Kuning', 'Merah'],
    story: 'Ketik kodingan Arduino Uno dari awal untuk 4 lampu LED dengan urutan spektrum terbalik.',
    mission: '1. Pasang kabel jumper: Merah ke Pin 5, Kuning ke Pin 12, Hijau ke Pin 8, Biru ke Pin 3.\n2. Tulis kodingan dari awal agar menyala berurutan: BIRU ➔ HIJAU ➔ KUNING ➔ MERAH!',
    starterCode: BLANK_STARTER_CODE_4,
    solutionCode: `#define ledred 5
#define ledyellow 12
#define ledgreen 8
#define ledbiru 3

void setup() {
  pinMode(ledred, OUTPUT);
  pinMode(ledyellow, OUTPUT);
  pinMode(ledgreen, OUTPUT);
  pinMode(ledbiru, OUTPUT);
}

void loop() {
  digitalWrite(ledbiru, HIGH);
  delay(1000);
  digitalWrite(ledbiru, LOW);

  digitalWrite(ledgreen, HIGH);
  delay(1000);
  digitalWrite(ledgreen, LOW);

  digitalWrite(ledyellow, HIGH);
  delay(1000);
  digitalWrite(ledyellow, LOW);

  digitalWrite(ledred, HIGH);
  delay(1000);
  digitalWrite(ledred, LOW);
}`,
    hints: [
      'Definisikan pin: Merah 5, Kuning 12, Hijau 8, Biru 3.',
      'Urutan loop: Biru, Hijau, Kuning, Merah.'
    ],
    successCriteria: [
      'Pin sesuai: Merah 5, Kuning 12, Hijau 8, Biru 3.',
      'Urutan nyala tepat: Biru ➔ Hijau ➔ Kuning ➔ Merah.'
    ],
    explanation: 'Urutan terbalik dari spektrum cahaya tampak.',
    defaultStudents: {
      leadCoder: 'Utama Jaya',
      wiringSpecialist: 'Vivi Anggraini',
      bugHunter: 'Wildan Hakim',
      presenter: 'Xaverius Bimo'
    }
  },
  {
    id: 107,
    series: 'polaris',
    groupNumber: 7,
    title: 'Kelompok 7: Merah ➔ Hijau ➔ Kuning ➔ Biru',
    category: 'Sequence & Logic',
    difficulty: 'Menengah',
    assignedPins: { red: 6, yellow: 9, green: 13, blue: 4 },
    colorSequence: ['Merah', 'Hijau', 'Kuning', 'Biru'],
    story: 'Ketik kodingan Arduino Uno dari awal untuk 4 lampu LED dengan urutan Merah, Hijau, Kuning, lalu Biru.',
    mission: '1. Pasang kabel jumper: Merah ke Pin 6, Kuning ke Pin 9, Hijau ke Pin 13, Biru ke Pin 4.\n2. Tulis kodingan dari awal agar menyala berurutan: MERAH ➔ HIJAU ➔ KUNING ➔ BIRU!',
    starterCode: BLANK_STARTER_CODE_4,
    solutionCode: `#define ledred 6
#define ledyellow 9
#define ledgreen 13
#define ledbiru 4

void setup() {
  pinMode(ledred, OUTPUT);
  pinMode(ledyellow, OUTPUT);
  pinMode(ledgreen, OUTPUT);
  pinMode(ledbiru, OUTPUT);
}

void loop() {
  digitalWrite(ledred, HIGH);
  delay(1000);
  digitalWrite(ledred, LOW);

  digitalWrite(ledgreen, HIGH);
  delay(1000);
  digitalWrite(ledgreen, LOW);

  digitalWrite(ledyellow, HIGH);
  delay(1000);
  digitalWrite(ledyellow, LOW);

  digitalWrite(ledbiru, HIGH);
  delay(1000);
  digitalWrite(ledbiru, LOW);
}`,
    hints: [
      'Definisikan pin: Merah 6, Kuning 9, Hijau 13, Biru 4.',
      'Urutan loop: Merah, Hijau, Kuning, Biru.'
    ],
    successCriteria: [
      'Pin sesuai: Merah 6, Kuning 9, Hijau 13, Biru 4.',
      'Urutan nyala tepat: Merah ➔ Hijau ➔ Kuning ➔ Biru.'
    ],
    explanation: 'Urutan lampu dengan penempatan pin digital 4 untuk LED biru.',
    defaultStudents: {
      leadCoder: 'Yudi Hartono',
      wiringSpecialist: 'Zefanya Citra',
      bugHunter: 'Arga Permana',
      presenter: 'Bintang Kejora'
    }
  },
  {
    id: 108,
    series: 'polaris',
    groupNumber: 8,
    title: 'Kelompok 8: Hijau ➔ Kuning ➔ Biru ➔ Merah',
    category: 'Sequence & Logic',
    difficulty: 'Menengah',
    assignedPins: { red: 10, yellow: 7, green: 2, blue: 8 },
    colorSequence: ['Hijau', 'Kuning', 'Biru', 'Merah'],
    story: 'Ketik kodingan Arduino Uno dari awal untuk 4 lampu LED dengan urutan Hijau, Kuning, Biru, lalu Merah.',
    mission: '1. Pasang kabel jumper: Merah ke Pin 10, Kuning ke Pin 7, Hijau ke Pin 2, Biru ke Pin 8.\n2. Tulis kodingan dari awal agar menyala berurutan: HIJAU ➔ KUNING ➔ BIRU ➔ MERAH!',
    starterCode: BLANK_STARTER_CODE_4,
    solutionCode: `#define ledred 10
#define ledyellow 7
#define ledgreen 2
#define ledbiru 8

void setup() {
  pinMode(ledred, OUTPUT);
  pinMode(ledyellow, OUTPUT);
  pinMode(ledgreen, OUTPUT);
  pinMode(ledbiru, OUTPUT);
}

void loop() {
  digitalWrite(ledgreen, HIGH);
  delay(1000);
  digitalWrite(ledgreen, LOW);

  digitalWrite(ledyellow, HIGH);
  delay(1000);
  digitalWrite(ledyellow, LOW);

  digitalWrite(ledbiru, HIGH);
  delay(1000);
  digitalWrite(ledbiru, LOW);

  digitalWrite(ledred, HIGH);
  delay(1000);
  digitalWrite(ledred, LOW);
}`,
    hints: [
      'Definisikan pin: Merah 10, Kuning 7, Hijau 2, Biru 8.',
      'Urutan loop: Hijau, Kuning, Biru, Merah.'
    ],
    successCriteria: [
      'Pin sesuai: Merah 10, Kuning 7, Hijau 2, Biru 8.',
      'Urutan nyala tepat: Hijau ➔ Kuning ➔ Biru ➔ Merah.'
    ],
    explanation: 'Menyusun urutan transisi sekuensial 4 warna LED.',
    defaultStudents: {
      leadCoder: 'Cahyo Utomo',
      wiringSpecialist: 'Dara Jingga',
      bugHunter: 'Edi Santoso',
      presenter: 'Fitri Handayani'
    }
  },
  {
    id: 109,
    series: 'polaris',
    groupNumber: 9,
    title: 'Kelompok 9: Kuning ➔ Merah ➔ Biru ➔ Hijau',
    category: 'Sequence & Logic',
    difficulty: 'Menengah',
    assignedPins: { red: 12, yellow: 3, green: 9, blue: 5 },
    colorSequence: ['Kuning', 'Merah', 'Biru', 'Hijau'],
    story: 'Ketik kodingan Arduino Uno dari awal untuk 4 lampu LED dengan urutan Kuning, Merah, Biru, lalu Hijau.',
    mission: '1. Pasang kabel jumper: Merah ke Pin 12, Kuning ke Pin 3, Hijau ke Pin 9, Biru ke Pin 5.\n2. Tulis kodingan dari awal agar menyala berurutan: KUNING ➔ MERAH ➔ BIRU ➔ HIJAU!',
    starterCode: BLANK_STARTER_CODE_4,
    solutionCode: `#define ledred 12
#define ledyellow 3
#define ledgreen 9
#define ledbiru 5

void setup() {
  pinMode(ledred, OUTPUT);
  pinMode(ledyellow, OUTPUT);
  pinMode(ledgreen, OUTPUT);
  pinMode(ledbiru, OUTPUT);
}

void loop() {
  digitalWrite(ledyellow, HIGH);
  delay(1000);
  digitalWrite(ledyellow, LOW);

  digitalWrite(ledred, HIGH);
  delay(1000);
  digitalWrite(ledred, LOW);

  digitalWrite(ledbiru, HIGH);
  delay(1000);
  digitalWrite(ledbiru, LOW);

  digitalWrite(ledgreen, HIGH);
  delay(1000);
  digitalWrite(ledgreen, LOW);
}`,
    hints: [
      'Definisikan pin: Merah 12, Kuning 3, Hijau 9, Biru 5.',
      'Urutan loop: Kuning, Merah, Biru, Hijau.'
    ],
    successCriteria: [
      'Pin sesuai: Merah 12, Kuning 3, Hijau 9, Biru 5.',
      'Urutan nyala tepat: Kuning ➔ Merah ➔ Biru ➔ Hijau.'
    ],
    explanation: 'Urutan lampu Kuning, Merah, Biru, Hijau melatih ketelitian koding siswa.',
    defaultStudents: {
      leadCoder: 'Gatot Koco',
      wiringSpecialist: 'Helena Putri',
      bugHunter: 'Iskandar Muda',
      presenter: 'Jelita Sari'
    }
  },
  {
    id: 110,
    series: 'polaris',
    groupNumber: 10,
    title: 'Kelompok 10: Biru ➔ Kuning ➔ Merah ➔ Hijau',
    category: 'Sequence & Logic',
    difficulty: 'Menengah',
    assignedPins: { red: 8, yellow: 5, green: 11, blue: 6 },
    colorSequence: ['Biru', 'Kuning', 'Merah', 'Hijau'],
    story: 'Ketik kodingan Arduino Uno dari awal untuk 4 lampu LED dengan urutan Biru, Kuning, Merah, lalu Hijau.',
    mission: '1. Pasang kabel jumper: Merah ke Pin 8, Kuning ke Pin 5, Hijau ke Pin 11, Biru ke Pin 6.\n2. Tulis kodingan dari awal agar menyala berurutan: BIRU ➔ KUNING ➔ MERAH ➔ HIJAU!',
    starterCode: BLANK_STARTER_CODE_4,
    solutionCode: `#define ledred 8
#define ledyellow 5
#define ledgreen 11
#define ledbiru 6

void setup() {
  pinMode(ledred, OUTPUT);
  pinMode(ledyellow, OUTPUT);
  pinMode(ledgreen, OUTPUT);
  pinMode(ledbiru, OUTPUT);
}

void loop() {
  digitalWrite(ledbiru, HIGH);
  delay(1000);
  digitalWrite(ledbiru, LOW);

  digitalWrite(ledyellow, HIGH);
  delay(1000);
  digitalWrite(ledyellow, LOW);

  digitalWrite(ledred, HIGH);
  delay(1000);
  digitalWrite(ledred, LOW);

  digitalWrite(ledgreen, HIGH);
  delay(1000);
  digitalWrite(ledgreen, LOW);
}`,
    hints: [
      'Definisikan pin: Merah 8, Kuning 5, Hijau 11, Biru 6.',
      'Urutan loop: Biru, Kuning, Merah, Hijau.'
    ],
    successCriteria: [
      'Pin sesuai: Merah 8, Kuning 5, Hijau 11, Biru 6.',
      'Urutan nyala tepat: Biru ➔ Kuning ➔ Merah ➔ Hijau.'
    ],
    explanation: 'Urutan lampu 4 LED yang diawali dengan biru dan diakhiri dengan hijau.',
    defaultStudents: {
      leadCoder: 'Kresna Bayu',
      wiringSpecialist: 'Lestari Indah',
      bugHunter: 'Mario Teguh',
      presenter: 'Nadia Safira'
    }
  }
];

export const GROUP_CHALLENGES = HELIOS_CHALLENGES;
