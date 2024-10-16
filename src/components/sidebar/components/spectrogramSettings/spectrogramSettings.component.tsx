import * as Icons from '../../../../assets/icons';

import CheckboxComponent from '@/components/checkbox/checkbox.component';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const SpectrogramSettingsComponent = (): JSX.Element => {
  return (
    <div>
      <CheckboxComponent />

      <span>Ajuste do ângulo do rótulo</span>
      <div className="flex">
        <Slider min={0} max={180} />
        <CheckboxComponent />
      </div>

      <div>
        <span>Intervalo (dB)</span>

        <Slider min={0} max={180} />
      </div>
      <div>
        <span>Tamanho da janela</span>

        <Slider min={0} max={180} />
      </div>
      <div>
        <span>Sobreposição (%)</span>
        <Slider min={0} max={180} />
      </div>

      <Button>
        <span>Voltar à configuração original</span>
        <Icons.SettingsIcon />
      </Button>
    </div>
  );
};

export default SpectrogramSettingsComponent;
