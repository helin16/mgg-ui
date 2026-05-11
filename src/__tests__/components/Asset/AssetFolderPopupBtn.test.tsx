import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AssetFolderPopupBtn from '../../../components/Asset/AssetFolderPopupBtn';
import AssetFolderService from '../../../services/Asset/AssetFolderService';
import Toaster from '../../../services/Toaster';

jest.mock('../../../components/common/PopupModal');
jest.mock('../../../components/form/FormLabel');
jest.mock('../../../components/common/SectionDiv');
jest.mock('../../../services/Asset/AssetFolderService', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
    update: jest.fn(),
  },
}));
jest.mock('../../../services/Toaster');

describe('AssetFolderPopupBtn', () => {
  const mockedService = AssetFolderService as jest.Mocked<typeof AssetFolderService>;
  const mockedToaster = Toaster as jest.Mocked<typeof Toaster>;

  test('validates and creates a folder', async () => {
    const onSaved = jest.fn();
    mockedService.create.mockResolvedValue({id: 'folder-1', name: 'Images'} as any);

    render(<AssetFolderPopupBtn onSaved={onSaved}>New Folder</AssetFolderPopupBtn>);

    await userEvent.click(screen.getByRole('button', {name: 'New Folder'}));
    await userEvent.click(screen.getByRole('button', {name: 'Create'}));
    expect(await screen.findByText('Folder name is required')).toBeInTheDocument();

    await userEvent.type(screen.getByPlaceholderText('The name of the folder'), 'Images');
    await userEvent.click(screen.getByRole('button', {name: 'Create'}));

    await waitFor(() => expect(mockedService.create).toHaveBeenCalledWith({name: 'Images'}));
    expect(onSaved).toHaveBeenCalledWith({id: 'folder-1', name: 'Images'}, true);
  });

  test('shows api errors when saving fails', async () => {
    const error = new Error('Folder save failed');
    mockedService.create.mockRejectedValue(error);

    render(<AssetFolderPopupBtn onSaved={jest.fn()}>New Folder</AssetFolderPopupBtn>);

    await userEvent.click(screen.getByRole('button', {name: 'New Folder'}));
    await userEvent.type(screen.getByPlaceholderText('The name of the folder'), 'Images');
    await userEvent.click(screen.getByRole('button', {name: 'Create'}));

    await waitFor(() => expect(mockedToaster.showApiError).toHaveBeenCalledWith(error));
  });
});
