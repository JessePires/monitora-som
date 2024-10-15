export interface SideBarProps {
  onChangeExpanded: (value: boolean) => void;
}

export interface SidebarContainerProps {
  isExpanded: boolean;
  actions: {
    toggleMenu: () => void;
  };
}

export interface SidebarContainerArgs {
  onChangeExpanded: (value: boolean) => void;
}
