import { assert } from './assert';
import { COMMAND_INSERT_TEXT, PHASE_TARGET } from './constants';
import { debugEvent } from './debug';
import {
  getEventInputData,
  isInsertFromDropEvent,
  isInsertFromPasteEvent,
  isInsertTextEvent,
  isTextInputEvent,
  unwrapEvent,
} from './event';
import { getEventTarget } from './get-event-target';
import type {
  ExecCommand,
  MakeInputTransformOptionsWithExecCommand,
  MakeInputTransformResult,
} from './types';

const insertText = (
  document: Document,
  execCommand: ExecCommand,
  value: string,
) => (
  execCommand.call(document, COMMAND_INSERT_TEXT, false, value)
);

export const makeInputTransformWithExecCommand = ({
  transform,
  document = globalThis.document,
  execCommand = document.execCommand,
  selectWhenDropped = true,
  phase = PHASE_TARGET,
}: MakeInputTransformOptionsWithExecCommand): MakeInputTransformResult => ({
  applyTransform(input) {
    const currentValue = input.value;
    const transformedValue = transform(currentValue);
    if (transformedValue !== currentValue) {
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
    debugEvent(maybeSyntheticEvent);
    
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
        const input = getEventTarget(maybeSyntheticEvent, phase);
        assert(
          input instanceof HTMLInputElement,
          'Expected event to have target.',
        );

        const currentValue = input.value;
        
        const selectionEnd = input.selectionStart ?? currentValue.length;
        const selectionStart = selectionEnd - transformedData.length;

        input.setSelectionRange(selectionStart, selectionEnd);
      }
    }
  },

  /** Fallback to ensure input is transformed even if previous step fails. */
  handleInput(maybeSyntheticEvent) {
    debugEvent(maybeSyntheticEvent);

    const input = getEventTarget(maybeSyntheticEvent, phase);
    assert(
      input instanceof HTMLInputElement,
      'Expected event to have target.',
    );

    const currentValue = input.value;
    const transformedValue = transform(currentValue);

    if (transformedValue !== currentValue) {
      input.value = transformedValue;
    }
  },
});
