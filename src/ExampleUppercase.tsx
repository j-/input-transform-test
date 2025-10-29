import { type FC, useEffect, useMemo, useRef } from 'react';

import { makeInputTransform } from './make-input-transform';

export const ExampleUppercase: FC<{
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
      type="text"
      defaultValue=""
      autoCapitalize="characters"
    />
  );
};

const transform = (str: string) =>
  str
    .toUpperCase()
    // Remove diacritic marks.
    .normalize('NFD')
    // Normalize various forms of quotes.
    .replace(/["`\u2018\u2019]/g, "'")
    // Remove everything but letters, spaces, and quotes.
    .replace(/[^\w ']/g, '');
