import './App.css';

import 'wavesurfer.js/dist/wavesurfer';
import DrawableSpectrogram from './components/spectrogram/spectrogram.component';

const audioUrls = [
  'src/assets/audio/W52753S23867_20200124_050000.wav',
  'src/assets/audio/W52753S23867_20200124_053000.wav',
];

function App() {
  return (
    <div style={{ marginTop: '300px' }}>
      <DrawableSpectrogram spectrogramWidth={1080} spectrogramHeight={300} audioUrls={audioUrls} maxFrequencyKHz={20} />
    </div>
  );
}

export default App;
