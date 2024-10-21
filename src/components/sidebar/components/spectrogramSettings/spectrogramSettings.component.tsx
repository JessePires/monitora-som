import * as Icons from '../../../../assets/icons';

import CheckboxComponent from '@/components/checkbox/checkbox.component';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const SpectrogramSettingsComponent = (): JSX.Element => {
  return (
    <div className="flex flex-col gap-4">
      <CheckboxComponent title="renderização acelerada (menor qualidade)" />

      <div>
        <span className="flex mb-2">Ajuste do ângulo do rótulo</span>
        <div className="flex gap-4">
          <Slider min={0} max={180} />
          <CheckboxComponent title="ocultar" />
        </div>
      </div>

      <div>
        <span className="flex mb-2 text-gray-800">Intervalo (dB)</span>
        <Slider min={0} max={180} />
      </div>
      <div>
        <span className="flex mb-2 text-gray-800">Tamanho da janela</span>
        <Slider min={0} max={180} />
      </div>
      <div>
        <span className="flex mb-2 text-gray-800">Sobreposição (%)</span>
        <Slider min={0} max={180} />
      </div>

      <Button>
        <span className="mr-2">Voltar à configuração original</span>
        <Icons.SettingsIcon />
      </Button>
    </div>
  );
};

export default SpectrogramSettingsComponent;
