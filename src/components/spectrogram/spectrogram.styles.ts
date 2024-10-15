import styled from 'styled-components';

export const DrawableSpectrogramWrapper = styled.div`
  display: flex;
  position: relative;
`;

export const SpectrogramWrapper = styled.div<{ spectrogramHeight: number }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  height: ${({ spectrogramHeight }: { spectrogramHeight: number }): string => `${spectrogramHeight}px`};
`;

export const FrequencyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 999;
`;

export const FrequencyText = styled.span`
  font-size: 12px;
`;

export const CanvasWrapper = styled.div<{ spectrogramWidth: number; spectrogramHeight: number }>`
  width: 100%;
  height: 100%;

  overflow-x: scroll;
  overflow-y: hidden;
`;

export const Text = styled.p``;

export const Button = styled.button``;

export const SpeciesName = styled.input``;

export const SpeciesInputWrapper = styled.div``;
