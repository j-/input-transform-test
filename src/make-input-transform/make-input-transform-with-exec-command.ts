import { COMMAND_INSERT_TEXT } from './constants';
import {
  getInputEventInputData,
  isInputEvent,
  isInsertFromDropEvent,
  isInsertFromPasteEvent,
  isInsertTextEvent,
} from './event';
import type {
  MakeInputTransformOptionsWithExecCommand,
  MakeInputTransformResult,
} from './types';

const insertText = (
  document: Document,
  execCommand: Document['execCommand'],
  value: string,
) => (
  execCommand.call(document, COMMAND_INSERT_TEXT, false, value)
);

export const makeInputTransformWithExecCommand = ({
  transform,
  document = globalThis.document,
  execCommand = document.execCommand,
  selectWhenDropped = true,
}: MakeInputTransformOptionsWithExecCommand): MakeInputTransformResult => ({
  applyTransform(input) {
    const currentValue = input.value;
    const transformed = transform(currentValue);
    if (transformed !== '' && transformed !== currentValue) {
      input.value = transformed;
    }
  },

  /**
   * Manipulates the data the customer has entered before it is
   * actually entered into the field by transforming/filtering
   * characters. Updates the caret position and selection range
   * accordingly.
   */
  handleBeforeInput(e) {
    // Only handle these input types.
    if (
      isInsertTextEvent(e) ||
      isInsertFromPasteEvent(e) ||
      isInsertFromDropEvent(e)
    ) {
      const eventData = getInputEventInputData(e);
      const transformed = transform(eventData);

      // 'Before' and 'after' match, nothing to do. Exit early.
      if (transformed === eventData) return;

      // Cancel the default insert.
      e.preventDefault();

      // Transformed data may be empty e.g. inserting a single disallowed char.
      // Ignore these inputs to prevent selected text from being deleted without
      // a clear reason.
      if (!transformed) return;

      // Use execCommand to insert the transformed text. Preserves history stack.
      insertText(document, execCommand, transformed);

      if (isInsertFromDropEvent(e) && selectWhenDropped) {
        const input = e.currentTarget as HTMLInputElement;
        const currentValue = input.value;
        
        const selectionEnd = input.selectionStart ?? currentValue.length;
        const selectionStart = selectionEnd - transformed.length;

        input.setSelectionRange(selectionStart, selectionEnd);
      }
    }
  },

  handleInput(e) {
    // Handle autocomplete events which trigger `input`
    // but are not actually of type `InputEvent`.
    // Just performs a naiive transform.
    if (!isInputEvent(e)) {
      const input = e.currentTarget as HTMLInputElement;
      const currentValue = input.value;
      const transformed = transform(currentValue);

      if (transformed !== currentValue) {
        input.value = transformed;
      }
    }
  },
});
