import { RefObject } from 'react';

import WaveSurfer from 'wavesurfer.js';

export interface SpectrogramContainerProps {
  containerRef: RefObject<HTMLDivElement>;
  spectrogramRef: RefObject<HTMLCanvasElement>;
  spectrogramRefTest: RefObject<HTMLDivElement>;
  frequencies: Array<number>;
  visibleTimes: TimeFrequencyDots;
  visibleFrequencies: TimeFrequencyDots;
  isPlaying: boolean;
  currentTime: number;
  currentAudioIndex: number;
  labelInput: string;
  headers: Array<string>;
  species: Array<SpeciesData>;
  isSidebarExpanded: boolean;
  markerRef: RefObject<HTMLDivElement>;
  arrowRef: RefObject<HTMLDivElement>;
  markerPosition: number;
  wavesurfer: WaveSurfer;
  actions: {
    handleScroll: (event: React.UIEvent<HTMLDivElement>) => void;
    stepForward: () => void;
    stepBack: () => void;
    moveOnToNextUnlabeled: () => void;
    goBackToPreviousUnlabeled: () => void;
    onPlayPause: () => void;
    handleKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    setLabelInput: React.Dispatch<React.SetStateAction<string>>;
    handleDeleteSelectedSquare: (event: KeyboardEvent) => void;
    onChangeExpanded: (value: boolean) => void;
    handleMarkerMouseDown: (event: React.MouseEvent) => void;
  };
}

export interface SpectrogramContainerArgs {
  spectrogramWidth: number;
  spectrogramHeight: number;
  maxFrequencyKHz: number;
  sampleRate: number;
  nFFT: number;
}

export interface TimeFrequencyDots {
  start: number;
  end: number;
}

export interface DrawableSpectrogramProps {
  spectrogramWidth: number;
  spectrogramHeight: number;
  maxFrequencyKHz: number;
  sampleRate: number;
  nFFT: number;
}

export interface SpeciesData {
  [x: string]: string;
}
