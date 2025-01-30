import { ForwardedRef, forwardRef } from 'react';

import * as Containers from './canvas.container';
import * as Styles from './canvas.styles';
import { CanvasContainerProps, CanvasDrawingProps } from './canvas.types';

const CanvasDrawing = forwardRef((props: CanvasDrawingProps, ref: ForwardedRef<HTMLCanvasElement>): JSX.Element => {
  return (
    <Containers.CanvasContainer spectrogramRef={ref} labelInput={props.labelInput} setLabelInput={props.setLabelInput}>
      {(containerProps: CanvasContainerProps): JSX.Element => {
        return (
          <Styles.CanvasWrapper>
            <div
              ref={props.markerRef}
              onMouseDown={props.handleMarkerMouseDown}
              style={{
                position: 'absolute',
                top: 0,
                bottom: '10px', // Mantém espaço para a seta
                width: '2px',
                backgroundColor: '#ff7300',
                pointerEvents: 'none',
                zIndex: 10,
                left: `${props.markerPosition}px`,
              }}
            />
            <div
              ref={props.arrowRef}
              onMouseDown={props.handleMarkerMouseDown}
              style={{
                position: 'absolute',
                left: `${props.markerPosition}px`,
                transform: 'translateX(-44%)',
                bottom: '0px',
                width: '0px',
                height: '0px',
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderBottom: '10px solid #ff7300', // Ponta da seta apontada para cima
                cursor: 'grab',
                zIndex: 11,
              }}
            />
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
