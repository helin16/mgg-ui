import React from 'react';
import {render, screen} from '@testing-library/react';
import VideoWithPlaceholder from '../../../../components/common/MultiMedia/VideoWithPlaceholder';

jest.mock('react-player', () => require('../../../../../__mocks__/react-player'));

describe('VideoWithPlaceholder', () => {
  test('renders the player when a source is present and nothing when blank', () => {
    const {rerender, container} = render(<VideoWithPlaceholder src="video.mp4" />);

    expect(screen.getByTestId('ReactPlayerTestId')).toBeInTheDocument();

    rerender(<VideoWithPlaceholder src="" />);
    expect(container).toBeEmptyDOMElement();
  });
});
