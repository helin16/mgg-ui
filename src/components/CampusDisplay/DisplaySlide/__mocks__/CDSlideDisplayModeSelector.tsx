import React from 'react';
import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const actual = jest.requireActual('../CDSlideDisplayModeSelector');
const {CD_DISPLAY_MODE_FULL_SCREEN_FILL, CD_DISPLAY_MODE_FULL_SCREEN_FIT} = actual;

const {key, testId} = ComponentTestHelper.getKeyAndTestId('CDSlideDisplayModeSelector');

export const CDSlideDisplayModeSelectorKey = key;
export const CDSlideDisplayModeSelectorTestId = testId;
export {CD_DISPLAY_MODE_FULL_SCREEN_FILL, CD_DISPLAY_MODE_FULL_SCREEN_FIT};

const CDSlideDisplayModeSelector = (props: any) => {
  ComponentTestHelper.mockComponent(
    CDSlideDisplayModeSelectorKey,
    CDSlideDisplayModeSelectorTestId
  )(props);

  return (
    <div data-testid={CDSlideDisplayModeSelectorTestId}>
      <button type="button" onClick={() => props?.onChange?.({value: CD_DISPLAY_MODE_FULL_SCREEN_FIT})}>
        Select Full Screen Fit
      </button>
      <button type="button" onClick={() => props?.onChange?.({value: CD_DISPLAY_MODE_FULL_SCREEN_FILL})}>
        Select Full Screen Fill
      </button>
    </div>
  );
};

export default CDSlideDisplayModeSelector;
