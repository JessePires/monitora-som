// import * as React from 'react';

// import * as SliderPrimitive from '@radix-ui/react-slider';

// import { cn } from '@/lib/utils';

// const Slider = React.forwardRef<
//   React.ElementRef<typeof SliderPrimitive.Root>,
//   React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
// >(({ className, ...props }, ref) => {
//   const [value, setValue] = React.useState<Array<number>>(props.defaultValue ?? [0]);
//   const [hovered, setHovered] = React.useState<boolean>(false);

//   return (
//     <SliderPrimitive.Root
//       ref={ref}
//       className={cn('relative flex w-full touch-none select-none items-center', className)}
//       {...props}
//       value={value}
//       onValueChange={(newValue) => setValue(newValue)}
//     >
//       <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
//         <SliderPrimitive.Range className="absolute h-full bg-primary" />
//       </SliderPrimitive.Track>

//       <SliderPrimitive.Thumb
//         onMouseEnter={() => setHovered(true)}
//         onMouseLeave={() => setHovered(false)}
//         className="relative block h-4 w-4 rounded-full border border-primary/50 bg-primary shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
//       >
//         {hovered && (
//           <div
//             className={cn(
//               'absolute -top-7 left-1/2 transform -translate-x-1/2 bg-primary text-white text-sm px-2 py-1 rounded transition-opacity duration-5000',
//               hovered ? 'opacity-100 visible' : 'opacity-0 invisible',
//             )}
//           >
//             {value[0] ?? props.defaultValue}
//           </div>
//         )}
//       </SliderPrimitive.Thumb>
//     </SliderPrimitive.Root>
//   );
// });

// Slider.displayName = SliderPrimitive.Root.displayName;

// export { Slider };

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
  const [value, setValue] = React.useState(props.defaultValue ?? [0]);
  const [isHovered, setIsHovered] = React.useState(false);

  // Define classes com base na orientação
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

  const thumbPosition =
    orientation === 'vertical'
      ? '-translate-y-1/2' // Centraliza o Thumb verticalmente
      : '-translate-x-1/3'; // Centraliza o Thumb horizontalmente

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
            `absolute ${thumbPosition} bg-primary text-white text-sm px-2 py-1 rounded transition-opacity duration-300`,
            isHovered ? 'opacity-100 visible' : 'opacity-0 invisible',
          )}
          style={orientation === 'vertical' ? { left: -30, top: '50%' } : { top: '-28px' }} // Posição do tooltip
        >
          {value[0] ?? props.defaultValue}
        </div>
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
