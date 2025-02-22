import WaveSurfer from 'wavesurfer.js';

export interface SideBarProps {
  waveSurferInstance: WaveSurfer;
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
