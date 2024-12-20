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

  const { squares, selectedAudio, isSelectedAudioAlreadyRendered, actions } = useContext(GlobalContext);

  const [urlIndex, setUrlIndex] = useState<number>(0);
  const [scrollAmount, setScrollAmount] = useState<number>(0);
  const [visibleTimes, setVisibleTimes] = useState<TimeFrequencyDots>({ start: 0, end: 0 });
  const [visibleFrequencies, setVisibleFrequencies] = useState<TimeFrequencyDots>({ start: 0, end: 0 });
  const [labelInput, setLabelInput] = useState<string>('');
  const [species, setSpecies] = useState<Array<SpeciesData>>([]);
  const [headers, setHeaders] = useState<Array<string>>([]);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(false);

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

  const stepForward = useCallback(() => {
    setUrlIndex((index) => (index + 1) % props.audioUrls.length);
  }, [props.audioUrls.length]);

  const stepBack = useCallback(() => {
    setUrlIndex((index) => (index - 1 + props.audioUrls.length) % props.audioUrls.length);
  }, [props.audioUrls.length]);

  const onPlayPause = useCallback(() => {
    wavesurfer && wavesurfer.playPause();
  }, [wavesurfer]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    spectrogramRef.current?.createLabel(event);
  };

  const handleDeleteSelectedSquare = (event: KeyboardEvent) => {
    spectrogramRef.current?.deleteSquare(event);
  };

  // const exportSquares = () => {
  //   if (spectrogramRef.current) {
  //     const arrayContent = [['label, freq início, freq fim, tempo início, tempo fim, tipo, nível certeza, completude']];
  //     squares.forEach((square: Square) => {
  //       arrayContent.push([
  //         `${square.label},${square.start.y},${square.end.y},${square.start.x},${square.end.x},${square.type},${square.certaintyLevel},${square.completude}`,
  //       ]);
  //     });

  //     const csvContent = arrayContent.join('\n');
  //     const link = window.document.createElement('a');
  //     link.setAttribute('href', 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURI(csvContent));
  //     link.setAttribute('download', 'upload_data.csv');
  //     link.click();
  //   }
  // };

  useEffect(() => {
    if (selectedAudio && wavesurfer) {
      if (!isSelectedAudioAlreadyRendered) {
        wavesurfer.loadBlob(selectedAudio); // Carrega o áudio

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
        actions.setIsSelectedAudioAlreadyRendered(true);
      }
    }
  }, [selectedAudio, wavesurfer, props.maxFrequencyKHz, props.spectrogramHeight, spectrogramColorMap]);

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
    urlIndex,
    labelInput,
    headers,
    species,
    isSidebarExpanded,
    actions: {
      handleScroll,
      stepForward,
      stepBack,
      onPlayPause,
      handleKeyPress,
      setLabelInput,
      handleDeleteSelectedSquare,
      onChangeExpanded,
    },
  });
};
