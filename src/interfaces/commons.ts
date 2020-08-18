import { TStores } from '../stores';
import { ChangeEvent, MouseEvent, KeyboardEvent } from 'react';

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

export type TComponenProps = TStores;

export type TOnInputChangeHandler = (
  event: ChangeEvent<HTMLInputElement>
) => void;

export type TOnKeyUpHandler = (event: KeyboardEvent<HTMLInputElement>) => void;

export type TOnClickHandler = (
  event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>
) => void;
