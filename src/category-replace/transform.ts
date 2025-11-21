import type { StringTransform } from '../make-input-transform';

export const transform: StringTransform = (str: string) =>
  str
    .toUpperCase()
    // Remove diacritic marks.
    .normalize('NFD')
    // Normalize various forms of quotes.
    .replace(/["`\u2018\u2019]/g, "'")
    // Remove everything but letters, spaces, and quotes.
    .replace(/[^A-Z ']/g, '');
