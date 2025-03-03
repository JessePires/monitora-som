import * as Icons from '../../assets/icons';
import CustomAccordion from '../accordion/accordion.components';

import NotesComponent from './components/notes/notes.component';
import SpectrogramSettingsComponent from './components/spectrogramSettings/spectrogramSettings.component';
import UserSettingsComponent from './components/userSettings/userSettings.component';
import * as Containers from './sidebar.container';
import { SidebarContainerProps, SideBarProps } from './sidebar.types';

import { cn } from '@/lib/utils';

const Sidebar = (props: SideBarProps): JSX.Element => {
  return (
    <Containers.SidebarContainer onChangeExpanded={props.onChangeExpanded}>
      {(containerProps: SidebarContainerProps): JSX.Element => {
        return (
          <div
            className={cn(
              'bg-gray-800 text-white shadow-xl',
              containerProps.isExpanded ? 'w-[20%]' : 'w-11',
              'transition-width duration-300',
            )}
          >
            <button
              onClick={containerProps.actions.toggleMenu}
              className={`p-4 transform transition-transform duration-300 ${containerProps.isExpanded ? 'rotate-180' : 'rotate-0'} w-[100%]`}
            >
              <Icons.ChevronRightIcon width="15" height="18" />
            </button>
            <nav className={cn('mt-4', !containerProps.isExpanded && 'hidden')}>
              <CustomAccordion title="Configurações do usuário">
                <UserSettingsComponent wavesurferInstance={props.waveSurferInstance} />
              </CustomAccordion>
              <CustomAccordion title="Parâmetros do espectrograma">
                <SpectrogramSettingsComponent />
              </CustomAccordion>
              <CustomAccordion title="Anotações">
                <NotesComponent />
              </CustomAccordion>
            </nav>
          </div>
        );
      }}
    </Containers.SidebarContainer>
  );
};

export default Sidebar;
