import React from 'react';
import {render, screen} from '@testing-library/react';
import Chart from '../../../components/chart/Chart';

jest.mock('highcharts-react-official', () => require('../../../../__mocks__/highcharts-react-official'));

describe('Chart', () => {
  test('renders the highcharts wrapper', () => {
    render(<Chart options={{title: {text: 'Example'}}} />);

    expect(screen.getByTestId('HighchartsReactTestId')).toBeInTheDocument();
  });
});
