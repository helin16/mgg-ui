import React from 'react';
import {render, screen} from '@testing-library/react';
import ComponentTestHelper from '../../helper/ComponentTestHelper';
import {
  AutoCompleteKey,
  AutoCompleteTestId,
} from '../../../components/common/__mocks__/AutoComplete';
import AddressAutoComplete from '../../../components/Address/AddressAutoComplete';

jest.mock('../../../components/Address/OpenCageAddressAutoComplete', () =>
  jest.requireActual('../../../components/common/__mocks__/AutoComplete')
);

describe('AddressAutoComplete', () => {
  ComponentTestHelper.prepare();

  test('defaults the placeholder and forwards the remaining props', () => {
    const onSelect = jest.fn();
    render(<AddressAutoComplete onSelect={onSelect} allowClear />);

    expect(screen.getByTestId(AutoCompleteTestId)).toBeInTheDocument();
    expect(ComponentTestHelper.get(AutoCompleteKey)[0]).toMatchObject({
      placeHolder: 'Search address...',
      allowClear: true,
      onSelect,
    });
  });
});
