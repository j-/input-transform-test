import {
  makeInputTransformWithExecCommand,
} from './make-input-transform-with-exec-command';
import {
  makeInputTransformWithoutExecCommand,
} from './make-input-transform-without-exec-command';
import type {
  MakeInputTransformResult,
  MakeInputTransformOptions,
  MakeInputTransformOptionsWithExecCommand as WithExecCommand,
  MakeInputTransformOptionsWithoutExecCommand as WithoutExecCommand,
} from './types';

export const makeInputTransform = (
  options: MakeInputTransformOptions
): MakeInputTransformResult => (
  typeof options.execCommand === 'function' ?
    makeInputTransformWithExecCommand(options as WithExecCommand) :
    makeInputTransformWithoutExecCommand(options as WithoutExecCommand)
);
