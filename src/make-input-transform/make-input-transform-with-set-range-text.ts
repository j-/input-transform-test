import { PHASE_TARGET } from './constants';
import { makeInputTransformBase } from './make-input-transform-base';
import type {
  MakeInputTransformOptionsWithSetRangeText,
  MakeInputTransformResult,
} from './types';

export const makeInputTransformWithSetRangeText = ({
  transform,
  selectWhenDropped = true,
  phase = PHASE_TARGET,
}: MakeInputTransformOptionsWithSetRangeText): MakeInputTransformResult => (
  makeInputTransformBase({
    transform,
    selectWhenDropped,
    phase,
    enableHistory: false,
    setRangeText(replacement, start, end, selectionMode) {
      this.setRangeText(replacement, start, end);

      const rangeLength = replacement.length;
      const rangeStart = start;
      const rangeEnd = start + rangeLength;

      switch (selectionMode) {
        case 'start':
          return this.setSelectionRange(rangeStart, rangeStart);
        case 'end':
          return this.setSelectionRange(rangeEnd, rangeEnd);
        case 'select':
          return this.setSelectionRange(rangeStart, rangeEnd);
      }
    },
  })
);
