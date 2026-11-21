/**
 * Unicode-aware grapheme splitter for Spanish and multilingual typography.
 * Ensures combining diacritics (acute accents, tildes, umlauts) remain
 * intact with their parent letter as single atomic grapheme clusters.
 */
export function splitGraphemes(text) {
  if (!text) return [];
  const normalized = text.normalize('NFC');
  
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    try {
      const segmenter = new Intl.Segmenter('es', { granularity: 'grapheme' });
      return Array.from(segmenter.segment(normalized), (s) => s.segment);
    } catch {
      // Fallback if locale or Intl.Segmenter fails
    }
  }

  // Fallback regex matching letters + optional combining marks
  return Array.from(normalized);
}

/**
 * Normalizes text to Unicode NFC (canonical decomposition followed by canonical composition).
 */
export function normalizeSpanish(text) {
  return typeof text === 'string' ? text.normalize('NFC') : text;
}
