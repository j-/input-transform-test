import { assert } from './assert';
import { COMMAND_INSERT_TEXT, PHASE_TARGET } from './constants';
import {
  getEventInputData,
  isHistoryEvent,
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
  enableHistory = true,
  setRangeText = (
    document,
    execCommand,
    _input,
    value,
    _selectionMode,
  ) => {
    insertText(document, execCommand, value);
  },
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
    const e = unwrapEvent(maybeSyntheticEvent);

    // Exit early if history is disabled.
    if (!enableHistory && isHistoryEvent(e)) {
      e.preventDefault();
      return;
    }

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

      const input = getEventTarget(maybeSyntheticEvent, 'target');
      assert(
        input instanceof HTMLInputElement,
        'Expected event to have target.',
      );

      const selectionMode =
        isInsertFromDropEvent(e) && selectWhenDropped ? 'select' : 'end';
      
      setRangeText(
        document,
        execCommand,
        input,
        transformedData,
        selectionMode,
      );
    }
  },

  /** Fallback to ensure input is transformed even if previous step fails. */
  handleInput(maybeSyntheticEvent) {
    const input = getEventTarget(maybeSyntheticEvent, phase);
    assert(
      input instanceof HTMLInputElement,
      'Expected event to have target.',
    );

    const currentValue = input.value;
    const transformedValue = transform(currentValue);

    if (transformedValue !== currentValue) {
      // Use `input.setRangeText()` over `input.value = `, otherwise
      // React will not detect the `change` event firing.
      input.setRangeText(transformedValue, 0, input.value.length);
    }
  },
});
