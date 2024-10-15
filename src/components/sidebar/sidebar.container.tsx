import { useState } from 'react';

import { SidebarContainerArgs, SidebarContainerProps } from './sidebar.types';

import { ContainerWithProps } from '@/common/types/container.type';

export const SidebarContainer = (
  props: ContainerWithProps<SidebarContainerProps, SidebarContainerArgs>,
): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleMenu = () => {
    setIsExpanded((prevState) => {
      if (props.onChangeExpanded) {
        props.onChangeExpanded(!prevState);
      }

      return !prevState;
    });
  };

  return props.children({
    isExpanded,
    actions: {
      toggleMenu,
    },
  });
};
