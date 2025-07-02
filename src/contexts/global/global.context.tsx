import { createContext, useCallback, useEffect, useState } from 'react';

import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { debounce } from 'lodash';
import Papa from 'papaparse';
import WaveSurfer from 'wavesurfer.js';

import { GlobalProviderProps, AudioFilesType } from './global.types';

import { Square } from '@/common/types/square.types';

export const GlobalContext = createContext({});

export const GlobalContextProvider = (props: GlobalProviderProps): JSX.Element => {
  const fftSizeOptions = [128, 256, 512, 1024, 2048, 4096, 8192, 16384];

  const windowFunctionOptions = [
    { value: 'bartlett', name: 'Barllet' },
    { value: 'bartlettHann', name: 'Bartlett-Hann' },
    { value: 'blackman', name: 'Blackman' },
    { value: 'cosine', name: 'Cosseno' },
    { value: 'gauss', name: 'Gauss' },
    { value: 'hamming', name: 'Hamming' },
    { value: 'hann', name: 'Hann' },
    { value: 'lanczoz', name: 'Lanczos' },
    { value: 'rectangular', name: 'Retangular' },
    { value: 'triangular', name: 'Triangular' },
  ];

  const defaultParamsConfig = {
    labelAngle: 0,
    fftSizeIndex: 3,
    windowOverlap: 50,
    windowFunction: windowFunctionOptions[5],
  };

  const fileHeader = [
    'nome',
    'label',
    'freq início',
    'freq fim',
    'tempo início',
    'tempo fim',
    'tipo',
    'nível certeza',
    'completude',
  ];

  const [audioFiles, setAudioFiles] = useState<Array<AudioFilesType> | null>([]);
  const [roiTables, setRoiTables] = useState<Array<File> | null>([]);
  const [selectedAudio, setSelectedAudio] = useState<Blob | null>(null);
  const [selectedRoiTable, setSelectedRoiTable] = useState<File | null>(null);
  const [squares, setSquares] = useState<{ [x: string]: { squares: Array<Square>; roiTable: File } }>({});

  const [isSelectedAudioAlreadyRendered, setIsSelectedAudioAlreadyRendered] = useState<boolean>(false);
  const [labelAngle, setLabelAngle] = useState<number>(defaultParamsConfig.labelAngle);
  const [fftSizeIndex, setFftSizeIndex] = useState<number>(defaultParamsConfig.fftSizeIndex);
  const [windowOverlap, setWindowOverlap] = useState<number>(defaultParamsConfig.windowOverlap);
  const [windowFunction, setWindowFunction] = useState<{ name: string; value: string }>(
    defaultParamsConfig.windowFunction,
  );
  const [isNoLabelsMarkerChecked, setIsNoLabelsMarkerChecked] = useState<boolean>(false);

  const handleSetRecords = (audioFiles: Array<AudioFilesType>): void => {
    setAudioFiles(audioFiles);
  };

  const handleSetRoiTables = (roiTables: Array<File>): void => {
    setRoiTables(roiTables);
  };

  const handleSetSelectedAudio = (audioFile: File): void => {
    setSelectedAudio(audioFile);
    setIsSelectedAudioAlreadyRendered(false);
    setIsNoLabelsMarkerChecked(isAudioMarkedAsEmpty(audioFile));
  };

  const handleSetWindowFunction = (windowFunction: string): void => {
    setWindowFunction(windowFunction);
    setIsSelectedAudioAlreadyRendered(false);
  };

  const handleResetConfigParams = (): void => {
    setLabelAngle(defaultParamsConfig.labelAngle);
    setFftSizeIndex(defaultParamsConfig.fftSizeIndex);
    setWindowOverlap(defaultParamsConfig.windowOverlap);
    setWindowFunction(defaultParamsConfig.windowFunction);
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

  const removeNoLabelsMarker = () => {
    const roiTablesNames = roiTables?.map((roiTable) => roiTable.name);

    if (roiTablesNames) {
      setSquares((prevState) => {
        const newObject = { ...prevState };

        for (const roiTableName of roiTablesNames) {
          const selectedAudioSquareIndex = squares[roiTableName].squares.findIndex(
            (element) => element.audioName === selectedAudio?.name,
          );

          if (selectedAudioSquareIndex === squares[roiTableName].squares.length - 1) {
            newObject[roiTableName].squares.pop();
          } else {
            const firstPart = newObject[roiTableName].squares.slice(0, selectedAudioSquareIndex);
            const secondPart = newObject[roiTableName].squares.slice(
              selectedAudioSquareIndex + 1,
              newObject[roiTableName].squares.length,
            );

            newObject[roiTableName].squares = [...firstPart, ...secondPart];
          }
        }

        return newObject;
      });
    }
  };

  const isAudioMarkedAsEmpty = (audioFile: File): boolean => {
    if (roiTables?.length === 0) return false;

    const foundedLabel = squares[roiTables[0]?.name].squares.find((square) => square.audioName === audioFile.name);

    if (!foundedLabel) return false;
    if (foundedLabel.label === '-') return true;

    return false;
  };

  const removeAllAudioSquares = () => {
    const audioName = selectedAudio?.name;
    const roiTablesNames = roiTables?.map((roiTable) => roiTable.name);

    if (roiTablesNames) {
      for (const roiTableName of roiTablesNames) {
        setSquares((prevState) => {
          const newObject = { ...prevState };

          newObject[roiTableName].squares = newObject[roiTableName].squares.filter(
            (square) => square.audioName !== audioName,
          );

          return newObject;
        });
      }
    }
  };

  const handleSetSquareInfo = (selectedIndex: number | null, info: Square): void => {
    if (selectedIndex === null) {
      const roiTablesNames = roiTables?.map((roiTable) => roiTable.name);

      setSquares((prevState) => {
        const newObject = { ...prevState };

        roiTablesNames?.forEach((roiTableName) => {
          newObject[roiTableName].squares.push({
            color: '',
            start: { x: 0, y: 0 },
            end: { x: 0, y: 0 },
            audioName: selectedAudio?.name,
            label: info.speciesName,
            type: info.type,
            certaintyLevel: info.certaintyLevel,
            completude: info.completude,
            additionalComments: info.additionalComments,
            roiTable: info.roiTable,
          });
        });

        return newObject;
      });
    } else {
      setSquares((prevState) => {
        const newObject = { ...prevState };

        newObject[selectedRoiTable?.name].squares[selectedIndex] = {
          ...newObject[selectedRoiTable?.name].squares[selectedIndex],
          audioName: selectedAudio?.name,
          label: info.speciesName,
          type: info.type,
          certaintyLevel: info.certaintyLevel,
          completude: info.completude,
          additionalComments: info.additionalComments,
          roiTable: info.roiTable,
        };

        return newObject;
      });
    }
  };

  const getFilesContent = (roiTables: File[], callback: (csvFiles: any[]) => any): void => {
    const allFilesData: any[] = [];

    const processFile = (roiTableFile: File, resolve: () => void) => {
      const squareRows = squares[roiTableFile.name].squares.map((square) => [
        square.audioName,
        square.label,
        square.start.y,
        square.end.y,
        square.start.x,
        square.end.x,
        square.type,
        square.certaintyLevel,
        square.completude,
      ]);

      const updatedData = [fileHeader, ...squareRows];

      allFilesData.push({ name: roiTableFile.name, data: updatedData });
      resolve();
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

  const handleSetFftSizeIndex = useCallback(
    debounce((value: number): void => {
      setIsSelectedAudioAlreadyRendered(false);
      setFftSizeIndex(value);
    }, 300),
    [],
  );

  const handleSetWindowOverlap = useCallback(
    debounce((value: number): void => {
      setIsSelectedAudioAlreadyRendered(false);
      setWindowOverlap(value);
    }, 300),
    [],
  );

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

  const isSquaresObjectEmpty = (): boolean => {
    const keys = Object.keys(squares);
    if (keys.length > 0) {
      for (const key of keys) {
        if (squares[key].squares.length > 0) {
          return false;
        }
      }
    }

    return true;
  };

  const findNextUnlabeled = () => {
    if (!audioFiles) return null;

    const selectedAudioIndex = audioFiles.indexOf(selectedAudio);
    const nextAudios = audioFiles.slice(selectedAudioIndex + 1);
    const squaresEntries = Object.values(squares);

    for (const audio of nextAudios) {
      const isLabeled = squaresEntries.some(({ squares }) => squares.some((square) => square.audioName === audio.name));

      if (!isLabeled) return audio;
    }

    return null;
  };

  const findPreviousUnlabeled = () => {
    if (!audioFiles) return null;

    const selectedAudioIndex = audioFiles.indexOf(selectedAudio);
    const previousAudios = audioFiles.slice(0, selectedAudioIndex);
    const squaresEntries = Object.values(squares);

    for (let i = previousAudios.length - 1; i >= 0; i--) {
      const audio = previousAudios[i];

      const isLabeled = squaresEntries.some(({ squares }) => squares.some((square) => square.audioName === audio.name));

      if (!isLabeled) return audio;
    }

    return null;
  };

  const areAllNextLabeled = (): boolean => {
    if (!audioFiles || !roiTables) return true;

    const selectedAudioIndex = audioFiles.indexOf(selectedAudio);
    const nextAudios = audioFiles.slice(selectedAudioIndex + 1);
    const squaresEntries = Object.values(squares);
    let unlabeledQuantity = 0;

    for (const audio of nextAudios) {
      const isLabeled = squaresEntries.some(({ squares }) => squares.some((square) => square.audioName !== audio.name));
      if (!isLabeled) unlabeledQuantity += 1;
    }

    return !unlabeledQuantity;
  };

  const areAllPreviousLabeled = (): boolean => {
    if (!audioFiles || !roiTables) return true;

    const selectedAudioIndex = audioFiles.indexOf(selectedAudio);
    const previousAudios = audioFiles.slice(0, selectedAudioIndex);
    const squaresEntries = Object.values(squares);
    let unlabeledQuantity = 0;

    for (let i = previousAudios.length - 1; i >= 0; i--) {
      const audio = previousAudios[i];

      const isLabeled = squaresEntries.some(({ squares }) => squares.some((square) => square.audioName !== audio.name));

      if (!isLabeled) unlabeledQuantity += 1;
    }

    return !unlabeledQuantity;
  };

  const encodeWav = async (audioBuffer: AudioBuffer) => {
    const numOfChan = audioBuffer.numberOfChannels;
    const length = audioBuffer.length * numOfChan * 2 + 44;
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);
    const channels = [];
    let position = 0;

    const writeString = (str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(position + i, str.charCodeAt(i));
      }
      position += str.length;
    };

    const writeInt16 = (data: number) => {
      view.setInt16(position, data, true);
      position += 2;
    };

    writeString('RIFF');
    view.setUint32(position, length - 8, true);
    position += 4;
    writeString('WAVE');
    writeString('fmt ');
    view.setUint32(position, 16, true);
    position += 4;
    writeInt16(1);
    writeInt16(numOfChan);
    view.setUint32(position, audioBuffer.sampleRate, true);
    position += 4;
    view.setUint32(position, audioBuffer.sampleRate * numOfChan * 2, true);
    position += 4;
    writeInt16(numOfChan * 2);
    writeInt16(16);
    writeString('data');
    view.setUint32(position, length - position - 4, true);
    position += 4;

    for (let i = 0; i < numOfChan; i++) {
      channels.push(audioBuffer.getChannelData(i));
    }

    for (let i = 0; i < audioBuffer.length; i++) {
      for (let j = 0; j < numOfChan; j++) {
        let sample = Math.max(-1, Math.min(1, channels[j][i]));
        sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        writeInt16(sample);
      }
    }

    return new Blob([buffer], { type: 'audio/wav' });
  };

  const exportMultipleAudioSlices = async (wavesurfer: WaveSurfer): Promise<void> => {
    const buffer = wavesurfer.getDecodedData();
    if (!buffer) return;

    const audioContext = new AudioContext();
    const duration = wavesurfer.getDuration();
    const sampleRate = buffer.sampleRate;
    const numChannels = buffer.numberOfChannels;
    const zip = new JSZip();

    const roiTablesNames = Object.keys(squares);

    const flattenSquares = roiTablesNames.map((name) => squares[name].squares).flat();

    for (const square of flattenSquares) {
      const startTime = (square.start.x / wavesurfer.getWrapper().clientWidth) * duration;
      const endTime = (square.end.x / wavesurfer.getWrapper().clientWidth) * duration;

      const startSample = Math.floor(startTime * sampleRate);
      const endSample = Math.floor(endTime * sampleRate);

      const newBuffer = audioContext.createBuffer(numChannels, endSample - startSample, sampleRate);

      for (let channel = 0; channel < numChannels; channel++) {
        const oldData = buffer.getChannelData(channel);
        const newData = newBuffer.getChannelData(channel);
        newData.set(oldData.slice(startSample, endSample));
      }

      const wavBlob = await encodeWav(newBuffer);
      zip.file(`${square.label || 'trecho'}_${startTime}-${endTime}.wav`, wavBlob);
    }

    zip.generateAsync({ type: 'blob' }).then((zipBlob) => {
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'trechos_audio.zip';
      link.click();
      URL.revokeObjectURL(url);
    });
  };

  const getTotalLabeled = (): number => {
    let total = 0;

    const squaresTablesNames = Object.keys(squares);

    for (const tableName of squaresTablesNames) {
      if (squares[tableName].squares.length > 0) {
        const audioNames: Array<string> = [];
        squares[tableName].squares.forEach((square) => {
          if (square.label !== '') {
            audioNames.push(square.audioName);
          }
        });
        total += new Set(audioNames).size;
      }
    }

    return total;
  };

  const readRoiTables = (roiTables: Array<File> | null) => {
    console.log('roiTables', roiTables);

    roiTables?.forEach((roiTable: File) => {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const text = reader.result as string;

          const lines = text
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.length > 0);

          if (lines.length === 0) {
            console.warn(`Arquivo ${roiTable.name} está vazio ou inválido.`);
            return;
          }

          const headers = lines[0].split(',').map((lineElement) => lineElement.trim());
          const data = lines.slice(1).map((line) => {
            const values = line.split(',');
            const row: Record<string, string> = {};

            headers.forEach((header, index) => {
              row[header] = values[index] ?? '';
            });

            return row;
          });

          if (data.length > 0) {
            data.forEach((element) =>
              setSquares((prevState) => {
                const newState = { ...prevState };

                newState[roiTable.name].squares.push({
                  color: 'rgba(0, 0, 255, 0.5)',
                  start: { x: Number(element['tempo início']), y: Number(element['freq início']) },
                  end: { x: Number(element['tempo fim']), y: Number(element['freq fim']) },
                  audioName: element['nome'],
                  label: element['label'],
                  type: element['tipo'],
                  certaintyLevel: element['nível certeza'],
                  completude: element['completude'],
                  additionalComments: '',
                  roiTable: roiTable.name,
                });

                return newState;
              }),
            );
          }
        } catch (error) {
          console.error(`Erro ao processar CSV do arquivo ${roiTable.name}:`, error);
        }
      };

      reader.onerror = () => {
        console.error(`Erro ao ler o arquivo ${roiTable.name}:`, reader.error);
      };

      reader.readAsText(roiTable);
    });
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
    isSquaresObjectEmpty,
    findNextUnlabeled,
    findPreviousUnlabeled,
    areAllNextLabeled,
    areAllPreviousLabeled,
    exportMultipleAudioSlices,
    setLabelAngle,
    handleSetFftSizeIndex,
    handleSetWindowOverlap,
    handleSetWindowFunction,
    handleResetConfigParams,
    getTotalLabeled,
    removeNoLabelsMarker,
    isAudioMarkedAsEmpty,
    setIsNoLabelsMarkerChecked,
    removeAllAudioSquares,
  };

  useEffect(() => {
    if (roiTables) {
      readRoiTables(roiTables);

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
        labelAngle,
        fftSizeIndex,
        fftSizeOptions,
        windowOverlap,
        windowFunctionOptions,
        windowFunction,
        isNoLabelsMarkerChecked,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};
