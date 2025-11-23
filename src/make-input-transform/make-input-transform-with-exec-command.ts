import type {
  MakeInputTransformOptionsWithExecCommand,
  MakeInputTransformResult,
} from './types';

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
    e.preventDefault();

    // Transformed data may be empty e.g. inserting a single disallowed char.
    // Ignore these inputs to prevent selected text from being deleted without
    // a clear reason.
    if (transformed === '') return;

    // Use execCommand to insert the transformed text. Preserves history stack.
    execCommand.call(document, 'insertText', false, transformed);

    if (selectWhenDropped && e.inputType === 'insertFromDrop') {
      const input = e.currentTarget as HTMLInputElement;
      const start = input.selectionStart ?? input.value.length
      input.setSelectionRange(
        start - transformed.length,
        start,
      );
    }
  },

  handleInput() {},

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
