import {
  ChangeEvent,
  MouseEvent,
  KeyboardEvent,
  FormEvent,
  FocusEvent,
} from 'react';

export type TJSON = {
  [key: string]: any;
};

export type TCopyright = {
  normal: string;
  less: string;
};

export type TFetchStaticDataProps = {
  block: string;
  path: string;
};

export type TOnInputChangeHandler = (
  event: ChangeEvent<HTMLInputElement>
) => void;

export type TOnInputKeyUpHandler = (
  event: KeyboardEvent<HTMLInputElement>
) => void;

export type TOnClickHandler = (event: MouseEvent<HTMLElement>) => void;
export type TOnSubmitHandler = (event: FormEvent<HTMLFormElement>) => void;
export type TOnBlurHandler = (event: FocusEvent<HTMLInputElement>) => void;
