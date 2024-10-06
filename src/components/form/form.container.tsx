import { useMemo, useState } from 'react';

import { FormContainerArgs, FormContainerProps, SelectOptions } from './form.types';

import { ContainerWithProps } from '@/common/types/container.type';
import { CertaintyLevelEnum, CertaintyLevelEnumLabels, CertaintyLevelEnumToExport } from '@/utils/enums/certainty.enum';
import { CompletudeEnum, CompletudeEnumLabels, CompletudeEnumToExport } from '@/utils/enums/completude.enum';
import { SongTypesEnum, SongTypesEnumLabels, SongTypesEnumLabelsToExport } from '@/utils/enums/types.enum';

export const SpectrogramContainer = (props: ContainerWithProps<FormContainerProps, FormContainerArgs>): JSX.Element => {
  const [selectedSpeciesType, setSelectedSpeciesType] = useState('');

  const onChangeSelectedSpeciesType = (selectedSpeciesType: string) => {
    setSelectedSpeciesType(selectedSpeciesType);
  };

  const songTypeOptions: Array<SelectOptions> = useMemo((): Array<SelectOptions> => {
    const songTypesArray: Array<SelectOptions> = [];
    Object.keys(SongTypesEnum).forEach((songTypesKey: string) => {
      const value = SongTypesEnumLabelsToExport[songTypesKey as keyof typeof SongTypesEnumLabelsToExport];
      const label = SongTypesEnumLabels[songTypesKey as keyof typeof SongTypesEnumLabels];

      if (value !== undefined && label !== undefined) {
        songTypesArray.push({
          value,
          label,
        });
      }
    });
    return songTypesArray;
  }, []);

  const certaintyLevelOptions: Array<SelectOptions> = useMemo((): Array<SelectOptions> => {
    const certaintyLevelArray: Array<SelectOptions> = [];
    Object.keys(CertaintyLevelEnum).forEach((certaintyLevelKey: string) => {
      const value = CertaintyLevelEnumToExport[certaintyLevelKey as keyof typeof CertaintyLevelEnumToExport];
      const label = CertaintyLevelEnumLabels[certaintyLevelKey as keyof typeof CertaintyLevelEnumLabels];

      if (value !== undefined && label !== undefined) {
        certaintyLevelArray.push({
          value,
          label,
        });
      }
    });
    return certaintyLevelArray;
  }, []);

  const completudeOptions: Array<SelectOptions> = useMemo((): Array<SelectOptions> => {
    const completudeArray: Array<SelectOptions> = [];
    Object.keys(CompletudeEnum).forEach((certaintyLevelKey: string) => {
      const value = CompletudeEnumToExport[certaintyLevelKey as keyof typeof CompletudeEnumToExport];
      const label = CompletudeEnumLabels[certaintyLevelKey as keyof typeof CompletudeEnumLabels];

      if (value !== undefined && label !== undefined) {
        completudeArray.push({
          value,
          label,
        });
      }
    });
    return completudeArray;
  }, []);

  return props.children({
    selectedSpeciesType,
    songTypeOptions,
    certaintyLevelOptions,
    completudeOptions,
    actions: {
      onChangeSelectedSpeciesType,
    },
  });
};
