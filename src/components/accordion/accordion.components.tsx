import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@radix-ui/react-accordion';

import * as Icons from '../../assets/icons';

import * as Containers from './accordion.container';
import { AccordionContainerProps, AccordionProps } from './accordion.types';

const CustomAccordion = (props: AccordionProps): JSX.Element => {
  return (
    <Containers.AccordionContainer>
      {(containerProps: AccordionContainerProps): JSX.Element => {
        return (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="w-full">
              <AccordionTrigger
                onClick={containerProps.actions.toogleExpanded}
                className="flex items-center justify-between w-[100%] p-4"
              >
                <div>{props.title}</div>
                <div
                  className={`transform transition-transform ${containerProps.isExpanded ? 'rotate-180' : 'rotate-0'} duration-300`}
                >
                  <Icons.ChevronDownIcon width="20" height="20" />
                </div>
              </AccordionTrigger>

              <AccordionContent className="bg-slate-400 w-full p-4">
                {props.component && <div>{props.component}</div>}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      }}
    </Containers.AccordionContainer>
  );
};

export default CustomAccordion;
