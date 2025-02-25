import WaveSurfer from 'wavesurfer.js';

export interface UserSettingsProps {
  wavesurferInstance: WaveSurfer;
}

export interface SpectrogramSettingsContainerArgs {
  globalContext: any;
  actions: {
    handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleRoiSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  };
}
