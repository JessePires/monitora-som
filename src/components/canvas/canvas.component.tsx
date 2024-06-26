// import React, { useRef, useEffect, useState } from 'react';

// const CanvasDrawing = () => {
//   const canvasRef = useRef(null);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [startPos, setStartPos] = useState({ x: 0, y: 0 });
//   const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
//   const [squares, setSquares] = useState([]);
//   const [selectedSquareIndex, setSelectedSquareIndex] = useState(null);
//   const [isResizing, setIsResizing] = useState(false);
//   const [resizeHandle, setResizeHandle] = useState(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
//   const [labelInput, setLabelInput] = useState(''); // Estado para armazenar o texto da label

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const context = canvas.getContext('2d');

//     context.clearRect(0, 0, canvas.width, canvas.height);
//     squares.forEach((square, index) => {
//       drawSquare(context, square.start, square.end, square.color);
//       drawLabel(context, square.start, square.label);
//       if (index === selectedSquareIndex) {
//         drawResizeHandles(context, square.start, square.end);
//       }
//     });
//     if (isDrawing) {
//       drawSquare(context, startPos, currentPos, 'rgba(0, 0, 255, 0.5)');
//     }
//   }, [squares, startPos, currentPos, isDrawing, selectedSquareIndex]);

//   const drawSquare = (context, start, end, color) => {
//     context.fillStyle = color;
//     const width = end.x - start.x;
//     const height = end.y - start.y;
//     context.fillRect(start.x, start.y, width, height);
//   };

//   const drawResizeHandles = (context, start, end) => {
//     context.fillStyle = 'rgba(255, 0, 0, 1)';
//     const handleSize = 6;
//     context.fillRect(start.x - handleSize / 2, start.y - handleSize / 2, handleSize, handleSize);
//     context.fillRect(end.x - handleSize / 2, start.y - handleSize / 2, handleSize, handleSize);
//     context.fillRect(start.x - handleSize / 2, end.y - handleSize / 2, handleSize, handleSize);
//     context.fillRect(end.x - handleSize / 2, end.y - handleSize / 2, handleSize, handleSize);
//   };

//   const drawLabel = (context, position, label) => {
//     context.fillStyle = '#000000';
//     context.font = '12px Arial';
//     context.fillText(label, position.x, position.y - 5);
//   };

//   const handleMouseDown = (event) => {
//     const x = event.nativeEvent.offsetX;
//     const y = event.nativeEvent.offsetY;
//     const clickedSquareIndex = squares.findIndex((square) => {
//       return x >= square.start.x && x <= square.end.x && y >= square.start.y && y <= square.end.y;
//     });
//     if (clickedSquareIndex !== -1) {
//       setSelectedSquareIndex(clickedSquareIndex);
//       const resizeHandleClicked = checkResizeHandleClicked(squares[clickedSquareIndex], { x, y });
//       if (resizeHandleClicked) {
//         setIsResizing(true);
//         setResizeHandle(resizeHandleClicked);
//         canvasRef.current.style.cursor = 'se-resize';
//       } else {
//         setIsDragging(true);
//         setDragStartPos({ x, y });
//         canvasRef.current.style.cursor = 'move';
//       }
//     } else {
//       setStartPos({ x, y });
//       setCurrentPos({ x, y });
//       setIsDrawing(true);
//       setSelectedSquareIndex(null);
//       setIsResizing(false);
//       setIsDragging(false);
//     }
//   };

//   const handleMouseMove = (event) => {
//     if (!isDrawing && !isResizing && !isDragging) return;

//     const x = event.nativeEvent.offsetX;
//     const y = event.nativeEvent.offsetY;
//     if (isDrawing) {
//       setCurrentPos({ x, y });
//     }
//     if (isResizing) {
//       resizeSquare(selectedSquareIndex, x, y, resizeHandle);
//     }
//     if (isDragging) {
//       dragSquare(selectedSquareIndex, x, y);
//     }
//   };

//   const resizeSquare = (index, x, y, handle) => {
//     const updatedSquares = [...squares];
//     const square = updatedSquares[index];
//     switch (handle) {
//       case 'top-left':
//         square.start.x = x;
//         square.start.y = y;
//         break;
//       case 'top-right':
//         square.end.x = x;
//         square.start.y = y;
//         break;
//       case 'bottom-left':
//         square.start.x = x;
//         square.end.y = y;
//         break;
//       case 'bottom-right':
//         square.end.x = x;
//         square.end.y = y;
//         break;
//       default:
//         break;
//     }
//     setSquares(updatedSquares);
//   };

//   const dragSquare = (index, x, y) => {
//     if (index === null) return;

//     const updatedSquares = [...squares];
//     const square = updatedSquares[index];
//     const offsetX = x - dragStartPos.x;
//     const offsetY = y - dragStartPos.y;

//     square.start.x += offsetX;
//     square.start.y += offsetY;
//     square.end.x += offsetX;
//     square.end.y += offsetY;

//     setSquares(updatedSquares);
//     setDragStartPos({ x, y });
//   };

//   const handleMouseUp = () => {
//     setIsDrawing(false);
//     setIsResizing(false);
//     setIsDragging(false);
//     setResizeHandle(null);
//     if (isDrawing && currentPos.x !== startPos.x && currentPos.y !== startPos.y) {
//       const newSquare = {
//         start: { ...startPos },
//         end: { ...currentPos },
//         color: 'rgba(0, 0, 255, 0.5)',
//         label: '', // Inicialmente sem label
//       };
//       setSquares([...squares, newSquare]);
//       setStartPos({ x: 0, y: 0 }); // Reinicia as posições de início e fim
//       setCurrentPos({ x: 0, y: 0 });
//     }
//   };

//   const handleDeleteSelectedSquare = () => {
//     if (selectedSquareIndex !== null) {
//       const updatedSquares = [...squares];
//       updatedSquares.splice(selectedSquareIndex, 1);
//       setSquares(updatedSquares);
//       setSelectedSquareIndex(null);
//     }
//   };

//   const handleEnterPress = (event) => {
//     if (event.key === 'Enter') {
//       if (labelInput.trim() !== '' && selectedSquareIndex !== null) {
//         const updatedSquares = [...squares];
//         updatedSquares[selectedSquareIndex].label = labelInput.trim(); // Atualiza a label do quadrado selecionado
//         setSquares(updatedSquares);
//         setLabelInput(''); // Limpa o input da label
//       }
//     }
//   };

//   return (
//     <div>
//       <canvas
//         ref={canvasRef}
//         width={1263}
//         height={301}
//         onMouseDown={handleMouseDown}
//         onMouseMove={handleMouseMove}
//         onMouseUp={handleMouseUp}
//         style={{ cursor: 'crosshair' }}
//       />
//       <input
//         type="text"
//         value={labelInput}
//         onChange={(e) => setLabelInput(e.target.value)}
//         onKeyDown={handleEnterPress}
//         placeholder="Enter label text and press Enter"
//       />
//       <button onClick={handleDeleteSelectedSquare}>Delete Selected Square</button>
//     </div>
//   );
// };

// export default CanvasDrawing;

import React, { useRef, useEffect, useState } from 'react';

const CanvasDrawing = ({
  spectrogramWidth,
  spectrogramHeight,
}: {
  spectrogramWidth: number;
  spectrogramHeight: number;
}) => {
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
  const [labelInput, setLabelInput] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
    squares.forEach((square, index) => {
      drawSquare(context, square.start, square.end, square.color, index === selectedSquareIndex);
      drawLabel(context, square.start, square.label);
      if (index === selectedSquareIndex) {
        drawResizeHandles(context, square.start, square.end);
      }
    });
    if (isDrawing) {
      drawSquare(context, startPos, currentPos, 'rgba(0, 0, 255, 0.5)', false);
    }
  }, [squares, startPos, currentPos, isDrawing, selectedSquareIndex]);

  useEffect(() => {
    const handleDeleteKeyPress = (event) => {
      if (event.key === 'Delete' && selectedSquareIndex !== null) {
        const updatedSquares = squares.filter((_, index) => index !== selectedSquareIndex);
        setSquares(updatedSquares);
        setSelectedSquareIndex(null);
      }
    };

    document.addEventListener('keydown', handleDeleteKeyPress);
    return () => {
      document.removeEventListener('keydown', handleDeleteKeyPress);
    };
  }, [selectedSquareIndex, squares]);

  const drawSquare = (context, start, end, color, isSelected) => {
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

  const drawResizeHandles = (context, start, end) => {
    context.fillStyle = 'rgba(255, 0, 0, 1)';
    const handleSize = 6;
    context.fillRect(start.x - handleSize / 2, start.y - handleSize / 2, handleSize, handleSize);
    context.fillRect(end.x - handleSize / 2, start.y - handleSize / 2, handleSize, handleSize);
    context.fillRect(start.x - handleSize / 2, end.y - handleSize / 2, handleSize, handleSize);
    context.fillRect(end.x - handleSize / 2, end.y - handleSize / 2, handleSize, handleSize);
  };

  const drawLabel = (context, position, label) => {
    context.fillStyle = '#fff';
    context.font = '12px Arial';
    context.fontWeight = '600';
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
    if (index === null) return;

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
        label: labelInput,
      };
      setSquares([...squares, newSquare]);
      setSelectedSquareIndex(squares.length); // Seleciona o quadrado mais recentemente adicionado
      setLabelInput('');
    }
  };

  const handleDeleteSelectedSquare = () => {
    if (selectedSquareIndex !== null) {
      const updatedSquares = squares.filter((_, index) => index !== selectedSquareIndex);
      setSquares(updatedSquares);
      setSelectedSquareIndex(null);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (isDrawing) {
        setIsDrawing(false);
      }
      if (labelInput.trim() !== '' && selectedSquareIndex !== null) {
        const updatedSquares = [...squares];
        updatedSquares[selectedSquareIndex].label = labelInput;
        setSquares(updatedSquares);
        setLabelInput('');
      }
    }
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

  return (
    <div>
      <div style={{ position: 'absolute', bottom: -3, opacity: '0.5', left: 53, zIndex: 9999 }}>
        <canvas
          ref={canvasRef}
          width={`${spectrogramWidth}px`}
          height={`${spectrogramHeight - 3}px`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{
            cursor: 'crosshair',
          }}
        />
      </div>
      <div>
        <input
          type="text"
          value={labelInput}
          onChange={(e) => setLabelInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Digite o nome da espécie"
        />
        <button onClick={handleDeleteSelectedSquare}>Excluir roi selecionada</button>
      </div>
    </div>
  );
};

export default CanvasDrawing;
