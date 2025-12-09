import { useRef, type FC, type InputHTMLAttributes } from 'react';
import { useDebug } from './use-debug';

export const InputNoTransform: FC<InputHTMLAttributes<HTMLInputElement>> = (
  props
) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useDebug(inputRef);

  return (
    <input
      ref={inputRef}
      onChange={(e) => {
        console.info('InputNoTransform onChange', e.currentTarget.value, e);
      }}
      onInput={(e) => {
        console.info('InputNoTransform onInput', e.currentTarget.value, e);
      }}
      {...props}
    />
  );
};
