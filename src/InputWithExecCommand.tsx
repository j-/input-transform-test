import { useEffect, useMemo, useRef, type FC, type InputHTMLAttributes } from 'react';
import { makeInputTransform, type StringTransform } from './make-input-transform';

export const InputWithExecCommand: FC<
  InputHTMLAttributes<HTMLInputElement> &
  { transform: StringTransform; }
> = ({
  transform,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    applyTransform,
    handleBeforeInput,
    handleInput,
  } = useMemo(() => {
    return makeInputTransform({
      transform,
      execCommand: document.execCommand,
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
    <input ref={inputRef} {...props} />
  );
};
