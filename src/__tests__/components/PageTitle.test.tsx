import React from 'react';
import {render, screen} from '@testing-library/react';
import PageTitle from '../../components/PageTitle';

describe('PageTitle', () => {
  test('renders the title children and optional operations', () => {
    render(
      <PageTitle operations={<button type="button">Refresh</button>}>
        <h1>Dashboard</h1>
      </PageTitle>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Refresh'})).toBeInTheDocument();
  });

  test('omits the operations column when not provided', () => {
    const {container} = render(<PageTitle>Only Title</PageTitle>);

    expect(screen.getByText('Only Title')).toBeInTheDocument();
    expect(container.querySelectorAll('.col').length).toBe(1);
  });
});
