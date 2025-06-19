import WaveSurfer from 'wavesurfer.js';

import { Square } from '@/common/types/square.types';

export type GlobalProviderProps = {
  children: React.ReactNode;
};

export type AudioFilesType = File & {
  alreadyLabeled: boolean;
};

export type GlobalContextStates = {
  records: AudioFilesType;
};

export type ContextType<P> = GlobalContextStates & {
  actions: P;
};

export type GlobalContextactions = {
  handleSetRecords: (records: Array<AudioFilesType>) => void;
  handleSetRoiTables: (roiTables: Array<File>) => void;
  handleSetSelectedAudio: (audioFile: File) => void;
  handleSetSelectedRoiTable: (roiTableFile: File) => void;
  handleSetSquares: (squares: Array<Square>) => void;
  exportSquares: () => void;
  handleSetSquareInfo: (selectedIndex: number, info: any) => void;
  setIsSelectedAudioAlreadyRendered: React.SetStateAction<boolean>;
  isSquaresObjectEmpty: () => boolean;
  findNextUnlabeled: () => void;
  findPreviousUnlabeled: () => void;
  areAllNextLabeled: () => boolean;
  areAllPreviousLabeled: () => boolean;
  exportMultipleAudioSlices: (wavesurfer: WaveSurfer) => Promise<void>;
  setLabelAngle: React.SetStateAction<number>;
  handleSetFftSizeIndex: (value: number) => void;
  handleSetWindowOverlap: (value: number) => void;
  handleSetWindowFunction: (windowFunction: string) => void;
  handleResetConfigParams: () => void;
  removeNoLabelsMarker: () => void;
};

export type GlobalContextValues = ContextType<GlobalContextactions>;
