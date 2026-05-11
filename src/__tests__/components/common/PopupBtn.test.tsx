import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import PopupBtn from '../../../components/common/PopupBtn';

jest.mock('../../../components/common/PopupModal');

describe('PopupBtn', () => {
  test('opens the popup and renders the popup content', () => {
    render(<PopupBtn popupProps={{children: 'Popup body'}}>Open Popup</PopupBtn>);

    fireEvent.click(screen.getByRole('button', {name: 'Open Popup'}));
    expect(screen.getByText('Popup body')).toBeInTheDocument();
  });
});
