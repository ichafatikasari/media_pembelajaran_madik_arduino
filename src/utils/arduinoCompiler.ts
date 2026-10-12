import { CompileDiagnostic, SimulationStep, GroupChallenge } from '../types';

export interface ParseResult {
  isValid: boolean;
  diagnostics: CompileDiagnostic[];
  steps: SimulationStep[];
  rawOutput: string;
  detectedPins: {
    red: number;
    yellow: number;
    green: number;
    blue?: number;
  };
  detectedSequence: string[];
  simpleErrorNotes: string[];
}

export function compileArduinoCode(code: string, currentChallenge?: GroupChallenge): ParseResult {
  const diagnostics: CompileDiagnostic[] = [];
  const simpleErrorNotes: string[] = [];
  const lines = code.split('\n');

  let openBraces = 0;
  let openParen = 0;
  let hasSetup = false;
  let hasLoop = false;

  const defines: Record<string, number> = {};
  const isPolaris = currentChallenge?.series === 'polaris';
  const assigned = currentChallenge?.assignedPins;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const lineNum = i + 1;
    const codePart = rawLine.split('//')[0].trim();

    if (!codePart) continue;

    // Detect #define
    if (codePart.startsWith('#define')) {
      const defineMatch = codePart.match(/^#define\s+([a-zA-Z0-9_]+)\s+(\d+)/);
      if (defineMatch) {
        defines[defineMatch[1].toLowerCase()] = parseInt(defineMatch[2], 10);
        continue;
      }

      // Check if it's incomplete like `#define` or `#define ledmerah`
      if (/^#define\s*$/.test(codePart)) {
        // Just empty skeleton line - don't crash, will be reported in pin validation
        continue;
      } else {
        const msg = `Baris ${lineNum}: Format #define belum lengkap (contoh: #define ledmerah 3).`;
        diagnostics.push({ type: 'warning', line: lineNum, message: msg });
        simpleErrorNotes.push(msg);
        continue;
      }
    }

    if (codePart.includes('void setup()') || codePart.includes('void setup ()')) {
      hasSetup = true;
    }
    if (codePart.includes('void loop()') || codePart.includes('void loop ()')) {
      hasLoop = true;
    }

    // Count braces & parentheses
    for (const char of codePart) {
      if (char === '{') openBraces++;
      if (char === '}') openBraces--;
      if (char === '(') openParen++;
      if (char === ')') openParen--;
    }

    // Typo in digitalWrit
    if (/digitalWrit\b/.test(codePart) && !codePart.includes('digitalWrite')) {
      const msg = `Baris ${lineNum}: Salah ketik fungsi 'digitalWrit' (harus 'digitalWrite').`;
      diagnostics.push({ type: 'error', line: lineNum, message: msg });
      simpleErrorNotes.push(msg);
    }

    // Typo in pinMod
    if (/pinMod\b/.test(codePart) && !codePart.includes('pinMode')) {
      const msg = `Baris ${lineNum}: Salah ketik fungsi 'pinMod' (harus 'pinMode').`;
      diagnostics.push({ type: 'error', line: lineNum, message: msg });
      simpleErrorNotes.push(msg);
    }

    // Check pinMode INPUT on LED
    if (/pinMode\s*\([^,]+,\s*INPUT\s*\)/i.test(codePart)) {
      const msg = `Baris ${lineNum}: Mode pin salah (LED harus 'OUTPUT', bukan 'INPUT').`;
      diagnostics.push({ type: 'error', line: lineNum, message: msg });
      simpleErrorNotes.push(msg);
    }

    // Check missing semicolons
    const isStatement =
      codePart.startsWith('pinMode') ||
      codePart.startsWith('digitalWrite') ||
      codePart.startsWith('digitalWrit') ||
      codePart.startsWith('delay');

    if (isStatement) {
      if (!codePart.endsWith(';') && !codePart.endsWith('{')) {
        const msg = `Baris ${lineNum}: Kurang tanda titik koma (;) di akhir baris.`;
        diagnostics.push({ type: 'error', line: lineNum, message: msg });
        simpleErrorNotes.push(msg);
      }
    }
  }

  // Resolve pins flexible
  const definedKeys = Object.keys(defines);

  // Red finder
  let redPin: number | undefined;
  const redKey = definedKeys.find((k) => k.includes('red') || k.includes('merah'));
  if (redKey) {
    redPin = defines[redKey];
  } else if (assigned) {
    const match = definedKeys.find((k) => defines[k] === assigned.red);
    if (match) redPin = defines[match];
  }

  // Yellow finder
  let yellowPin: number | undefined;
  const yellowKey = definedKeys.find((k) => k.includes('yellow') || k.includes('kuning'));
  if (yellowKey) {
    yellowPin = defines[yellowKey];
  } else if (assigned) {
    const match = definedKeys.find((k) => defines[k] === assigned.yellow);
    if (match) yellowPin = defines[match];
  }

  // Green finder
  let greenPin: number | undefined;
  const greenKey = definedKeys.find((k) => k.includes('green') || k.includes('hijau'));
  if (greenKey) {
    greenPin = defines[greenKey];
  } else if (assigned) {
    const match = definedKeys.find((k) => defines[k] === assigned.green);
    if (match) greenPin = defines[match];
  }

  // Blue finder
  let bluePin: number | undefined;
  const blueKey = definedKeys.find((k) => k.includes('blue') || k.includes('biru'));
  if (blueKey) {
    bluePin = defines[blueKey];
  } else if (assigned?.blue) {
    const match = definedKeys.find((k) => defines[k] === assigned.blue);
    if (match) bluePin = defines[match];
  }

  // Validation messages for undefined pins based on what the current challenge assigns
  if (assigned) {
    if (assigned.red !== undefined && redPin === undefined) {
      simpleErrorNotes.push('Definisi pin Merah (#define ...) belum ditulis lengkap.');
    }
    if (assigned.yellow !== undefined && yellowPin === undefined) {
      simpleErrorNotes.push('Definisi pin Kuning (#define ...) belum ditulis lengkap.');
    }
    if (assigned.green !== undefined && greenPin === undefined) {
      simpleErrorNotes.push('Definisi pin Hijau (#define ...) belum ditulis lengkap.');
    }
    if (assigned.blue !== undefined && bluePin === undefined) {
      simpleErrorNotes.push('Definisi pin Biru (#define ...) belum ditulis lengkap.');
    }
  } else {
    if (redPin === undefined) simpleErrorNotes.push('Definisi pin Merah (#define ...) belum ditulis lengkap.');
    if (yellowPin === undefined) simpleErrorNotes.push('Definisi pin Kuning (#define ...) belum ditulis lengkap.');
    if (greenPin === undefined) simpleErrorNotes.push('Definisi pin Hijau (#define ...) belum ditulis lengkap.');
    if (isPolaris && bluePin === undefined) simpleErrorNotes.push('Definisi pin Biru (#define ...) belum ditulis lengkap.');
  }

  if (openBraces > 0) {
    simpleErrorNotes.push(`Struktur: Kurang tanda kurung kurawal penutup '}' pada fungsi setup() atau loop().`);
  } else if (openBraces < 0) {
    simpleErrorNotes.push(`Struktur: Tanda kurung kurawal penutup '}' berlebih.`);
  }

  if (openParen !== 0) {
    simpleErrorNotes.push(`Sintaks: Tanda kurung biasa '()' belum seimbang.`);
  }

  if (!hasSetup) {
    simpleErrorNotes.push(`Struktur: Fungsi void setup() { ... } belum dibuat.`);
  }
  if (!hasLoop) {
    simpleErrorNotes.push(`Struktur: Fungsi void loop() { ... } belum dibuat.`);
  }

  const detectedPins = {
    ...(redPin !== undefined ? { red: redPin } : {}),
    ...(yellowPin !== undefined ? { yellow: yellowPin } : {}),
    ...(greenPin !== undefined ? { green: greenPin } : {}),
    ...(bluePin !== undefined ? { blue: bluePin } : {})
  } as { red: number; yellow: number; green: number; blue?: number };

  const steps = parseSimulationSteps(code, defines, {
    red: redPin,
    yellow: yellowPin,
    green: greenPin,
    blue: bluePin
  }, isPolaris || assigned?.blue !== undefined);

  // Extract detected color sequence from the simulation steps
  const detectedSequence: string[] = [];
  let lastColor = '';
  for (const step of steps) {
    let colorName = '';
    if (step.ledRed && !step.ledYellow && !step.ledGreen && !step.ledBlue) colorName = 'Merah';
    else if (step.ledYellow && !step.ledRed && !step.ledGreen && !step.ledBlue) colorName = 'Kuning';
    else if (step.ledGreen && !step.ledRed && !step.ledYellow && !step.ledBlue) colorName = 'Hijau';
    else if (step.ledBlue && !step.ledRed && !step.ledYellow && !step.ledGreen) colorName = 'Biru';

    if (colorName && colorName !== lastColor) {
      detectedSequence.push(colorName);
      lastColor = colorName;
    }
  }

  // VALIDASI TANTANGAN KELOMPOK
  if (currentChallenge) {
    const assignedPins = currentChallenge.assignedPins;
    const targetSeq = currentChallenge.colorSequence;

    // 1. Cek kecocokan pin
    const pinMatches =
      (assignedPins.red === undefined || detectedPins.red === assignedPins.red) &&
      (assignedPins.yellow === undefined || detectedPins.yellow === assignedPins.yellow) &&
      (assignedPins.green === undefined || detectedPins.green === assignedPins.green) &&
      (assignedPins.blue === undefined || detectedPins.blue === assignedPins.blue);

    const allDefined =
      (assignedPins.red === undefined || redPin !== undefined) &&
      (assignedPins.yellow === undefined || yellowPin !== undefined) &&
      (assignedPins.green === undefined || greenPin !== undefined) &&
      (assignedPins.blue === undefined || bluePin !== undefined);

    if (!pinMatches && allDefined) {
      const parts: string[] = [];
      if (assignedPins.red !== undefined) parts.push(`Merah ${assignedPins.red}`);
      if (assignedPins.yellow !== undefined) parts.push(`Kuning ${assignedPins.yellow}`);
      if (assignedPins.green !== undefined) parts.push(`Hijau ${assignedPins.green}`);
      if (assignedPins.blue !== undefined) parts.push(`Biru ${assignedPins.blue}`);

      simpleErrorNotes.push(`Pin #define belum sesuai target (Harusnya: ${parts.join(', ')}).`);
    }

    // 2. Cek urutan nyala lampu (Color Sequence)
    if (detectedSequence.length === 0) {
      if (hasLoop && openBraces === 0) {
        simpleErrorNotes.push('Belum ada perintah menyalakan lampu (digitalWrite HIGH) di void loop().');
      }
    } else {
      // Bandingkan urutan warna
      const matchesSeq =
        detectedSequence.length >= targetSeq.length &&
        targetSeq.every((color, idx) => detectedSequence[idx] === color);

      if (!matchesSeq) {
        simpleErrorNotes.push(
          `Urutan nyala lampu belum tepat (Kodingan Anda: ${detectedSequence.join(' ➔ ')} | Target: ${targetSeq.join(' ➔ ')}).`
        );
      }
    }
  }

  const isValidSyntax = diagnostics.filter((d) => d.type === 'error').length === 0;
  const isChallengePassed = simpleErrorNotes.length === 0;

  const rawOutput = isChallengePassed
    ? `Done compiling!\nUkuran sketch: 928 bytes.\nSintaks valid, pin tepat, dan urutan nyala lampu sesuai!`
    : simpleErrorNotes.join('\n');

  return {
    isValid: isValidSyntax,
    diagnostics,
    steps,
    rawOutput,
    detectedPins,
    detectedSequence,
    simpleErrorNotes
  };
}

function parseSimulationSteps(
  code: string,
  defines: Record<string, number>,
  resolved: { red?: number; yellow?: number; green?: number; blue?: number },
  isPolaris: boolean = false
): SimulationStep[] {
  const steps: SimulationStep[] = [];
  let r = false;
  let y = false;
  let g = false;
  let b = false;

  const redPin = resolved.red ?? 2;
  const yellowPin = resolved.yellow ?? 4;
  const greenPin = resolved.green ?? 7;
  const bluePin = resolved.blue ?? 11;

  const loopMatch = code.match(/void\s+loop\s*\(\s*\)\s*\{([\s\S]*)\}/);
  if (!loopMatch) {
    return [];
  }

  const loopCode = loopMatch[1];
  const lines = loopCode.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i].split('//')[0].trim();
    if (!raw) continue;

    const dwMatch = raw.match(/digitalWrite\s*\(\s*([a-zA-Z0-9_]+)\s*,\s*(HIGH|LOW)\s*\)/i);
    if (dwMatch) {
      const pinName = dwMatch[1].toLowerCase();
      const state = dwMatch[2].toUpperCase() === 'HIGH';

      // Check pinName mapping
      const val = defines[pinName];

      const isMatchRed =
        pinName.includes('red') ||
        pinName.includes('merah') ||
        pinName === String(redPin) ||
        (val !== undefined && val === redPin);

      const isMatchYellow =
        pinName.includes('yellow') ||
        pinName.includes('kuning') ||
        pinName === String(yellowPin) ||
        (val !== undefined && val === yellowPin);

      const isMatchGreen =
        pinName.includes('green') ||
        pinName.includes('hijau') ||
        pinName === String(greenPin) ||
        (val !== undefined && val === greenPin);

      const isMatchBlue =
        pinName.includes('blue') ||
        pinName.includes('biru') ||
        pinName === String(bluePin) ||
        (val !== undefined && val === bluePin);

      if (isMatchRed) r = state;
      else if (isMatchYellow) y = state;
      else if (isMatchGreen) g = state;
      else if (isMatchBlue) b = state;
    }

    const delayMatch = raw.match(/delay\s*\(\s*(\d+)\s*\)/i);
    if (delayMatch) {
      const duration = parseInt(delayMatch[1], 10);
      steps.push({
        ledRed: r,
        ledYellow: y,
        ledGreen: g,
        ...(isPolaris ? { ledBlue: b } : {}),
        durationMs: Math.max(150, Math.min(duration, 10000)),
        description: getStepDescription(r, y, g, isPolaris ? b : false, duration)
      });
    }
  }

  return steps;
}

function getStepDescription(r: boolean, y: boolean, g: boolean, b: boolean, dur: number): string {
  const parts: string[] = [];
  if (r) parts.push('Merah');
  if (y) parts.push('Kuning');
  if (g) parts.push('Hijau');
  if (b) parts.push('Biru');
  if (parts.length === 0) parts.push('Padam');

  return `${parts.join(' + ')} (${(dur / 1000).toFixed(1)}s)`;
}
