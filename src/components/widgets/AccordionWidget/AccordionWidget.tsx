import React, { ReactElement, FC } from 'react';
import { Accordion } from 'semantic-ui-react';
import _ from 'lodash';

import style from './AccordionWidget.module.scss';

type TQuestion = {
  question: string;
  answer: string;
};

type TFaqItem = {
  title: string;
  questions: Array<TQuestion>;
};

type TFaqListItemsProps = Array<TFaqItem>;

const renderPanels = (questions: Array<TQuestion>) => {
  return questions.map((item: TQuestion, key: number) => {
    const { question, answer } = item;

    return {
      key,
      title: {
        className: style.accordionTitle,
        children: (
          <>
            <span className={'content'}>{question}</span>
            <i className={'icon'} />
          </>
        ),
      },
      content: {
        className: 'panel',
        content: <span>{answer}</span>,
      },
    };
  });
};

export const AccordionWidget: FC<TFaqListItemsProps> = (
  props
): ReactElement => {
  return (
    <>
      {_.map(props, (item: TFaqItem, index: number) => {
        const { title, questions } = item;

        return (
          <section key={index} className={style.section}>
            <h2 className={style.title}>{title}</h2>

            <Accordion
              className={style.accordion}
              panels={renderPanels(questions)}
              exclusive={false}
              fluid
            />
          </section>
        );
      })}
    </>
  );
};
