import React from 'react';
import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('CampusDisplayDraggableSlides');

export const CampusDisplayDraggableSlidesKey = key;
export const CampusDisplayDraggableSlidesTestId = testId;

const CampusDisplayDraggableSlides = (props: any) => {
  ComponentTestHelper.mockComponent(CampusDisplayDraggableSlidesKey, CampusDisplayDraggableSlidesTestId)(props);

  return (
    <div data-testid={CampusDisplayDraggableSlidesTestId}>
      <button type="button" onClick={() => props?.onSlideClick?.(props?.slides?.[0])}>
        Click First Slide
      </button>
      <button type="button" onClick={() => props?.onSlidesSelected?.(props?.slides || [])}>
        Select Slides
      </button>
      <button type="button" onClick={() => props?.onSlidesReordered?.([...(props?.slides || [])].reverse())}>
        Reorder Slides
      </button>
      <button type="button" onClick={() => props?.onNewSlidesCreated?.(props?.slides || [])}>
        Create Slides
      </button>
    </div>
  );
};

export default CampusDisplayDraggableSlides;
