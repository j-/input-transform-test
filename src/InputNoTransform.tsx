import type { FC, InputHTMLAttributes } from 'react';

export const InputNoTransform: FC<InputHTMLAttributes<HTMLInputElement>> = (
  props
) => (
  <input {...props} />
);
