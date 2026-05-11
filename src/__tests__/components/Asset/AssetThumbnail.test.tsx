import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComponentTestHelper from '../../helper/ComponentTestHelper';
import {
  ImageWithPlaceholderKey,
  ImageWithPlaceholderTestId,
} from '../../../components/common/MultiMedia/__mocks__/ImageWithPlaceholder';
import AssetThumbnail from '../../../components/Asset/AssetThumbnail';
import AssetHelper from '../../../helper/AssetHelper';

jest.mock('../../../components/common/MultiMedia/ImageWithPlaceholder');
jest.mock('../../../helper/AssetHelper', () => ({
  __esModule: true,
  default: {
    getThumbnail: jest.fn(() => 'thumb.jpg'),
  },
}));

describe('AssetThumbnail', () => {
  ComponentTestHelper.prepare();

  test('renders a video thumbnail and delegates click events', async () => {
    const onClick = jest.fn();
    const asset = {mimeType: 'video/mp4', url: 'video.mp4'} as any;

    render(<AssetThumbnail asset={asset} onClick={onClick} />);

    expect(screen.getByTestId(ImageWithPlaceholderTestId)).toBeInTheDocument();
    expect(AssetHelper.getThumbnail).toHaveBeenCalledWith('video.mp4');

    await userEvent.click(screen.getByTestId(ImageWithPlaceholderTestId).parentElement!);
    expect(onClick).toHaveBeenCalledWith(asset);
  });

  test('renders the original asset url for non-video assets', () => {
    render(<AssetThumbnail asset={{mimeType: 'image/png', url: 'image.png'} as any} />);

    expect(ComponentTestHelper.get(ImageWithPlaceholderKey).length).toBeGreaterThan(0);
  });
});
