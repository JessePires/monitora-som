import { ForwardedRef, forwardRef } from 'react';

import * as Containers from './canvas.container';
import * as Styles from './canvas.styles';
import { CanvasContainerProps, CanvasDrawingProps } from './canvas.types';

const CanvasDrawing = forwardRef((props: CanvasDrawingProps, ref: ForwardedRef<HTMLCanvasElement>): JSX.Element => {
  return (
    <Containers.CanvasContainer spectrogramRef={ref}>
      {(containerProps: CanvasContainerProps): JSX.Element => {
        return (
          <Styles.CanvasDrwawingWrapper>
            <Styles.CanvasWrapper>
              <Styles.Canvas
                ref={containerProps.canvasRef}
                width={`${props.spectrogramWidth - 15}px`}
                height={`${props.spectrogramHeight - 15}px`}
                onMouseDown={containerProps.actions.handleMouseDown}
                onMouseMove={containerProps.actions.handleMouseMove}
                onMouseUp={containerProps.actions.handleMouseUp}
              />
            </Styles.CanvasWrapper>
          </Styles.CanvasDrwawingWrapper>
        );
      }}
    </Containers.CanvasContainer>
  );
});

export default CanvasDrawing;
