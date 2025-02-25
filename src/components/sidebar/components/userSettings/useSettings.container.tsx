import { useContext } from 'react';

import { SpectrogramSettingsContainerArgs } from './userSettings.types';

import { ContainerWithProps } from '@/common/types/container.type';
import { GlobalContext } from '@/contexts/global/global.context';

export const SpectrogramSettingsContainer = (
  props: ContainerWithProps<SpectrogramSettingsContainerArgs>,
): JSX.Element => {
  const globalContext = useContext(GlobalContext);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []).filter((file) => file.type.startsWith('audio'));
    globalContext.actions.handleSetRecords(files);
  };

  const handleRoiSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []).filter((file) => file.type === 'text/csv');
    globalContext.actions.handleSetRoiTables(files);
  };

  return props.children({
    globalContext,
    actions: {
      handleFileSelect,
      handleRoiSelect,
    },
  });
};
