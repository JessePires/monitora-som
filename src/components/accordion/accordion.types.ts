export interface AccordionContainerProps {
  isExpanded: boolean;
  actions: {
    toogleExpanded: () => void;
  };
}

export interface AccordionProps {
  title: string | JSX.Element;
}
