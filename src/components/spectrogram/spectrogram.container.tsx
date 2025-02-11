import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { useWavesurfer } from '@wavesurfer/react';
import createColormap from 'colormap';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';
import SpectrogramPlugin from 'wavesurfer.js/dist/plugins/spectrogram.js';

import {
  SpeciesData,
  SpectrogramContainerArgs,
  SpectrogramContainerProps,
  TimeFrequencyDots,
} from './spectrogram.types';

import { ContainerWithProps } from '@/common/types/container.type';
import { GlobalContext } from '@/contexts/global/global.context';

export const SpectrogramContainer = (
  props: ContainerWithProps<SpectrogramContainerProps, SpectrogramContainerArgs>,
): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const spectrogramRef = useRef<HTMLCanvasElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  const globalContext = useContext(GlobalContext);
  console.log('globalContext', globalContext);

  const [currentAudioIndex, setCurrentAudioIndex] = useState<number>(0);
  const [scrollAmount, setScrollAmount] = useState<number>(0);
  const [visibleTimes, setVisibleTimes] = useState<TimeFrequencyDots>({ start: 0, end: 0 });
  const [visibleFrequencies, setVisibleFrequencies] = useState<TimeFrequencyDots>({ start: 0, end: 0 });
  const [labelInput, setLabelInput] = useState<string>('');
  const [species, setSpecies] = useState<Array<SpeciesData>>([]);
  const [headers, setHeaders] = useState<Array<string>>([]);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(false);
  const [isMarkerDragging, setIsMarkerDragging] = useState<boolean>(false);
  const [markerPosition, setMarkerPosition] = useState(0);

  const onChangeExpanded = (value: boolean): void => {
    setIsSidebarExpanded(value);
  };

  const spectrogramColorMap = createColormap({
    colormap: 'inferno',
    nshades: 256,
    format: 'float',
    alpha: 1,
  });

  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    height: 0,
  });

  const calculateFrequencies = useCallback(() => {
    const frequencies = [];
    const step = props.maxFrequencyKHz / 4;
    for (let i = 0; i <= 4; i++) {
      frequencies.push(i * step);
    }
    return frequencies.reverse();
  }, [props.maxFrequencyKHz]);

  const calculateTimeFromColumn = (columnIndex: number): number => {
    const dt = props.nFFT / props.sampleRate;
    const dtMs = dt * 1000;

    return columnIndex * dtMs - scrollAmount * dtMs;
  };

  const calculateFrequencyFromRow = (rowIndex: number): number => {
    const nBins = props.nFFT / 2;

    return (rowIndex / nBins) * (props.sampleRate / 2); // Frequency in Hz
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const newScrollAmount =
      (event.currentTarget.scrollLeft / event.currentTarget.scrollWidth) * (wavesurfer.getDuration() * 1000);
    setScrollAmount(newScrollAmount);

    const visibleStartTime = calculateTimeFromColumn(0);
    const visibleEndTime = calculateTimeFromColumn(props.spectrogramWidth);
    setVisibleTimes({ start: visibleStartTime, end: visibleEndTime });
  };

  const frequencies = calculateFrequencies();

  const stepForward = () => {
    const newIndex = globalContext.audioFiles.indexOf(globalContext.selectedAudio);
    globalContext.actions.handleSetSelectedAudio(
      globalContext.audioFiles[(newIndex + 1) % globalContext.audioFiles.length],
    );
  };

  const stepBack = () => {
    const newIndex = globalContext.audioFiles.indexOf(globalContext.selectedAudio);
    globalContext.actions.handleSetSelectedAudio(
      globalContext.audioFiles[(newIndex - 1) % globalContext.audioFiles.length],
    );
  };

  const moveOnToNextUnlabeled = () => {};

  const goBackToPreviousUnlabeled = () => {
    console.log('Anterior não rotulado');
  };

  const onPlayPause = useCallback(() => {
    wavesurfer && wavesurfer.playPause();
  }, [wavesurfer]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    spectrogramRef.current?.createLabel(event);
  };

  const handleDeleteSelectedSquare = (event: KeyboardEvent) => {
    spectrogramRef.current?.deleteSquare(event);
  };

  const handleMarkerMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsMarkerDragging(true);
  };

  const handleMarkerMouseMove = (event: MouseEvent) => {
    if (isMarkerDragging && containerRef.current && wavesurfer) {
      const rect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRef.current.offsetWidth;
      const duration = wavesurfer.getDuration();

      let newPosition = event.clientX - rect.left;

      newPosition = Math.max(0, Math.min(newPosition, containerWidth));

      setMarkerPosition(newPosition);

      const newTime = (newPosition / containerWidth) * duration;
      wavesurfer.setTime(newTime);
    }
  };

  const handleMarkerMouseUp = () => {
    setIsMarkerDragging(false);
  };

  useEffect(() => {
    if (isMarkerDragging) {
      document.addEventListener('mousemove', handleMarkerMouseMove);
      document.addEventListener('mouseup', handleMarkerMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMarkerMouseMove);
      document.removeEventListener('mouseup', handleMarkerMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMarkerMouseMove);
      document.removeEventListener('mouseup', handleMarkerMouseUp);
    };
  }, [isMarkerDragging]);

  useEffect(() => {
    if (globalContext.selectedAudio && wavesurfer) {
      if (!globalContext.isSelectedAudioAlreadyRendered) {
        // wavesurfer.loadBlob(globalContext.selectedAudio); // Carrega o áudio
        wavesurfer.loadBlob(new Blob([globalContext.selectedAudio], { type: globalContext.selectedAudio.type }));

        const fftSamples = Math.pow(2, Math.ceil(Math.log2((props.maxFrequencyKHz * 1000) / 20)));

        wavesurfer.registerPlugin(
          SpectrogramPlugin.create({
            labels: false,
            height: props.spectrogramHeight,
            colorMap: spectrogramColorMap,
            container: containerRef.current,
            fftSamples: fftSamples,
          }),
        );

        wavesurfer.registerPlugin(RegionsPlugin.create());

        globalContext.actions.setIsSelectedAudioAlreadyRendered(true);
      }
    }
  }, [globalContext.selectedAudio, wavesurfer, props.maxFrequencyKHz, props.spectrogramHeight, spectrogramColorMap]);

  // useEffect(() => {
  //   if (wavesurfer) {
  //     const updateMarkerPosition = () => {
  //       const currentTime = wavesurfer.getCurrentTime();
  //       const duration = wavesurfer.getDuration();

  //       if (markerRef.current && containerRef.current) {
  //         const containerWidth = containerRef.current.offsetWidth;
  //         const markerPosition = (currentTime / duration) * containerWidth;

  //         markerRef.current.style.left = `${markerPosition}px`;
  //       }
  //     };

  //     wavesurfer.on('audioprocess', updateMarkerPosition);
  //     wavesurfer.on('seeking', updateMarkerPosition);

  //     return () => {
  //       wavesurfer.un('audioprocess', updateMarkerPosition);
  //       wavesurfer.un('seeking', updateMarkerPosition);
  //     };
  //   }
  // }, [wavesurfer]);

  useEffect(() => {
    if (wavesurfer) {
      const updateMarkerPosition = () => {
        if (!isMarkerDragging && containerRef.current) {
          const currentTime = wavesurfer.getCurrentTime();
          const duration = wavesurfer.getDuration();
          const containerWidth = containerRef.current.offsetWidth;

          const newPosition = (currentTime / duration) * containerWidth;

          setMarkerPosition(Math.max(0, Math.min(newPosition, containerWidth))); // Garante que não saia do espectrograma
        }
      };

      wavesurfer.on('audioprocess', updateMarkerPosition);
      wavesurfer.on('seeking', updateMarkerPosition);

      return () => {
        wavesurfer.un('audioprocess', updateMarkerPosition);
        wavesurfer.un('seeking', updateMarkerPosition);
      };
    }
  }, [wavesurfer, isMarkerDragging]);

  useEffect(() => {
    const visibleStartTime = calculateTimeFromColumn(0);
    const visibleEndTime = calculateTimeFromColumn(props.spectrogramWidth);
    setVisibleTimes({ start: visibleStartTime, end: visibleEndTime });

    const visibleStartFrequency = calculateFrequencyFromRow(0);
    const visibleEndFrequency = calculateFrequencyFromRow(props.spectrogramHeight);
    setVisibleFrequencies({ start: visibleStartFrequency, end: visibleEndFrequency });
  }, [scrollAmount, props.spectrogramWidth, props.spectrogramHeight]);

  useEffect(() => {
    const worker: Worker = new Worker('./src/workers/loadSpecies.js');

    worker.postMessage(new URL('../../assets/labels/sp_labels.csv', import.meta.url).toString());

    worker.onmessage = (event) => {
      const result = event.data;
      setHeaders(result.headers);
      setSpecies(result.data);
    };

    return () => {
      worker.terminate();
    };
  }, []);

  return props.children({
    containerRef,
    spectrogramRef,
    frequencies,
    visibleTimes,
    visibleFrequencies,
    currentTime,
    isPlaying,
    currentAudioIndex,
    labelInput,
    headers,
    species,
    isSidebarExpanded,
    markerRef,
    arrowRef,
    markerPosition,
    actions: {
      handleScroll,
      stepForward,
      moveOnToNextUnlabeled,
      goBackToPreviousUnlabeled,
      stepBack,
      onPlayPause,
      handleKeyPress,
      setLabelInput,
      handleDeleteSelectedSquare,
      onChangeExpanded,
      handleMarkerMouseDown,
    },
  });
};
