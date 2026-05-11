import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import CheckBox from '../../../components/common/CheckBox';

describe('CheckBox', () => {
  test('renders and changes through the bootstrap checkbox', () => {
    const onChange = jest.fn();
    const {container} = render(<CheckBox label="Enabled" onChange={onChange} />);

    fireEvent.click(container.querySelector('input[type="checkbox"]') as HTMLInputElement);
    expect(onChange).toHaveBeenCalled();
  });
});
