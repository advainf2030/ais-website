/**
 * Splits a headline into animation units for <KineticHeadline>: whole words
 * (with the spaces kept as their own units) when `wordLevel` is set — needed
 * for Arabic, whose letters join and break apart if split — otherwise
 * grapheme clusters, so emoji and combining marks stay intact.
 */
export function splitUnits(text: string, wordLevel: boolean): string[] {
  if (wordLevel) {
    return text.split(/(\s+)/).filter((s) => s.length > 0);
  }
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    return Array.from(segmenter.segment(text), (s) => s.segment);
  }
  return Array.from(text);
}
