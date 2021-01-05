import { TJSON } from '@interfaces';
import { TStores } from '@stores';
import { NextComponentType } from 'next';

export type TLayoutProps = {
  Component: NextComponentType;
  template?: TJSON;
} & TStores;
