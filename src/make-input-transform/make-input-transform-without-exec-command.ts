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
    if (transformed !== '' && transformed !== currentValue) {
      input.value = transformed;
    }
  },

  handleBeforeInput(e) {
    // Only handle these input types.
    if (
      e.inputType !== 'insertText' &&
      e.inputType !== 'insertFromPaste' &&
      e.inputType !== 'insertFromDrop'
    ) {
      return;
    }

    const eventData = e.data ?? '';
    const transformed = transform(eventData);

    // 'Before' and 'after' match, nothing to do. Exit early.
    if (transformed === eventData) return;

    // Cancel the default insert.
    if (!transformed) {
      e.preventDefault();
    }

    // Transformed data may be empty e.g. inserting a single disallowed char.
    // Ignore these inputs to prevent selected text from being deleted without
    // a clear reason.
    if (transformed === '') return;
  },

  handleInput(e) {
    const input = e.currentTarget as HTMLInputElement;
    const { inputType } = e as InputEvent;
    const { value, selectionStart, selectionEnd } = input;

    const valueBeforeSelection = value.substring(0, selectionStart ?? 0);
    const valueWithinSelection = value.substring(selectionStart ?? 0, selectionEnd ?? 0);
    const valueAfterSelection = value.substring(selectionEnd ?? 0);

    const transformedValueBeforeSelection = transform(valueBeforeSelection);

    const transformedValueWithinSelection = inputType === 'insertFromDrop' ?
      transform(valueWithinSelection) :
      '';

    const transformedValueAfterSelection = transform(valueAfterSelection);

    const transformedValue = transformedValueBeforeSelection +
      transformedValueWithinSelection +
      transformedValueAfterSelection;

    if (transformedValue !== value) {
      input.value = transformedValue;
      if (inputType !== 'insertFromDrop' || selectWhenDropped) {
        input.setSelectionRange(
          transformedValueBeforeSelection.length,
          transformedValueBeforeSelection.length +
          transformedValueWithinSelection.length
        );
      }
    }
  },

  handleChange(e) {
    const input = e.currentTarget as HTMLInputElement;
    const value = input.value;

    const transformedValue = transform(value);

    // Last resort action if the beforeinput/input events were
    // not respected e.g. when performing autocomplete.
    if (transformedValue !== value) {
      input.value = transformedValue;
    }
  },
});
