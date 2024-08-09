import { ForwardedRef, RefObject } from 'react';

export interface CanvasContainerProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  isDrawing: boolean;
  labelInput: string;
  actions: {
    handleMouseDown: (event: React.MouseEvent<HTMLCanvasElement>) => void;
    handleMouseMove: (event: React.MouseEvent<HTMLCanvasElement>) => void;
    handleMouseUp: () => void;
    setLabelInput: React.Dispatch<React.SetStateAction<string>>;
    handleKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    handleDeleteSelectedSquare: () => void;
  };
}

export interface Position {
  x: number;
  y: number;
}

export interface Square {
  start: Position;
  end: Position;
  color: string;
  label: string;
}

export interface CanvasContainerArgs {
  spectrogramRef: ForwardedRef<HTMLCanvasElement>;
}

export interface CanvasDrawingProps {
  spectrogramWidth: number;
  spectrogramHeight: number;
}
