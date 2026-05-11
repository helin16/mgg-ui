import React from 'react';
import {render, screen} from '@testing-library/react';
import PopupModal from '../../../components/common/PopupModal';

describe('PopupModal', () => {
  test('renders title body and footer in the bootstrap modal', () => {
    render(
      <PopupModal show title="Popup Title" footer={<button type="button">Done</button>}>
        Popup Body
      </PopupModal>
    );

    expect(screen.getByText('Popup Title')).toBeInTheDocument();
    expect(screen.getByText('Popup Body')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Done'})).toBeInTheDocument();
  });
});
