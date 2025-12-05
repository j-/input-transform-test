import type { SyntheticEvent } from 'react';

export type StringTransform = (input: string) => string;

export type ExecCommand = (
  this: Document,
  commandId: string,
  showUI?: boolean | undefined,
  value?: string | undefined,
) => boolean;

export type MakeExecCommand = (
  activeElement?: Element | null,
  selectionMode?: SelectionMode,
) => ExecCommand;

export type MakeInputTransformOptionsWithoutExecCommand = {
  transform: StringTransform;
  selectWhenDropped?: boolean;
};

export type MakeInputTransformOptionsWithExecCommand = {
  transform: StringTransform;
  selectWhenDropped?: boolean;
  makeExecCommand?: MakeExecCommand;
};

export type MakeInputTransformOptions = {
  transform: StringTransform;
  selectWhenDropped?: boolean;
  makeExecCommand?: MakeExecCommand;
};

export type MakeInputTransformResult = {
  applyTransform(input: Pick<HTMLInputElement, 'value'>): void;
  handleBeforeInput(e: Event | SyntheticEvent): void;
  handleInput(e: Event | SyntheticEvent): void;
};
