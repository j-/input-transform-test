import { COMMAND_INSERT_TEXT } from './constants';
import {
  getEventInputData,
  isInputEvent,
  isInsertFromDropEvent,
  isInsertFromPasteEvent,
  isInsertReplacementTextEvent,
  isInsertTextEvent,
  isTextInputEvent,
  unwrapEvent,
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
    const transformedValue = transform(currentValue);
    if (transformedValue !== '' && transformedValue !== currentValue) {
      input.value = transformedValue;
    }
  },

  /**
   * Manipulates the data the customer has entered before it is
   * actually entered into the field by transforming/filtering
   * characters. Updates the caret position and selection range
   * accordingly.
   */
  handleBeforeInput(maybeSyntheticEvent) {
    const e = unwrapEvent(maybeSyntheticEvent);

    // Only handle these input types.
    if (
      // React "on input" event.
      isTextInputEvent(e) ||
      // Native "on input" events.
      isInsertTextEvent(e) ||
      isInsertFromPasteEvent(e) ||
      isInsertFromDropEvent(e)
    ) {
      const inputData = getEventInputData(e) ?? '';
      const transformedData = transform(inputData);

      // 'Before' and 'after' match, nothing to do. Exit early.
      if (transformedData === inputData) return;

      // Cancel the default insert.
      e.preventDefault();

      // Transformed data may be empty e.g. inserting a single disallowed char.
      // Ignore these inputs to prevent selected text from being deleted without
      // a clear reason.
      if (!transformedData) return;

      // Use execCommand to insert the transformed text. Preserves history stack.
      insertText(document, execCommand, transformedData);

      if (isInsertFromDropEvent(e) && selectWhenDropped) {
        const input = maybeSyntheticEvent.currentTarget as HTMLInputElement;
        const currentValue = input.value;
        
        const selectionEnd = input.selectionStart ?? currentValue.length;
        const selectionStart = selectionEnd - transformedData.length;

        input.setSelectionRange(selectionStart, selectionEnd);
      }
    }
  },

  handleInput(maybeSyntheticEvent) {
    const e = unwrapEvent(maybeSyntheticEvent);

    if (
      // Handle autocomplete events which trigger `input`
      // but are not actually of type `InputEvent`.
      (!isInputEvent(e) && !isTextInputEvent(e)) ||
      // Spell check will also trigger `input` event
      // without a corresponding `beforeinput` event.
      isInsertReplacementTextEvent(e)
    ) {
      const input = maybeSyntheticEvent.currentTarget as HTMLInputElement;
      const currentValue = input.value;
      const transformedValue = transform(currentValue);

      if (transformedValue !== currentValue) {
        // Use value assignment instead of execCommand to align
        // with Chrome's default behavior disallowing Cmd+Z when
        // the field has been autocompleted.
        input.value = transformedValue;
      }
    }
  },
});
