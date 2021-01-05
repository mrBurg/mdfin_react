import React, { ReactElement } from 'react';
import { Accordion } from 'semantic-ui-react';
import classNames from 'classnames';
import _ from 'lodash';

import style from './AccordionWidget.module.scss';
import { WithTracking } from '@components/hocs';
import { WidgetRoles } from '@src/roles';
import { EMouseEvents } from '@src/trackingConstants';
import { TQuestion, TFaqListItemsProps, TFaqItem } from './@types';

const renderPanels = (questions: TQuestion[]) => {
  return _.map(questions, (item: TQuestion, key: number) => {
    const { question, answer } = item;

    return {
      key,
      title: (
        <Accordion.Title>
          <WithTracking
            id={`AccordionWidget-${WidgetRoles.tab}`}
            events={[EMouseEvents.CLICK]}
          >
            <div className={style.accordionTitle} role={WidgetRoles.tab}>
              <span className={style.accordionTitleContent}>{question}</span>
              <i className={classNames('icon', style.accordionTitleIcon)} />
            </div>
          </WithTracking>
        </Accordion.Title>
      ),
      content: (
        <Accordion.Content
          className={classNames('content', style.accordionPanel)}
        >
          <span>{answer}</span>
        </Accordion.Content>
      ),
    };
  });
};

export const AccordionWidget = (props: TFaqListItemsProps): ReactElement => {
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
