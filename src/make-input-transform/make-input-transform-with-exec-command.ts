import { COMMAND_INSERT_TEXT, PHASE_TARGET } from './constants';
import { makeInputTransformBase } from './make-input-transform-base';
import type {
  MakeInputTransformOptionsWithExecCommand,
  MakeInputTransformResult,
} from './types';

export const makeInputTransformWithExecCommand = ({
  transform,
  document = globalThis.document,
  execCommand = document.execCommand,
  selectWhenDropped = true,
  phase = PHASE_TARGET,
  enableHistory = true,
}: MakeInputTransformOptionsWithExecCommand): MakeInputTransformResult => (
  makeInputTransformBase({
    transform,
    selectWhenDropped,
    phase,
    enableHistory,
    setRangeText(value) {
      execCommand.call(document, COMMAND_INSERT_TEXT, false, value);
    },
  })
);
