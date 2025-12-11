import { PHASE_TARGET } from './constants';
import { makeInputTransformWithExecCommand } from './make-input-transform-with-exec-command';
import type {
  MakeInputTransformOptionsWithoutExecCommand,
  MakeInputTransformResult,
} from './types';

export const makeInputTransformWithoutExecCommand = ({
  transform,
  selectWhenDropped = true,
  phase = PHASE_TARGET,
}: MakeInputTransformOptionsWithoutExecCommand): MakeInputTransformResult => (
  makeInputTransformWithExecCommand({
    transform,
    selectWhenDropped,
    execCommand: document.execCommand,
    phase,
    enableHistory: false,
    setRangeText(_document, _execCommand, input, value, selectionMode) {
      const inputValueLength = input.value.length;
      const selectionStart = input.selectionStart ?? inputValueLength;
      const selectionEnd = input.selectionEnd ?? inputValueLength;

      input.setRangeText(
        value,
        selectionStart,
        selectionEnd,
      );

      const rangeLength = value.length;

      switch (selectionMode) {
        case 'start':
          input.setSelectionRange(
            selectionStart,
            selectionStart,
          );
          break;

        case 'end':
          input.setSelectionRange(
            selectionStart + rangeLength,
            selectionStart + rangeLength,
          );
          break;

        case 'select':
          input.setSelectionRange(
            selectionStart,
            selectionStart + rangeLength,
          );
          break;
      }
    },
  })
);
