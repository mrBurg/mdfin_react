import { TJSON } from '../../../../interfaces';

export type TSliderWidgetProps = {
  sliderValue?: number;
  sliderProps: TJSON;
  onValueSliderChange: Function;
  onAfterChange: Function;
};
