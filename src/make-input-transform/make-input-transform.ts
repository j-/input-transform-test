import {
  makeInputTransformWithExecCommand,
} from './make-input-transform-with-exec-command';
import {
  makeInputTransformWithSetRangeText,
} from './make-input-transform-with-set-range-text';
import type {
  MakeInputTransformResult,
  MakeInputTransformOptions,
  MakeInputTransformOptionsWithExecCommand as WithExecCommand,
  MakeInputTransformOptionsWithSetRangeText as WithSetRangeText,
} from './types';

export const makeInputTransform = (
  options: MakeInputTransformOptions
): MakeInputTransformResult => (
  typeof options.execCommand === 'function' ?
    makeInputTransformWithExecCommand(options as WithExecCommand) :
    makeInputTransformWithSetRangeText(options as WithSetRangeText)
);
