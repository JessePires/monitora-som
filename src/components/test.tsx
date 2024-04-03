// import React, { useEffect, useRef } from 'react';

// import WaveSurfer from 'wavesurfer.js';
// import SpectrogramPlugin from 'wavesurfer.js/dist/plugins/spectrogram.js';

// const AudioSpectrogram = ({ audioData }) => {
//   const waveformRef = useRef<string | HTMLElement>('');

//   useEffect(() => {
//     if (audioData) {
//       // Criando um colormap com 256 cores
//       const colormap = [];
//       for (let i = 0; i < 256; i++) {
//         const color = [
//           i / 256, // Componente vermelho
//           (255 - i) / 256, // Componente verde
//           0, // Componente azul
//           1, // Canal de transparência
//         ];
//         colormap.push(color);
//       }

//       const wavesurfer = WaveSurfer.create({
//         container: waveformRef.current,
//         backend: 'WebAudio',
//         height: 200,
//         progressColor: 'purple',
//         waveColor: 'violet',
//         cursorColor: 'navy',
//         plugins: [
//           SpectrogramPlugin.create({
//             // wavesurfer: wavesurfer,
//             container: '#wave-spectrogram',
//             labels: true,
//             colorMap: colormap,
//           }),
//         ],
//       });

//       wavesurfer.loadBlob(new Blob([audioData]));

//       // // Configurar faixa de frequências (exemplo: de 500 Hz a 2000 Hz)
//       // wavesurfer.backend.setPeaks([]);
//       // wavesurfer.setFilters([wavesurfer.backend.ac.createBiquadFilter(), wavesurfer.backend.ac.createBiquadFilter()]);
//       // wavesurfer.backend.setFilter([
//       //   { type: 'lowpass', frequency: 2000 },
//       //   { type: 'highpass', frequency: 500 },
//       // ]);

//       return () => wavesurfer.destroy();
//     }
//   }, [audioData]);

//   return <div id="wave-spectrogram" ref={waveformRef} />;
// };

// export default AudioSpectrogram;
