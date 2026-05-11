import React from 'react';
import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('CampusDisplayLocationSelector');

export const CampusDisplayLocationSelectorKey = key;
export const CampusDisplayLocationSelectorTestId = testId;

export const mockCampusDisplayLocationOption = {
  value: 'location-1',
  label: 'Location One',
  data: {id: 'location-1', name: 'Location One', displayId: ''},
};

const CampusDisplayLocationSelector = (props: any) => {
  ComponentTestHelper.mockComponent(
    CampusDisplayLocationSelectorKey,
    CampusDisplayLocationSelectorTestId
  )(props);

  return (
    <div data-testid={CampusDisplayLocationSelectorTestId}>
      <button type="button" onClick={() => props?.onSelect?.(mockCampusDisplayLocationOption)}>
        Select Location
      </button>
      <button type="button" onClick={() => props?.onSelect?.({value: '', data: null})}>
        Clear Location
      </button>
    </div>
  );
};

export default CampusDisplayLocationSelector;
