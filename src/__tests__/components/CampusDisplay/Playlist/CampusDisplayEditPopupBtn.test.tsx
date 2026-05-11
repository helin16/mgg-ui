import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import CampusDisplayEditPopupBtn from '../../../../components/CampusDisplay/Playlist/CampusDisplayEditPopupBtn';
import CampusDisplayService from '../../../../services/CampusDisplay/CampusDisplayService';
import Toaster, {TOAST_TYPE_SUCCESS} from '../../../../services/Toaster';
import TestHelper from '../../../helper/TestHelper';

jest.mock('../../../../components/common/PopupModal');
jest.mock('../../../../components/common/LoadingBtn');
jest.mock('../../../../components/form/FormLabel');
jest.mock('../../../../components/form/FormErrorDisplay');
jest.mock('../../../../services/CampusDisplay/CampusDisplayService', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
    update: jest.fn(),
  },
}));
jest.mock('../../../../services/Toaster');

describe('CampusDisplayEditPopupBtn', () => {
  const mockedService = CampusDisplayService as jest.Mocked<typeof CampusDisplayService>;
  const mockedToaster = Toaster as jest.Mocked<typeof Toaster>;

  test('requires a name before saving', async () => {
    render(<CampusDisplayEditPopupBtn onSaved={jest.fn()}>Open</CampusDisplayEditPopupBtn>);

    fireEvent.click(screen.getByRole('button', {name: 'Open'}));
    fireEvent.click(screen.getByRole('button', {name: /Save/i}));

    await waitFor(() =>
      expect(screen.getByRole('textbox')).toHaveClass('is-invalid')
    );
    expect(mockedService.create).not.toHaveBeenCalled();
  });

  test('creates a playlist and reports success', async () => {
    const fakeName = TestHelper.faker.company.name();
    mockedService.create.mockResolvedValue({id: 'display-1', name: fakeName} as any);

    render(<CampusDisplayEditPopupBtn onSaved={jest.fn()}>Open</CampusDisplayEditPopupBtn>);

    fireEvent.click(screen.getByRole('button', {name: 'Open'}));
    fireEvent.change(screen.getByRole('textbox'), {target: {value: fakeName}});
    fireEvent.click(screen.getByRole('button', {name: /Save/i}));

    await waitFor(() => expect(mockedService.create).toHaveBeenCalled());
    expect(mockedToaster.showToast).toHaveBeenCalledWith('Saved successfully.', TOAST_TYPE_SUCCESS);
  });
});
