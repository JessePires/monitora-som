import * as Icons from '../../../../assets/icons';

import { SpectrogramSettingsContainerArgs, UserSettingsProps } from './userSettings.types';
import * as Containers from './useSettings.container';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const UserSettingsComponent = (props: UserSettingsProps): JSX.Element => {
  return (
    <Containers.SpectrogramSettingsContainer>
      {(containerProps: SpectrogramSettingsContainerArgs) => {
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
              <Button className="mb-2" onClick={() => containerProps.globalContext.actions.exportSquares()}>
                <span className="mr-2">Exportar tabelas de região de interesse</span>
                <Icons.PaperClipIcon />
              </Button>
              <Button
                className="mb-2"
                onClick={() => containerProps.globalContext.actions.exportMultipleAudioSlices(props.wavesurferInstance)}
              >
                <span className="mr-2">Exportar cortes das regiões de interesse</span>
                <Icons.PaperClipIcon />
              </Button>
            </div>

            <div className="flex flex-col">
              <span className="font-bold mb-2 text-gray-800">Localização das gravações</span>
              <Input type="file" webkitdirectory="true" multiple onChange={containerProps.actions.handleFileSelect} />
            </div>

            <div className="flex flex-col">
              <span className="font-bold mb-2 text-gray-800">Localização das tabelas ROI</span>
              <Input
                id="picture"
                type="file"
                webkitdirectory="true"
                multiple
                onChange={containerProps.actions.handleRoiSelect}
              />
            </div>
          </div>
        );
      }}
    </Containers.SpectrogramSettingsContainer>
  );
};

export default UserSettingsComponent;
