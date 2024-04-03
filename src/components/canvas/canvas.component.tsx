import React, { useRef, useEffect, useState } from 'react';

const CanvasDrawing = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [squares, setSquares] = useState([]);
  const [selectedSquareIndex, setSelectedSquareIndex] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
    squares.forEach((square, index) => {
      drawSquare(context, square.start, square.end, square.color);
      if (index === selectedSquareIndex) {
        drawResizeHandles(context, square.start, square.end);
      }
    });
    if (isDrawing) {
      drawSquare(context, startPos, currentPos, 'rgba(0, 0, 255, 0.5)'); // Quadrado azul com 50% de opacidade
    }
  }, [squares, startPos, currentPos, isDrawing, selectedSquareIndex]);

  const drawSquare = (context, start, end, color) => {
    context.fillStyle = color;
    const width = end.x - start.x;
    const height = end.y - start.y;
    context.fillRect(start.x, start.y, width, height);
  };

  const drawResizeHandles = (context, start, end) => {
    context.fillStyle = 'rgba(255, 0, 0, 1)';
    const handleSize = 6;
    context.fillRect(start.x - handleSize / 2, start.y - handleSize / 2, handleSize, handleSize); // Top-left handle
    context.fillRect(end.x - handleSize / 2, start.y - handleSize / 2, handleSize, handleSize); // Top-right handle
    context.fillRect(start.x - handleSize / 2, end.y - handleSize / 2, handleSize, handleSize); // Bottom-left handle
    context.fillRect(end.x - handleSize / 2, end.y - handleSize / 2, handleSize, handleSize); // Bottom-right handle
  };

  // const handleMouseDown = (event) => {
  //   const x = event.nativeEvent.offsetX;
  //   const y = event.nativeEvent.offsetY;
  //   const clickedSquareIndex = squares.findIndex((square) => {
  //     return x >= square.start.x && x <= square.end.x && y >= square.start.y && y <= square.end.y;
  //   });
  //   if (clickedSquareIndex !== -1) {
  //     setSelectedSquareIndex(clickedSquareIndex);
  //     const resizeHandleClicked = checkResizeHandleClicked(squares[clickedSquareIndex], { x, y });
  //     if (resizeHandleClicked) {
  //       setIsResizing(true);
  //       setResizeHandle(resizeHandleClicked);
  //     } else {
  //       setIsResizing(false);
  //     }
  //   } else {
  //     setStartPos({ x, y });
  //     setCurrentPos({ x, y });
  //     setIsDrawing(true);
  //     setSelectedSquareIndex(null);
  //     setIsResizing(false);
  //   }
  // };

  const handleMouseDown = (event) => {
    const x = event.nativeEvent.offsetX;
    const y = event.nativeEvent.offsetY;
    const clickedSquareIndex = squares.findIndex((square) => {
      return x >= square.start.x && x <= square.end.x && y >= square.start.y && y <= square.end.y;
    });
    if (clickedSquareIndex !== -1) {
      setSelectedSquareIndex(clickedSquareIndex);
      const resizeHandleClicked = checkResizeHandleClicked(squares[clickedSquareIndex], { x, y });
      if (resizeHandleClicked) {
        setIsResizing(true);
        setResizeHandle(resizeHandleClicked);
        canvasRef.current.style.cursor = 'se-resize'; // Define o cursor de redimensionamento
      } else {
        setIsDragging(true);
        setDragStartPos({ x, y });
        canvasRef.current.style.cursor = 'move'; // Define o cursor de movimentação
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

  // const handleMouseMove = (event) => {
  //   if (!isDrawing && !isResizing) return;

  //   const x = event.nativeEvent.offsetX;
  //   const y = event.nativeEvent.offsetY;
  //   if (isDrawing) {
  //     setCurrentPos({ x, y });
  //   }
  //   if (isResizing) {
  //     resizeSquare(selectedSquareIndex, x, y, resizeHandle);
  //   }
  // };

  const dragSquare = (index, x, y) => {
    if (index === null) return;

    const updatedSquares = [...squares];
    const square = updatedSquares[index];
    const offsetX = x - dragStartPos.x;
    const offsetY = y - dragStartPos.y;

    square.start.x += offsetX;
    square.start.y += offsetY;
    square.end.x += offsetX;
    square.end.y += offsetY;

    setSquares(updatedSquares);
    setDragStartPos({ x, y });
  };

  const handleMouseMove = (event) => {
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

  const resizeSquare = (index, x, y, handle) => {
    const updatedSquares = [...squares];
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
    setSquares(updatedSquares);
  };

  const checkResizeHandleClicked = (square, { x, y }) => {
    const handleSize = 10;
    const handleMargin = 10; // Margem ao redor do canto para torná-lo mais fácil de clicar
    const handles = [
      { x: square.start.x, y: square.start.y }, // Top-left
      { x: square.end.x, y: square.start.y }, // Top-right
      { x: square.start.x, y: square.end.y }, // Bottom-left
      { x: square.end.x, y: square.end.y }, // Bottom-right
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

  const handleMouseUp = () => {
    setIsDrawing(false);
    setIsResizing(false);
    setResizeHandle(null);
    if (isDrawing && currentPos.x !== startPos.x && currentPos.y !== startPos.y) {
      const newSquare = {
        start: { ...startPos },
        end: { ...currentPos },
        color: 'rgba(0, 0, 255, 0.5)', // Quadrado azul com 50% de opacidade
      };
      setSquares([...squares, newSquare]);
    }

    if (isDragging) {
      setIsDragging(false);
    }

    canvasRef.current.style.cursor = 'crosshair';
  };

  return (
    <canvas
      ref={canvasRef}
      width={945}
      height={247}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ cursor: 'crosshair' }}
    />
  );
};

export default CanvasDrawing;
