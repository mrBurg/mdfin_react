import { INPUT_TYPE } from '@src/constants';
import { ChangeEvent, InputHTMLAttributes } from 'react';

export type TInputWidgetProps = {
  name: string;
  value: string | number;
  type: INPUT_TYPE;
  className?: string;
  symbol?: string;
  symbolClassName?: string;
  inputClassName?: string;
  transformer?: () => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
} & InputHTMLAttributes<HTMLInputElement>;
