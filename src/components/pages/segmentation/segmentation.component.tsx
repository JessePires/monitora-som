import * as Styles from './segmentation.styles';

import DrawableSpectrogram from '@/components/spectrogram/spectrogram.component';

const Segmentation = (): JSX.Element => {
  const audioUrls = [
    'src/assets/audio/W52753S23867_20200124_050000.wav',
    'src/assets/audio/W52753S23867_20200124_053000.wav',
  ];

  return (
    <Styles.ScreenWrapper>
      <div style={{ marginTop: '300px' }}>
        <DrawableSpectrogram
          audioUrls={audioUrls}
          spectrogramWidth={1024}
          spectrogramHeight={512}
          sampleRate={44100}
          nFFT={1024}
          maxFrequencyKHz={20}
        />
      </div>
    </Styles.ScreenWrapper>
  );
};

export default Segmentation;
