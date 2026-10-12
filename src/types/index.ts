export type Difficulty = 'Dasar' | 'Menengah' | 'Menantang';
export type ChallengeCategory = 'Sequence & Logic' | 'Syntax Debug' | 'Timing & Delay' | 'Hardware-Software';
export type ModuleSeries = 'helios' | 'polaris'; // helios = 3 LED, polaris = 4 LED

export interface AssignedPins {
  red?: number;
  yellow?: number;
  green?: number;
  blue?: number;
}

export interface StudentRole {
  role: string;
  duty: string;
  defaultName: string;
}

export interface GroupChallenge {
  id: number;
  series: ModuleSeries;
  groupNumber: number;
  title: string;
  category: ChallengeCategory;
  difficulty: Difficulty;
  story: string;
  mission: string;
  assignedPins: AssignedPins;
  colorSequence: ('Merah' | 'Kuning' | 'Hijau' | 'Biru')[];
  starterCode: string;
  solutionCode: string;
  hints: string[];
  successCriteria: string[];
  explanation: string;
  defaultStudents: {
    leadCoder: string;
    wiringSpecialist: string;
    bugHunter: string;
    presenter: string;
  };
}

export interface CompileDiagnostic {
  type: 'error' | 'warning' | 'success';
  line?: number;
  column?: number;
  message: string;
  snippet?: string;
}

export interface SimulationStep {
  ledRed: boolean;
  ledYellow: boolean;
  ledGreen: boolean;
  ledBlue?: boolean;
  durationMs: number;
  description: string;
}

export interface GroupEvaluation {
  groupNumber: number;
  groupName: string;
  students: {
    leadCoder: string;
    wiringSpecialist: string;
    bugHunter: string;
    presenter: string;
  };
  wiringScore: number;
  codingScore: number;
  functionScore: number;
  teamworkScore: number;
  notes: string;
  status: 'Lulus' | 'Revisi' | 'Belum Dinilai';
  completedAt?: string;
}
