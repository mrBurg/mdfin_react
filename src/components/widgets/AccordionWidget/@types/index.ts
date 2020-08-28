import { StrictAccordionProps } from 'semantic-ui-react';

export type TQuestion = {
  question: string;
  answer: string;
};

export type TFaqItem = {
  title: string;
  questions: Array<TQuestion>;
};

export type TFaqListItemsProps = {
  data: Array<TFaqItem>;
} & StrictAccordionProps;
