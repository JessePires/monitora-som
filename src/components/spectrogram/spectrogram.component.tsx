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
//   maxFrequencyKHz,
// }: {
//   audioUrls: Array<string>;
//   spectrogramWidth: number;
//   spectrogramHeight: number;
//   maxFrequencyKHz: number;
// }): JSX.Element => {
//   const containerRef = useRef(null);
//   const [urlIndex, setUrlIndex] = useState(0);
//   const [scrollAmount, setScrollAmount] = useState(0);
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
//         // const fftSamples = Math.ceil((maxFrequencyKHz * 1000) / 20); // 20Hz is a good resolution for the spectrogram
//         // Calcular fftSamples como uma potência de 2 próxima do valor calculado anteriormente
//         const fftSamples = Math.pow(2, Math.ceil(Math.log2((maxFrequencyKHz * 1000) / 20)));

//         wavesurfer.registerPlugin(
//           SpectrogramPlugin.create({
//             labels: false,
//             height: spectrogramHeight,
//             colorMap: spectrogramColorMap,
//             container: containerRef.current,
//             fftSamples: fftSamples,
//           }),
//         );

//         wavesurfer.registerPlugin(RegionsPlugin.create());
//       }
//     }
//   }, [wavesurfer, maxFrequencyKHz, spectrogramHeight, spectrogramColorMap]);

//   const calculateFrequencies = useCallback(() => {
//     const frequencies = [];
//     const step = maxFrequencyKHz / 4;
//     for (let i = 0; i <= 4; i++) {
//       frequencies.push(i * step);
//     }
//     return frequencies.reverse();
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

//   const frequencies = calculateFrequencies();

//   const calculateTimeFromColumn = (columnIndex) => {
//     const dt = nFFT / sampleRate; // Interval of time per column in seconds
//     const dtMs = dt * 1000; // Convert to milliseconds
//     return columnIndex * dtMs - scrollAmount * dtMs;
//   };

//   const calculateFrequencyFromRow = (rowIndex) => {
//     const nBins = nFFT / 2;
//     return (rowIndex / nBins) * (sampleRate / 2); // Frequency in Hz
//   };

//   const handleScroll = (event) => {
//     const newScrollAmount = (event.target.scrollLeft / event.target.scrollWidth) * (wavesurfer.getDuration() * 1000); // Convert scrollLeft to ms
//     setScrollAmount(newScrollAmount);
//   };

//   return (
//     <>
//       <div style={{ width: '100%' }}>
//         <div
//           style={{
//             display: 'flex',
//             position: 'relative',
//             marginLeft: '300px',
//           }}
//         >
//           <div
//             style={{
//               display: 'flex',
//               flexDirection: 'column',
//               justifyContent: 'space-between',
//               alignItems: 'flex-end',
//               height: `${spectrogramHeight}px`,
//             }}
//           >
//             {frequencies.map((freq) => (
//               <div
//                 key={freq}
//                 style={{
//                   display: 'flex',
//                   flexDirection: 'column',
//                   zIndex: 999,
//                 }}
//               >
//                 <span style={{ fontSize: '12px' }}>{freq.toFixed(1)} kHz -</span>
//               </div>
//             ))}
//           </div>
//           <div
//             ref={containerRef}
//             style={{
//               width: spectrogramWidth,
//               height: spectrogramHeight,
//             }}
//           />
//           <CanvasDrawing spectrogramWidth={spectrogramWidth} spectrogramHeight={spectrogramHeight} />
//         </div>
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
  maxFrequencyKHz,
  sampleRate,
  nFFT,
}: {
  audioUrls: Array<string>;
  spectrogramWidth: number;
  spectrogramHeight: number;
  maxFrequencyKHz: number;
  sampleRate: number;
  nFFT: number;
}): JSX.Element => {
  const containerRef = useRef(null);
  const [urlIndex, setUrlIndex] = useState(0);
  const [scrollAmount, setScrollAmount] = useState(0);
  const [visibleTimes, setVisibleTimes] = useState({ start: 0, end: 0 });
  const [visibleFrequencies, setVisibleFrequencies] = useState({ start: 0, end: 0 });

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
  }, [wavesurfer, maxFrequencyKHz, spectrogramHeight, spectrogramColorMap]);

  const calculateFrequencies = useCallback(() => {
    const frequencies = [];
    const step = maxFrequencyKHz / 4;
    for (let i = 0; i <= 4; i++) {
      frequencies.push(i * step);
    }
    return frequencies.reverse();
  }, [maxFrequencyKHz]);

  const calculateTimeFromColumn = (columnIndex) => {
    const dt = nFFT / sampleRate; // Interval of time per column in seconds
    const dtMs = dt * 1000; // Convert to milliseconds
    return columnIndex * dtMs - scrollAmount * dtMs;
  };

  const calculateFrequencyFromRow = (rowIndex) => {
    const nBins = nFFT / 2;

    return (rowIndex / nBins) * (sampleRate / 2); // Frequency in Hz
  };

  const handleScroll = (event) => {
    const newScrollAmount = (event.target.scrollLeft / event.target.scrollWidth) * (wavesurfer.getDuration() * 1000); // Convert scrollLeft to ms
    setScrollAmount(newScrollAmount);

    const visibleStartTime = calculateTimeFromColumn(0);
    const visibleEndTime = calculateTimeFromColumn(spectrogramWidth);
    setVisibleTimes({ start: visibleStartTime, end: visibleEndTime });

    const visibleStartFrequency = calculateFrequencyFromRow(0);
    const visibleEndFrequency = calculateFrequencyFromRow(spectrogramHeight);
    setVisibleFrequencies({ start: visibleStartFrequency, end: visibleEndFrequency });
  };

  useEffect(() => {
    const visibleStartTime = calculateTimeFromColumn(0);
    const visibleEndTime = calculateTimeFromColumn(spectrogramWidth);
    setVisibleTimes({ start: visibleStartTime, end: visibleEndTime });

    const visibleStartFrequency = calculateFrequencyFromRow(0);
    const visibleEndFrequency = calculateFrequencyFromRow(spectrogramHeight);
    setVisibleFrequencies({ start: visibleStartFrequency, end: visibleEndFrequency });
  }, [scrollAmount, spectrogramWidth, spectrogramHeight]);

  const stepForward = useCallback(() => {
    setUrlIndex((index) => (index + 1) % audioUrls.length);
  }, [audioUrls.length]);

  const stepBack = useCallback(() => {
    setUrlIndex((index) => (index - 1 + audioUrls.length) % audioUrls.length);
  }, [audioUrls.length]);

  const onPlayPause = useCallback(() => {
    wavesurfer && wavesurfer.playPause();
  }, [wavesurfer]);

  const frequencies = calculateFrequencies();

  return (
    <>
      <div style={{ width: '100%' }}>
        <div
          style={{
            display: 'flex',
            position: 'relative',
            marginLeft: '300px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              height: `${spectrogramHeight}px`,
            }}
          >
            {frequencies.map((freq) => (
              <div
                key={freq}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  zIndex: 999,
                }}
              >
                <span style={{ fontSize: '12px' }}>{freq.toFixed(1)} kHz -</span>
              </div>
            ))}
          </div>
          <div
            ref={containerRef}
            style={{
              width: spectrogramWidth,
              height: spectrogramHeight,
              overflowX: 'scroll',
            }}
            onScroll={handleScroll}
          >
            <CanvasDrawing spectrogramWidth={spectrogramWidth} spectrogramHeight={spectrogramHeight} />
          </div>
        </div>
      </div>

      <p>
        Visible time range: {visibleTimes.start.toFixed(2)} ms - {visibleTimes.end.toFixed(2)} ms
      </p>
      <p>
        Visible frequency range: {visibleFrequencies.start.toFixed(2)} Hz - {visibleFrequencies.end.toFixed(2)} Hz
      </p>

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
