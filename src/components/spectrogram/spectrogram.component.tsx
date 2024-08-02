import { formatTime } from '../../utils/formatTime';
import CanvasDrawing from '../canvas/canvas.component';

import * as Containers from './spectrogram.container';
import * as Styles from './spectrogram.styles';
import { DrawableSpectrogramProps, SpectrogramContainerProps } from './spectrogram.types';

const DrawableSpectrogram = (props: DrawableSpectrogramProps): JSX.Element => {
  return (
    <Containers.SpectrogramContainer {...props}>
      {(containerProps: SpectrogramContainerProps): JSX.Element => {
        return (
          <>
            <Styles.DrawableSpectrogramWrapper>
              <Styles.SpectrogramWrapper spectrogramHeight={props.spectrogramHeight}>
                {containerProps.frequencies.map((freq) => (
                  <Styles.FrequencyWrapper key={freq}>
                    <Styles.FrequencyText>{freq.toFixed(1)} kHz -</Styles.FrequencyText>
                  </Styles.FrequencyWrapper>
                ))}
              </Styles.SpectrogramWrapper>
              <Styles.CanvasWrapper
                ref={containerProps.containerRef}
                spectrogramWidth={props.spectrogramWidth}
                spectrogramHeight={props.spectrogramHeight}
                onScroll={containerProps.actions.handleScroll}
              >
                <CanvasDrawing spectrogramWidth={props.spectrogramWidth} spectrogramHeight={props.spectrogramHeight} />
              </Styles.CanvasWrapper>
            </Styles.DrawableSpectrogramWrapper>

            <Styles.Text>
              Visible time range: {containerProps.visibleTimes.start.toFixed(2)} ms -{' '}
              {containerProps.visibleTimes.end.toFixed(2)} ms
            </Styles.Text>
            <Styles.Text>
              Visible frequency range: {containerProps.visibleFrequencies.start.toFixed(2)} Hz -{' '}
              {containerProps.visibleFrequencies.end.toFixed(2)} Hz
            </Styles.Text>

            <Styles.Text>Current time: {formatTime(containerProps.currentTime)}</Styles.Text>
            <Styles.ActionButtonsWrapper>
              <Styles.Button onClick={containerProps.actions.stepBack} disabled={containerProps.urlIndex === 0}>
                Retroceda
              </Styles.Button>

              <Styles.Button onClick={containerProps.actions.onPlayPause} style={{ minWidth: '5em' }}>
                {containerProps.isPlaying ? 'Pause' : 'Play'}
              </Styles.Button>

              <Styles.Button
                onClick={containerProps.actions.stepForward}
                disabled={containerProps.urlIndex === props.audioUrls.length - 1}
              >
                Avance
              </Styles.Button>
            </Styles.ActionButtonsWrapper>
          </>
        );
      }}
    </Containers.SpectrogramContainer>
  );
};

export default DrawableSpectrogram;
