import { useCallback, useEffect, useRef, useState } from 'react';

import { useWavesurfer } from '@wavesurfer/react';
import createColormap from 'colormap';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';
import SpectrogramPlugin from 'wavesurfer.js/dist/plugins/spectrogram.js';

import { SpectrogramContainerArgs, SpectrogramContainerProps, TimeFrequencyDots } from './spectrogram.types';

import { ContainerWithProps } from '@/common/types/container.type';

export const SpectrogramContainer = (
  props: ContainerWithProps<SpectrogramContainerProps, SpectrogramContainerArgs>,
): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [urlIndex, setUrlIndex] = useState<number>(0);
  const [scrollAmount, setScrollAmount] = useState<number>(0);
  const [visibleTimes, setVisibleTimes] = useState<TimeFrequencyDots>({ start: 0, end: 0 });
  const [visibleFrequencies, setVisibleFrequencies] = useState<TimeFrequencyDots>({ start: 0, end: 0 });

  const spectrogramColorMap = createColormap({
    colormap: 'inferno',
    nshades: 256,
    format: 'float',
    alpha: 1,
  });

  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    height: 0,
    url: props.audioUrls[urlIndex],
  });

  useEffect(() => {
    if (containerRef.current && wavesurfer) {
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
    }
  }, [wavesurfer, props.maxFrequencyKHz, props.spectrogramHeight, spectrogramColorMap]);

  const calculateFrequencies = useCallback(() => {
    const frequencies = [];
    const step = props.maxFrequencyKHz / 4;
    for (let i = 0; i <= 4; i++) {
      frequencies.push(i * step);
    }
    return frequencies.reverse();
  }, [props.maxFrequencyKHz]);

  const calculateTimeFromColumn = (columnIndex: number): number => {
    const dt = props.nFFT / props.sampleRate; // Interval of time per column in seconds
    const dtMs = dt * 1000; // Convert to milliseconds

    return columnIndex * dtMs - scrollAmount * dtMs;
  };

  const calculateFrequencyFromRow = (rowIndex: number): number => {
    const nBins = props.nFFT / 2;

    return (rowIndex / nBins) * (props.sampleRate / 2); // Frequency in Hz
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const newScrollAmount = (event.target.scrollLeft / event.target.scrollWidth) * (wavesurfer.getDuration() * 1000); // Convert scrollLeft to ms
    setScrollAmount(newScrollAmount);

    const visibleStartTime = calculateTimeFromColumn(0);
    const visibleEndTime = calculateTimeFromColumn(props.spectrogramWidth);
    setVisibleTimes({ start: visibleStartTime, end: visibleEndTime });

    const visibleStartFrequency = calculateFrequencyFromRow(0);
    const visibleEndFrequency = calculateFrequencyFromRow(props.spectrogramHeight);
    setVisibleFrequencies({ start: visibleStartFrequency, end: visibleEndFrequency });
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

  useEffect(() => {
    const visibleStartTime = calculateTimeFromColumn(0);
    const visibleEndTime = calculateTimeFromColumn(props.spectrogramWidth);
    setVisibleTimes({ start: visibleStartTime, end: visibleEndTime });

    const visibleStartFrequency = calculateFrequencyFromRow(0);
    const visibleEndFrequency = calculateFrequencyFromRow(props.spectrogramHeight);
    setVisibleFrequencies({ start: visibleStartFrequency, end: visibleEndFrequency });
  }, [scrollAmount, props.spectrogramWidth, props.spectrogramHeight]);

  return props.children({
    containerRef,
    frequencies,
    visibleTimes,
    visibleFrequencies,
    currentTime,
    isPlaying,
    urlIndex,
    actions: {
      handleScroll,
      stepForward,
      stepBack,
      onPlayPause,
    },
  });
};
