import { useContext, useEffect, useMemo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { FormContainerArgs, FormContainerProps, SelectOptions } from './form.types';

import { ContainerWithProps } from '@/common/types/container.type';
import { GlobalContext } from '@/contexts/global/global.context';
import { CertaintyLevelEnum, CertaintyLevelEnumLabels, CertaintyLevelEnumToExport } from '@/utils/enums/certainty.enum';
import { CompletudeEnum, CompletudeEnumLabels, CompletudeEnumToExport } from '@/utils/enums/completude.enum';
import { SongTypesEnum, SongTypesEnumLabels, SongTypesEnumLabelsToExport } from '@/utils/enums/types.enum';

export const SpectrogramContainer = (props: ContainerWithProps<FormContainerProps, FormContainerArgs>): JSX.Element => {
  const globalContext = useContext(GlobalContext);
  const [selectedSpeciesType, setSelectedSpeciesType] = useState('');

  const FormSchema = z.object({
    records: z.string({ required_error: 'Selecione a gravação' }),
    roiTable: z.string({ required_error: 'Selecione a tabela de região de interesse' }),
    availableSpecies: z.string({
      required_error: 'Selecione uma categoria de espécies.',
    }),
    speciesName: z.string({
      required_error: 'Selecione um rótulo.',
    }),
    type: z.string({
      required_error: 'Selecione um tipo.',
    }),
    certaintyLevel: z.string({
      required_error: 'Selecione o nível de certeza.',
    }),
    completude: z.string({
      required_error: 'Selecione o nível de certeza.',
    }),
    additionalComments: z.string().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onChangeSelectedSpeciesType = (selectedSpeciesType: string) => {
    setSelectedSpeciesType(selectedSpeciesType);
  };

  const progress = (): number => {
    const total = globalContext.audioFiles.length;
    const alreadyLabeled = globalContext.actions.getTotalLabeled();

    return (100 * alreadyLabeled) / total;
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

  useEffect(() => {
    if (globalContext.selectedAudio) form.setValue('records', globalContext.selectedAudio.name);
  }, [globalContext.selectedAudio]);

  return props.children({
    selectedSpeciesType,
    songTypeOptions,
    certaintyLevelOptions,
    completudeOptions,
    FormSchema,
    form,
    globalContext,
    actions: {
      progress,
      onChangeSelectedSpeciesType,
    },
  });
};
