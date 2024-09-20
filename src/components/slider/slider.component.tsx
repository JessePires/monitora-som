import { Slider } from '../ui/slider';

import { SliderProps } from './slider.types';

const CustomSlider = (props: SliderProps): JSX.Element => {
  return (
    <Slider
      min={props.minValue ?? 0}
      max={props.maxValue}
      defaultValue={props.default ?? [0]}
      step={props.step ?? 0.1}
      orientation={props.orientation ?? 'horizontal'}
    />
  );
};

export default CustomSlider;
