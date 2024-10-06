export interface FormContainerProps {
  selectedSpeciesType: string;
  songTypeOptions: Array<SelectOptions>;
  certaintyLevelOptions: Array<SelectOptions>;
  completudeOptions: Array<SelectOptions>;
  actions: {
    onChangeSelectedSpeciesType: (selectedSpeciesType: string) => void;
  };
}

export interface FormContainerArgs {}

export interface ComboBoxFormProps {
  species: Array<{ [x: string]: string }>;
  speciesTypes: Array<string>;
}

export interface SelectOptions {
  value: string;
  label: string;
}
