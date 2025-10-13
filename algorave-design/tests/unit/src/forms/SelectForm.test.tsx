import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SelectForm from '../../../../src/forms/SelectForm';
import * as Ariakit from '@ariakit/react';


const items = [
  { value: 'finished', label: 'Finished Project' },
  { value: 'before-after', label: 'Before and After Live Coding Project' },
];

function TestWrapper() {
  const store = Ariakit.useSelectStore({
    items: items.map(item => ({ id: item.value, value: item.value })),
  });
  return (
    <Ariakit.SelectProvider store={store}>
      <SelectForm
        label="Choose a project type"
        items={items}
        store={store}
      />
    </Ariakit.SelectProvider>
  );
}

describe('SelectForm', () => {
  it('renders label and options', () => {
    render(<TestWrapper />);
    expect(screen.getByText('Choose a project type')).toBeInTheDocument();
    expect(screen.getByText('Finished Project')).toBeInTheDocument();
    expect(screen.getByText('Before and After Live Coding Project')).toBeInTheDocument();
  });
});
