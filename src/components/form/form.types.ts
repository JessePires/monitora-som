import { RefObject } from 'react';

export interface FormContainerProps {
  selectedSpeciesType: string;
  songTypeOptions: Array<SelectOptions>;
  certaintyLevelOptions: Array<SelectOptions>;
  completudeOptions: Array<SelectOptions>;
  FormSchema: any;
  form: any;
  globalContext: any;
  actions: {
    onChangeSelectedSpeciesType: (selectedSpeciesType: string) => void;
    progress: () => number;
  };
}

export interface FormContainerArgs {}

export interface ComboBoxFormProps {
  species: Array<{ [x: string]: string }>;
  speciesTypes: Array<string>;
  spectrogramRef: RefObject<HTMLCanvasElement>;
  onSubmit: () => void;
}

export interface SelectOptions {
  value: string;
  label: string;
}
