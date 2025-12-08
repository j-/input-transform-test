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
      value={value}
      onChange={(e) => {
        console.info('InputNaiiveTransform onChange', e.currentTarget.value, e);
        setValue(transform(e.currentTarget.value));
      }}
      onInput={(e) => {
        console.info('InputNaiiveTransform onInput', e.currentTarget.value, e);
      }}
      {...props}
    />
  );
};
