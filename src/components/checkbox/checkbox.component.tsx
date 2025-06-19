'use client';

import { CheckboxProps } from './checkbox.types';

import { Checkbox } from '@/components/ui/checkbox';

const CheckboxComponent = (props: CheckboxProps): JSX.Element => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="terms"
        onCheckedChange={(checkedState: boolean) => props.onChecked?.(checkedState)}
        checked={props.checked}
      />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-800"
      >
        {props.title}
      </label>
    </div>
  );
};

export default CheckboxComponent;
