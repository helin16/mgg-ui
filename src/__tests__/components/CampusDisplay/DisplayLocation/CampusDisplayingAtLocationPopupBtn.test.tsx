import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import CampusDisplayingAtLocationPopupBtn from '../../../../components/CampusDisplay/DisplayLocation/CampusDisplayingAtLocationPopupBtn';
import CampusDisplayLocationService from '../../../../services/CampusDisplay/CampusDisplayLocationService';
import Toaster, {TOAST_TYPE_SUCCESS} from '../../../../services/Toaster';

jest.mock('../../../../components/common/PopupModal');
jest.mock('../../../../components/common/LoadingBtn');
jest.mock('../../../../components/form/FormLabel');
jest.mock('../../../../components/CampusDisplay/DisplayLocation/CampusDisplayLocationSelector');
jest.mock('../../../../services/CampusDisplay/CampusDisplayLocationService', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
    update: jest.fn(),
  },
}));
jest.mock('../../../../services/Toaster');

describe('CampusDisplayingAtLocationPopupBtn', () => {
  const mockedService = CampusDisplayLocationService as jest.Mocked<typeof CampusDisplayLocationService>;
  const mockedToaster = Toaster as jest.Mocked<typeof Toaster>;

  test('loads current location and updates the selected location', async () => {
    mockedService.getAll.mockResolvedValue({data: [{id: 'location-2', name: 'Current Location'}]} as any);
    mockedService.update.mockResolvedValue({} as any);

    render(<CampusDisplayingAtLocationPopupBtn displayId="display-1" />);

    expect(await screen.findByRole('button', {name: /Showing At:/i})).toHaveTextContent('Current Location');

    fireEvent.click(screen.getByRole('button', {name: /Showing At:/i}));
    fireEvent.click(screen.getByRole('button', {name: 'Select Location'}));
    fireEvent.click(screen.getByRole('button', {name: /Save/i}));

    await waitFor(() => expect(mockedService.update).toHaveBeenCalledTimes(2));
    expect(mockedToaster.showToast).toHaveBeenCalledWith('Displaying Location Updated', TOAST_TYPE_SUCCESS);
  });
});
