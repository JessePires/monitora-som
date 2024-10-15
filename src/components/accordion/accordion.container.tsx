import { useState } from 'react';

import { AccordionContainerProps } from './accordion.types';

import { ContainerWithProps } from '@/common/types/container.type';

export const AccordionContainer = (props: ContainerWithProps<AccordionContainerProps>): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toogleExpanded = (): void => {
    setIsExpanded((prevState) => !prevState);
  };

  return props.children({ isExpanded, actions: { toogleExpanded } });
};
