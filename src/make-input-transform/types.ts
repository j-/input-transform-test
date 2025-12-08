import type { SyntheticEvent } from 'react';
import type { PHASE_BUBBLE, PHASE_CAPTURE, PHASE_TARGET } from './constants';

export type TargetPhase = typeof PHASE_TARGET;
export type NonTargetPhase = typeof PHASE_CAPTURE | typeof PHASE_BUBBLE;
export type EventPhase = TargetPhase | NonTargetPhase;

export type StringTransform = (input: string) => string;

export type MakeInputTransformOptionsWithoutExecCommand = {
  transform: StringTransform;
  selectWhenDropped?: boolean;
  phase?: EventPhase;
};

export type MakeInputTransformOptionsWithExecCommand = {
  transform: StringTransform;
  selectWhenDropped?: boolean;
  execCommand: Document['execCommand'];
  document?: Document;
  phase?: EventPhase;
};

export type MakeInputTransformOptions = {
  transform: StringTransform;
  selectWhenDropped?: boolean;
  execCommand?: Document['execCommand'] | null;
  document?: Document;
  phase?: EventPhase;
};

export type MakeInputTransformResult = {
  applyTransform(input: Pick<HTMLInputElement, 'value'>): void;
  handleBeforeInput(e: Event | SyntheticEvent): void;
  handleInput(e: Event | SyntheticEvent): void;
};
