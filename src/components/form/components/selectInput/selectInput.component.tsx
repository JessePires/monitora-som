import { useState } from 'react';

import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { SelectInputType } from './selectInput.types';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const SelectInput = (props: SelectInputType) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <FormField
      control={props.form.control}
      name="records"
      render={({ field }) => (
        <FormItem className="flex w-[49%] flex-col">
          <FormLabel>{`Gravação (1 de 30)`}</FormLabel>
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn('justify-between bg-white', !field.value && 'text-muted-foreground')}
                >
                  {field.value
                    ? audioFiles.find((audioFile: File) => audioFile.name === field.value)?.name
                    : 'Selecione um Gravação'}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[400px]">
              <Command>
                <CommandInput placeholder="Search framework..." className="h-9" />
                <CommandList>
                  <CommandEmpty>Nenhuma gravação encontrada</CommandEmpty>
                  <CommandGroup>
                    {audioFiles.map(
                      (audioFile: File): JSX.Element => (
                        <CommandItem
                          value={audioFile.webkitRelativePath}
                          key={audioFile.name}
                          onSelect={() => {
                            form.setValue('records', audioFile.name);
                            actions.handleSetSelectedAudio(audioFile);
                            setIsPopoverOpen(false);
                          }}
                        >
                          {audioFile.name}
                          <CheckIcon
                            className={cn(
                              'ml-auto h-4 w-4',
                              audioFile.name === field.value ? 'opacity-100' : 'opacity-0',
                            )}
                          />
                        </CommandItem>
                      ),
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SelectInput;
