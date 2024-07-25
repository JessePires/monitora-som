// import './App.css';

import 'wavesurfer.js/dist/wavesurfer';
import CanvasDrawing from './components/canvas/canvas.component';
import Segmentation from './components/pages/segmentation/segmentation.component';
import DrawableSpectrogram from './components/spectrogram/spectrogram.component';
import Spectrogram from './components/spectrogram/spectrogram.component';

// function App() {
//   return (
//     <div style={{ marginTop: '300px' }}>
//       {/* <DrawableSpectrogram
//         spectrogramWidth={1080}
//         spectrogramHeight={300}
//         audioUrls={audioUrls}
//         maxFrequencyKHz={20}
//         nFFT={1024}
//         sampleRate={44100}
//       /> */}
//       <DrawableSpectrogram
//         audioUrl={audioUrls[0]}
//         spectrogramWidth={1024}
//         spectrogramHeight={512}
//         sampleRate={44100}
//         nFFT={1024}
//         maxFrequencyKHz={20}
//       />
//       <CanvasDrawing spectrogramWidth={1024} spectrogramHeight={512} />
//     </div>
//   );
// }

function App() {
  return <Segmentation />;
}

export default App;
