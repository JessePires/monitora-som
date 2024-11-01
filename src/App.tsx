import './global.css';

import 'wavesurfer.js/dist/wavesurfer';
import { GlobalContextProvider } from './contexts/global/global.context';
import Segmentation from './pages/segmentation/segmentation.component';

function App() {
  return (
    <GlobalContextProvider>
      <Segmentation />
    </GlobalContextProvider>
  );
}

export default App;
