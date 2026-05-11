import React from 'react';
import {render, screen} from '@testing-library/react';
import CampusDisplayShowSlide from '../../../../components/CampusDisplay/DisplaySlide/CampusDisplayShowSlide';
import {ImageWithPlaceholderTestId} from '../../../../components/common/MultiMedia/__mocks__/ImageWithPlaceholder';
import {VideoWithPlaceholderTestId} from '../../../../components/common/MultiMedia/__mocks__/VideoWithPlaceholder';

jest.mock('../../../../components/common/MultiMedia/ImageWithPlaceholder');
jest.mock('../../../../components/common/MultiMedia/VideoWithPlaceholder');

describe('CampusDisplayShowSlide', () => {
  test('renders the default slide when there is no asset url', () => {
    render(<CampusDisplayShowSlide slide={null} />);

    expect(screen.getByText('This is the default slide')).toBeInTheDocument();
  });

  test('renders image and video assets in the expected modes', () => {
    const {rerender} = render(
      <CampusDisplayShowSlide
        slide={{Asset: {url: 'image.png', mimeType: 'image/png'}, settings: {displayMode: 'fullscreen_contain'}} as any}
      />
    );

    expect(screen.getByTestId(ImageWithPlaceholderTestId)).toBeInTheDocument();

    rerender(
      <CampusDisplayShowSlide
        slide={{Asset: {url: 'movie.mp4', mimeType: 'video/mp4'}, settings: {}} as any}
      />
    );

    expect(screen.getByTestId(VideoWithPlaceholderTestId)).toBeInTheDocument();
  });
});
