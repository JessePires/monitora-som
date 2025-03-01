import { useContext } from 'react';

import * as Icons from '../../../../assets/icons';

import CheckboxComponent from '@/components/checkbox/checkbox.component';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { GlobalContext } from '@/contexts/global/global.context';

const SpectrogramSettingsComponent = (): JSX.Element => {
  const globalContext = useContext(GlobalContext);

  return (
    <div className="flex flex-col gap-4">
      <CheckboxComponent title="renderização acelerada (menor qualidade)" />

      <div>
        <span className="flex mb-2 text-gray-800">Ajuste do ângulo do rótulo</span>
        <div className="flex gap-4">
          <Slider min={0} max={180} onValueChange={(value) => globalContext.actions.setLabelAngle(value[0])} />
          <CheckboxComponent title="ocultar" />
        </div>
      </div>

      <div>
        <span className="flex mb-2 text-gray-800">Intervalo (dB)</span>
        <Slider min={0} max={180} />
      </div>
      <div>
        <span className="flex mb-2 text-gray-800">Tamanho da janela</span>
        <Slider
          defaultValue={[globalContext.fftSizeIndex]}
          value={[globalContext.fftSizeIndex]}
          onValueChange={(value) => {
            globalContext.actions.handleSetFftSizeIndex(value[0]);
          }}
          min={0}
          max={globalContext.fftSizeOptions.length - 1}
          step={1}
          labelFormat={(value) => globalContext.fftSizeOptions[value]}
        />
      </div>
      <div>
        <span className="flex mb-2 text-gray-800">Sobreposição (%)</span>
        <Slider
          min={0}
          max={100}
          defaultValue={[globalContext.windowOverlap]}
          onValueChange={(value) => {
            globalContext.actions.handleSetWindowOverlap(value[0]);
          }}
          step={1}
          labelFormat={(value) => `${value}%`}
        />
      </div>

      <Button>
        <span className="mr-2">Voltar à configuração original</span>
        <Icons.SettingsIcon />
      </Button>
    </div>
  );
};

export default SpectrogramSettingsComponent;
