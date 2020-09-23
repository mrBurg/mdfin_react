import { URIS_SUFFIX } from '../../../constants';
import { TComponenProps } from '../../../interfaces';

export type TOtpProps = {
  className?: string;
  action: Function;
  page?: URIS_SUFFIX; //для подписания заявки, этот параметр не нужен
} & TComponenProps;
