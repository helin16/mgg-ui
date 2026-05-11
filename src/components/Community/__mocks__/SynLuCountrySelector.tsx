import React from 'react';
import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('SynLuCountrySelector');

export const SynLuCountrySelectorKey = key;
export const SynLuCountrySelectorTestId = testId;
export const SynLuCountrySelectorOption = {
  value: 'AU',
  data: {
    Code: 'AU',
    Description: 'Australia',
  },
};

const SynLuCountrySelector = (props: any) => {
  ComponentTestHelper.mockComponent(
    SynLuCountrySelectorKey,
    SynLuCountrySelectorTestId
  )(props);

  return (
    <div data-testid={SynLuCountrySelectorTestId}>
      <button type="button" onClick={() => props?.onSelect?.(SynLuCountrySelectorOption)}>
        Select Country
      </button>
      <button type="button" onClick={() => props?.onSelect?.(null)}>
        Clear Country
      </button>
    </div>
  );
};

export default SynLuCountrySelector;
