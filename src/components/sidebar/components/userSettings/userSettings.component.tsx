import * as Icons from '../../../../assets/icons';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const UserSettingsComponent = (): JSX.Element => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <span className="font-bold mb-2 text-gray-800">presets</span>
        <Button className="mb-2">
          <span className="mr-2">Exportar preset</span>
          <Icons.PaperClipIcon />
        </Button>
        <Button>
          <span className="mr-2">Importar preset</span>
          <Icons.PaperClipIcon />
        </Button>
      </div>

      <div className="flex flex-col">
        <span className="font-bold mb-2 text-gray-800">Resultados</span>
        <Button className="mb-2">
          <span className="mr-2">Exportar tabelas de região de interesse</span>
          <Icons.PaperClipIcon />
        </Button>
        <Button>
          <span className="mr-2">Exportar cortes das regiões de interesse</span>
          <Icons.PaperClipIcon />
        </Button>
      </div>

      <div className="flex flex-col">
        <span className="font-bold mb-2 text-gray-800">Localização das gravações</span>
        <Input id="picture" type="file" />
      </div>

      <div className="flex flex-col">
        <span className="font-bold mb-2 text-gray-800">Localização das tabelas ROI</span>
        <Input id="picture" type="text" placeholder="Digite o caminho aqui" />
      </div>

      <div className="flex flex-col">
        <span className="font-bold mb-2 text-gray-800">Destino dos cortes</span>
        <Input id="picture" type="text" placeholder="Digite o caminho aqui" />
      </div>
    </div>
  );
};

export default UserSettingsComponent;
