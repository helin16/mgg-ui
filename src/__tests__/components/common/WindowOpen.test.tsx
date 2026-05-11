import React from 'react';
import {render, screen} from '@testing-library/react';
import WindowOpen from '../../../components/common/WindowOpen';

jest.mock('../../../components/common/PopupModal');

describe('WindowOpen', () => {
  test('shows the fallback popup when the browser blocks the new window', () => {
    const originalOpen = window.open;
    window.open = jest.fn(() => null);

    render(<WindowOpen url="https://example.com" />);

    expect(screen.getByText(/blocked popup/i)).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'https://example.com'})).toBeInTheDocument();

    window.open = originalOpen;
  });
});
