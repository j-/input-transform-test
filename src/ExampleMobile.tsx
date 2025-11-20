import { type FC, useEffect, useMemo, useRef } from 'react';

import { makeInputTransform } from './make-input-transform';

export const ExampleMobile: FC<{
  execCommand?: Document['execCommand'] | null,
}> = ({
  execCommand,
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
      execCommand,
    });
  }, [execCommand]);

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
    <input
      ref={inputRef}
      defaultValue=""
      inputMode="tel"
      pattern="\d*"
      maxLength={10}
      type="tel"
      autoComplete="tel"
    />
  );
};

const transform = (str: string) =>
  str.replace(/\D/g, '');
