import React from 'react';
import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('AssetThumbnail');

export const AssetThumbnailKey = key;
export const AssetThumbnailTestId = testId;

const AssetThumbnail = (props: any) => {
  ComponentTestHelper.mockComponent(AssetThumbnailKey, AssetThumbnailTestId)(props);

  return (
    <div data-testid={AssetThumbnailTestId} onClick={() => props?.onClick?.(props?.asset)}>
      {props?.asset?.id || ''}
    </div>
  );
};

export default AssetThumbnail;
