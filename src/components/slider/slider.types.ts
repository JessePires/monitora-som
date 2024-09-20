export interface SliderProps {
  maxValue: number;
  minValue?: number;
  default?: Array<number>;
  step?: number;
  showValue?: boolean;
  orientation?: 'horizontal' | 'vertical' | undefined;
}
