import styled from 'styled-components';

export const CanvasWrapper = styled.div<{ containerWidth?: string }>`
  position: absolute;
  bottom: -5;
  left: 51;
  z-index: 5;
  width: ${({ containerWidth }: { containerWidth?: string }): string => `${containerWidth}`};
`;

export const SpeciesName = styled.input``;

export const Button = styled.button``;

export const SpeciesInputWrapper = styled.div``;

export const Canvas = styled.canvas<{ height: number; width: number }>`
  cursor: crosshair;
  width: 100.7%;
  height: ${({ height }: { height: number }): string => `${height}px`};
  opacity: 0.5;
`;
