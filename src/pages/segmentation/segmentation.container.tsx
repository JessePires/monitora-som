import { SegmentationContainerArgs } from './segmentation.types';

import { ContainerWithProps } from '@/common/types/container.type';

export const SpectrogramContainer = (props: ContainerWithProps<SegmentationContainerArgs>): JSX.Element => {
  const audioUrls = [
    'src/assets/audio/W52753S23867_20200124_050000.wav',
    'src/assets/audio/W52753S23867_20200124_053000.wav',
  ];

  return props.children({
    audioUrls,
  });
};
