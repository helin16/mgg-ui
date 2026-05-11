import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import ToggleBtn from '../../../components/common/ToggleBtn';

jest.mock('react-switch', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react');
  return {
    __esModule: true,
    default: ({checked, onChange, disabled}: any) => {
      return React.createElement(
        'button',
        {
          type: 'button',
          ['data-testid']: 'ReactSwitchTestId',
          ['aria-pressed']: checked,
          disabled,
          onClick: () => onChange?.(!checked),
        },
        checked ? 'On' : 'Off'
      );
    },
  };
});

describe('ToggleBtn', () => {
  test('calls onChange through the wrapped switch', () => {
    const onChange = jest.fn();

    render(<ToggleBtn checked={false} on="On" off="Off" onChange={onChange} />);

    fireEvent.click(screen.getByTestId('ReactSwitchTestId'));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
