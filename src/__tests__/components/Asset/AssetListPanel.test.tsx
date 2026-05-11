import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComponentTestHelper from '../../helper/ComponentTestHelper';
import {
  AssetFolderPopupBtnKey,
  AssetFolderPopupBtnTestId,
} from '../../../components/Asset/__mocks__/AssetFolderPopupBtn';
import {
  AssetThumbnailKey,
  AssetThumbnailTestId,
} from '../../../components/Asset/__mocks__/AssetThumbnail';
import {AssetUrlEditPopupBtnTestId} from '../../../components/Asset/__mocks__/AssetUrlEditPopupBtn';
import AssetListPanel from '../../../components/Asset/AssetListPanel';
import AssetService from '../../../services/Asset/AssetService';
import AssetFolderService from '../../../services/Asset/AssetFolderService';
import Toaster from '../../../services/Toaster';

jest.mock('../../../components/Asset/UploadFilePanel');
jest.mock('../../../components/Asset/AssetThumbnail');
jest.mock('../../../components/common/DeleteConfirm/DeleteConfirmPopupBtn');
jest.mock('../../../components/Asset/AssetUrlEditPopupBtn');
jest.mock('../../../components/Asset/AssetFolderPopupBtn');
jest.mock('../../../services/Asset/AssetService', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
    deactivate: jest.fn(),
    upload: jest.fn(),
  },
  HEADER_NAME_ASSET_FOLDER_ID: 'x-folder-id',
  HEADER_NAME_ASSET_TYPE: 'x-asset-type',
}));
jest.mock('../../../services/Asset/AssetFolderService', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
    deactivate: jest.fn(),
  },
}));
jest.mock('../../../services/Toaster');

describe('AssetListPanel', () => {
  ComponentTestHelper.prepare();

  const mockedAssetService = AssetService as jest.Mocked<typeof AssetService>;
  const mockedFolderService = AssetFolderService as jest.Mocked<typeof AssetFolderService>;
  const mockedToaster = Toaster as jest.Mocked<typeof Toaster>;

  beforeEach(() => {
    mockedAssetService.getAll.mockResolvedValue({
      currentPage: 1,
      pages: 1,
      data: [{id: 'asset-1', createdAt: '2026-01-01T00:00:00Z', url: 'image.png'}],
    } as any);
    mockedFolderService.getAll.mockResolvedValue({
      data: [{id: 'folder-1', name: 'Images', type: 'image'}],
    } as any);
  });

  test('loads folders and assets and supports selecting them', async () => {
    const onSelect = jest.fn();
    const onFolderSelected = jest.fn();
    const onListingFolder = jest.fn();

    render(
      <AssetListPanel
        onSelect={onSelect}
        onFolderSelected={onFolderSelected}
        onListingFolder={onListingFolder}
        selectedAssetIds={[]}
        selectedFolderIds={[]}
      />
    );

    expect(await screen.findByText('Images')).toBeInTheDocument();
    expect(screen.getByTestId(AssetThumbnailTestId)).toBeInTheDocument();

    await userEvent.click(screen.getByText('Images'));
    expect(onFolderSelected).toHaveBeenCalledWith(['folder-1']);

    await userEvent.dblClick(screen.getByText('Images'));
    expect(onListingFolder).toHaveBeenCalledWith('folder-1');

    await userEvent.click(screen.getByTestId(AssetThumbnailTestId));
    expect(onSelect).toHaveBeenCalledWith(['asset-1']);
    expect(ComponentTestHelper.get(AssetThumbnailKey)[0]).toMatchObject({
      asset: expect.objectContaining({id: 'asset-1'}),
    });
  });

  test('renders creation controls when allowCreation is enabled', async () => {
    render(<AssetListPanel allowCreation assetType="video" />);

    await screen.findByTestId(AssetUrlEditPopupBtnTestId);
    expect(screen.getByTestId(AssetUrlEditPopupBtnTestId)).toBeInTheDocument();
    expect(screen.getByTestId(AssetFolderPopupBtnTestId)).toBeInTheDocument();
    expect(ComponentTestHelper.get(AssetFolderPopupBtnKey)[0]).toMatchObject({
      parentId: undefined,
    });
  });

  test('shows api errors when loading fails', async () => {
    const error = new Error('Asset list failed');
    mockedAssetService.getAll.mockRejectedValue(error);

    render(<AssetListPanel />);

    await waitFor(() => expect(mockedToaster.showApiError).toHaveBeenCalledWith(error));
  });
});
