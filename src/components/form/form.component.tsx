'use client';

import { useContext } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Textarea } from '../ui/textarea';

import * as Containers from './form.container';
import { ComboBoxFormProps, FormContainerProps } from './form.types';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { GlobalContext } from '@/contexts/global/global.context';
import { cn } from '@/lib/utils';

const FormSchema = z.object({
  records: z.string({ required_error: 'Selecione a gravação' }),
  roiTable: z.string({ required_error: 'Selecione a tabela de região de interesse' }),
  availableSpecies: z.string({
    required_error: 'Selecione uma categoria de espécies.',
  }),
  speciesName: z.string({
    required_error: 'Selecione um rótulo.',
  }),
  type: z.string({
    required_error: 'Selecione um tipo.',
  }),
  certaintyLevel: z.string({
    required_error: 'Selecione o nível de certeza.',
  }),
  completude: z.string({
    required_error: 'Selecione o nível de certeza.',
  }),
  additionalComments: z.string().optional(),
});

const ComboboxForm = (props: ComboBoxFormProps): JSX.Element => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { audioFiles, roiTables, actions } = useContext(GlobalContext);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    props.spectrogramRef.current?.addNewSquare(data);
  }

  return (
    <Containers.SpectrogramContainer>
      {(containerProps: FormContainerProps): JSX.Element => {
        return (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 rounded-xl bg-white shadow-md m-4 p-4 z-10"
            >
              <div className="flex justify-between">
                <FormField
                  control={form.control}
                  name="records"
                  render={({ field }) => (
                    <FormItem className="flex w-[49%] flex-col">
                      <FormLabel>{`Gravação (1 de 30)`}</FormLabel>
                      <Popover>
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
                <FormField
                  control={form.control}
                  name="roiTable"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex w-[49%] flex-col">
                        <FormLabel>Tabela de Regiões de Interesse</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn('justify-between bg-white', !field.value && 'text-muted-foreground')}
                              >
                                {field.value
                                  ? roiTables.find((roiTable: File) => roiTable.name === field.value)?.name
                                  : 'Selecione a tabela'}
                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput placeholder="Procure pela tabela..." className="h-9" />
                              <CommandList>
                                <CommandEmpty>Tabela não encontrada.</CommandEmpty>
                                <CommandGroup>
                                  {roiTables.map((roiTable: File): JSX.Element => {
                                    return (
                                      <CommandItem
                                        value={roiTable.webkitRelativePath}
                                        key={roiTable.name}
                                        onSelect={() => {
                                          form.setValue('roiTable', roiTable.name);
                                          actions.handleSetSelectedRoiTable(roiTable);
                                        }}
                                      >
                                        {roiTable.name}
                                        <CheckIcon
                                          className={cn(
                                            'ml-auto h-4 w-4',
                                            roiTable.name === field.value ? 'opacity-100' : 'opacity-0',
                                          )}
                                        />
                                      </CommandItem>
                                    );
                                  })}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="flex justify-between">
                <FormField
                  control={form.control}
                  name="availableSpecies"
                  render={({ field }) => (
                    <FormItem className="w-[18%] flex flex-col">
                      <FormLabel>Nomes das Espécies Disponíveis</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn('justify-between bg-white', !field.value && 'text-muted-foreground')}
                            >
                              {field.value
                                ? props.speciesTypes.find((speciesType: string): boolean => speciesType === field.value)
                                : 'Selecione as espécies'}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                          <Command>
                            <CommandInput placeholder="Procurando tipo de espécie..." className="h-9" />
                            <CommandList>
                              <CommandEmpty>Nenhum tipo de espécie disponível.</CommandEmpty>
                              <CommandGroup>
                                {props.speciesTypes.map(
                                  (speciesType: string): JSX.Element => (
                                    <CommandItem
                                      value={speciesType}
                                      key={speciesType}
                                      onSelect={() => {
                                        containerProps.actions.onChangeSelectedSpeciesType(speciesType);
                                        form.setValue('availableSpecies', speciesType);
                                      }}
                                    >
                                      {speciesType}
                                      <CheckIcon
                                        className={cn(
                                          'ml-auto h-4 w-4',
                                          speciesType === field.value ? 'opacity-100' : 'opacity-0',
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
                <FormField
                  control={form.control}
                  name="speciesName"
                  render={({ field }) => {
                    const formattedSpecies: Array<string> = [];

                    props.species.forEach((speciesElement: { [x: string]: string }) => {
                      if (speciesElement[containerProps.selectedSpeciesType]) {
                        formattedSpecies.push(speciesElement[containerProps.selectedSpeciesType]);
                      }
                    });

                    return (
                      <FormItem className="w-[18%] flex flex-col">
                        <FormLabel>Rótulo</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn('justify-between bg-white', !field.value && 'text-muted-foreground')}
                              >
                                {field.value
                                  ? formattedSpecies.find((species) => species === field.value)
                                  : 'Selecione a espécie'}
                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput placeholder="Search framework..." className="h-9" />
                              <CommandList>
                                <CommandEmpty>Nenhuma espécie encontrada</CommandEmpty>
                                <CommandGroup>
                                  {formattedSpecies.map((species) => {
                                    return (
                                      <CommandItem
                                        value={species}
                                        key={species}
                                        onSelect={() => {
                                          form.setValue('speciesName', species);
                                        }}
                                      >
                                        {species}
                                        <CheckIcon
                                          className={cn(
                                            'ml-auto h-4 w-4',
                                            species === field.value ? 'opacity-100' : 'opacity-0',
                                          )}
                                        />
                                      </CommandItem>
                                    );
                                  })}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="w-[18%] flex flex-col">
                      <FormLabel>Tipo</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn('justify-between bg-white', !field.value && 'text-muted-foreground')}
                            >
                              {field.value
                                ? containerProps.songTypeOptions.find(
                                    (songTypeOption) => songTypeOption.value === field.value,
                                  )?.label
                                : 'Selecione o tipo da roi'}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                          <Command>
                            <CommandInput placeholder="Procurando tipo..." className="h-9" />
                            <CommandList>
                              <CommandEmpty>Nenhum tipo encontrado</CommandEmpty>
                              <CommandGroup>
                                {containerProps.songTypeOptions.map((songTypeOption) => (
                                  <CommandItem
                                    value={songTypeOption.label}
                                    key={songTypeOption.value}
                                    onSelect={() => {
                                      form.setValue('type', songTypeOption.value);
                                    }}
                                  >
                                    {songTypeOption.label}
                                    <CheckIcon
                                      className={cn(
                                        'ml-auto h-4 w-4',
                                        songTypeOption.value === field.value ? 'opacity-100' : 'opacity-0',
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="certaintyLevel"
                  render={({ field }) => (
                    <FormItem className="w-[18%] flex flex-col">
                      <FormLabel>Nível de Certeza</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'w-[100%] justify-between bg-white',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              {field.value
                                ? containerProps.certaintyLevelOptions.find(
                                    (certaintyLevelOption) => certaintyLevelOption.value === field.value,
                                  )?.label
                                : 'Selecione o nível de certeza'}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                          <Command>
                            <CommandInput placeholder="Procurando nível de certeza..." className="h-9" />
                            <CommandList>
                              <CommandEmpty>Nenhum nível de certeza encontrado</CommandEmpty>
                              <CommandGroup>
                                {containerProps.certaintyLevelOptions.map((certaintyLevelOption) => (
                                  <CommandItem
                                    value={certaintyLevelOption.label}
                                    key={certaintyLevelOption.value}
                                    onSelect={() => {
                                      form.setValue('certaintyLevel', certaintyLevelOption.value);
                                    }}
                                  >
                                    {certaintyLevelOption.label}
                                    <CheckIcon
                                      className={cn(
                                        'ml-auto h-4 w-4',
                                        certaintyLevelOption.value === field.value ? 'opacity-100' : 'opacity-0',
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="completude"
                  render={({ field }) => (
                    <FormItem className="w-[18%] flex flex-col">
                      <FormLabel>Completude</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'w-[100%] justify-between bg-white',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              {field.value
                                ? containerProps.completudeOptions.find(
                                    (completudeOption) => completudeOption.value === field.value,
                                  )?.label
                                : 'Selecione a completude'}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[100%] p-0">
                          <Command>
                            <CommandInput placeholder="Procurando completude..." className="h-9" />
                            <CommandList>
                              <CommandEmpty>Nenhum nível de completude</CommandEmpty>
                              <CommandGroup>
                                {containerProps.completudeOptions.map((completudeOption) => (
                                  <CommandItem
                                    value={completudeOption.label}
                                    key={completudeOption.value}
                                    onSelect={() => {
                                      form.setValue('completude', completudeOption.value);
                                    }}
                                  >
                                    {completudeOption.label}
                                    <CheckIcon
                                      className={cn(
                                        'ml-auto h-4 w-4',
                                        completudeOption.value === field.value ? 'opacity-100' : 'opacity-0',
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="additionalComments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comentários Adicionais</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Adicione aqui os comentários a respeito do rótulo"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Salvar rótulo</Button>
            </form>
          </Form>
        );
      }}
    </Containers.SpectrogramContainer>
  );
};

export default ComboboxForm;
