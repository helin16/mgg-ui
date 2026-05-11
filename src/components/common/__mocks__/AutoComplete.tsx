import React from 'react';
import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('AutoComplete');

export const AutoCompleteKey = key;
export const AutoCompleteTestId = testId;

const AutoComplete = (props: any) => {
  ComponentTestHelper.mockComponent(AutoCompleteKey, AutoCompleteTestId)(props);

  return (
    <div data-testid={AutoCompleteTestId}>
      <button type="button" onClick={() => props?.onSelected?.(props?.renderOptionItemFn?.([
        {
          formatted: '12 Smith St, Mentone VIC 3194, Australia',
          components: {
            house_number: '12',
            road: 'Smith St',
            country: 'Australia',
            state_code: 'VIC',
            postcode: '3194',
            suburb: 'Mentone',
          },
        },
      ])?.[0])}>
        Select Address
      </button>
    </div>
  );
};

export default AutoComplete;
