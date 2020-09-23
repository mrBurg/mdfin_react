import React, { ReactElement, FC } from 'react';
import { Accordion } from 'semantic-ui-react';
import _ from 'lodash';

import style from './AccordionWidget.module.scss';
import { TQuestion, TFaqListItemsProps, TFaqItem } from './@types';

const renderPanels = (questions: Array<TQuestion>) => {
  return _.map(questions, (item: TQuestion, key: number) => {
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
  const { data, ...accordionProps } = props;

  return (
    <>
      {_.map(data, (item: TFaqItem, index: number) => {
        const { title, questions } = item;

        return (
          <section key={index} className={style.section}>
            <h2 className={style.title}>{title}</h2>

            <Accordion
              className={style.accordion}
              panels={renderPanels(questions)}
              {...accordionProps}
            />
          </section>
        );
      })}
    </>
  );
};
