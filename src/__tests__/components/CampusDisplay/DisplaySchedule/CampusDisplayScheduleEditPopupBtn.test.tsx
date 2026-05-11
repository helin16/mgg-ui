import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import CampusDisplayScheduleEditPopupBtn from '../../../../components/CampusDisplay/DisplaySchedule/CampusDisplayScheduleEditPopupBtn';
import CampusDisplayScheduleService from '../../../../services/CampusDisplay/CampusDisplayScheduleService';
import CampusDisplayService from '../../../../services/CampusDisplay/CampusDisplayService';

jest.mock('../../../../components/common/PopupModal');
jest.mock('../../../../components/common/LoadingBtn');
jest.mock('../../../../components/form/FormLabel');
jest.mock('../../../../components/common/DateTimePicker');
jest.mock('../../../../components/common/SectionDiv');
jest.mock('../../../../components/form/FormErrorDisplay');
jest.mock('../../../../components/CampusDisplay/Playlist/CampusDisplaySelector');
jest.mock('../../../../services/CampusDisplay/CampusDisplayScheduleService', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
    update: jest.fn(),
  },
}));
jest.mock('../../../../services/CampusDisplay/CampusDisplayService', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
  },
}));
jest.mock('../../../../services/Toaster');
describe('CampusDisplayScheduleEditPopupBtn', () => {
  const mockedScheduleService = CampusDisplayScheduleService as jest.Mocked<typeof CampusDisplayScheduleService>;
  const mockedDisplayService = CampusDisplayService as jest.Mocked<typeof CampusDisplayService>;

  test('validates that a playlist is required before saving', async () => {
    render(<CampusDisplayScheduleEditPopupBtn locationId="location-1">Open</CampusDisplayScheduleEditPopupBtn>);

    fireEvent.click(screen.getByRole('button', {name: 'Open'}));
    fireEvent.click(screen.getByRole('button', {name: /Save/i}));

    await waitFor(() =>
      expect(screen.getAllByTestId('FormErrorDisplayTestId').length).toBeGreaterThan(0)
    );
    expect(mockedScheduleService.create).not.toHaveBeenCalled();
  });

  test('creates a schedule after choosing a playlist', async () => {
    mockedScheduleService.create.mockResolvedValue({id: 'schedule-1'} as any);

    render(<CampusDisplayScheduleEditPopupBtn locationId="location-1">Open</CampusDisplayScheduleEditPopupBtn>);

    fireEvent.click(screen.getByRole('button', {name: 'Open'}));
    fireEvent.click(screen.getByRole('button', {name: 'Select Display'}));
    fireEvent.click(screen.getAllByRole('button', {name: 'Pick Date Time'})[0]);
    fireEvent.click(screen.getByRole('button', {name: /Save/i}));

    await waitFor(() => expect(mockedScheduleService.create).toHaveBeenCalled());
    expect(mockedDisplayService.create).not.toHaveBeenCalled();
  });
});
