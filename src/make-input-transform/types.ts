import type { SyntheticEvent } from "react";

export type StringTransform = (input: string) => string;

export type MakeInputTransformOptionsWithoutExecCommand = {
  transform: StringTransform;
  selectWhenDropped?: boolean;
};

export type MakeInputTransformOptionsWithExecCommand = {
  transform: StringTransform;
  selectWhenDropped?: boolean;
  execCommand: Document['execCommand'];
  document?: Document;
};

export type MakeInputTransformOptions = {
  transform: StringTransform;
  selectWhenDropped?: boolean;
  execCommand?: Document['execCommand'] | null;
  document?: Document;
};

export type MakeInputTransformResult = {
  applyTransform(input: Pick<HTMLInputElement, 'value'>): void;
  handleBeforeInput(e: Event | SyntheticEvent): void;
  handleInput(e: Event | SyntheticEvent): void;
};
