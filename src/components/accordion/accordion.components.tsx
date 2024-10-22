import { ReactNode } from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@radix-ui/react-accordion';

import * as Icons from '../../assets/icons';

import * as Containers from './accordion.container';
import { AccordionContainerProps, AccordionProps } from './accordion.types';

const CustomAccordion = (props: AccordionProps & { children: ReactNode }): JSX.Element => {
  return (
    <Containers.AccordionContainer>
      {(containerProps: AccordionContainerProps): JSX.Element => {
        return (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="w-full">
              <AccordionTrigger
                onClick={containerProps.actions.toogleExpanded}
                className={`flex items-center justify-between w-[100%] p-4 ${containerProps.isExpanded ? 'bg-gray-400' : ''}`}
              >
                <div>
                  <span className={`font-extrabold ${containerProps.isExpanded ? 'text-gray-800' : 'text-white'}`}>
                    {props.title}
                  </span>
                </div>
                <div
                  className={`transform transition-transform ${containerProps.isExpanded ? 'rotate-180' : 'rotate-0'} duration-300`}
                >
                  <Icons.ChevronDownIcon
                    width="20"
                    height="20"
                    color={containerProps.isExpanded ? '#1f2937' : 'white'}
                  />
                </div>
              </AccordionTrigger>

              <AccordionContent className="bg-white w-full p-4">
                <div>{props.children}</div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      }}
    </Containers.AccordionContainer>
  );
};

export default CustomAccordion;
