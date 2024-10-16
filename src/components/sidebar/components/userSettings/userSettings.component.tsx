import * as Icons from '../../../../assets/icons';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const UserSettingsComponent = (): JSX.Element => {
  return (
    <div className="flex flex-col">
      <span>presets</span>
      <Button>
        <span>Exportar preset</span>
        <Icons.PaperClipIcon />
      </Button>
      <Button>
        <span>Importar preset</span>
        <Icons.PaperClipIcon />
      </Button>

      <span>Resultados</span>
      <Button>
        <span>Exportar tabelas de região de interesse</span>
        <Icons.PaperClipIcon />
      </Button>
      <Button>
        <span>Exportar cortes das regiões de interesse</span>
        <Icons.PaperClipIcon />
      </Button>

      <span>Localização das gravações</span>
      <Input id="picture" type="file" />

      <span>Localização das tabelas ROI</span>
      <Input id="picture" type="text" placeholder="Digite o caminho aqui" />

      <span>Destino dos cortes</span>
      <Input id="picture" type="text" placeholder="Digite o caminho aqui" />
    </div>
  );
};

export default UserSettingsComponent;
