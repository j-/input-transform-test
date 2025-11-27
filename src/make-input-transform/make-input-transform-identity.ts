import type { MakeInputTransformResult } from './types';

export const makeInputTransformIdentity = (): MakeInputTransformResult => ({
  applyTransform() {},
  handleBeforeInput() {},
  handleInput() {},
});
