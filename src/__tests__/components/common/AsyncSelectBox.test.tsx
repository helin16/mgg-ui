import React from 'react';
import {render, screen} from '@testing-library/react';
import AsyncSelectBox from '../../../components/common/AsyncSelectBox';

jest.mock('react-select/async', () => require('../../../../__mocks__/react-select/async'));

describe('AsyncSelectBox', () => {
  test('renders the async react select wrapper', () => {
    render(<AsyncSelectBox loadOptions={jest.fn()} />);

    expect(screen.getByTestId('AsyncReactSelectTestId')).toBeInTheDocument();
  });
});
