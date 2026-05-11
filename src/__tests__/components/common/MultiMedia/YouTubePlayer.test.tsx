import React from 'react';
import {act, render, screen} from '@testing-library/react';
import YouTubePlayer from '../../../../components/common/MultiMedia/YouTubePlayer';

describe('YouTubePlayer', () => {
  test('renders the iframe and reacts to postMessage state changes', () => {
    const onStart = jest.fn();
    const onEnd = jest.fn();

    render(<YouTubePlayer src="https://youtube.test/video" onStart={onStart} onEnd={onEnd} />);

    expect(screen.getByTitle('YouTube Video')).toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new MessageEvent('message', {data: JSON.stringify({event: 'onStateChange', info: 1})}));
      window.dispatchEvent(new MessageEvent('message', {data: JSON.stringify({event: 'onStateChange', info: 0})}));
    });

    expect(onStart).toHaveBeenCalled();
    expect(onEnd).toHaveBeenCalled();
  });
});
