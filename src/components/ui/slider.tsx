import * as React from 'react';

import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    orientation?: 'horizontal' | 'vertical';
    tooltipOrientation?: 'left' | 'right' | 'top' | 'bottom';
  }
>(({ className, orientation = 'horizontal', tooltipOrientation = 'top', ...props }, ref) => {
  const tooltipRef = React.useRef<HTMLDivElement | null>(null);

  const [value, setValue] = React.useState(props.defaultValue ?? [0]);
  const [isHovered, setIsHovered] = React.useState(false);
  const [tooltipWidth, setTooltipWidth] = React.useState<number>(0);

  const orientationClasses =
    orientation === 'vertical'
      ? 'flex-col h-full' // Estilos para vertical
      : 'flex-row w-full'; // Estilos para horizontal

  const trackClasses =
    orientation === 'vertical'
      ? 'w-1.5 h-full' // Estilos da faixa (Track) vertical
      : 'h-1.5 w-full'; // Estilos da faixa (Track) horizontal

  const rangeClasses =
    orientation === 'vertical'
      ? 'w-full' // Estilos do Range vertical
      : 'h-full'; // Estilos do Range horizontal

  const tooltipPosition =
    orientation === 'vertical'
      ? '-translate-y-1/2' // Centraliza o Thumb verticalmente
      : '-translate-x-1/3'; // Centraliza o Thumb horizontalmente

  const tooltipPositionAdjustment = () => {
    let adjustment: { left?: number | string; top: number | string } = { top: '' };

    if (orientation === 'vertical') {
      if (tooltipOrientation === 'right') {
        adjustment = { left: 12, top: '50%' };
      } else {
        adjustment = { left: -tooltipWidth, top: '50%' };
      }
    } else {
      if (tooltipOrientation === 'bottom') {
        adjustment = { top: '100%' };
      } else {
        adjustment = { top: '-28px' };
      }
    }

    return adjustment;
  };

  const handleResize = () => {
    if (tooltipRef.current) {
      setTooltipWidth(tooltipRef.current.offsetWidth);
    }
  };

  React.useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [value]);

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(`relative flex touch-none select-none items-center ${orientationClasses}`, className)}
      {...props}
      value={value}
      onValueChange={(newValue) => setValue(newValue)}
      orientation={orientation} // Define a orientação
    >
      <SliderPrimitive.Track className={cn(`relative overflow-hidden rounded-full bg-primary/20 ${trackClasses}`)}>
        <SliderPrimitive.Range className={cn(`absolute bg-primary ${rangeClasses}`)} />
      </SliderPrimitive.Track>

      <SliderPrimitive.Thumb
        className={cn(
          `relative block h-4 w-4 rounded-full border border-primary/50 bg-primary shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50`,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={cn(
            `absolute ${tooltipPosition} bg-primary text-white text-sm px-2 py-1 rounded transition-opacity duration-300`,
            isHovered ? 'opacity-100 visible' : 'opacity-0 invisible',
          )}
          style={tooltipPositionAdjustment()}
          ref={tooltipRef}
        >
          {value[0].toString().replace('.', ',') ?? props.defaultValue?.toString().replace('.', ',')}
        </div>
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
