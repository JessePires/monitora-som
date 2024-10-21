import * as Icons from '../../assets/icons';
import CustomAccordion from '../accordion/accordion.components';
import { AccordionProps } from '../accordion/accordion.types';

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
        const items: Array<AccordionProps> = [
          {
            title: 'Configurações do usuário',
            component: <UserSettingsComponent />,
          },
          {
            title: 'Parâmetros do espectrograma',
            component: <SpectrogramSettingsComponent />,
          },
          { title: 'Anotações', component: <NotesComponent /> },
        ];

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
              {items.map(
                (item: AccordionProps): JSX.Element => (
                  <CustomAccordion title={item.title} component={item.component} />
                ),
              )}
            </nav>
          </div>
        );
      }}
    </Containers.SidebarContainer>
  );
};

export default Sidebar;
