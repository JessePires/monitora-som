import { useState } from 'react';

import { FormContainerArgs, FormContainerProps } from './form.types';

import { ContainerWithProps } from '@/common/types/container.type';

export const SpectrogramContainer = (props: ContainerWithProps<FormContainerProps, FormContainerArgs>): JSX.Element => {
  const [selectedSpeciesType, setSelectedSpeciesType] = useState('');

  const onChangeSelectedSpeciesType = (selectedSpeciesType: string) => {
    setSelectedSpeciesType(selectedSpeciesType);
  };

  console.log('AQUI', selectedSpeciesType);

  return props.children({
    selectedSpeciesType,
    actions: {
      onChangeSelectedSpeciesType,
    },
  });
};
