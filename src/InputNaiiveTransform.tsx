import { useState, type FC, type InputHTMLAttributes } from 'react';
import type { StringTransform } from './make-input-transform';

export const InputNaiiveTransform: FC<
  Omit<InputHTMLAttributes<HTMLInputElement>, 'defaultValue'> &
  { transform: StringTransform; defaultValue?: string; }
> = ({
  defaultValue = '',
  transform,
  ...props
}) => {
  const [value, setValue] = useState(defaultValue);

  return (
    <input
      {...props}
      value={transform(value)}
      onChange={(e) => {
        setValue(e.currentTarget.value);
      }}
    />
  );
};
