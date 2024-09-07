import { useState } from 'react';

import { Combobox } from 'shadcn-ui';

const Example = () => {
  const [query, setQuery] = useState('');
  const options = [
    { id: 1, label: 'Option 1' },
    { id: 2, label: 'Option 2' },
    { id: 3, label: 'Option 3' },
  ];

  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <Combobox value={query} onChange={setQuery}>
      <Combobox.Input placeholder="Type to filter..." />
      <Combobox.Options>
        {filteredOptions.length === 0 ? (
          <Combobox.Option disabled>No options found</Combobox.Option>
        ) : (
          filteredOptions.map((option) => (
            <Combobox.Option key={option.id} value={option.label}>
              {option.label}
            </Combobox.Option>
          ))
        )}
      </Combobox.Options>
    </Combobox>
  );
};

export default Example;
