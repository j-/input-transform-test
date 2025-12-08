import type { FC, InputHTMLAttributes } from 'react';

export const InputNoTransform: FC<InputHTMLAttributes<HTMLInputElement>> = (
  props
) => (
  <input
    onChange={(e) => {
      console.info('InputNoTransform onChange', e.currentTarget.value, e);
    }}
    onInput={(e) => {
      console.info('InputNoTransform onInput', e.currentTarget.value, e);
    }}
    {...props}
  />
);
