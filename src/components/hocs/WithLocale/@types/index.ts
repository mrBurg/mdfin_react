import { LocaleStore } from '@src/stores/LocaleStore';
import { ReactNode } from 'react';

export type TWithLocaleProps = {
  children: ReactNode;
  localeStore?: LocaleStore;
};
