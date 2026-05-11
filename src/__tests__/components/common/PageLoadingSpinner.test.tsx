import React from 'react';
import {render, screen} from '@testing-library/react';
import PageLoadingSpinner from '../../../components/common/PageLoadingSpinner';

describe('PageLoadingSpinner', () => {
  test('renders the default loading copy', () => {
    render(<PageLoadingSpinner />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
