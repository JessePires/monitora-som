import { ForwardedRef, forwardRef } from 'react';

import * as Containers from './canvas.container';
import * as Styles from './canvas.styles';
import { CanvasContainerProps, CanvasDrawingProps } from './canvas.types';

const CanvasDrawing = forwardRef((props: CanvasDrawingProps, ref: ForwardedRef<HTMLCanvasElement>): JSX.Element => {
  return (
    <Containers.CanvasContainer spectrogramRef={ref} labelInput={props.labelInput} setLabelInput={props.setLabelInput}>
      {(containerProps: CanvasContainerProps): JSX.Element => {
        return (
          <Styles.CanvasWrapper containerWidth={props.containerWidth}>
            <Styles.Canvas
              ref={containerProps.canvasRef}
              width={props.spectrogramWidth}
              height={props.spectrogramHeight}
              onMouseDown={containerProps.actions.handleMouseDown}
              onMouseMove={containerProps.actions.handleMouseMove}
              onMouseUp={containerProps.actions.handleMouseUp}
            />
          </Styles.CanvasWrapper>
        );
      }}
    </Containers.CanvasContainer>
  );
});

export default CanvasDrawing;
