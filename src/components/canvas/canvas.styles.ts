import styled from 'styled-components';

export const CanvasWrapper = styled.div<{ containerWidth?: string }>`
  position: absolute;
  bottom: -5;
  opacity: 0.5;
  left: 51;
  z-index: 5;
  background-color: red;

  width: ${({ containerWidth }: { containerWidth?: string }) => containerWidth ?? '100%'};
`;

export const SpeciesName = styled.input``;

export const Button = styled.button``;

export const SpeciesInputWrapper = styled.div``;

export const Canvas = styled.canvas<{ height: number }>`
  cursor: crosshair;
  width: 100%;
  /* height: ${({ height }: { height: number }): string => `${height}px`}; */
  height: 512px;
`;
