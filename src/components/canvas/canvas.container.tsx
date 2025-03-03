import { useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { CanvasContainerArgs, CanvasContainerProps } from './canvas.types';

import { ContainerWithProps } from '@/common/types/container.type';
import { Position, Square } from '@/common/types/square.types';
import { GlobalContext } from '@/contexts/global/global.context';

export const CanvasContainer = (props: ContainerWithProps<CanvasContainerProps, CanvasContainerArgs>): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const globalContext = useContext(GlobalContext);

  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [selectedSquareIndex, setSelectedSquareIndex] = useState<number | null>(null);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartPos, setDragStartPos] = useState<Position>({ x: 0, y: 0 });

  useImperativeHandle(props.spectrogramRef, () => ({
    ...props.spectrogramRef?.current,

    createLabel(event: React.KeyboardEvent<HTMLInputElement>) {
      return handleKeyPress(event);
    },

    addNewSquare(data: Square) {
      if (isDrawing) {
        setIsDrawing(false);
      }

      if (selectedSquareIndex !== null) {
        globalContext.actions.handleSetSquareInfo(selectedSquareIndex, data);
      }
    },

    deleteSquare() {
      return handleDeleteSelectedSquare();
    },
  }));

  const drawSquare = (
    context: CanvasRenderingContext2D,
    start: Position,
    end: Position,
    color: string,
    isSelected: boolean,
  ): void => {
    context.fillStyle = color;
    const width = end.x - start.x;
    const height = end.y - start.y;
    context.fillRect(start.x, start.y, width, height);
    if (isSelected) {
      context.strokeStyle = 'red';
      context.lineWidth = 2;
      context.strokeRect(start.x, start.y, width, height);
    }
  };

  const drawResizeHandles = (context: CanvasRenderingContext2D, start: Position, end: Position): void => {
    context.fillStyle = 'rgba(255, 0, 0, 1)';
    const handleSize = 6;
    context.fillRect(start.x - handleSize / 2, start.y - handleSize / 2, handleSize, handleSize);
    context.fillRect(end.x - handleSize / 2, start.y - handleSize / 2, handleSize, handleSize);
    context.fillRect(start.x - handleSize / 2, end.y - handleSize / 2, handleSize, handleSize);
    context.fillRect(end.x - handleSize / 2, end.y - handleSize / 2, handleSize, handleSize);
  };

  const drawLabel = (context: CanvasRenderingContext2D, position: Position, label: string): void => {
    context.save();
    context.translate(position.x, position.y);
    context.rotate(((globalContext.labelAngle * Math.PI) / 180) * -1);

    context.fillStyle = '#fff';
    context.font = '600 12px Arial';
    context.fillText(label, 0, -10);

    context.restore();
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>): void => {
    const x = event.nativeEvent.offsetX;
    const y = event.nativeEvent.offsetY;
    const clickedSquareIndex = globalContext.squares[globalContext.selectedRoiTable.name].squares.findIndex(
      (square) => {
        return x >= square.start.x && x <= square.end.x && y >= square.start.y && y <= square.end.y;
      },
    );
    if (clickedSquareIndex !== -1) {
      setSelectedSquareIndex(clickedSquareIndex);
      const resizeHandleClicked = checkResizeHandleClicked(
        globalContext.squares[globalContext.selectedRoiTable.name].squares[clickedSquareIndex],
        { x, y },
      );
      if (resizeHandleClicked) {
        setIsResizing(true);
        setResizeHandle(resizeHandleClicked);

        canvasRef.current.style.cursor = 'se-resize';
      } else {
        setIsDragging(true);
        setDragStartPos({ x: x + 10, y });
        canvasRef.current.style.cursor = 'move';
      }
    } else {
      setStartPos({ x, y });
      setCurrentPos({ x, y });
      setIsDrawing(true);
      setSelectedSquareIndex(null);
      setIsResizing(false);
      setIsDragging(false);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!isDrawing && !isResizing && !isDragging) return;

    const x = event.nativeEvent.offsetX;
    const y = event.nativeEvent.offsetY;
    if (isDrawing) {
      setCurrentPos({ x, y });
    }
    if (isResizing) {
      resizeSquare(selectedSquareIndex, x, y, resizeHandle);
    }
    if (isDragging) {
      dragSquare(selectedSquareIndex, x, y);
    }
  };

  const resizeSquare = (index: number | null, x: number, y: number, handle: string | null): void => {
    if (index === null) return;

    const updatedSquares = [...globalContext.squares[globalContext.selectedRoiTable.name].squares];
    const square = updatedSquares[index];
    switch (handle) {
      case 'top-left':
        square.start.x = x;
        square.start.y = y;
        break;
      case 'top-right':
        square.end.x = x;
        square.start.y = y;
        break;
      case 'bottom-left':
        square.start.x = x;
        square.end.y = y;
        break;
      case 'bottom-right':
        square.end.x = x;
        square.end.y = y;
        break;
      default:
        break;
    }

    globalContext.actions.handleSetSquares(updatedSquares);
  };

  const dragSquare = (index: number | null, x: number, y: number): void => {
    if (index === null) return;

    const updatedSquares = [...globalContext.squares[globalContext.selectedRoiTable.name].squares];
    const square = updatedSquares[index];
    const offsetX = x - dragStartPos.x;
    const offsetY = y - dragStartPos.y;

    square.start.x += offsetX;
    square.start.y += offsetY;
    square.end.x += offsetX;
    square.end.y += offsetY;

    globalContext.actions.handleSetSquares(updatedSquares);

    setDragStartPos({ x, y });
  };

  const handleMouseUp = (): void => {
    setIsDrawing(false);
    setIsResizing(false);
    setIsDragging(false);
    setResizeHandle(null);
    if (isDrawing && currentPos.x !== startPos.x && currentPos.y !== startPos.y) {
      const newSquare = {
        start: { ...startPos },
        end: { ...currentPos },
        color: 'rgba(0, 0, 255, 0.5)',
        label: props.labelInput,
      };

      globalContext.actions.handleSetSquares([
        ...globalContext.squares[globalContext.selectedRoiTable.name].squares,
        newSquare,
      ]);

      setSelectedSquareIndex(globalContext.squares[globalContext.selectedRoiTable.name].squares.length - 1); // Seleciona o quadrado mais recentemente adicionado
      props.setLabelInput('');
    }
  };

  const handleDeleteSelectedSquare = (): void => {
    if (selectedSquareIndex !== null) {
      const updatedSquares = globalContext.squares[globalContext.selectedRoiTable.name].squares.filter(
        (_, index) => index !== selectedSquareIndex,
      );

      globalContext.actions.handleSetSquares(updatedSquares);
      setSelectedSquareIndex(null);
      props.setLabelInput('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      if (isDrawing) {
        setIsDrawing(false);
      }
      if (props.labelInput.trim() !== '' && selectedSquareIndex !== null) {
        const updatedSquares = [...globalContext.squares[globalContext.selectedRoiTable.name].squares];
        updatedSquares[selectedSquareIndex].label = props.labelInput;
        globalContext.actions.handleSetSquares(updatedSquares);
        props.setLabelInput('');
      }
    }
  };

  const checkResizeHandleClicked = (square: Square, { x, y }: Position): string | null => {
    const handleSize = 10;
    const handleMargin = 10;
    const handles = [
      { x: square.start.x, y: square.start.y },
      { x: square.end.x, y: square.start.y },
      { x: square.start.x, y: square.end.y },
      { x: square.end.x, y: square.end.y },
    ];
    const clickedHandle = handles.find((handle) => {
      return (
        x >= handle.x - handleSize / 2 - handleMargin &&
        x <= handle.x + handleSize / 2 + handleMargin &&
        y >= handle.y - handleSize / 2 - handleMargin &&
        y <= handle.y + handleSize / 2 + handleMargin
      );
    });
    if (clickedHandle) {
      if (clickedHandle.x === square.start.x && clickedHandle.y === square.start.y) {
        return 'top-left';
      } else if (clickedHandle.x === square.end.x && clickedHandle.y === square.start.y) {
        return 'top-right';
      } else if (clickedHandle.x === square.start.x && clickedHandle.y === square.end.y) {
        return 'bottom-left';
      } else if (clickedHandle.x === square.end.x && clickedHandle.y === square.end.y) {
        return 'bottom-right';
      }
    }
    return null;
  };

  useEffect(() => {
    const handleDeleteKeyPress = (event) => {
      if (event.key === 'Delete' && selectedSquareIndex !== null) {
        const updatedSquares = globalContext.squares[globalContext.selectedRoiTable.name].squares.filter((_, index) => {
          return index !== selectedSquareIndex;
        });

        globalContext.actions.handleSetSquaresTest(updatedSquares);
        setSelectedSquareIndex(null);
      }
    };

    document.addEventListener('keydown', handleDeleteKeyPress);
    return () => {
      document.removeEventListener('keydown', handleDeleteKeyPress);
    };
  }, [selectedSquareIndex, globalContext.squares]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width;
      canvas.height = rect.height;
    }
  }, [props.isSidebarOpen]);

  const drawAllSquares = (): void => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas?.getContext('2d');

      if (context) {
        context?.clearRect(0, 0, canvas.width, canvas.height);
        if (globalContext.selectedRoiTable && globalContext.squares) {
          globalContext.squares[globalContext.selectedRoiTable.name].squares.forEach((square, index) => {
            if (square.audioName === undefined || square.audioName === globalContext.selectedAudio.name) {
              drawSquare(context, square.start, square.end, square.color, index === selectedSquareIndex);
              drawLabel(context, square.start, square.label);

              if (index === selectedSquareIndex) {
                drawResizeHandles(context, square.start, square.end);
              }
            }
          });
        }
        if (isDrawing) {
          drawSquare(context, startPos, currentPos, 'rgba(0, 0, 255, 0.5)', false);
        }
      }
    }
  };

  useEffect(() => {
    drawAllSquares();
  }, [
    globalContext.squares,
    globalContext.selectedAudio,
    globalContext.selectedRoiTable,
    startPos,
    currentPos,
    isDrawing,
    selectedSquareIndex,
    props.isSidebarOpen,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    drawAllSquares();
  }, [globalContext.labelAngle]);

  return props.children({
    isDrawing,
    canvasRef,
    actions: {
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
      handleKeyPress,
      handleDeleteSelectedSquare,
    },
  });
};
