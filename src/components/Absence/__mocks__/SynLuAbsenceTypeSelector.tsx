import React from 'react';
import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('SynLuAbsenceTypeSelector');

export const SynLuAbsenceTypeSelectorKey = key;
export const SynLuAbsenceTypeSelectorTestId = testId;

const SynLuAbsenceTypeSelector = (props: any) => {
  ComponentTestHelper.mockComponent(SynLuAbsenceTypeSelectorKey, SynLuAbsenceTypeSelectorTestId)(props);

  return (
    <div data-testid={SynLuAbsenceTypeSelectorTestId}>
      <button type="button" onClick={() => props?.onSelect?.({value: 'ABS'})}>
        Pick Type
      </button>
    </div>
  );
};

export default SynLuAbsenceTypeSelector;
