import './App.css';

import 'wavesurfer.js/dist/wavesurfer';
import DrawableSpectrogram from './components/spectrogram/spectrogram.component';

const audioUrls = [
  'src/assets/audio/W52753S23867_20200124_050000.wav',
  'src/assets/audio/W52753S23867_20200124_053000.wav',
];

function App() {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <DrawableSpectrogram spectrogramWidth={1080} spectrogramHeight={350} audioUrls={audioUrls} maxFrequencyKHz={10} />
    </div>
  );
}

export default App;
