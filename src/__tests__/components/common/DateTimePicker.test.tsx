import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import DateTimePicker from '../../../components/common/DateTimePicker';

jest.mock('react-datetime', () => require('../../../../__mocks__/react-datetime'));

describe('DateTimePicker', () => {
  test('calls onChange from the datetime picker and supports clear', () => {
    const onChange = jest.fn();

    render(<DateTimePicker value="2026-05-11T10:00:00" onChange={onChange} allowClear />);

    fireEvent.click(screen.getByRole('button', {name: 'Pick Date'}));
    expect(onChange).toHaveBeenCalledWith('2026-05-11T10:00:00');
  });
});
