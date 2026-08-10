import { Word, Level, PartOfSpeech } from '@/types/vocabulary';

/**
 * Parse a single CSV line respecting quoted fields (handles commas within quotes).
 * MED-3 fix: Replaces naive comma-split that broke on values like "Hola, ¿cómo estás?"
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && i + 1 < line.length && line[i + 1] === '"') {
        current += '"'; // escaped quote
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Parse CSV text string into validated internal Word objects
 */
export function parseVocabularyCSV(csvContent: string): { words: Word[]; errors: string[] } {
  const lines = csvContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const errors: string[] = [];
  const words: Word[] = [];

  if (lines.length === 0) {
    return { words: [], errors: ['CSV file is empty'] };
  }

  // Header line inspection
  const header = lines[0].toLowerCase().split(',').map((h) => h.trim());
  const expectedCols = ['id', 'spanish', 'english', 'level', 'partofspeech', 'imagequery'];

  // Basic header check
  const hasSpanish = header.includes('spanish');
  const hasEnglish = header.includes('english');

  if (!hasSpanish || !hasEnglish) {
    errors.push('CSV header must contain at least "spanish" and "english" columns.');
    return { words: [], errors };
  }

  const spanishIdx = header.indexOf('spanish');
  const englishIdx = header.indexOf('english');
  const levelIdx = header.indexOf('level');
  const posIdx = header.indexOf('partofspeech');
  const imageQueryIdx = header.indexOf('imagequery');
  const idIdx = header.indexOf('id');

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    // MED-3 fix: Proper CSV parser that handles commas inside quoted fields
    const cols = parseCSVLine(rawLine);

    if (cols.length < 2) continue;

    const spanish = cols[spanishIdx] || '';
    const english = cols[englishIdx] || '';

    if (!spanish || !english) {
      errors.push(`Line ${i + 1}: Missing required spanish or english value.`);
      continue;
    }

    const levelRaw = (levelIdx !== -1 ? cols[levelIdx] : 'A1').toUpperCase() as Level;
    const validLevels: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const level: Level = validLevels.includes(levelRaw) ? levelRaw : 'A1';

    const posRaw = (posIdx !== -1 ? cols[posIdx] : 'noun').toLowerCase() as PartOfSpeech;

    const imageQuery = imageQueryIdx !== -1 && cols[imageQueryIdx] ? cols[imageQueryIdx] : spanish;

    const id = idIdx !== -1 && cols[idIdx] ? parseInt(cols[idIdx], 10) || Date.now() + i : i;

    words.push({
      id,
      spanish,
      english,
      level,
      partOfSpeech: posRaw,
      imageQuery,
      image: {
        enabled: true,
        source: 'pexels',
        url: null,
        photographer: null,
        photographerUrl: null,
        pexelsUrl: null,
      },
    });
  }

  return { words, errors };
}

/**
 * Export vocabulary words back into standard CSV string
 */
export function exportVocabularyToCSV(words: Word[]): string {
  const header = 'id,spanish,english,level,partOfSpeech,imageQuery';
  const rows = words.map(
    (w) => `${w.id},"${w.spanish}","${w.english}",${w.level},${w.partOfSpeech},"${w.imageQuery}"`
  );

  return [header, ...rows].join('\n');
}
