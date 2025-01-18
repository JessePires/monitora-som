import { createContext, useEffect, useState } from 'react';

import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import Papa from 'papaparse';

import { GlobalProviderProps, AudioFilesType } from './global.types';

import { Square } from '@/common/types/square.types';

export const GlobalContext = createContext({});

export const GlobalContextProvider = (props: GlobalProviderProps): JSX.Element => {
  const [audioFiles, setAudioFiles] = useState<Array<AudioFilesType> | null>([]);
  const [roiTables, setRoiTables] = useState<Array<File> | null>([]);
  const [selectedAudio, setSelectedAudio] = useState<Blob | null>(null);
  const [selectedRoiTable, setSelectedRoiTable] = useState<File | null>(null);
  const [squares, setSquares] = useState<{ [x: string]: { squares: Array<Square>; roiTable: File } }>({});
  const [isSelectedAudioAlreadyRendered, setIsSelectedAudioAlreadyRendered] = useState<boolean>(false);
  const fileHeader = [
    'label',
    'freq início',
    'freq fim',
    'tempo início',
    'tempo fim',
    'tipo',
    'nível certeza',
    'completude',
  ];

  const handleSetRecords = (audioFiles: Array<AudioFilesType>): void => {
    setAudioFiles(audioFiles);
  };

  const handleSetRoiTables = (roiTables: Array<File>): void => {
    setRoiTables(roiTables);
  };

  const handleSetSelectedAudio = (audioFile: File): void => {
    setSelectedAudio(new Blob([audioFile], { type: audioFile.type }));
    setIsSelectedAudioAlreadyRendered(false);
  };

  const handleSetSelectedRoiTable = (roiTableFile: File): void => {
    setSelectedRoiTable(roiTableFile);
  };

  const handleSetSquares = (squares: Array<Square>): void => {
    setSquares((prevState) => {
      if (selectedRoiTable) {
        const newState = { ...prevState };
        newState[selectedRoiTable.name].squares = squares;

        return newState;
      } else return prevState;
    });
  };

  const handleSetSquaresTest = (squares: Array<Square>): void => {
    setSquares((prevState) => {
      if (selectedRoiTable) {
        const newState = { ...prevState };
        newState[selectedRoiTable.name].squares = [...squares];

        return newState;
      } else return prevState;
    });
  };

  const handleSetSquareInfo = (selectedIndex: number, info: Square): void => {
    setSquares((prevState) => {
      const newObject = { ...prevState };

      newObject[selectedRoiTable?.name].squares[selectedIndex] = {
        ...newObject[selectedRoiTable?.name].squares[selectedIndex],
        label: info.speciesName,
        type: info.type,
        certaintyLevel: info.certaintyLevel,
        completude: info.completude,
        additionalComments: info.additionalComments,
        roiTable: info.roiTable,
      };

      return newObject;
    });
  };

  const getFilesContent = (roiTables: File[], callback: (csvFiles: any[]) => any): void => {
    const allFilesData: any[] = [];

    const processFile = (roiTableFile: File, resolve: () => void) => {
      Papa.parse(roiTableFile, {
        complete: (result) => {
          let updatedData = result.data.length === 0 ? [fileHeader] : [...result.data];
          const squareRows = squares[roiTableFile.name].squares.map((square) => [
            square.label,
            square.start.x,
            square.end.x,
            square.start.y,
            square.end.y,
            square.type,
            square.certaintyLevel,
            square.completude,
          ]);

          updatedData = [...updatedData, ...squareRows];

          allFilesData.push({ name: roiTableFile.name, data: updatedData });
          resolve();
        },
        header: false,
        skipEmptyLines: true,
      });
    };

    const promises = roiTables.map(
      (roiTableFile) =>
        new Promise<void>((resolve) => {
          processFile(roiTableFile, resolve);
        }),
    );

    Promise.all(promises).then(() => callback(allFilesData));
  };

  const handleDownloadZip = async (data) => {
    const zip = new JSZip();

    data.forEach((file) => {
      const csvContent = Papa.unparse(file.data);

      zip.file(file.name, csvContent);
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, 'csv-files.zip');
  };

  const exportSquares = async () => {
    try {
      if (squares[selectedRoiTable.name].squares.length > 0) {
        if (roiTables) {
          getFilesContent(roiTables, handleDownloadZip);
        }
      } else {
        console.log('não há regiões de interesse criadas');
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const actions = {
    handleSetRecords,
    handleSetRoiTables,
    handleSetSelectedAudio,
    handleSetSelectedRoiTable,
    handleSetSquares,
    handleSetSquaresTest,
    exportSquares,
    handleSetSquareInfo,
    setIsSelectedAudioAlreadyRendered,
  };

  useEffect(() => {
    if (roiTables) {
      const squaresByTableObject: { [x: string]: { squares: Array<Square>; roiTable: File } } = {};

      roiTables.forEach((roiTable) => {
        squaresByTableObject[roiTable.name] = {
          squares: [],
          roiTable,
        };
      });

      setSquares(squaresByTableObject);
    }
  }, [roiTables]);

  return (
    <GlobalContext.Provider
      value={{
        audioFiles,
        roiTables,
        selectedAudio,
        selectedRoiTable,
        squares,
        isSelectedAudioAlreadyRendered,
        actions,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};
