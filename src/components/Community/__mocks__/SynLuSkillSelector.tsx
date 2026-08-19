import React from 'react';
import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('SynLuSkillSelector');

export const SynLuSkillSelectorKey = key;
export const SynLuSkillSelectorTestId = testId;
export const SynLuSkillSelectorOption = {
  value: 'CPR',
  data: {Code: 'CPR', Description: 'CPR'},
  label: 'CPR - CPR',
};

const SynLuSkillSelector = (props: any) => {
  ComponentTestHelper.mockComponent(
    SynLuSkillSelectorKey,
    SynLuSkillSelectorTestId
  )(props);

  return (
    <div data-testid={SynLuSkillSelectorTestId}>
      <button type="button" onClick={() => props?.onSelect?.(SynLuSkillSelectorOption)}>
        Select Skill
      </button>
      <button type="button" onClick={() => props?.onSelect?.(null)}>
        Clear Skill
      </button>
    </div>
  );
};

export default SynLuSkillSelector;
