import { useContext } from 'react';

import * as Icons from '../../assets/icons';
import CanvasDrawing from '../canvas/canvas.component';
import ComboboxForm from '../form/form.component';
import Sidebar from '../sidebar/sidebar.component';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';

import * as Containers from './spectrogram.container';
import * as Styles from './spectrogram.styles';
import { DrawableSpectrogramProps, SpectrogramContainerProps } from './spectrogram.types';

import { GlobalContext } from '@/contexts/global/global.context';

const DrawableSpectrogram = (props: DrawableSpectrogramProps): JSX.Element => {
  const globalContext = useContext(GlobalContext);

  console.log('globalContext', globalContext.selectedAudio);

  return (
    <Containers.SpectrogramContainer {...props}>
      {(containerProps: SpectrogramContainerProps): JSX.Element => {
        return (
          <div className="flex">
            <Sidebar onChangeExpanded={containerProps.actions.onChangeExpanded} />
            <div className="w-[97%]">
              <div className="bg-white rounded-xl shadow-md m-4 p-4">
                <div className={`flex flex-col items-center mb-2 ml-12 mr-8`}>
                  <p className="text-sm font-medium mb-2">Segundos</p>
                  <Slider max={60} defaultValue={[60]} step={0.1} />
                </div>

                <div className="flex mr-8">
                  <div className="self-center w-10">
                    <p className="text-sm font-medium text-center rotate-[-90deg]">Intervalo (kHz)</p>
                  </div>
                  <div className={`h-[${props.spectrogramHeight}px] w-1 mr-2`}>
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
                    {/* {globalContext.selectedAudio && ( */}
                    <CanvasDrawing
                      spectrogramWidth={props.spectrogramWidth}
                      spectrogramHeight={props.spectrogramHeight}
                      containerWidth={`${containerProps.isSidebarExpanded ? '75.2%' : '89.3%'}`}
                      labelInput={containerProps.labelInput}
                      setLabelInput={containerProps.actions.setLabelInput}
                      ref={containerProps.spectrogramRef}
                      markerRef={containerProps.markerRef}
                      arrowRef={containerProps.arrowRef}
                      handleMarkerMouseDown={containerProps.actions.handleMarkerMouseDown}
                      markerPosition={containerProps.markerPosition}
                    />
                    {/* )} */}
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
                    {containerProps.isPlaying ? <Icons.PauseIcon /> : <Icons.CustomPlayIcon width="12" />}
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
                <ComboboxForm
                  speciesTypes={containerProps.headers}
                  species={containerProps.species}
                  onSubmit={containerProps.actions.handleKeyPress}
                  spectrogramRef={containerProps.spectrogramRef}
                />
              </Styles.SpeciesInputWrapper>
            </div>
          </div>
        );
      }}
    </Containers.SpectrogramContainer>
  );
};

export default DrawableSpectrogram;
