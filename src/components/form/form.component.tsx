'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Textarea } from '../ui/textarea';

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

const ComboboxForm = (props): JSX.Element => {
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
            render={({ field }) => (
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
                          ? languages.find((language) => language.value === field.value)?.label
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
                          {languages.map((language) => (
                            <CommandItem
                              value={language.label}
                              key={language.value}
                              onSelect={() => {
                                form.setValue('speciesName', language.value);
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
                          ? languages.find((language) => language.value === field.value)?.label
                          : 'Select language'}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
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
            render={({ field }) => (
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
                          ? languages.find((language) => language.value === field.value)?.label
                          : 'Select language'}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
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
                                form.setValue('speciesName', language.value);
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
                          ? languages.find((language) => language.value === field.value)?.label
                          : 'Select language'}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
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
                                form.setValue('type', language.value);
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
                        className={cn('w-[100%] justify-between bg-white', !field.value && 'text-muted-foreground')}
                      >
                        {field.value
                          ? languages.find((language) => language.value === field.value)?.label
                          : 'Select language'}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
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
                                form.setValue('levelOfCertainty', language.value);
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
                        className={cn('w-[100%] justify-between bg-white', !field.value && 'text-muted-foreground')}
                      >
                        {field.value
                          ? languages.find((language) => language.value === field.value)?.label
                          : 'Select language'}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[100%] p-0">
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
                                form.setValue('completude', language.value);
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
};

export default ComboboxForm;
