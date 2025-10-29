export type StringTransform = (input: string) => string;

export const makeInputTransform = ({
  transform,
  execCommand = document.execCommand,
}: {
  transform: StringTransform;
  execCommand?: Document['execCommand'] | null;
}) => ({
  applyTransform(input: Pick<HTMLInputElement, 'value'>) {
    const currentValue = input.value;
    const transformed = transform(currentValue);
    if (transformed !== '' && transformed !== currentValue) {
      input.value = transformed;
    }
  },

  handleBeforeInput(e: InputEvent) {
    // Only handle these input types.
    if (
      e.inputType !== 'insertText' &&
      e.inputType !== 'insertFromPaste' &&
      e.inputType !== 'insertFromDrop'
    ) {
      return;
    }

    const transformed = transform(e.data ?? '');

    // 'Before' and 'after' match, nothing to do. Exit early.
    if (transformed === e.data) return;

    // Cancel the default insert.
    if (
      !transformed ||
      typeof execCommand === 'function'
    ) {
      e.preventDefault();
    }

    // Transformed data may be empty e.g. inserting a single disallowed char.
    // Ignore these inputs to prevent selected text from being deleted without
    // a clear reason.
    if (transformed === '') return;

    // Use execCommand to insert the transformed text. Preserves history stack.
    if (typeof execCommand === 'function') {
      execCommand.call(document, 'insertText', false, transformed);
    }
  },

  handleInput(e: Event | InputEvent) {
    // Only proceed with this handler if the exec command API is not available.
    // Otherwise this behaviour will be handled in `handleBeforeInput`.
    if (typeof execCommand === 'function') return;

    const input = e.currentTarget as HTMLInputElement;
    const { inputType } = e as InputEvent;
    const { value, selectionStart, selectionEnd } = input;

    const valueBeforeSelection = value.substring(0, selectionStart ?? 0);
    const valueWithinSelection = value.substring(selectionStart ?? 0, selectionEnd ?? 0);
    const valueAfterSelection = value.substring(selectionEnd ?? 0);

    const transformedValueBeforeSelection =
      transform(valueBeforeSelection);

    const transformedValueWithinSelection =
      inputType === 'insertFromDrop' ? transform(valueWithinSelection) : '';

    const transformedValueAfterSelection =
      transform(valueAfterSelection);

    const transformedValue =
      transformedValueBeforeSelection +
      transformedValueWithinSelection +
      transformedValueAfterSelection;
    
    if (transformedValue !== value) {
      input.value = transformedValue;
      input.selectionStart = transformedValueBeforeSelection.length;
      input.selectionEnd = transformedValueBeforeSelection.length +
        transformedValueWithinSelection.length;
    }
  },
});

export const makeInputTransformIdentity = (): ReturnType<typeof makeInputTransform> => ({
  applyTransform() {},
  handleBeforeInput() {},
  handleInput() {},
});
