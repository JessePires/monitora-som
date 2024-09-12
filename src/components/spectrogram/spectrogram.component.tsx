import { formatTime } from '../../utils/formatTime';
import CanvasDrawing from '../canvas/canvas.component';
import ComboboxForm from '../form/form.component';
import { Button } from '../ui/button';

import * as Containers from './spectrogram.container';
import * as Styles from './spectrogram.styles';
import { DrawableSpectrogramProps, SpectrogramContainerProps } from './spectrogram.types';

const DrawableSpectrogram = (props: DrawableSpectrogramProps): JSX.Element => {
  return (
    <Containers.SpectrogramContainer {...props}>
      {(containerProps: SpectrogramContainerProps): JSX.Element => {
        return (
          <>
            <div className="bg-white rounded-xl shadow-md m-4 p-4">
              <Styles.CanvasWrapper
                ref={containerProps.containerRef}
                spectrogramWidth={props.spectrogramWidth}
                spectrogramHeight={props.spectrogramHeight}
                onScroll={containerProps.actions.handleScroll}
              >
                <CanvasDrawing
                  spectrogramWidth={props.spectrogramWidth}
                  spectrogramHeight={props.spectrogramHeight}
                  labelInput={containerProps.labelInput}
                  setLabelInput={containerProps.actions.setLabelInput}
                  ref={containerProps.spectrogramRef}
                />
              </Styles.CanvasWrapper>

              <div className="mt-8 flex gap-4 justify-center">
                <Button onClick={containerProps.actions.stepBack} disabled={containerProps.urlIndex === 0}>
                  Retroceda
                </Button>

                <Button onClick={containerProps.actions.onPlayPause} style={{ minWidth: '5em' }}>
                  {containerProps.isPlaying ? 'Pause' : 'Play'}
                </Button>

                <Button
                  onClick={containerProps.actions.stepForward}
                  disabled={containerProps.urlIndex === props.audioUrls.length - 1}
                >
                  Avance
                </Button>
              </div>
            </div>

            <Styles.SpeciesInputWrapper>
              <ComboboxForm />
              <Styles.SpeciesName
                type="text"
                value={containerProps.labelInput}
                onChange={(e) => containerProps.actions.setLabelInput(e.target.value)}
                onKeyDown={containerProps.actions.handleKeyPress}
                placeholder="Digite o nome da espécie"
              />
              <Button onClick={containerProps.actions.handleDeleteSelectedSquare}>Excluir roi selecionada</Button>
              <Button onClick={containerProps.actions.exportSquares}>Exportar</Button>
            </Styles.SpeciesInputWrapper>

            <p>
              Visible time range: {containerProps.visibleTimes.start.toFixed(2)} ms -{' '}
              {containerProps.visibleTimes.end.toFixed(2)} ms
            </p>
            <p>
              Visible frequency range: {containerProps.visibleFrequencies.start.toFixed(2)} Hz -{' '}
              {containerProps.visibleFrequencies.end.toFixed(2)} Hz
            </p>

            <p>Current time: {formatTime(containerProps.currentTime)}</p>
          </>
        );
      }}
    </Containers.SpectrogramContainer>
  );
};

export default DrawableSpectrogram;
