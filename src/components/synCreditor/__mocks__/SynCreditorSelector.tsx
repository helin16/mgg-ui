import React from 'react';
import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('SynCreditorSelector');

export const SynCreditorSelectorKey = key;
export const SynCreditorSelectorTestId = testId;
export const SynCreditorSelectorOption = {
  data: {
    CreditorID: 77,
    CreditorNameExternal: 'ACME Supplies',
    CreditorNameInternal: 'ACME Supplies',
    CreditorBankBSB: '123-456',
    CreditorBankAccount: '999999',
  },
};

const SynCreditorSelector = (props: any) => {
  ComponentTestHelper.mockComponent(
    SynCreditorSelectorKey,
    SynCreditorSelectorTestId
  )(props);

  return (
    <div data-testid={SynCreditorSelectorTestId}>
      <button type="button" onClick={() => props?.onSelect?.(SynCreditorSelectorOption)}>
        Pick Creditor
      </button>
    </div>
  );
};

export default SynCreditorSelector;
