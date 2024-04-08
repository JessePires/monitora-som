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
  const [labelInput, setLabelInput] = useState(''); // Estado para armazenar o texto da label

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
    squares.forEach((square, index) => {
      drawSquare(context, square.start, square.end, square.color);
      drawLabel(context, square.start, square.label);
      if (index === selectedSquareIndex) {
        drawResizeHandles(context, square.start, square.end);
      }
    });
    if (isDrawing) {
      drawSquare(context, startPos, currentPos, 'rgba(0, 0, 255, 0.5)');
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
    context.fillRect(start.x - handleSize / 2, start.y - handleSize / 2, handleSize, handleSize);
    context.fillRect(end.x - handleSize / 2, start.y - handleSize / 2, handleSize, handleSize);
    context.fillRect(start.x - handleSize / 2, end.y - handleSize / 2, handleSize, handleSize);
    context.fillRect(end.x - handleSize / 2, end.y - handleSize / 2, handleSize, handleSize);
  };

  const drawLabel = (context, position, label) => {
    context.fillStyle = '#000000';
    context.font = '12px Arial';
    context.fillText(label, position.x, position.y - 5);
  };

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
        canvasRef.current.style.cursor = 'se-resize';
      } else {
        setIsDragging(true);
        setDragStartPos({ x, y });
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

  const handleMouseUp = () => {
    setIsDrawing(false);
    setIsResizing(false);
    setIsDragging(false);
    setResizeHandle(null);
    if (isDrawing && currentPos.x !== startPos.x && currentPos.y !== startPos.y) {
      const newSquare = {
        start: { ...startPos },
        end: { ...currentPos },
        color: 'rgba(0, 0, 255, 0.5)',
        label: labelInput, // Usando o texto da label inserido pelo usuário
      };
      setSquares([...squares, newSquare]);
      setLabelInput(''); // Limpar o input da label após adicionar o quadrado
    }
  };

  const handleDeleteSelectedSquare = () => {
    if (selectedSquareIndex !== null) {
      const updatedSquares = [...squares];
      updatedSquares.splice(selectedSquareIndex, 1);
      setSquares(updatedSquares);
      setSelectedSquareIndex(null);
    }
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ cursor: 'crosshair' }}
      />
      <input
        type="text"
        value={labelInput}
        onChange={(e) => setLabelInput(e.target.value)}
        placeholder="Enter label text"
      />
      <button onClick={handleDeleteSelectedSquare}>Delete Selected Square</button>
    </div>
  );
};

export default CanvasDrawing;
