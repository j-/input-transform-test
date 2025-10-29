import { type FC, useEffect, useMemo, useRef } from 'react';

import { makeInputTransform } from './make-input-transform';

export const ExampleNumeric: FC<{
  execCommand?: Document['execCommand'] | null,
}> = ({
  execCommand,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    applyTransform,
    handleBeforeInput,
    handleInput,
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

    return () => {
      input.removeEventListener('beforeinput', handleBeforeInput);
      input.removeEventListener('input', handleInput);
    };
  }, [applyTransform, handleBeforeInput, handleInput]);

  return (
    <input
      ref={inputRef}
      defaultValue=""
      type="text"
      inputMode="numeric"
      pattern="\d*"
      maxLength={10}
    />
  );
};

const transform = (str: string) =>
  str.replace(/\D/g, '');
