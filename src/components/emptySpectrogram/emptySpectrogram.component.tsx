import { MicOff } from 'lucide-react';

import { EmptySpectrogramProps } from './emptySpectrogram.types';

import { cn } from '@/lib/utils';

const EmptySpectrogram = (props: EmptySpectrogramProps): React.JSX.Element => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center w-full h-full min-h-[300px] p-8 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/5',
        props.className,
      )}
    >
      <div className="flex flex-col item-center justify-center space-y-4 text-center">
        <div className="rounded-full bg-muted/100 p-6 w-fit self-center shadow-sm">
          <MicOff />
        </div>
        <div className="space-y-2">
          <h3 className="text-x1 font-semibold tracking-tight">Nenhum áudio selecionado</h3>
          <p className="text-sm text-muted-foreground max-w-[300px]">
            Selecione um arquivo de áudio para visualizar e rotular o espectrograma.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptySpectrogram;
