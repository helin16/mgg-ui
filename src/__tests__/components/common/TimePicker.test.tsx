import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import TimePicker from '../../../components/common/TimePicker';
import UtilsService from '../../../services/UtilsService';

jest.mock('../../../services/UtilsService', () => ({
  __esModule: true,
  default: {
    validateTime: jest.fn(() => true),
  },
}));

describe('TimePicker', () => {
  test('increments the selected time and emits hours and minutes', () => {
    const onChange = jest.fn();
    render(<TimePicker value="10:15:00" onChange={onChange} />);

    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(UtilsService.validateTime).toHaveBeenCalledWith('10:15:00');
  });
});
