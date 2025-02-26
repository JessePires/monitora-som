import * as Styles from './segmentation.styles';

import DrawableSpectrogram from '@/components/spectrogram/spectrogram.component';

const Segmentation = (): JSX.Element => {
  return (
    <Styles.ScreenWrapper>
      <DrawableSpectrogram
        spectrogramWidth={1840}
        spectrogramHeight={512}
        maxFrequencyKHz={30}
        sampleRate={44100}
        nFFT={2048}
      />
    </Styles.ScreenWrapper>
  );
};

export default Segmentation;
