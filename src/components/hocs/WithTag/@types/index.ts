import { TJSON } from '@interfaces';

export type TWithTagProps = {
  tags: TJSON;
  children: string;
  tag?: string;
  className?: string;
};
