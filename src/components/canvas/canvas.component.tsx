import * as Containers from './canvas.container';
import * as Styles from './canvas.styles';
import { CanvasContainerProps } from './canvas.types';

const CanvasDrawing = ({
  spectrogramWidth,
  spectrogramHeight,
}: {
  spectrogramWidth: number;
  spectrogramHeight: number;
}): JSX.Element => {
  return (
    <Containers.CanvasContainer>
      {(containerProps: CanvasContainerProps): JSX.Element => {
        return (
          <Styles.CanvasDrwawingWrapper>
            <Styles.CanvasWrapper>
              <Styles.Canvas
                ref={containerProps.canvasRef}
                width={`${spectrogramWidth - 15}px`}
                height={`${spectrogramHeight - 38}px`}
                onMouseDown={containerProps.actions.handleMouseDown}
                onMouseMove={containerProps.actions.handleMouseMove}
                onMouseUp={containerProps.actions.handleMouseUp}
              />
            </Styles.CanvasWrapper>
            <Styles.SpeciesInputWrapper>
              <Styles.SpeciesName
                type="text"
                value={containerProps.labelInput}
                onChange={(e) => containerProps.actions.setLabelInput(e.target.value)}
                onKeyDown={containerProps.actions.handleKeyPress}
                placeholder="Digite o nome da espécie"
              />
              <Styles.Button onClick={containerProps.actions.handleDeleteSelectedSquare}>
                Excluir roi selecionada
              </Styles.Button>
            </Styles.SpeciesInputWrapper>
          </Styles.CanvasDrwawingWrapper>
        );
      }}
    </Containers.CanvasContainer>
  );
};

export default CanvasDrawing;
