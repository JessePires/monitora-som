// import React, { useRef, useEffect, useState } from 'react';

// const CanvasDrawing = ({
//   spectrogramWidth,
//   spectrogramHeight,
// }: {
//   spectrogramWidth: number;
//   spectrogramHeight: number;
// }) => {
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
//   const [labelInput, setLabelInput] = useState('');

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const context = canvas.getContext('2d');

//     context.clearRect(0, 0, canvas.width, canvas.height);
//     squares.forEach((square, index) => {
//       drawSquare(context, square.start, square.end, square.color, index === selectedSquareIndex);
//       drawLabel(context, square.start, square.label);
//       if (index === selectedSquareIndex) {
//         drawResizeHandles(context, square.start, square.end);
//       }
//     });
//     if (isDrawing) {
//       drawSquare(context, startPos, currentPos, 'rgba(0, 0, 255, 0.5)', false);
//     }
//   }, [squares, startPos, currentPos, isDrawing, selectedSquareIndex]);

//   useEffect(() => {
//     const handleDeleteKeyPress = (event) => {
//       if (event.key === 'Delete' && selectedSquareIndex !== null) {
//         const updatedSquares = squares.filter((_, index) => index !== selectedSquareIndex);
//         setSquares(updatedSquares);
//         setSelectedSquareIndex(null);
//       }
//     };

//     document.addEventListener('keydown', handleDeleteKeyPress);
//     return () => {
//       document.removeEventListener('keydown', handleDeleteKeyPress);
//     };
//   }, [selectedSquareIndex, squares]);

//   const drawSquare = (context, start, end, color, isSelected) => {
//     context.fillStyle = color;
//     const width = end.x - start.x;
//     const height = end.y - start.y;
//     context.fillRect(start.x, start.y, width, height);
//     if (isSelected) {
//       context.strokeStyle = 'red';
//       context.lineWidth = 2;
//       context.strokeRect(start.x, start.y, width, height);
//     }
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
//     context.fillStyle = '#fff';
//     context.font = '12px Arial';
//     context.fontWeight = '600';
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
//     if (index === null) return;

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
//         label: labelInput,
//       };
//       setSquares([...squares, newSquare]);
//       setSelectedSquareIndex(squares.length); // Seleciona o quadrado mais recentemente adicionado
//       setLabelInput('');
//     }
//   };

//   const handleDeleteSelectedSquare = () => {
//     if (selectedSquareIndex !== null) {
//       const updatedSquares = squares.filter((_, index) => index !== selectedSquareIndex);
//       setSquares(updatedSquares);
//       setSelectedSquareIndex(null);
//     }
//   };

//   const handleKeyPress = (event) => {
//     if (event.key === 'Enter') {
//       if (isDrawing) {
//         setIsDrawing(false);
//       }
//       if (labelInput.trim() !== '' && selectedSquareIndex !== null) {
//         const updatedSquares = [...squares];
//         updatedSquares[selectedSquareIndex].label = labelInput;
//         setSquares(updatedSquares);
//         setLabelInput('');
//       }
//     }
//   };

//   const checkResizeHandleClicked = (square, { x, y }) => {
//     const handleSize = 10;
//     const handleMargin = 10; // Margem ao redor do canto para torná-lo mais fácil de clicar
//     const handles = [
//       { x: square.start.x, y: square.start.y }, // Top-left
//       { x: square.end.x, y: square.start.y }, // Top-right
//       { x: square.start.x, y: square.end.y }, // Bottom-left
//       { x: square.end.x, y: square.end.y }, // Bottom-right
//     ];
//     const clickedHandle = handles.find((handle) => {
//       return (
//         x >= handle.x - handleSize / 2 - handleMargin &&
//         x <= handle.x + handleSize / 2 + handleMargin &&
//         y >= handle.y - handleSize / 2 - handleMargin &&
//         y <= handle.y + handleSize / 2 + handleMargin
//       );
//     });
//     if (clickedHandle) {
//       if (clickedHandle.x === square.start.x && clickedHandle.y === square.start.y) {
//         return 'top-left';
//       } else if (clickedHandle.x === square.end.x && clickedHandle.y === square.start.y) {
//         return 'top-right';
//       } else if (clickedHandle.x === square.start.x && clickedHandle.y === square.end.y) {
//         return 'bottom-left';
//       } else if (clickedHandle.x === square.end.x && clickedHandle.y === square.end.y) {
//         return 'bottom-right';
//       }
//     }
//     return null;
//   };

//   return (
//     <div>
//       <div style={{ position: 'absolute', top: 20, opacity: '0.5', left: 51, zIndex: 9999 }}>
//         <canvas
//           ref={canvasRef}
//           width={`${spectrogramWidth - 17}px`}
//           height={`${spectrogramHeight - 40}px`}
//           onMouseDown={handleMouseDown}
//           onMouseMove={handleMouseMove}
//           onMouseUp={handleMouseUp}
//           style={{
//             cursor: 'crosshair',
//           }}
//         />
//       </div>
//       <div>
//         <input
//           type="text"
//           value={labelInput}
//           onChange={(e) => setLabelInput(e.target.value)}
//           onKeyPress={handleKeyPress}
//           placeholder="Digite o nome da espécie"
//         />
//         <button onClick={handleDeleteSelectedSquare}>Excluir roi selecionada</button>
//       </div>
//     </div>
//   );
// };

// export default CanvasDrawing;

// ==============================================================================================================================
// import React, { useRef, useEffect, useState } from 'react';

// const CanvasDrawing = ({ spectrogramWidth, spectrogramHeight, calculateFrequencyFromRow, calculateTimeFromColumn }) => {
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
//   const [labelInput, setLabelInput] = useState('');

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const context = canvas.getContext('2d');

//     context.clearRect(0, 0, canvas.width, canvas.height);
//     squares.forEach((square, index) => {
//       drawSquare(context, square.start, square.end, square.color, index === selectedSquareIndex);
//       drawLabel(context, square.start, square.label);
//       if (index === selectedSquareIndex) {
//         drawResizeHandles(context, square.start, square.end);
//       }
//       drawInfo(context, square);
//     });
//     if (isDrawing) {
//       drawSquare(context, startPos, currentPos, 'rgba(0, 0, 255, 0.5)', false);
//     }
//   }, [squares, startPos, currentPos, isDrawing, selectedSquareIndex]);

//   useEffect(() => {
//     const handleDeleteKeyPress = (event) => {
//       if (event.key === 'Delete' && selectedSquareIndex !== null) {
//         const updatedSquares = squares.filter((_, index) => index !== selectedSquareIndex);
//         setSquares(updatedSquares);
//         setSelectedSquareIndex(null);
//       }
//     };

//     document.addEventListener('keydown', handleDeleteKeyPress);
//     return () => {
//       document.removeEventListener('keydown', handleDeleteKeyPress);
//     };
//   }, [selectedSquareIndex, squares]);

//   const drawSquare = (context, start, end, color, isSelected) => {
//     context.fillStyle = color;
//     const width = end.x - start.x;
//     const height = end.y - start.y;
//     context.fillRect(start.x, start.y, width, height);
//     if (isSelected) {
//       context.strokeStyle = 'red';
//       context.lineWidth = 2;
//       context.strokeRect(start.x, start.y, width, height);
//     }
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
//     context.fillStyle = '#fff';
//     context.font = '12px Arial';
//     context.fontWeight = '600';
//     context.fillText(label, position.x, position.y - 5);
//   };

//   const drawInfo = (context, square) => {
//     const { start, end, frequencyStart, frequencyEnd, timeStart, timeEnd } = square;
//     context.fillStyle = '#fff';
//     context.font = '12px Arial';
//     context.fillText(`Freq: ${frequencyStart.toFixed(2)} - ${frequencyEnd.toFixed(2)} Hz`, start.x, start.y - 20);
//     context.fillText(`Time: ${timeStart.toFixed(2)} - ${timeEnd.toFixed(2)} ms`, start.x, start.y - 10);
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
//     if (index === null) return;

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
//     updateSquareInfo(updatedSquares[index]);
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
//     updateSquareInfo(updatedSquares[index]);
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
//         label: labelInput,
//         frequencyStart: calculateFrequencyFromRow(startPos.y),
//         frequencyEnd: calculateFrequencyFromRow(currentPos.y),
//         timeStart: calculateTimeFromColumn(startPos.x),
//         timeEnd: calculateTimeFromColumn(currentPos.x),
//       };
//       setSquares([...squares, newSquare]);
//       setSelectedSquareIndex(squares.length);
//       setLabelInput('');
//     }
//   };

//   const handleDeleteSelectedSquare = () => {
//     if (selectedSquareIndex !== null) {
//       const updatedSquares = squares.filter((_, index) => index !== selectedSquareIndex);
//       setSquares(updatedSquares);
//       setSelectedSquareIndex(null);
//     }
//   };

//   const handleKeyPress = (event) => {
//     if (event.key === 'Enter') {
//       if (isDrawing) {
//         setIsDrawing(false);
//       }
//       if (labelInput.trim() !== '' && selectedSquareIndex !== null) {
//         const updatedSquares = [...squares];
//         updatedSquares[selectedSquareIndex].label = labelInput;
//         setSquares(updatedSquares);
//         setLabelInput('');
//       }
//     }
//   };

//   const checkResizeHandleClicked = (square, { x, y }) => {
//     const handleSize = 10;
//     const handleMargin = 10; // Margin around the corner to make it easier to click
//     const handles = [
//       { x: square.start.x, y: square.start.y, name: 'top-left' },
//       { x: square.end.x, y: square.start.y, name: 'top-right' },
//       { x: square.start.x, y: square.end.y, name: 'bottom-left' },
//       { x: square.end.x, y: square.end.y, name: 'bottom-right' },
//     ];

//     for (const handle of handles) {
//       if (
//         x >= handle.x - handleSize / 2 - handleMargin &&
//         x <= handle.x + handleSize / 2 + handleMargin &&
//         y >= handle.y - handleSize / 2 - handleMargin &&
//         y <= handle.y + handleSize / 2 + handleMargin
//       ) {
//         return handle.name;
//       }
//     }
//     return null;
//   };

//   const updateSquareInfo = (square) => {
//     square.frequencyStart = calculateFrequencyFromRow(square.start.y);
//     square.frequencyEnd = calculateFrequencyFromRow(square.end.y);
//     square.timeStart = calculateTimeFromColumn(square.start.x);
//     square.timeEnd = calculateTimeFromColumn(square.end.x);
//   };

//   return (
//     <div>
//       <canvas
//         ref={canvasRef}
//         width={spectrogramWidth}
//         height={spectrogramHeight}
//         onMouseDown={handleMouseDown}
//         onMouseMove={handleMouseMove}
//         onMouseUp={handleMouseUp}
//       />
//       <div>
//         <label htmlFor="labelInput">Label:</label>
//         <input
//           type="text"
//           id="labelInput"
//           value={labelInput}
//           onChange={(e) => setLabelInput(e.target.value)}
//           onKeyPress={handleKeyPress}
//         />
//         <button onClick={handleDeleteSelectedSquare}>Delete Selected Square</button>
//       </div>
//     </div>
//   );
// };

// export default CanvasDrawing;

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

import * as Containers from './canvas.container';
import { CanvasContainerProps } from './canvas.types';

const CanvasDrawing = ({
  spectrogramWidth,
  spectrogramHeight,
}: {
  spectrogramWidth: number;
  spectrogramHeight: number;
}) => {
  return (
    <Containers.CanvasContainer>
      {(containerProps: CanvasContainerProps): JSX.Element => {
        console.log('containerProps', containerProps);

        return (
          <div>
            <div style={{ position: 'absolute', bottom: 12, opacity: '0.5', left: 51, zIndex: 9999 }}>
              <canvas
                ref={containerProps.canvasRef}
                width={`${spectrogramWidth - 15}px`}
                height={`${spectrogramHeight - 38}px`}
                onMouseDown={containerProps.actions.handleMouseDown}
                onMouseMove={containerProps.actions.handleMouseMove}
                onMouseUp={containerProps.actions.handleMouseUp}
                style={{
                  cursor: 'crosshair',
                  background: 'red',
                }}
              />
            </div>
            <div>
              <input
                type="text"
                value={containerProps.labelInput}
                onChange={(e) => containerProps.actions.setLabelInput(e.target.value)}
                onKeyDown={containerProps.actions.handleKeyPress}
                placeholder="Digite o nome da espécie"
              />
              <button onClick={containerProps.actions.handleDeleteSelectedSquare}>Excluir roi selecionada</button>
            </div>
          </div>
        );
      }}
    </Containers.CanvasContainer>
  );
};

export default CanvasDrawing;
