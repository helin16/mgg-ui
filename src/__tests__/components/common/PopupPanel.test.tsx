import React from 'react';
import {render, screen} from '@testing-library/react';
import PopupPanel from '../../../components/common/PopupPanel';

describe('PopupPanel', () => {
  test('renders header body and footer areas', () => {
    render(
      <PopupPanel header="Header" footer="Footer">
        Body
      </PopupPanel>
    );

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});
