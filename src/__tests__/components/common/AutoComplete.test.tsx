import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import AutoComplete from '../../../components/common/AutoComplete';

jest.mock('react-select/async', () => require('../../../../__mocks__/react-select/async'));

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
