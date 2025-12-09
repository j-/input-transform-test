import { useRef, useState, type FC, type InputHTMLAttributes } from 'react';
import type { StringTransform } from './make-input-transform';
import { useDebug } from './use-debug';

export const InputNaiiveTransform: FC<
  Omit<InputHTMLAttributes<HTMLInputElement>, 'defaultValue'> &
  { transform: StringTransform; defaultValue?: string; }
> = ({
  defaultValue = '',
  transform,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useDebug(inputRef);

  const [value, setValue] = useState(defaultValue);

  return (
    <input
      ref={inputRef}
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
