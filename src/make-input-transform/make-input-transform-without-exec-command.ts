import { makeExecCommandShim } from './exec-command';
import {
  makeInputTransformWithExecCommand,
} from './make-input-transform-with-exec-command';
import type {
  MakeInputTransformOptionsWithoutExecCommand,
  MakeInputTransformResult,
} from './types';

export const makeInputTransformWithoutExecCommand = ({
  transform,
  selectWhenDropped = true,
}: MakeInputTransformOptionsWithoutExecCommand): MakeInputTransformResult => (
  makeInputTransformWithExecCommand({
    transform,
    selectWhenDropped,
    makeExecCommand: makeExecCommandShim,
  })
);
