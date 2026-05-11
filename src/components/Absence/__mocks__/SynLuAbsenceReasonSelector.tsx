import React from 'react';
import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('SynLuAbsenceReasonSelector');

export const SynLuAbsenceReasonSelectorKey = key;
export const SynLuAbsenceReasonSelectorTestId = testId;

const SynLuAbsenceReasonSelector = (props: any) => {
  ComponentTestHelper.mockComponent(SynLuAbsenceReasonSelectorKey, SynLuAbsenceReasonSelectorTestId)(props);

  return (
    <div data-testid={SynLuAbsenceReasonSelectorTestId}>
      <button type="button" onClick={() => props?.onSelect?.({value: 'REASON'})}>
        Pick Reason
      </button>
    </div>
  );
};

export default SynLuAbsenceReasonSelector;
