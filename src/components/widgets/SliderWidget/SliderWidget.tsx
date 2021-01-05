import React, { PureComponent, ReactElement } from 'react';
import Slider from 'rc-slider';

import style from './SliderWidget.module.scss';
import { WithTracking } from '@components/hocs';
import { WidgetRoles, AbstractRoles } from '@src/roles';
import { EFormEvents, EWidgetEvent } from '@src/trackingConstants';
import { TSliderWidgetProps } from './@types';

export class SliderWidget extends PureComponent<TSliderWidgetProps> {
  private handleChange = (value: number): void => {
    this.props.onValueSliderChange(value, false);
  };

  private handleAfterChange = (value: number): void => {
    this.props.onAfterChange(value, true);
  };

  render(): ReactElement {
    const { sliderValue, sliderProps } = this.props;

    return (
      <WithTracking
        id={`SliderWidget-${WidgetRoles.slider}`}
        events={[EFormEvents.CHANGE, EWidgetEvent.AFTER_CHANGE]}
      >
        <Slider
          value={sliderValue}
          className={style.slider}
          onChange={this.handleChange}
          onAfterChange={this.handleAfterChange}
          role={AbstractRoles.range}
          {...sliderProps}
        />
      </WithTracking>
    );
  }
}
