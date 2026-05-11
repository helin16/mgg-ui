import React from 'react';
import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('VideoWithPlaceholder');

export const VideoWithPlaceholderKey = key;
export const VideoWithPlaceholderTestId = testId;

const VideoWithPlaceholder = (props: any) => {
  ComponentTestHelper.mockComponent(VideoWithPlaceholderKey, VideoWithPlaceholderTestId)(props);

  return <video data-testid={VideoWithPlaceholderTestId} className={props?.className} />;
};

export default VideoWithPlaceholder;
