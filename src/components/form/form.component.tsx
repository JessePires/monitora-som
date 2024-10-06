'use client';

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
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const languages = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Spanish', value: 'es' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Russian', value: 'ru' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Chinese', value: 'zh' },
] as const;

const FormSchema = z.object({
  records: z.string({ required_error: 'Selecione a gravação' }),
  roi_table: z.string({ required_error: 'Selecione a tabela de região de interesse' }),
  availableSpecies: z.string({
    required_error: 'Selecione uma categoria de espécies.',
  }),
  speciesName: z.string({
    required_error: 'Selecione um rótulo.',
  }),
  type: z.string({
    required_error: 'Selecione um tipo.',
  }),
  levelOfCertainty: z.string({
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

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Containers.SpectrogramContainer>
      {(containerProps: FormContainerProps): JSX.Element => {
        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 rounded-xl bg-white shadow-md m-4 p-4">
              <div className="flex justify-between">
                <FormField
                  control={form.control}
                  name="availableSpecies"
                  render={({ field }) => (
                    <FormItem className="flex w-[49%] flex-col">
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
                                ? languages.find((language) => language.value === field.value)?.label
                                : 'Select language'}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[400px]">
                          <Command>
                            <CommandInput placeholder="Search framework..." className="h-9" />
                            <CommandList>
                              <CommandEmpty>No framework found.</CommandEmpty>
                              <CommandGroup>
                                {languages.map((language) => (
                                  <CommandItem
                                    value={language.label}
                                    key={language.value}
                                    onSelect={() => {
                                      form.setValue('availableSpecies', language.value);
                                    }}
                                  >
                                    {language.label}
                                    <CheckIcon
                                      className={cn(
                                        'ml-auto h-4 w-4',
                                        language.value === field.value ? 'opacity-100' : 'opacity-0',
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
                  name="speciesName"
                  render={({ field }) => {
                    const speciesType = form.getValues().availableSpecies;
                    const formattedSpecies: Array<string> = [];

                    props.species.forEach((speciesElement: { [x: string]: string }) => {
                      if (speciesElement[speciesType]) {
                        formattedSpecies.push(speciesElement[speciesType]);
                      }
                    });

                    return (
                      <FormItem className="flex w-[49%] flex-col">
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
                                  : 'Select language'}
                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput placeholder="Search framework..." className="h-9" />
                              <CommandList>
                                <CommandEmpty>No framework found.</CommandEmpty>
                                <CommandGroup>
                                  {formattedSpecies.map((species: string): JSX.Element => {
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
                  name="levelOfCertainty"
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
                                      form.setValue('levelOfCertainty', certaintyLevelOption.value);
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
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        );
      }}
    </Containers.SpectrogramContainer>
  );
};

export default ComboboxForm;
