import { createContext, useState } from 'react';

import { GlobalProviderProps, AudioFilesType } from './global.types';

import { Square } from '@/common/types/square.types';

export const GlobalContext = createContext({});

export const GlobalContextProvider = (props: GlobalProviderProps): JSX.Element => {
  const [audioFiles, setAudioFiles] = useState<Array<AudioFilesType> | null>([]);
  const [roiTables, setRoiTables] = useState<Array<File> | null>([]);
  const [selectedAudio, setSelectedAudio] = useState<Blob | null>(null);
  const [selectedRoiTable, setSelectedRoiTable] = useState<File | null>(null);
  const [squares, setSquares] = useState<Array<Square>>([]);

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

  const handleSetSquares = (squares: Array<Square>): void => {
    setSquares(squares);
  };

  const exportSquares = () => {
    if (squares.length > 0) {
      const arrayContent = [['label, freq início, freq fim, tempo início, tempo fim, tipo, nível certeza, completude']];
      squares.forEach((square: Square) => {
        arrayContent.push([
          `${square.label},${square.start.y},${square.end.y},${square.start.x},${square.end.x},${square.type},${square.certaintyLevel},${square.completude}`,
        ]);
      });

      const csvContent = arrayContent.join('\n');
      const link = window.document.createElement('a');
      link.setAttribute('href', 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURI(csvContent));
      link.setAttribute('download', 'upload_data.csv');
      link.click();
    } else {
      console.log('não há regiões de interesse criadas');
    }
  };

  const actions = {
    handleSetRecords,
    handleSetRoiTables,
    handleSetSelectedAudio,
    handleSetSelectedRoiTable,
    handleSetSquares,
    exportSquares,
  };

  return (
    <GlobalContext.Provider value={{ audioFiles, roiTables, selectedAudio, selectedRoiTable, squares, actions }}>
      {props.children}
    </GlobalContext.Provider>
  );
};
