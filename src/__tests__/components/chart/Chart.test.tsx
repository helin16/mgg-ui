import React from 'react';
import {render, screen} from '@testing-library/react';
import Chart from '../../../components/chart/Chart';

jest.mock('highcharts-react-official', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react');
  return {
    __esModule: true,
    default: (props: any) => React.createElement('div', {['data-testid']: 'HighchartsReactTestId'}, props?.containerProps?.children || null),
  };
});

describe('Chart', () => {
  test('renders the highcharts wrapper', () => {
    render(<Chart options={{title: {text: 'Example'}}} />);

    expect(screen.getByTestId('HighchartsReactTestId')).toBeInTheDocument();
  });
});
