import React, { FC, ReactElement } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';

import style from './AccordionWidget.module.scss';

import { TJSON } from '../../../interfaces';

type TQuestion = {
  question: string;
  answer: string;
};

type TFaqItem = {
  title: string;
  questions: Array<TQuestion>;
};

type TFaqListItemsProps = Array<TFaqItem>;

const renderFaqList = (props: TFaqListItemsProps): Array<ReactElement> =>
  Object.keys(props).map((key: string, index: number) => {
    const { title, questions } = (props as TJSON)[key];

    return (
      <div key={index}>
        <h2 className={style.accordion__paragraph}>{title}</h2>

        <Accordion
          allowMultipleExpanded={true}
          allowZeroExpanded={true}
          className={style.accordion}
        >
          <span>{renderQaList(questions)}</span>
        </Accordion>
      </div>
    );
  });

const renderQaList = (questions: Array<TQuestion>): Array<ReactElement> =>
  Object.keys(questions).map((item: string, index) => {
    const { question, answer } = (questions as TJSON)[item];

    return (
      <AccordionItem
        key={index}
        className={style.accordion__item}
        uuid={String(index)}
      >
        <AccordionItemHeading>
          <AccordionItemButton className={style.accordion__button}>
            <span>{question}</span>
          </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel className={style.accordion__panel}>
          <span>{answer}</span>
        </AccordionItemPanel>
      </AccordionItem>
    );
  });

export const AccordionWidget: FC<{}> = (props: any): ReactElement => {
  return <>{renderFaqList(props)}</>;
};
