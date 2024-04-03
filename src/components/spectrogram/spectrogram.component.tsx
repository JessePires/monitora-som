import { useCallback, useEffect, useRef, useState } from 'react';

import { useWavesurfer } from '@wavesurfer/react';
import createColormap from 'colormap';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';
import SpectrogramPlugin from 'wavesurfer.js/dist/plugins/spectrogram.js';

import { formatTime } from '../../utils/formatTime';
import CanvasDrawing from '../canvas/canvas.component';

const DrawableSpectrogram = ({ audioUrls }: { audioUrls: Array<string> }): JSX.Element => {
  const containerRef = useRef(null);

  const [urlIndex, setUrlIndex] = useState(0);

  const spectrogramColorMap = createColormap({
    colormap: 'inferno',
    nshades: 256,
    format: 'float',
    alpha: 1,
  });

  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    height: 0,

    url: audioUrls[urlIndex],
  });

  useEffect(() => {
    if (containerRef.current && wavesurfer) {
      // wavesurfer.current = WaveSurfer.create({
      //   container: containerRef.current,
      //   height: 800,
      //   width: 500,
      //   waveColor: 'rgb(200, 0, 200)',
      //   progressColor: 'rgb(100, 0, 100)',
      //   url: '/src/teste.wav',
      //   sampleRate: 22050,
      // });
      // console.log('container', containerRef);

      // Initialize the Spectrogram plugin
      if (wavesurfer) {
        wavesurfer.registerPlugin(
          SpectrogramPlugin.create({
            labels: false,
            height: 300,
            colorMap: spectrogramColorMap,
            container: containerRef.current,
          }),
        );

        wavesurfer.registerPlugin(RegionsPlugin.create());
      }
    }
  }, [wavesurfer]);

  const stepForward = useCallback(() => {
    setUrlIndex((index) => (index + 1) % audioUrls.length);
  }, []);

  const stepBack = useCallback(() => {
    setUrlIndex((index) => (index - 1) % audioUrls.length);
  }, []);

  const onPlayPause = useCallback(() => {
    wavesurfer && wavesurfer.playPause();
  }, [wavesurfer]);

  return (
    <>
      <div style={{ position: 'relative' }}>
        <div ref={containerRef} style={{ background: 'red', marginTop: '-54px' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 100 }}>
          <CanvasDrawing />
        </div>
      </div>

      <p>Current time: {formatTime(currentTime)}</p>
      <div
        style={{
          margin: '1em 0',
          display: 'flex',
          gap: '1em',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <button onClick={stepBack} disabled={urlIndex === 0}>
          Retroceda
        </button>

        <button onClick={onPlayPause} style={{ minWidth: '5em' }}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        <button onClick={stepForward} disabled={urlIndex === audioUrls.length - 1}>
          Avance
        </button>
      </div>
    </>
  );
};

export default DrawableSpectrogram;
