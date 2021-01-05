import { COMPONENT_TYPE } from '@src/constants';
import { STORE_IDS } from '@stores';
import { inject } from 'mobx-react';
import { cloneElement, FC } from 'react';
import { TWithTrackingProps } from './@types';
import { bindEvents } from './withTrackingUtils';

export const WithTracking: FC<TWithTrackingProps> = inject(
  STORE_IDS.TRACKING_STORE
)((props) => {
  const { id, children, events, trackingStore } = props;

  if (trackingStore) {
    switch (typeof children.type) {
      case COMPONENT_TYPE.STRING:
        return cloneElement(children, {
          ...children.props,
          ...bindEvents(id, events, children, trackingStore),
        });
      case COMPONENT_TYPE.FUNCTION:
        switch (typeof children.props.children) {
          case COMPONENT_TYPE.OBJECT:
            return cloneElement(
              children,
              children.props,
              cloneElement(children.props.children, {
                ...children.props.children.props,
                ...bindEvents(
                  id,
                  events,
                  children.props.children,
                  trackingStore
                ),
              })
            );
        }
    }

    return cloneElement(children, {
      ...children.props,
      ...bindEvents(id, events, children, trackingStore),
    });
  }

  return children;
});
