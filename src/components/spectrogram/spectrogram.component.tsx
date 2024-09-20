import * as Icons from '../../assets/icons';
import { formatTime } from '../../utils/formatTime';
import CanvasDrawing from '../canvas/canvas.component';
import ComboboxForm from '../form/form.component';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';

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
              <div className="flex flex-col items-center mb-2 ml-16 mr-8">
                <p className="text-sm font-medium mb-2">Segundos</p>
                <Slider max={60} defaultValue={[60]} step={0.1} />
              </div>

              <div className="flex mr-8">
                <div className={`h-[${props.spectrogramHeight}] w-1 pl-12 pr-4`}>
                  <Slider
                    orientation="vertical"
                    max={props.maxFrequencyKHz}
                    defaultValue={[props.maxFrequencyKHz]}
                    step={0.1}
                  />
                </div>
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
              </div>

              <div className="mt-8 flex gap-4 justify-center">
                <Button onClick={() => console.log('Anterior não rotulado')} disabled={containerProps.urlIndex === 0}>
                  <Icons.CustomPreviousUnseenIcon width="20" />
                  <span className="ml-2">Anterior não rotulado</span>
                </Button>

                <Button onClick={containerProps.actions.stepBack} disabled={containerProps.urlIndex === 0}>
                  <Icons.CustomPreviousIcon width="11" />
                  <span className="ml-2">Anterior</span>
                </Button>

                <Button onClick={containerProps.actions.onPlayPause} style={{ minWidth: '5em' }} className="w-[30%]">
                  <Icons.CustomPlayIcon width="11" />
                  <span className="ml-2">{containerProps.isPlaying ? 'Pausar áudio' : 'Tocar áudio'}</span>
                </Button>

                <Button
                  onClick={containerProps.actions.stepForward}
                  disabled={containerProps.urlIndex === props.audioUrls.length - 1}
                >
                  <span className="mr-2">Próximo</span>
                  <Icons.CustomNextIcon width="11" />
                </Button>

                <Button
                  onClick={() => console.log('próximo não rotulado')}
                  disabled={containerProps.urlIndex === props.audioUrls.length - 1}
                >
                  <span className="mr-2">Próximo não rotulado</span>
                  <Icons.CustomNextUnseenIcon width="20" />
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
