import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import ToggleBtn from '../../../components/common/ToggleBtn';

jest.mock('react-switch', () => require('../../../../__mocks__/react-switch'));

describe('ToggleBtn', () => {
  test('calls onChange through the wrapped switch', () => {
    const onChange = jest.fn();

    render(<ToggleBtn checked={false} on="On" off="Off" onChange={onChange} />);

    fireEvent.click(screen.getByTestId('ReactSwitchTestId'));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
