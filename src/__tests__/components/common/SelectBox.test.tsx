import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import SelectBox from '../../../components/common/SelectBox';

jest.mock('react-select', () => require('../../../../__mocks__/react-select'));

describe('SelectBox', () => {
  test('passes selection changes through the wrapped select', () => {
    const onChange = jest.fn();

    render(
      <SelectBox
        options={[{value: 'a', label: 'Option A'}]}
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByRole('button', {name: 'Select First Option'}));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({value: 'a'}));
  });
});
