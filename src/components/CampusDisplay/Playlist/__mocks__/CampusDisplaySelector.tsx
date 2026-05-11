import React from 'react';
import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('CampusDisplaySelector');

export const CampusDisplaySelectorKey = key;
export const CampusDisplaySelectorTestId = testId;

export const mockCampusDisplayOption = {
  value: 'display-1',
  label: 'Display One',
  data: {id: 'display-1', name: 'Display One'},
};

const CampusDisplaySelector = (props: any) => {
  ComponentTestHelper.mockComponent(CampusDisplaySelectorKey, CampusDisplaySelectorTestId)(props);

  return (
    <div data-testid={CampusDisplaySelectorTestId}>
      <button type="button" onClick={() => props?.onSelect?.(mockCampusDisplayOption)}>
        Select Display
      </button>
      <button type="button" onClick={() => props?.onSelect?.({value: '', data: null})}>
        Clear Display
      </button>
    </div>
  );
};

export default CampusDisplaySelector;
