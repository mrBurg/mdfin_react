import { TJSON } from '@interfaces';
import { COMPONENT_TYPE } from '@src/constants';
import { TrackingStore } from '@src/stores/TrackingStore';
import { requiredData } from '@src/trackingConstants';
import _ from 'lodash';
import { ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import { TEvents } from './@types';

function collectData(id: string, element: ReactElement, event?: any) {
  const { props } = element;
  let eventData: TJSON = {
    target_id: id,
  };

  switch (typeof element.type) {
    case COMPONENT_TYPE.STRING:
      eventData = {
        ...eventData,
        type: element.type,
      };

      break;
    case COMPONENT_TYPE.FUNCTION:
      eventData = {
        ...eventData,
        type: (element.type as TJSON).name,
      };
      break;
  }

  _.map(requiredData, (item) => {
    eventData[item] = props[item] ?? null;
  });

  if (props.hasOwnProperty.call(props, 'checked'))
    eventData.value = String(props.checked);

  eventData = {
    ...eventData,
    target: renderToString(element),
    content: renderToString(props.children) || null,
  };

  if (event && event.target && event.target.tagName == 'A') {
    eventData = {
      ...eventData,
      target: event.target.outerHTML,
      content: event.target.innerHTML,
    };
  }

  return eventData;
}

export function bindEvents(
  id: string,
  events: TEvents[],
  element: ReactElement,
  store: TrackingStore
): TJSON {
  return _.reduce(
    events,
    (props, eventType) => {
      props[eventType] = function (arg1: any, arg2: any) {
        const args = _.compact([arg1, arg2]);
        let event = void 0;

        _.map(args, (item) => {
          if (item.target) {
            event = item;
            return false;
          }
        });

        //TODO не отсылать если был клик по тексту из ДБ
        store.sendEvent(eventType, collectData(id, element, event));
        if (element.props[eventType]) element.props[eventType](arg1, arg2);
      };

      return props;
    },
    <TJSON>{}
  );
}
