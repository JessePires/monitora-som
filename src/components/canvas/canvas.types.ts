import { ForwardedRef, RefObject } from 'react';

export interface CanvasContainerProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  isDrawing: boolean;
  actions: {
    handleMouseDown: (event: React.MouseEvent<HTMLCanvasElement>) => void;
    handleMouseMove: (event: React.MouseEvent<HTMLCanvasElement>) => void;
    handleMouseUp: () => void;
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
  labelInput: string;
  setLabelInput: React.Dispatch<React.SetStateAction<string>>;
}

export interface CanvasDrawingProps {
  spectrogramWidth: number;
  spectrogramHeight: number;
  labelInput: string;
  setLabelInput: React.Dispatch<React.SetStateAction<string>>;
}
