import React from 'react';
import {render, screen} from '@testing-library/react';
import PageNotFound from '../../components/PageNotFound';

jest.mock('../../components/SchoolLogo');
jest.mock('../../components/support/ContactSupportPopupBtn');

describe('PageNotFound', () => {
  test('renders the default not found content', () => {
    render(<PageNotFound />);

    expect(screen.getByText("Requested page can't be found.")).toBeInTheDocument();
    expect(
      screen.getByText('This page might have been removed or temporarily unavailable.')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Reload Page'})).toBeInTheDocument();
  });

  test('renders custom title, description and buttons', () => {
    render(
      <PageNotFound
        title="Custom Title"
        description={<span>Custom Description</span>}
        primaryBtn={<button type="button">Primary</button>}
        secondaryBtn={<button type="button">Secondary</button>}
      />
    );

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom Description')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Primary'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Secondary'})).toBeInTheDocument();
  });
});
