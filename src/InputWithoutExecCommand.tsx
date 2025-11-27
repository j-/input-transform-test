import { useEffect, useMemo, useRef, type FC, type InputHTMLAttributes } from 'react';
import { makeInputTransform, type StringTransform } from './make-input-transform';

export const InputWithoutExecCommand: FC<
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
    });
  }, [transform]);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    applyTransform(input);
  }, [applyTransform, handleBeforeInput, handleInput]);

  return (
    <input
      ref={inputRef}
      onBeforeInput={handleBeforeInput}
      onInput={handleInput}
      {...props}
    />
  );
};
