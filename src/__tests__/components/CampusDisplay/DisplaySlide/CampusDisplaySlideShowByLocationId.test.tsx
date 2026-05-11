import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import CampusDisplaySlideShowByLocationId from '../../../../components/CampusDisplay/DisplaySlide/CampusDisplaySlideShowByLocationId';
import CampusDisplayLocationService from '../../../../services/CampusDisplay/CampusDisplayLocationService';
import CampusDisplayScheduleService from '../../../../services/CampusDisplay/CampusDisplayScheduleService';
import CampusDisplaySlideService from '../../../../services/CampusDisplay/CampusDisplaySlideService';

jest.mock('../../../../components/common/PageLoadingSpinner');
jest.mock('../../../../components/CampusDisplay/DisplaySlide/CampusDisplaySlideShow');
jest.mock('../../../../services/CampusDisplay/CampusDisplayLocationService', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
    getById: jest.fn(),
  },
}));
jest.mock('../../../../services/CampusDisplay/CampusDisplayScheduleService', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
  },
}));
jest.mock('../../../../services/CampusDisplay/CampusDisplaySlideService', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
  },
}));
jest.mock('../../../../services/Toaster');

describe('CampusDisplaySlideShowByLocationId', () => {
  const mockedLocationService = CampusDisplayLocationService as jest.Mocked<typeof CampusDisplayLocationService>;
  const mockedScheduleService = CampusDisplayScheduleService as jest.Mocked<typeof CampusDisplayScheduleService>;
  const mockedSlideService = CampusDisplaySlideService as jest.Mocked<typeof CampusDisplaySlideService>;

  test('shows a not-found state when the location has no playlist', async () => {
    mockedLocationService.getAll.mockResolvedValue({data: [{id: 'location-1', displayId: ''}]} as any);
    mockedScheduleService.getAll.mockResolvedValue({data: []} as any);

    render(<CampusDisplaySlideShowByLocationId locationId="location-1" />);

    await waitFor(() => expect(screen.getByText(/Can NOT find the campus display/i)).toBeInTheDocument());
  });

  test('loads slides for the resolved playlist and reports the loaded location', async () => {
    const onLocationLoaded = jest.fn();
    mockedLocationService.getAll.mockResolvedValue({data: [{id: 'location-1', displayId: 'display-1', isActive: true, version: 1}]} as any);
    mockedLocationService.getById.mockResolvedValue({id: 'location-1', displayId: 'display-1', isActive: true, version: 1} as any);
    mockedScheduleService.getAll.mockResolvedValue({data: []} as any);
    mockedSlideService.getAll.mockResolvedValue({data: [{id: 'slide-1'}]} as any);

    render(<CampusDisplaySlideShowByLocationId locationId="location-1" onLocationLoaded={onLocationLoaded} />);

    await waitFor(() => expect(onLocationLoaded).toHaveBeenCalledWith(expect.objectContaining({id: 'location-1'})));
  });
});
