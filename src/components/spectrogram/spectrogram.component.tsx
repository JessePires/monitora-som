import { useState } from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@radix-ui/react-accordion';

import * as Icons from '../../assets/icons';
import CanvasDrawing from '../canvas/canvas.component';
import ComboboxForm from '../form/form.component';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';

import * as Containers from './spectrogram.container';
import * as Styles from './spectrogram.styles';
import { DrawableSpectrogramProps, SpectrogramContainerProps } from './spectrogram.types';

import { cn } from '@/lib/utils';

const DrawableSpectrogram = (props: DrawableSpectrogramProps): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const toggleMenu = () => {
    setIsExpanded((prevState) => !prevState);
  };

  return (
    <Containers.SpectrogramContainer {...props}>
      {(containerProps: SpectrogramContainerProps): JSX.Element => {
        return (
          <div className="flex">
            <div
              className={cn(
                'h-screen bg-gray-800 text-white',
                isExpanded ? 'w-96' : 'w-11',
                'transition-width duration-300',
              )}
            >
              <button
                onClick={toggleMenu}
                className={`p-4 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'} w-[100%]`}
              >
                <Icons.ChevronRightIcon width="15" height="18" />
              </button>
              <nav className={cn('mt-4', !isExpanded && 'hidden')}>
                <ul>
                  <li className="p-4 hover:bg-gray-700">
                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="flex items-center justify-between w-[100%]">
                          <span>Is it accessible?</span>
                          <div className="bg-red-500 transform transition-transform rotate-180 duration-300">
                            <Icons.ChevronDownIcon width="15" height="15" />
                          </div>
                        </AccordionTrigger>

                        <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </li>
                  <li className="p-4 hover:bg-gray-700">Opção 2</li>
                  <li className="p-4 hover:bg-gray-700">Opção 3</li>
                </ul>
              </nav>
            </div>
            <div className={`w-[${isExpanded ? '83%' : '100%'}]`}>
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
