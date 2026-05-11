import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import PlayListEditPanel from '../../../../components/CampusDisplay/Playlist/PlayListEditPanel';
import {CampusDisplayEditPanelTestId} from '../../../../components/CampusDisplay/Playlist/__mocks__/CampusDisplayEditPanel';

jest.mock('../../../../components/PanelTitle');
jest.mock('../../../../components/CampusDisplay/Playlist/CampusDisplaySelector');
jest.mock('../../../../components/CampusDisplay/Playlist/CampusDisplayEditPanel');
jest.mock('../../../../components/CampusDisplay/DisplaySlide/CampusDisplaySlideCreatePopupBtn');
jest.mock('../../../../components/CampusDisplay/DisplaySlide/CampusDisplaySlideEditPopupBtn');
jest.mock('../../../../components/common/DeleteConfirm/DeleteConfirmPopupBtn');
jest.mock('../../../../services/CampusDisplay/CampusDisplaySlideService', () => ({
  __esModule: true,
  default: {
    deactivate: jest.fn(),
  },
}));
jest.mock('../../../../services/Toaster');
jest.mock('react-redux', () => ({
  useSelector: (selector: any) => selector({auth: {user: {synergyId: 'abc123'}}}),
}));

describe('PlayListEditPanel', () => {
  test('shows the placeholder when no playlist is selected and loads the edit panel when selected', () => {
    const {rerender} = render(<PlayListEditPanel />);

    expect(screen.getByText(/Please select a play list above to edit/i)).toBeInTheDocument();

    rerender(<PlayListEditPanel playList={{id: 'display-1', name: 'Display One'} as any} />);
    expect(screen.getByTestId(CampusDisplayEditPanelTestId)).toBeInTheDocument();
  });

  test('allows playlist selection through the selector in free mode', () => {
    render(<PlayListEditPanel />);

    fireEvent.click(screen.getByRole('button', {name: 'Select Display'}));
    expect(screen.getByTestId(CampusDisplayEditPanelTestId)).toBeInTheDocument();
  });
});
