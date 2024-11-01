import { createContext, useState } from 'react';

import { GlobalProviderProps, AudioFilesType } from './global.types';

export const GlobalContext = createContext({});

export const GlobalContextProvider = (props: GlobalProviderProps): JSX.Element => {
  const [audioFiles, setAudioFiles] = useState<Array<AudioFilesType> | null>([]);
  const [roiTables, setRoiTables] = useState<Array<File> | null>([]);
  const [selectedAudio, setSelectedAudio] = useState<Blob | null>(null);
  const [selectedRoiTable, setSelectedRoiTable] = useState<File | null>(null);

  const handleSetRecords = (audioFiles: Array<AudioFilesType>): void => {
    setAudioFiles(audioFiles);
  };

  const handleSetRoiTables = (roiTables: Array<File>): void => {
    setRoiTables(roiTables);
  };

  const handleSetSelectedAudio = (audioFile: File): void => {
    setSelectedAudio(new Blob([audioFile], { type: audioFile.type }));
  };

  const handleSetSelectedRoiTable = (roiTableFile: File): void => {
    setSelectedRoiTable(roiTableFile);
  };

  const actions = { handleSetRecords, handleSetRoiTables, handleSetSelectedAudio, handleSetSelectedRoiTable };

  return (
    <GlobalContext.Provider value={{ audioFiles, roiTables, selectedAudio, selectedRoiTable, actions }}>
      {props.children}
    </GlobalContext.Provider>
  );
};
