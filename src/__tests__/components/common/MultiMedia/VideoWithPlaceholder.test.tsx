import React from 'react';
import {render, screen} from '@testing-library/react';
import VideoWithPlaceholder from '../../../../components/common/MultiMedia/VideoWithPlaceholder';

jest.mock('react-player', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react');
  const mockComponent = React.forwardRef<any, any>((props: any, ref: any) => {
    if (typeof ref === 'function') {
      ref({});
    } else if (ref && 'current' in ref) {
      ref.current = {};
    }

    return React.createElement('div', {['data-testid']: 'ReactPlayerTestId'}, props?.url || '');
  });
  return {
    __esModule: true,
    default: mockComponent,
  };
});

describe('VideoWithPlaceholder', () => {
  test('renders the player when a source is present and nothing when blank', () => {
    const {rerender, container} = render(<VideoWithPlaceholder src="video.mp4" />);

    expect(screen.getByTestId('ReactPlayerTestId')).toBeInTheDocument();

    rerender(<VideoWithPlaceholder src="" />);
    expect(container).toBeEmptyDOMElement();
  });
});
