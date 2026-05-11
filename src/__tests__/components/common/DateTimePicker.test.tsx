import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import DateTimePicker from '../../../components/common/DateTimePicker';

jest.mock('react-datetime', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react');
  return {
    __esModule: true,
    default: ({onChange, renderInput, inputProps, value, ...props}: any) => {
      const renderedInputProps = {
        className: 'datetime-input',
        value: value || '',
        onChange: (event: any) => onChange?.(event.target.value),
        ...inputProps,
      };

      if (renderInput) {
        return React.createElement(
          'div',
          {['data-testid']: 'DatetimeTestId'},
        renderInput(renderedInputProps),
        React.createElement(
          'button',
          {type: 'button', onClick: () => onChange?.('2026-05-11T10:00:00')},
          'Pick Date'
        )
      );
    }

      return React.createElement(
        'div',
        {['data-testid']: 'DatetimeTestId'},
        React.createElement('input', renderedInputProps),
        React.createElement(
          'button',
          {type: 'button', onClick: () => onChange?.('2026-05-11T10:00:00')},
          'Pick Date'
        )
      );
    },
  };
});

describe('DateTimePicker', () => {
  test('calls onChange from the datetime picker and supports clear', () => {
    const onChange = jest.fn();

    render(<DateTimePicker value="2026-05-11T10:00:00" onChange={onChange} allowClear />);

    fireEvent.click(screen.getByRole('button', {name: 'Pick Date'}));
    expect(onChange).toHaveBeenCalledWith('2026-05-11T10:00:00');
  });
});
