import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import AutoComplete from '../../../components/common/AutoComplete';

jest.mock('react-select/async', () => ({
  __esModule: true,
  default: ({ onSelected, onChange }: any) => {
      const handleSelect = onSelected ?? onChange;
      return (
          <div data-testid="AsyncReactSelectTestId">
            <button
                type="button"
                onClick={() => handleSelect({ label: 'Option 1', value: '1' })}
            >
              Load Async Options
            </button>
            <button type="button" onClick={() => handleSelect(null)}>
              Clear Selection
            </button>
          </div>
      );
    },
}));

describe('AutoComplete', () => {
  test('loads async options and forwards the selected value', async () => {
    const onSelected = jest.fn();

    render(
      <AutoComplete
        handleSearchFn={jest.fn().mockResolvedValue([{id: '1', name: 'Option A'}])}
        renderOptionItemFn={(options) => options.map((option: any) => ({value: option.id, label: option.name}))}
        onSelected={onSelected}
      />
    );

    fireEvent.click(screen.getByRole('button', {name: 'Load Async Options'}));

    await waitFor(() => expect(onSelected).toHaveBeenCalledWith(expect.objectContaining({value: '1'})));
  });
});
