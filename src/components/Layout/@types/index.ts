import { NextComponentType } from 'next';
import { TJSON, TComponenProps } from '../../../interfaces';

export type TLayoutProps = {
  Component: NextComponentType;
  template?: TJSON;
} & TComponenProps;
