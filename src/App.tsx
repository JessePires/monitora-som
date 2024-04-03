import { useCallback, useEffect, useRef, useState } from 'react';

import './App.css';
import { useWavesurfer } from '@wavesurfer/react';
import createColormap from 'colormap';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';
import Spectrogram from 'wavesurfer.js/dist/plugins/spectrogram.esm.js';

import 'wavesurfer.js/dist/wavesurfer';
import CanvasDrawing from './components/canvas/canvas.component';
import DrawableSpectrogram from './components/spectrogram/spectrogram.component';
import { formatTime } from './utils/formatTime';

const audioUrls = [
  'src/assets/audio/W52753S23867_20200124_050000.wav',
  'src/assets/audio/W52753S23867_20200124_053000.wav',
];

function App() {
  return (
    <div
      style={
        {
          // width: '100%',
          // padding: '10px',
          // display: 'flex',
          // flexDirection: 'column',
          // justifyContent: 'center',
        }
      }
    >
      <DrawableSpectrogram audioUrls={audioUrls} />
    </div>
  );
}

export default App;
