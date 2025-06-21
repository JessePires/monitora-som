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
  const spectrogramRefTest = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  const globalContext = useContext(GlobalContext);

  const [scrollAmount, setScrollAmount] = useState<number>(0);
  const [visibleTimes, setVisibleTimes] = useState<TimeFrequencyDots>({ start: 0, end: 0 });
  const [visibleFrequencies, setVisibleFrequencies] = useState<TimeFrequencyDots>({ start: 0, end: 0 });
  const [labelInput, setLabelInput] = useState<string>('');
  const [species, setSpecies] = useState<Array<SpeciesData>>([]);
  const [headers, setHeaders] = useState<Array<string>>([]);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(false);
  const [isMarkerDragging, setIsMarkerDragging] = useState<boolean>(false);
  const [markerPosition, setMarkerPosition] = useState(0);
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const onChangeExpanded = (value: boolean): void => {
    setIsSidebarExpanded(value);
  };

  const spectrogramColorMap = createColormap({
    colormap: 'inferno',
    nshades: 256,
    format: 'float',
    alpha: 1,
  });

  const wavesurferHook = useWavesurfer({ container: containerRef, height: 0 });

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
      (event.currentTarget.scrollLeft / event.currentTarget.scrollWidth) *
      (wavesurferHook.wavesurfer.getDuration() * 1000);
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
    setMarkerPosition(0);
  };

  const stepBack = () => {
    const newIndex = globalContext.audioFiles.indexOf(globalContext.selectedAudio);
    globalContext.actions.handleSetSelectedAudio(
      globalContext.audioFiles[(newIndex - 1) % globalContext.audioFiles.length],
    );
    setMarkerPosition(0);
  };

  const moveOnToNextUnlabeled = () => {
    if (globalContext.actions.isSquaresObjectEmpty()) {
      return stepForward();
    }

    const nextAudio = globalContext.actions.findNextUnlabeled();
    if (nextAudio !== null) {
      globalContext.actions.handleSetSelectedAudio(nextAudio);
    }

    setMarkerPosition(0);
  };

  const goBackToPreviousUnlabeled = () => {
    if (globalContext.actions.isSquaresObjectEmpty()) {
      setMarkerPosition(0);
      return stepBack();
    }

    const previousAudio = globalContext.actions.findPreviousUnlabeled();
    if (previousAudio !== null) {
      globalContext.actions.handleSetSelectedAudio(previousAudio);
    }
  };

  const onPlayPause = useCallback(() => {
    wavesurferHook.wavesurfer && wavesurferHook.wavesurfer.playPause();
  }, [wavesurferHook.wavesurfer]);

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
    if (isMarkerDragging && containerRef.current && wavesurferHook.wavesurfer) {
      const rect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRef.current.offsetWidth;
      const duration = wavesurferHook.wavesurfer.getDuration();

      let newPosition = event.clientX - rect.left;

      newPosition = Math.max(0, Math.min(newPosition, containerWidth));

      setMarkerPosition(newPosition);

      const newTime = (newPosition / containerWidth) * duration;
      wavesurferHook.wavesurfer.setTime(newTime);
    }
  };

  const onConfirmMarkAsNoLabels = (): void => {
    globalContext.actions.removeAllAudioSquares();
    globalContext.actions.handleSetSquareInfo(null, {
      availableSpecies: '-',
      speciesName: '-',
      type: '-',
      certaintyLevel: '-',
      completude: '-',
      additionalComments: '-',
    });
    setShowDialog(false);
    globalContext.actions.setIsNoLabelsMarkerChecked(true);
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
    if (globalContext.selectedAudio && wavesurferHook.wavesurfer) {
      if (!globalContext.isSelectedAudioAlreadyRendered) {
        wavesurferHook.wavesurfer.loadBlob(
          new Blob([globalContext.selectedAudio], { type: globalContext.selectedAudio.type }),
        );

        // const fftSamples = Math.pow(2, Math.ceil(Math.log2(globalContext.fftSize)));
        const hopLength = Math.floor(
          globalContext.fftSizeOptions[globalContext.fftSizeIndex] * (1 - globalContext.windowOverlap / 100),
        );

        wavesurferHook.wavesurfer.registerPlugin(
          SpectrogramPlugin.create({
            labels: false,
            colorMap: spectrogramColorMap,
            container: containerRef.current,
            height: 512,
            fftSamples: globalContext.fftSizeOptions[globalContext.fftSizeIndex],
            windowFunc: 'hamming',
            noverlap: hopLength,
          }),
        );

        wavesurferHook.wavesurfer.registerPlugin(RegionsPlugin.create());
        globalContext.actions.setIsSelectedAudioAlreadyRendered(true);
      }
    }
  }, [
    globalContext.selectedAudio,
    wavesurferHook.wavesurfer,
    props.maxFrequencyKHz,
    props.spectrogramHeight,
    spectrogramColorMap,
    globalContext.fftSize,
    globalContext.windowOverlap,
  ]);

  useEffect(() => {
    if (wavesurferHook.wavesurfer) {
      const updateMarkerPosition = () => {
        if (!isMarkerDragging && containerRef.current) {
          const currentTime = wavesurferHook.wavesurfer.getCurrentTime();
          const duration = wavesurferHook.wavesurfer.getDuration();
          const containerWidth = containerRef.current.offsetWidth;

          const newPosition = (currentTime / duration) * containerWidth;

          setMarkerPosition(Math.max(0, Math.min(newPosition, containerWidth)));
        }
      };

      wavesurferHook.wavesurfer.on('audioprocess', updateMarkerPosition);
      wavesurferHook.wavesurfer.on('seeking', updateMarkerPosition);

      return () => {
        wavesurferHook.wavesurfer.un('audioprocess', updateMarkerPosition);
        wavesurferHook.wavesurfer.un('seeking', updateMarkerPosition);
      };
    }
  }, [wavesurferHook.wavesurfer, isMarkerDragging]);

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
    spectrogramRefTest,
    frequencies,
    visibleTimes,
    visibleFrequencies,
    currentTime: wavesurferHook.currentTime,
    isPlaying: wavesurferHook.isPlaying,
    labelInput,
    headers,
    species,
    isSidebarExpanded,
    markerRef,
    arrowRef,
    markerPosition,
    wavesurfer: wavesurferHook.wavesurfer,
    showDialog,
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
      setShowDialog,
      onConfirmMarkAsNoLabels,
    },
  });
};
