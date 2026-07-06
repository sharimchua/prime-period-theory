export interface ParsedSolfege {
  solfege: string;
  diacritic: string;
  superscriptStr?: string;
  superscript?: ParsedSolfege;
}

export interface ParsedToken {
  type: 'glyph' | 'padding' | 'hold';
  solfege?: string;
  diacritic?: string;
  octaveOffset?: number;
  modifiers?: ParsedToken[];
  paddingLength?: number;
  isImplicit?: boolean;
  raw?: string;
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

/**
 * Parses a raw phrase string into a structured array of ParsedTokens,
 * handling grid padding (.), strong beat holds (-), and chord modifiers ([...]).
 */
export function tokenizePhrase(text: string): ParsedToken[] {
  const results: ParsedToken[] = [];
  // Match things like: "..", "-", "Do", "[Ti, Re]", "[Me]"
  const regex = /(\.+)|(-)|(\[[^\]]+\])|([A-Za-z\^]+)/g;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    if (match[1]) { // padding
       results.push({ type: 'padding', paddingLength: match[1].length });
    } else if (match[2]) { // hold
       results.push({ type: 'hold' });
    } else if (match[3]) { // bracketed modifiers
       // attach to previous token if it's a glyph
       const prev = results[results.length - 1];
       if (prev && prev.type === 'glyph') {
          prev.modifiers = prev.modifiers || [];
          const inner = match[3].slice(1, -1); // remove [ ]
          const modStrs = inner.split(/[,\s]+/).filter(Boolean);
          for (const ms of modStrs) {
             if (isValidSolfegeToken(ms)) {
               const p = parseSolfegeToken(ms);
                let octaveOffset = 0;
                if (p.superscriptStr === 'Ra') octaveOffset = 1;
                if (p.superscriptStr === 'Ti') octaveOffset = -1;
                prev.modifiers.push({ type: 'glyph', solfege: p.solfege, diacritic: p.diacritic, octaveOffset, raw: ms });
             }
          }
       }
    } else if (match[4]) {
       if (isValidSolfegeToken(match[4])) {
          const p = parseSolfegeToken(match[4]);
          let octaveOffset = 0;
          if (p.superscriptStr === 'Ra') octaveOffset = 1;
          if (p.superscriptStr === 'Ti') octaveOffset = -1;
          results.push({ type: 'glyph', solfege: p.solfege, diacritic: p.diacritic, octaveOffset, modifiers: [], raw: match[4] });
       }
    }
  }
  return results;
}

const DESCENDING_FIFTHS = ['Li', 'Me', 'Le', 'Ra', 'Fi', 'Si', 'Mi', 'La', 'Re'];

/**
 * Expands a rhythmic shorthand (e.g. "Dox La") into its full explicitly required tokens (e.g. "Dox La Re So"),
 * marking the expanded tokens as implicit so the UI can render them muted.
 */
export function expandRhythmPhrase(tokens: ParsedToken[]): ParsedToken[] {
  if (tokens.length === 0) return tokens;
  
  const expanded: ParsedToken[] = [];
  
  // A simple pass: look for sequences of [Opener, Interior] where Opener is Dox/Dix
  // For Phase 1, we just do a basic expansion if the entire phrase is exactly 2 tokens 
  // (opener + interior) or if we encounter an opener+interior at the end.
  // We'll iterate through and rebuild.
  
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    
    // In Rhythm layer, Do or Di should automatically promote to Dox or Dix (axis diacritic)
    if (token.type === 'glyph' && (token.solfege === 'Do' || token.solfege === 'Di') && !token.diacritic) {
      token.diacritic = 'axis';
      token.raw = token.solfege + 'x';
    }
    
    expanded.push(token);
    
    // Check for shorthand block: Opener (Dox/Dix) followed by an interior token (not So).
    if (token.type === 'glyph' && (token.solfege === 'Do' || token.solfege === 'Di') && token.diacritic === 'axis') {
      const next = tokens[i + 1];
      if (next && next.type === 'glyph' && next.solfege !== 'So' && next.solfege !== 'Do' && next.solfege !== 'Di') {
        // It's a shorthand opener + interior. Expand it.
        expanded.push(next);
        i++; // skip next since we just pushed it
        
        // Now fill the descending fifths from `next.solfege` down to Re, then append So.
        const startIndex = DESCENDING_FIFTHS.indexOf(next.solfege || '');
        if (startIndex !== -1) {
          for (let j = startIndex + 1; j < DESCENDING_FIFTHS.length; j++) {
            const parsed = parseSolfegeToken(DESCENDING_FIFTHS[j]);
            expanded.push({ type: 'glyph', solfege: parsed.solfege, diacritic: parsed.diacritic, octaveOffset: 0, isImplicit: true, modifiers: [], raw: DESCENDING_FIFTHS[j] });
          }
        }
        // Append So
        expanded.push({ type: 'glyph', solfege: 'So', diacritic: '', octaveOffset: 0, isImplicit: true, modifiers: [], raw: 'So' });
      }
    }
  }
  
  return expanded;
}
