import React, { FC, ReactElement } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';

import style from './AccordionWidget.module.scss';

export const AccordionWidget: FC<{}> = (props: any): ReactElement | null => {
  const faqListItems = Object.keys(props).map((key, index) => {
    const { title, questions } = props[key];

    const qaList = Object.keys(questions).map((item, itemIndex) => {
      const { question, answer } = questions[item];

      return (
        <AccordionItem
          key={itemIndex}
          className={style.accordion__item}
          uuid={String(itemIndex)}
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

    return (
      <div key={index}>
        <h2 className={style.accordion__paragraph}>{title}</h2>

        <Accordion
          allowMultipleExpanded={true}
          allowZeroExpanded={true}
          className={style.accordion}
        >
          <span>{qaList}</span>
        </Accordion>
      </div>
    );
  });

  return <>{faqListItems}</>;
};
