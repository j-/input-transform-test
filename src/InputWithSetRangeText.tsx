import { useEffect, useMemo, useRef, type FC, type InputHTMLAttributes } from 'react';
import { makeInputTransform, type StringTransform } from './make-input-transform';
import { useDebug } from './use-debug';

export const InputWithSetRangeText: FC<
  InputHTMLAttributes<HTMLInputElement> &
  { transform: StringTransform; }
> = ({
  transform,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useDebug(inputRef);

  const {
    applyTransform,
    handleBeforeInput,
    handleInput,
  } = useMemo(() => {
    return makeInputTransform({
      transform,
    });
  }, [transform]);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    applyTransform(input);

    const controller = new AbortController();
    const signal = controller.signal;

    input.addEventListener('beforeinput', handleBeforeInput, { signal });
    input.addEventListener('input', handleInput, { signal });

    return () => {
      controller.abort();
    };
  }, [applyTransform, handleBeforeInput, handleInput]);

  return (
    <input
      ref={inputRef}
      onChange={(e) => {
        console.info('InputWithSetRangeText onChange', e.currentTarget.value, e);
      }}
      onInput={(e) => {
        console.info('InputWithSetRangeText onInput', e.currentTarget.value, e);
      }}
      {...props}
    />
  );
};
