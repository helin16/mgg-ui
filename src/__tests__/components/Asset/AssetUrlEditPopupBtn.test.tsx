import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AssetUrlEditPopupBtn from '../../../components/Asset/AssetUrlEditPopupBtn';
import AssetService from '../../../services/Asset/AssetService';
import Toaster from '../../../services/Toaster';
import {ASSET_TYPE_TEMP} from '../../../types/asset/iAsset';

jest.mock('../../../components/common/PopupModal');
jest.mock('../../../components/form/FormLabel');
jest.mock('../../../components/common/SectionDiv');
jest.mock('../../../services/Asset/AssetService', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
  },
}));
jest.mock('../../../services/Toaster');

describe('AssetUrlEditPopupBtn', () => {
  const mockedService = AssetService as jest.Mocked<typeof AssetService>;
  const mockedToaster = Toaster as jest.Mocked<typeof Toaster>;

  test('validates and creates an asset from url', async () => {
    const onSaved = jest.fn();
    mockedService.create.mockResolvedValue({id: 'asset-1'} as any);

    render(<AssetUrlEditPopupBtn onSaved={onSaved}>Create Link</AssetUrlEditPopupBtn>);

    await userEvent.click(screen.getByRole('button', {name: 'Create Link'}));
    await userEvent.click(screen.getByRole('button', {name: 'Create'}));
    expect(await screen.findByText('Url is required.')).toBeInTheDocument();

    await userEvent.type(screen.getByPlaceholderText('Youtube / Vimeo / External link'), 'https://youtube.com/watch?v=1');
    await userEvent.click(screen.getByRole('button', {name: 'Create'}));

    await waitFor(() =>
      expect(mockedService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://youtube.com/watch?v=1',
          type: ASSET_TYPE_TEMP,
          mimeType: null,
        })
      )
    );
    expect(onSaved).toHaveBeenCalledWith({id: 'asset-1'});
  });

  test('shows api errors when asset creation fails', async () => {
    const error = new Error('Asset create failed');
    mockedService.create.mockRejectedValue(error);

    render(<AssetUrlEditPopupBtn>Open</AssetUrlEditPopupBtn>);

    await userEvent.click(screen.getByRole('button', {name: 'Open'}));
    await userEvent.type(screen.getByPlaceholderText('Youtube / Vimeo / External link'), 'https://example.com');
    await userEvent.click(screen.getByRole('button', {name: 'Create'}));

    await waitFor(() => expect(mockedToaster.showApiError).toHaveBeenCalledWith(error));
  });
});
