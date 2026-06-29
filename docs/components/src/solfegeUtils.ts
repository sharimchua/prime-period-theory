export interface ParsedSolfege {
  solfege: string;
  diacritic: string;
  superscriptStr?: string;
  superscript?: ParsedSolfege;
}

const DIACRITIC_SUFFIX_MAP: Record<string, string> = {
  'Sub': 'w_tri',
  'HalfSub': 'w_dutri',
  'HalfSup': 'd_dutri',
  'Sup': 'd_tri',
  'Axis': 'axis',
  'x': 'axis'
};

// The set of lowercase base syllables that have a known glyph.
// Se and Si are PPT-specific variants of Te and Ti, used to avoid the
// dental consonant T outside of Do/Di (which serve as accent markers in
// Rhythmic Grammar). This deviates from standard moveable-do convention.
export const KNOWN_SYLLABLES = new Set([
  'do', 'di',         // 1/1 — origin / raised-Do enharmonic
  'ra', 're', 'ri',   // seconds (3-prime)
  'me', 'mi',         // thirds (5-prime)
  'fa', 'fi',         // fourth / tritone
  'so',               // fifth (3-prime)
  'le', 'la',         // sixths (5-prime)
  'te', 'se',         // sevenths (7-prime) — Se is Te variant
  'ti', 'si'          // leading tone (7-prime) — Si is Ti variant
]);

// Valid base solfege tokens: first character MUST be uppercase, second lowercase.
const VALID_BASE_RE = /^[A-Z][a-z]/;

/**
 * Returns true if the token string would resolve to a known glyph.
 * Used to decide whether to render a glyph or fall back to raw text.
 */
export function isValidSolfegeToken(tokenStr: string): boolean {
  if (!tokenStr) return false;
  const mainPart = tokenStr.split('^')[0];
  if (mainPart.length < 2 || !VALID_BASE_RE.test(mainPart)) return false;
  const base = mainPart.substring(0, 2).toLowerCase();
  return KNOWN_SYLLABLES.has(base);
}

export function parseSolfegeToken(tokenStr: string): ParsedSolfege {
  if (!tokenStr) return { solfege: 'Do', diacritic: '' };

  const parts = tokenStr.split('^');
  const mainPart = parts[0];

  let solfege = 'Do'; // Default fallback for any invalid token
  let diacritic = '';

  // Base solfege is always the first 2 characters with strict casing: [A-Z][a-z].
  // Tokens that do not start with an uppercase letter followed by a lowercase letter
  // (e.g. all-lowercase "do", "re") are invalid and fall back to "Do".
  if (mainPart.length >= 2 && VALID_BASE_RE.test(mainPart)) {
    const possibleBase = mainPart.substring(0, 2);
    solfege = possibleBase;
    const suffix = mainPart.substring(2);
    if (suffix && DIACRITIC_SUFFIX_MAP[suffix]) {
      diacritic = DIACRITIC_SUFFIX_MAP[suffix];
    }
  }

  const result: ParsedSolfege = { solfege, diacritic };

  if (parts.length > 1 && parts[1]) {
    result.superscriptStr = parts.slice(1).join('^');
    result.superscript = parseSolfegeToken(result.superscriptStr);
  }

  return result;
}
