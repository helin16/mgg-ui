import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import AssetInfoPanel from '../../../components/Asset/AssetInfoPanel';
import AssetService from '../../../services/Asset/AssetService';
import Toaster from '../../../services/Toaster';
import {PageLoadingSpinnerTestId} from '../../../components/common/__mocks__/PageLoadingSpinner';

jest.mock('../../../components/common/SectionDiv');
jest.mock('../../../components/common/PageLoadingSpinner');
jest.mock('../../../components/form/FormLabel');
jest.mock('../../../components/PanelTitle');
jest.mock('../../../services/Asset/AssetService', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
  },
}));
jest.mock('../../../services/Toaster');

describe('AssetInfoPanel', () => {
  const mockedService = AssetService as jest.Mocked<typeof AssetService>;
  const mockedToaster = Toaster as jest.Mocked<typeof Toaster>;

  test('loads and renders asset details', async () => {
    mockedService.getAll.mockResolvedValue({
      data: [{fileName: 'intro.mp4', url: 'video.mp4', type: 'video'}],
    } as any);

    render(<AssetInfoPanel assetId="asset-1" />);

    expect(screen.getByTestId(PageLoadingSpinnerTestId)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByDisplayValue('intro.mp4')).toBeInTheDocument());
    expect(screen.getByDisplayValue('video.mp4')).toBeInTheDocument();
    expect(screen.getByDisplayValue('video')).toBeInTheDocument();
  });

  test('shows api errors when loading fails', async () => {
    const error = new Error('Asset load failed');
    mockedService.getAll.mockRejectedValue(error);

    render(<AssetInfoPanel assetId="asset-1" />);

    await waitFor(() => expect(mockedToaster.showApiError).toHaveBeenCalledWith(error));
  });
});
