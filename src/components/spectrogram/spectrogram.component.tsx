// import { useCallback, useEffect, useRef, useState } from 'react';

// import { useWavesurfer } from '@wavesurfer/react';
// import createColormap from 'colormap';
// import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';
// import SpectrogramPlugin from 'wavesurfer.js/dist/plugins/spectrogram.js';

// import { formatTime } from '../../utils/formatTime';
// import CanvasDrawing from '../canvas/canvas.component';

// const DrawableSpectrogram = ({
//   audioUrls,
//   spectrogramWidth,
//   spectrogramHeight,
//   maxFrequencyKHz, // Nova propriedade para a frequência máxima em kHz
// }: {
//   audioUrls: Array<string>;
//   spectrogramWidth: number;
//   spectrogramHeight: number;
//   maxFrequencyKHz: number; // Nova propriedade para a frequência máxima em kHz
// }): JSX.Element => {
//   const containerRef = useRef(null);
//   const [urlIndex, setUrlIndex] = useState(0);
//   const spectrogramColorMap = createColormap({
//     colormap: 'inferno',
//     nshades: 256,
//     format: 'float',
//     alpha: 1,
//   });
//   const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
//     container: containerRef,
//     height: 0,
//     url: audioUrls[urlIndex],
//   });

//   useEffect(() => {
//     if (containerRef.current && wavesurfer) {
//       if (wavesurfer) {
//         wavesurfer.registerPlugin(
//           SpectrogramPlugin.create({
//             labels: false,
//             height: spectrogramHeight,
//             colorMap: spectrogramColorMap,
//             container: containerRef.current,
//           }),
//         );

//         wavesurfer.registerPlugin(RegionsPlugin.create());
//       }
//     }
//   }, [wavesurfer]);

//   // Calcula as cinco frequências igualmente divididas
//   const calculateFrequencies = useCallback(() => {
//     const frequencies = [];
//     const step = maxFrequencyKHz / 4; // Dividindo em quatro partes para cinco labels
//     for (let i = 0; i <= 4; i++) {
//       frequencies.push(i * step);
//     }
//     console.log('frequencies', frequencies);

//     return frequencies;
//   }, [maxFrequencyKHz]);

//   const stepForward = useCallback(() => {
//     setUrlIndex((index) => (index + 1) % audioUrls.length);
//   }, []);

//   const stepBack = useCallback(() => {
//     setUrlIndex((index) => (index - 1) % audioUrls.length);
//   }, []);

//   const onPlayPause = useCallback(() => {
//     wavesurfer && wavesurfer.playPause();
//   }, [wavesurfer]);

//   const frequencies = calculateFrequencies(); // Obter as frequências calculadas

//   return (
//     <>
//       <div style={{ width: '100%' }}>
//         {/* Renderiza as labels de frequência */}
//         <div
//           style={{
//             marginTop: '300px',
//             position: 'relative',
//             height: `${spectrogramHeight - 100}px`,
//             float: 'left',
//             zIndex: 99999,
//           }}
//         >
//           {frequencies.map((freq) => (
//             <div
//               key={freq}
//               style={{
//                 position: 'absolute',
//                 bottom: `${(freq / maxFrequencyKHz) * 100}%`,
//                 background: 'red',
//                 width: '60px',
//                 fontSize: '14px',
//               }}
//             >
//               {freq.toFixed(1)} kHz
//             </div>
//           ))}
//         </div>

//         {/* Container do espectrograma */}
//         <div
//           ref={containerRef}
//           style={{
//             marginTop: '-100px',
//             width: spectrogramWidth,
//             height: 600,
//             float: 'left',
//           }}
//         />
//         <CanvasDrawing spectrogramWidth={spectrogramWidth} spectrogramHeight={spectrogramHeight} />
//       </div>

//       <p>Current time: {formatTime(currentTime)}</p>
//       <div
//         style={{
//           margin: '1em 0',
//           display: 'flex',
//           gap: '1em',
//           justifyContent: 'center',
//         }}
//       >
//         <button onClick={stepBack} disabled={urlIndex === 0}>
//           Retroceda
//         </button>

//         <button onClick={onPlayPause} style={{ minWidth: '5em' }}>
//           {isPlaying ? 'Pause' : 'Play'}
//         </button>

//         <button onClick={stepForward} disabled={urlIndex === audioUrls.length - 1}>
//           Avance
//         </button>
//       </div>
//     </>
//   );
// };

// export default DrawableSpectrogram;

import { useCallback, useEffect, useRef, useState } from 'react';

import { useWavesurfer } from '@wavesurfer/react';
import createColormap from 'colormap';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';
import SpectrogramPlugin from 'wavesurfer.js/dist/plugins/spectrogram.js';

import { formatTime } from '../../utils/formatTime';
import CanvasDrawing from '../canvas/canvas.component';

const DrawableSpectrogram = ({
  audioUrls,
  spectrogramWidth,
  spectrogramHeight,
}: {
  audioUrls: Array<string>;
  spectrogramWidth: number;
  spectrogramHeight: number;
}): JSX.Element => {
  const containerRef = useRef(null);
  const [urlIndex, setUrlIndex] = useState(0);
  const spectrogramColorMap = createColormap({
    colormap: 'inferno',
    nshades: 256,
    format: 'float',
    alpha: 1,
  });
  const maxFrequencyKHz = 10; // Frequência máxima em kHz
  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    height: 0,
    url: audioUrls[urlIndex],
  });

  useEffect(() => {
    if (containerRef.current && wavesurfer) {
      if (wavesurfer) {
        // const fftSamples = Math.ceil((maxFrequencyKHz * 1000) / 20); // 20Hz is a good resolution for the spectrogram
        // Calcular fftSamples como uma potência de 2 próxima do valor calculado anteriormente
        const fftSamples = Math.pow(2, Math.ceil(Math.log2((maxFrequencyKHz * 1000) / 20)));

        wavesurfer.registerPlugin(
          SpectrogramPlugin.create({
            labels: false,
            height: spectrogramHeight,
            colorMap: spectrogramColorMap,
            container: containerRef.current,
            fftSamples: fftSamples,
          }),
        );

        wavesurfer.registerPlugin(RegionsPlugin.create());
      }
    }
  }, [wavesurfer, maxFrequencyKHz, spectrogramHeight, spectrogramColorMap]);

  const calculateFrequencies = useCallback(() => {
    const frequencies = [];
    const step = maxFrequencyKHz / 4;
    for (let i = 0; i <= 4; i++) {
      frequencies.push(i * step);
    }
    return frequencies.reverse();
  }, [maxFrequencyKHz]);

  const stepForward = useCallback(() => {
    setUrlIndex((index) => (index + 1) % audioUrls.length);
  }, []);

  const stepBack = useCallback(() => {
    setUrlIndex((index) => (index - 1) % audioUrls.length);
  }, []);

  const onPlayPause = useCallback(() => {
    wavesurfer && wavesurfer.playPause();
  }, [wavesurfer]);

  const frequencies = calculateFrequencies();

  return (
    <>
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', position: 'relative', marginLeft: '300px', marginTop: '50px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {frequencies.map((freq) => (
              <div
                key={freq}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  zIndex: 999,
                }}
              >
                {freq.toFixed(1)} kHz -
              </div>
            ))}
          </div>
          <div
            ref={containerRef}
            style={{
              marginTop: '-100px',
              width: spectrogramWidth,
              height: spectrogramHeight,
            }}
          />
          <CanvasDrawing spectrogramWidth={spectrogramWidth} spectrogramHeight={spectrogramHeight} />
        </div>
      </div>

      <p>Current time: {formatTime(currentTime)}</p>
      <div
        style={{
          margin: '1em 0',
          display: 'flex',
          gap: '1em',
          justifyContent: 'center',
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
