import React from 'react';
import {act} from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import CampusDisplaySlideCreatePopupBtn from '../../../../components/CampusDisplay/DisplaySlide/CampusDisplaySlideCreatePopupBtn';
import CampusDisplaySlideService from '../../../../services/CampusDisplay/CampusDisplaySlideService';
import Toaster, {TOAST_TYPE_SUCCESS} from '../../../../services/Toaster';

jest.mock('../../../../components/common/PopupModal');
jest.mock('../../../../components/common/LoadingBtn');
jest.mock('../../../../components/Asset/AssetListPanel');
jest.mock('../../../../services/CampusDisplay/CampusDisplaySlideService', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
    createFromFolder: jest.fn(),
  },
}));
jest.mock('../../../../services/Toaster');

describe('CampusDisplaySlideCreatePopupBtn', () => {
  const mockedService = CampusDisplaySlideService as jest.Mocked<typeof CampusDisplaySlideService>;
  const mockedToaster = Toaster as jest.Mocked<typeof Toaster>;

  test('creates slides from selected assets and folders', async () => {
    const onSaved = jest.fn();
    mockedService.create.mockResolvedValue({id: 'slide-1'} as any);
    mockedService.createFromFolder.mockResolvedValue([{id: 'slide-2'}] as any);

    render(
      <CampusDisplaySlideCreatePopupBtn display={{id: 'display-1'} as any} onSaved={onSaved}>
        Open
      </CampusDisplaySlideCreatePopupBtn>
    );

    fireEvent.click(screen.getByRole('button', {name: 'Open'}));

    await act(async () => {
      fireEvent.click(screen.getByRole('button', {name: 'Select Asset'}));
      fireEvent.click(screen.getByRole('button', {name: 'Select Folder'}));
    });

    fireEvent.click(screen.getByRole('button', {name: /Create/i}));

    await waitFor(() => expect(mockedService.create).toHaveBeenCalledWith({displayId: 'display-1', assetId: 'asset-1'}));
    expect(mockedToaster.showToast).toHaveBeenCalledWith('Slides created successfully.', TOAST_TYPE_SUCCESS);
    expect(onSaved).toHaveBeenCalled();
  });
});
