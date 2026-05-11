import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CommunityGridCell from '../../components/CommunityGridCell';
import SynPhotoService from '../../services/Synergetic/SynPhotoService';

jest.mock('../../services/Synergetic/SynPhotoService', () => ({
  __esModule: true,
  default: {
    getPhoto: jest.fn(),
    convertBufferToUrl: jest.fn(),
  },
}));

describe('CommunityGridCell', () => {
  const mockedSynPhotoService = SynPhotoService as jest.Mocked<typeof SynPhotoService>;
  const profile = {
    ID: 10,
    Title: 'Ms',
    Given1: 'Ada',
    Surname: 'Lovelace',
  } as any;

  test('loads the photo and renders the default caption', async () => {
    mockedSynPhotoService.getPhoto.mockResolvedValue({
      Photo: {data: [1, 2, 3]},
      PhotoType: 'image/png',
    } as any);
    mockedSynPhotoService.convertBufferToUrl.mockReturnValue('blob:photo-url');

    render(<CommunityGridCell communityProfile={profile} />);

    await waitFor(() =>
      expect(screen.getByAltText('Ada Lovelace')).toHaveAttribute('src', 'blob:photo-url')
    );
    expect(screen.getByText('Ms Ada Lovelace')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  test('falls back to the default avatar and delegates click events', async () => {
    const onClick = jest.fn();
    mockedSynPhotoService.getPhoto.mockResolvedValue({} as any);

    render(
      <CommunityGridCell
        communityProfile={profile}
        caption={<div>Custom Caption</div>}
        onClick={onClick}
      />
    );

    const image = await screen.findByAltText('Ada Lovelace');
    expect(image).toHaveAttribute('src', '/images/User-avatar.png');
    await userEvent.click(image);
    await userEvent.click(screen.getByText('Custom Caption'));
    expect(onClick).toHaveBeenCalledTimes(2);
  });
});
