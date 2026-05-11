import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import CampusDisplaySlideEditPopupBtn from '../../../../components/CampusDisplay/DisplaySlide/CampusDisplaySlideEditPopupBtn';
import CampusDisplaySlideService from '../../../../services/CampusDisplay/CampusDisplaySlideService';
import {
  CD_DISPLAY_MODE_FULL_SCREEN_FIT,
} from '../../../../components/CampusDisplay/DisplaySlide/CDSlideDisplayModeSelector';

jest.mock('../../../../components/common/PopupModal');
jest.mock('../../../../components/common/LoadingBtn');
jest.mock('../../../../components/form/FormLabel');
jest.mock('../../../../components/CampusDisplay/DisplaySlide/CDSlideDisplayModeSelector');
jest.mock('../../../../services/CampusDisplay/CampusDisplaySlideService', () => ({
  __esModule: true,
  default: {
    update: jest.fn(),
  },
}));
jest.mock('../../../../services/Toaster');

describe('CampusDisplaySlideEditPopupBtn', () => {
  const mockedService = CampusDisplaySlideService as jest.Mocked<typeof CampusDisplaySlideService>;

  test('updates slide settings for the selected slides', async () => {
    mockedService.update.mockResolvedValue({id: 'slide-1'} as any);

    render(
      <CampusDisplaySlideEditPopupBtn
        display={{id: 'display-1'} as any}
        slides={[{id: 'slide-1', settings: {}}] as any}
      >
        Open
      </CampusDisplaySlideEditPopupBtn>
    );

    fireEvent.click(screen.getByRole('button', {name: 'Open'}));
    fireEvent.click(screen.getByRole('button', {name: 'Select Full Screen Fit'}));
    fireEvent.click(screen.getByRole('button', {name: /Update/i}));

    await waitFor(() => expect(mockedService.update).toHaveBeenCalledWith(
      'slide-1',
      expect.objectContaining({
        settings: expect.objectContaining({
          displayMode: CD_DISPLAY_MODE_FULL_SCREEN_FIT,
        }),
      })
    ));
  });
});
