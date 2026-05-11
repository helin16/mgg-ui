import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExplanationPanel from '../../components/ExplanationPanel';

describe('ExplanationPanel', () => {
  test('renders the provided text and default icon styling', () => {
    render(<ExplanationPanel text="Details here" />);

    expect(screen.getByText('Details here')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('alert-secondary');
  });

  test('supports dismissible alerts and custom variants', async () => {
    const onDismiss = jest.fn();
    render(
      <ExplanationPanel
        text="Dismiss me"
        variant="warning"
        dismissible
        onDismiss={onDismiss}
      />
    );

    expect(screen.getByRole('alert')).toHaveClass('alert-warning');
    await userEvent.click(screen.getByLabelText('Close alert'));
    expect(onDismiss).toHaveBeenCalled();
  });
});
