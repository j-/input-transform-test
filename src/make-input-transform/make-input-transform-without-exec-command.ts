import {
  getInputEventInputData,
  isInputEvent,
  isInsertFromDropEvent,
  isInsertFromPasteEvent,
  isInsertTextEvent,
} from './event';
import type {
  MakeInputTransformOptionsWithoutExecCommand,
  MakeInputTransformResult,
} from './types';

export const makeInputTransformWithoutExecCommand = ({
  transform,
  selectWhenDropped = true,
}: MakeInputTransformOptionsWithoutExecCommand): MakeInputTransformResult => ({
  applyTransform(input) {
    const currentValue = input.value;
    const transformed = transform(currentValue);
    if (transformed !== currentValue) {
      input.value = transformed;
    }
  },

  /**
   * Responsible for preventing user input unless input data contains
   * valid characters. For example if the input expects numbers only
   * and the user presses the "A" key on their keyboard this should
   * be prevented. It would be stripped by the `input` event handler
   * anyway but this addresses the case where a portion of the input
   * text is highlighted, the user presses an invalid key, and that
   * portion is deleted without any new characters being entered.
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

      // If all the input data is stripped by the transform function
      // then none of the input is valid in which case it should be
      // prevented. If this condition is not met it means the input
      // data will be manipulated by the `input` handler below.
      if (!transformed) {
        e.preventDefault();
      }
    }
  },

  /**
   * Manipulates the data the customer has entered before it is
   * actuallly entered into the field by transforming/filtering
   * characters. Updates the caret position and selection range
   * accordingly.
   */
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

      return;
    }

    const input = e.currentTarget as HTMLInputElement;
    const value = input.value;
    
    const selectionStart = input.selectionStart ?? value.length;
    const selectionEnd = input.selectionEnd ?? value.length;

    const valueBeforeSelection = value.substring(0, selectionStart);
    const valueWithinSelection = value.substring(selectionStart, selectionEnd);
    const valueAfterSelection = value.substring(selectionEnd);

    if (isInsertTextEvent(e) || isInsertFromPasteEvent(e)) {
      const transformedValueBeforeSelection = transform(valueBeforeSelection);
      const transformedValueAfterSelection = transform(valueAfterSelection);
  
      const transformedValue = transformedValueBeforeSelection +
        transformedValueAfterSelection;
  
      if (transformedValue !== value) {
        input.value = transformedValue;
        
        input.setSelectionRange(
          transformedValueBeforeSelection.length,
          transformedValueBeforeSelection.length,
        );
      }

      return;
    }

    if (isInsertFromDropEvent(e)) {
      const transformedValueBeforeSelection = transform(valueBeforeSelection);
      const transformedValueWithinSelection = transform(valueWithinSelection);
      const transformedValueAfterSelection = transform(valueAfterSelection);
  
      const transformedValue = (
        transformedValueBeforeSelection +
        transformedValueWithinSelection +
        transformedValueAfterSelection
      );
  
      if (transformedValue !== value) {
        input.value = transformedValue;

        if (selectWhenDropped) {
          input.setSelectionRange(
            transformedValueBeforeSelection.length,
            transformedValueBeforeSelection.length +
            transformedValueWithinSelection.length
          );
        }
      }

      return;
    }
  },

  handleChange() {},
});
