import { TJSON } from '@interfaces';

export type TSliderWidgetProps = {
  sliderValue?: number;
  sliderProps: TJSON;
  onValueSliderChange: (value: number, calculate: boolean) => void;
  onAfterChange: (value: number, calculate: boolean) => void;
};
