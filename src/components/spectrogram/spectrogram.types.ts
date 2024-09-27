import { RefObject } from 'react';

export interface SpectrogramContainerProps {
  containerRef: RefObject<HTMLDivElement>;
  frequencies: Array<number>;
  visibleTimes: TimeFrequencyDots;
  visibleFrequencies: TimeFrequencyDots;
  isPlaying: boolean;
  currentTime: number;
  urlIndex: number;
  spectrogramRef: RefObject<HTMLCanvasElement>;
  labelInput: string;
  headers: Array<string>;
  species: Array<SpeciesData>;
  actions: {
    handleScroll: (event: React.UIEvent<HTMLDivElement>) => void;
    stepForward: () => void;
    stepBack: () => void;
    onPlayPause: () => void;
    handleKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    setLabelInput: React.Dispatch<React.SetStateAction<string>>;
    handleDeleteSelectedSquare: (event: KeyboardEvent) => void;
    exportSquares: () => void;
  };
}

export interface SpectrogramContainerArgs {
  audioUrls: Array<string>;
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
  audioUrls: Array<string>;
  spectrogramWidth: number;
  spectrogramHeight: number;
  maxFrequencyKHz: number;
  sampleRate: number;
  nFFT: number;
}

export interface SpeciesData {
  [x: string]: string;
}
