import React from 'react';
import {render, screen} from '@testing-library/react';
import AsyncSelectBox from '../../../components/common/AsyncSelectBox';

jest.mock('react-select/async', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react');
  return {
    __esModule: true,
    default: (props: any) => {
      return React.createElement(
        'div',
        {['data-testid']: 'AsyncReactSelectTestId'},
      React.createElement(
        'button',
        {
          type: 'button',
          onClick: () => props?.onChange?.(props?.options?.[0] || null),
        },
        'Load Async Options'
      ),
      React.createElement(
        'button',
        {
          type: 'button',
          onClick: () => props?.onChange?.(null),
        },
        'Clear Selection'
      )
      );
    },
  };
});

describe('AsyncSelectBox', () => {
  test('renders the async react select wrapper', () => {
    render(<AsyncSelectBox loadOptions={jest.fn()} />);

    expect(screen.getByTestId('AsyncReactSelectTestId')).toBeInTheDocument();
  });
});
