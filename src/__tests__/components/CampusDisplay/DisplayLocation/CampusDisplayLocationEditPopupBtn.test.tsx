import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import CampusDisplayLocationEditPopupBtn from '../../../../components/CampusDisplay/DisplayLocation/CampusDisplayLocationEditPopupBtn';
import CampusDisplayLocationService from '../../../../services/CampusDisplay/CampusDisplayLocationService';
import Toaster, {TOAST_TYPE_SUCCESS} from '../../../../services/Toaster';
import TestHelper from '../../../helper/TestHelper';

jest.mock('../../../../components/common/PopupModal');
jest.mock('../../../../components/form/FormLabel');
jest.mock('../../../../components/common/LoadingBtn');
jest.mock('../../../../components/form/FormErrorDisplay');
jest.mock('../../../../components/common/SectionDiv');
jest.mock('../../../../components/CampusDisplay/Playlist/CampusDisplaySelector');
jest.mock('../../../../services/CampusDisplay/CampusDisplayLocationService', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
    update: jest.fn(),
  },
}));
jest.mock('../../../../services/Toaster');

describe('CampusDisplayLocationEditPopupBtn', () => {
  const mockedService = CampusDisplayLocationService as jest.Mocked<typeof CampusDisplayLocationService>;
  const mockedToaster = Toaster as jest.Mocked<typeof Toaster>;
  const fakeName = TestHelper.faker.company.name();

  test('validates required name before saving', async () => {
    render(<CampusDisplayLocationEditPopupBtn onSaved={jest.fn()}>Open</CampusDisplayLocationEditPopupBtn>);

    fireEvent.click(screen.getByRole('button', {name: 'Open'}));
    fireEvent.click(screen.getByRole('button', {name: /Save/i}));

    await waitFor(() =>
      expect(screen.getByRole('textbox')).toHaveClass('is-invalid')
    );
    expect(mockedService.create).not.toHaveBeenCalled();
  });

  test('creates a new location and reports success', async () => {
    const onSaved = jest.fn();
    mockedService.create.mockResolvedValue({id: 'location-1', name: fakeName} as any);

    render(<CampusDisplayLocationEditPopupBtn onSaved={onSaved}>Open</CampusDisplayLocationEditPopupBtn>);

    fireEvent.click(screen.getByRole('button', {name: 'Open'}));
    fireEvent.change(screen.getByRole('textbox'), {target: {value: fakeName}});
    fireEvent.click(screen.getByRole('button', {name: /Save/i}));

    await waitFor(() => expect(mockedService.create).toHaveBeenCalled());
    expect(mockedToaster.showToast).toHaveBeenCalledWith('Saved successfully.', TOAST_TYPE_SUCCESS);
    expect(onSaved).toHaveBeenCalledWith(expect.objectContaining({id: 'location-1'}));
  });
});
