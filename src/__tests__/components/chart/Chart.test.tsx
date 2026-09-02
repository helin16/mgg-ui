import React from 'react';
import {render, screen} from '@testing-library/react';
import Chart from '../../../components/chart/Chart';
import HighchartsRuntime from '../../../components/chart/HighchartsRuntime';

let mockLastProps: any;
jest.mock('highcharts-react-official', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react');
  return {
    __esModule: true,
    default: (props: any) => {
      mockLastProps = props;
      return React.createElement('div', {['data-testid']: 'HighchartsReactTestId'});
    },
  };
});

describe('Chart', () => {
  beforeEach(() => {
    mockLastProps = undefined;
  });

  test('renders the highcharts wrapper', () => {
    render(<Chart options={{title: {text: 'Example'}}} />);

    expect(screen.getByTestId('HighchartsReactTestId')).toBeInTheDocument();
  });

  test('passes the isolated Highcharts instance and forwards props unchanged', () => {
    const options = {title: {text: 'Example'}};
    render(<Chart options={options} />);

    expect(mockLastProps.highcharts).toBe(HighchartsRuntime);
    expect(mockLastProps.options).toBe(options);
  });
});
