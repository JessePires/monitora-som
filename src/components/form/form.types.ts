export interface FormContainerProps {
  selectedSpeciesType: string;
  actions: {
    onChangeSelectedSpeciesType: (selectedSpeciesType: string) => void;
  };
}

export interface FormContainerArgs {}

export interface ComboBoxFormProps {
  species: Array<{ [x: string]: string }>;
  speciesTypes: Array<string>;
}
