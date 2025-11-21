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
    handleChange,
  } = useMemo(() => {
    return makeInputTransform({
      transform,
    });
  }, [transform]);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    applyTransform(input);

    input.addEventListener('beforeinput', handleBeforeInput);
    input.addEventListener('input', handleInput);
    input.addEventListener('change', handleChange);

    return () => {
      input.removeEventListener('beforeinput', handleBeforeInput);
      input.removeEventListener('input', handleInput);
      input.removeEventListener('change', handleChange);
    };
  }, [applyTransform, handleBeforeInput, handleInput, handleChange]);

  return (
    <input ref={inputRef} {...props} />
  );
};
