import React, { PureComponent } from 'react';
import Slider from 'rc-slider';

import style from './SliderWidget.module.scss';

import { TSliderWidgetProps } from './@types';

export class SliderWidget extends PureComponent<TSliderWidgetProps> {
  private handleChange = (value: number): void => {
    this.props.onValueSliderChange(value, false);
  };

  private handleAfterChange = (value: number): void => {
    this.props.onAfterChange(value, true);
  };

  render() {
    const { sliderValue, sliderProps } = this.props;

    return (
      <Slider
        value={sliderValue}
        className={style.slider}
        onChange={this.handleChange}
        onAfterChange={this.handleAfterChange}
        {...sliderProps}
      />
    );
  }
}
