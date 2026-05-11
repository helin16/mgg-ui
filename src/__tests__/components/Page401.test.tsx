import React from 'react';
import {render, screen} from '@testing-library/react';
import Page401 from '../../components/Page401';

jest.mock('../../components/SchoolLogo');
jest.mock('../../components/support/ContactSupportPopupBtn');

describe('Page401', () => {
  test('renders the default access denied content', () => {
    render(<Page401 />);

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(
      screen.getByText("You don't have Access to this page or your session has timed out.")
    ).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Reload Page'})).toBeInTheDocument();
    expect(screen.getByTestId('SchoolLogoTestId')).toBeInTheDocument();
  });

  test('renders custom content and hides the logo when requested', () => {
    render(
      <Page401
        title="No Budget Access"
        description={<div>Custom description</div>}
        btns={<button type="button">Custom Action</button>}
        showLogo={false}
        variant="success"
      />
    );

    expect(screen.getByText('No Budget Access')).toHaveClass('success');
    expect(screen.getByText('Custom description')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Custom Action'})).toBeInTheDocument();
    expect(screen.queryByTestId('SchoolLogoTestId')).not.toBeInTheDocument();
  });
});
