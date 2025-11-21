import type { StringTransform } from '../make-input-transform';

export const transform: StringTransform = (str: string) =>
  str.replace(/\D/g, '');
