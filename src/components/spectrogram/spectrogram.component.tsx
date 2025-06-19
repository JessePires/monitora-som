import { useContext } from 'react';

import * as Icons from '../../assets/icons';
import CanvasDrawing from '../canvas/canvas.component';
import CheckboxComponent from '../checkbox/checkbox.component';
import ComboboxForm from '../form/form.component';
import Sidebar from '../sidebar/sidebar.component';
import { Button } from '../ui/button';

import * as Containers from './spectrogram.container';
import * as Styles from './spectrogram.styles';
import { DrawableSpectrogramProps, SpectrogramContainerProps } from './spectrogram.types';

import { GlobalContext } from '@/contexts/global/global.context';

const DrawableSpectrogram = (props: DrawableSpectrogramProps): JSX.Element => {
  const globalContext = useContext(GlobalContext);

  return (
    <Containers.SpectrogramContainer {...props}>
      {(containerProps: SpectrogramContainerProps): JSX.Element => {
        return (
          <div className="flex">
            <Sidebar
              onChangeExpanded={containerProps.actions.onChangeExpanded}
              waveSurferInstance={containerProps.wavesurfer}
            />
            <div className={`w-[100vw]`}>
              <div className="bg-white rounded-xl shadow-md m-4 px-8 py-4">
                <div className="flex mr-8">
                  <Styles.CanvasWrapper
                    ref={containerProps.containerRef}
                    spectrogramWidth={props.spectrogramWidth}
                    spectrogramHeight={props.spectrogramHeight}
                    onScroll={containerProps.actions.handleScroll}
                  >
                    <CanvasDrawing
                      spectrogramWidth={props.spectrogramWidth}
                      spectrogramHeight={props.spectrogramHeight}
                      containerWidth={`${containerProps.isSidebarExpanded ? '75.6%' : '89.3%'}`}
                      isSidebarOpen={containerProps.isSidebarExpanded}
                      labelInput={containerProps.labelInput}
                      setLabelInput={containerProps.actions.setLabelInput}
                      ref={containerProps.spectrogramRef}
                      markerRef={containerProps.markerRef}
                      arrowRef={containerProps.arrowRef}
                      handleMarkerMouseDown={containerProps.actions.handleMarkerMouseDown}
                      markerPosition={containerProps.markerPosition}
                    />
                  </Styles.CanvasWrapper>
                </div>

                <div className="flex justify-center w-[100%]">
                  <div className="mt-8 flex flex-1">
                    <div className="flex gap-4 w-[100%] justify-center pl-4">
                      <Button
                        onClick={containerProps.actions.goBackToPreviousUnlabeled}
                        disabled={globalContext.actions.areAllPreviousLabeled()}
                      >
                        <Icons.CustomPreviousUnseenIcon width="20" />
                        <span className="ml-2">Anterior não rotulado</span>
                      </Button>

                      <Button
                        onClick={containerProps.actions.stepBack}
                        disabled={globalContext.audioFiles.indexOf(globalContext.selectedAudio) === 0}
                      >
                        <Icons.CustomPreviousIcon width="11" />
                        <span className="ml-2">Anterior</span>
                      </Button>

                      <Button
                        onClick={containerProps.actions.onPlayPause}
                        style={{ minWidth: '5em' }}
                        className="w-[30%]"
                      >
                        {containerProps.isPlaying ? <Icons.PauseIcon /> : <Icons.CustomPlayIcon width="12" />}
                        <span className="ml-2">{containerProps.isPlaying ? 'Pausar áudio' : 'Tocar áudio'}</span>
                      </Button>

                      <Button
                        onClick={containerProps.actions.stepForward}
                        disabled={
                          globalContext.audioFiles.indexOf(globalContext.selectedAudio) >=
                          globalContext.audioFiles.length - 1
                        }
                      >
                        <span className="mr-2">Próximo</span>
                        <Icons.CustomNextIcon width="11" />
                      </Button>

                      <Button
                        onClick={containerProps.actions.moveOnToNextUnlabeled}
                        disabled={globalContext.actions.areAllNextLabeled()}
                      >
                        <span className="mr-2">Próximo não rotulado</span>
                        <Icons.CustomNextUnseenIcon width="20" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex mt-8 justify-end items-center">
                    <CheckboxComponent
                      title="Este áudio não tem ROI"
                      checked={globalContext.isNoLabelsMarkerChecked}
                      onChecked={(checked) => {
                        globalContext.actions.setIsNoLabelsMarkerChecked(checked);

                        if (checked) {
                          globalContext.actions.handleSetSquareInfo(null, {
                            availableSpecies: '-',
                            speciesName: '-',
                            type: '-',
                            certaintyLevel: '-',
                            completude: '-',
                            additionalComments: '-',
                          });
                        } else {
                          globalContext.actions.removeNoLabelsMarker();
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <ComboboxForm
                  speciesTypes={containerProps.headers}
                  species={containerProps.species}
                  onSubmit={containerProps.actions.handleKeyPress}
                  spectrogramRef={containerProps.spectrogramRef}
                />
              </div>
            </div>
          </div>
        );
      }}
    </Containers.SpectrogramContainer>
  );
};

export default DrawableSpectrogram;
