import type { SyntheticEvent } from 'react';
import type { PHASE_BUBBLE, PHASE_CAPTURE, PHASE_TARGET } from './constants';

export type TargetPhase = typeof PHASE_TARGET;
export type NonTargetPhase = typeof PHASE_CAPTURE | typeof PHASE_BUBBLE;
export type EventPhase = TargetPhase | NonTargetPhase;

export type StringTransform = (input: string) => string;

export type ExecCommand = (
  this: Document,
  commandId: string,
  showUI?: boolean | undefined,
  value?: string | undefined,
) => boolean;

export type SetRangeText = (
  this: HTMLInputElement,
  replacement: string,
  start: number,
  end: number,
  selectionMode?: SelectionMode,
) => void;

export type MakeInputTransformOptionsBase = {
  transform: StringTransform;
  selectWhenDropped?: boolean;
  phase?: EventPhase;
  enableHistory?: boolean;
  setRangeText: SetRangeText;
};

export type MakeInputTransformOptionsWithSetRangeText = {
  transform: StringTransform;
  selectWhenDropped?: boolean;
  phase?: EventPhase;
};

export type MakeInputTransformOptionsWithExecCommand = {
  transform: StringTransform;
  selectWhenDropped?: boolean;
  execCommand: ExecCommand;
  document?: Document;
  phase?: EventPhase;
  enableHistory?: boolean;
  setRangeText?: SetRangeText;
};

export type MakeInputTransformOptions = {
  transform: StringTransform;
  selectWhenDropped?: boolean;
  execCommand?: ExecCommand | null;
  document?: Document;
  phase?: EventPhase;
  setRangeText?: SetRangeText;
};

export type MakeInputTransformResult = {
  applyTransform(input: Pick<HTMLInputElement, 'value'>): void;
  handleBeforeInput(e: Event | SyntheticEvent): void;
  handleInput(e: Event | SyntheticEvent): void;
};
