import { useContext, useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import * as Icons from '../../../../assets/icons';

import CheckboxComponent from '@/components/checkbox/checkbox.component';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { GlobalContext } from '@/contexts/global/global.context';
import { cn } from '@/lib/utils';

const SpectrogramSettingsComponent = (): JSX.Element => {
  const globalContext = useContext(GlobalContext);

  const FormSchema = z.object({
    windowFunction: z.string({ required_error: 'Selecione a função' }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  useEffect(() => {
    form.setValue('windowFunction', globalContext.windowFunction.value);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <CheckboxComponent title="renderização acelerada (menor qualidade)" />

      <div>
        <span className="flex mb-2 text-gray-800">Ajuste do ângulo do rótulo</span>
        <div className="flex gap-4">
          <Slider min={0} max={180} onValueChange={(value) => globalContext.actions.setLabelAngle(value[0])} />
          <CheckboxComponent title="ocultar" />
        </div>
      </div>

      <div>
        <span className="flex mb-2 text-gray-800">Intervalo (dB)</span>
        <Slider min={0} max={180} />
      </div>
      <div>
        <span className="flex mb-2 text-gray-800">Tamanho da janela</span>
        <Slider
          defaultValue={[globalContext.fftSizeIndex]}
          value={[globalContext.fftSizeIndex]}
          onValueChange={(value) => {
            globalContext.actions.handleSetFftSizeIndex(value[0]);
          }}
          min={0}
          max={globalContext.fftSizeOptions.length - 1}
          step={1}
          labelFormat={(value) => globalContext.fftSizeOptions[value]}
        />
      </div>
      <div>
        <span className="flex mb-2 text-gray-800">Sobreposição (%)</span>
        <Slider
          min={0}
          max={100}
          defaultValue={[globalContext.windowOverlap]}
          onValueChange={(value) => {
            globalContext.actions.handleSetWindowOverlap(value[0]);
          }}
          step={1}
          labelFormat={(value) => `${value}%`}
        />
      </div>

      <Form {...form}>
        <FormField
          control={form.control}
          name="windowFunction"
          render={({ field }) => {
            return (
              <FormItem className="flex w-[100%] flex-col">
                <FormLabel className="text-gray-800">Função da janela</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'justify-between bg-white text-gray-800',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value
                          ? globalContext.windowFunctionOptions.find(
                              (windowFunction: { label: string; value: string }) =>
                                windowFunction.value === field.value,
                            )?.name
                          : 'Selecione a função'}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Procure pela função..." className="h-9" />
                      <CommandList>
                        <CommandEmpty>Função não encontrada.</CommandEmpty>
                        <CommandGroup>
                          {globalContext.windowFunctionOptions.map(
                            (windowFunction: { name: string; value: string }): JSX.Element => {
                              return (
                                <CommandItem
                                  value={windowFunction.value}
                                  key={windowFunction.name}
                                  onSelect={() => {
                                    form.setValue('windowFunction', windowFunction.value);
                                    globalContext.actions.handleSetWindowFunction(windowFunction);
                                  }}
                                >
                                  {windowFunction.name}
                                  <CheckIcon
                                    className={cn(
                                      'ml-auto h-4 w-4',
                                      windowFunction.value === field.value ? 'opacity-100' : 'opacity-0',
                                    )}
                                  />
                                </CommandItem>
                              );
                            },
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormItem>
            );
          }}
        />
      </Form>

      <Button onClick={() => globalContext.actions.handleResetConfigParams()}>
        <span className="mr-2">Voltar à configuração original</span>
        <Icons.SettingsIcon />
      </Button>
    </div>
  );
};

export default SpectrogramSettingsComponent;
