import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import CampusDisplayEditPanel from '../../../../components/CampusDisplay/Playlist/CampusDisplayEditPanel';
import CampusDisplaySlideService from '../../../../services/CampusDisplay/CampusDisplaySlideService';
import {CampusDisplayDraggableSlidesTestId} from '../../../../components/CampusDisplay/DisplaySlide/__mocks__/CampusDisplayDraggableSlides';

jest.mock('../../../../components/common/PageLoadingSpinner');
jest.mock('../../../../components/CampusDisplay/DisplaySlide/CampusDisplayDraggableSlides');
jest.mock('../../../../components/CampusDisplay/DisplaySlide/CampusDisplayShowSlide');
jest.mock('../../../../components/CampusDisplay/DisplaySlide/CampusDisplaySlideEditPopupBtn');
jest.mock('../../../../services/CampusDisplay/CampusDisplaySlideService', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
    update: jest.fn(),
    deactivate: jest.fn(),
  },
}));
jest.mock('../../../../services/Toaster');
jest.mock('react-redux', () => ({
  useSelector: (selector: any) => selector({auth: {user: {synergyId: 'abc123'}}}),
}));

describe('CampusDisplayEditPanel', () => {
  const mockedService = CampusDisplaySlideService as jest.Mocked<typeof CampusDisplaySlideService>;

  test('loads slides and renders the draggable slide strip', async () => {
    mockedService.getAll.mockResolvedValue({data: [{id: 'slide-1', Asset: {}}]} as any);

    render(
      <CampusDisplayEditPanel
        campusDisplay={{id: 'display-1'} as any}
        onSlidesSelected={jest.fn()}
      />
    );

    expect(await screen.findByTestId(CampusDisplayDraggableSlidesTestId)).toBeInTheDocument();
  });

  test('persists reordered slides', async () => {
    mockedService.getAll.mockResolvedValue({data: [{id: 'slide-1', Asset: {}}, {id: 'slide-2', Asset: {}}]} as any);

    render(
      <CampusDisplayEditPanel
        campusDisplay={{id: 'display-1'} as any}
        onSlidesSelected={jest.fn()}
      />
    );

    await screen.findByTestId(CampusDisplayDraggableSlidesTestId);
    fireEvent.click(screen.getByRole('button', {name: 'Reorder Slides'}));

    await waitFor(() => expect(mockedService.update).toHaveBeenCalled());
  });
});
