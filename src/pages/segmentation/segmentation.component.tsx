import * as Containers from './segmentation.container';
import * as Styles from './segmentation.styles';
import { SegmentationContainerArgs } from './segmentation.types';

import DrawableSpectrogram from '@/components/spectrogram/spectrogram.component';

const Segmentation = (): JSX.Element => {
  return (
    <Containers.SpectrogramContainer>
      {(containerProps: SegmentationContainerArgs): JSX.Element => {
        return (
          <Styles.ScreenWrapper>
            <DrawableSpectrogram
              audioUrls={containerProps.audioUrls}
              spectrogramWidth={1024}
              spectrogramHeight={512}
              maxFrequencyKHz={20}
              sampleRate={44100}
              nFFT={1024}
            />
          </Styles.ScreenWrapper>
        );
      }}
    </Containers.SpectrogramContainer>
  );
};

export default Segmentation;
