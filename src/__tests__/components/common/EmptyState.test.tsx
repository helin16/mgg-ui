import React from 'react';
import {render, screen} from '@testing-library/react';
import EmptyState from '../../../components/common/EmptyState';

describe('EmptyState', () => {
  test('renders title, description, logo and actions', () => {
    render(
      <EmptyState
        title="No records"
        description="Try again later"
        mainBtn={<button type="button">Create</button>}
        secondaryBtn={<button type="button">Cancel</button>}
      />
    );

    expect(screen.getByText('No records')).toBeInTheDocument();
    expect(screen.getByText('Try again later')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Create'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Cancel'})).toBeInTheDocument();
  });
});
