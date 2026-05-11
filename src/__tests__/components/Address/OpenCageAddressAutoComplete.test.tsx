import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import ComponentTestHelper from '../../helper/ComponentTestHelper';
import {AutoCompleteKey, AutoCompleteTestId} from '../../../components/common/__mocks__/AutoComplete';
import OpenCageAddressAutoComplete from '../../../components/Address/OpenCageAddressAutoComplete';

jest.mock('axios');
jest.mock('../../../components/common/AutoComplete');

describe('OpenCageAddressAutoComplete', () => {
  ComponentTestHelper.prepare();

  test('wires the search handler and maps the selected result into an address', async () => {
    const onSelect = jest.fn();
    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        results: [
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
        ],
      },
    });

    render(<OpenCageAddressAutoComplete onSelect={onSelect} placeHolder="Lookup" />);

    expect(screen.getByTestId(AutoCompleteTestId)).toBeInTheDocument();
    const props = ComponentTestHelper.get(AutoCompleteKey)[0];
    expect(props).toMatchObject({
      placeholder: 'Lookup',
    });

    const results = await props.handleSearchFn('smith');
    expect(axios.get).toHaveBeenCalledWith(
      'https://api.opencagedata.com/geocode/v1/json',
      expect.objectContaining({
        params: expect.objectContaining({
          q: 'smith',
          countrycode: 'au',
        }),
      })
    );
    expect(results).toHaveLength(1);

    await userEvent.click(screen.getByRole('button', {name: 'Select Address'}));
    expect(onSelect).toHaveBeenCalledWith({
      street: '12 Smith St',
      country: 'Australia',
      state: 'VIC',
      postcode: '3194',
      suburb: 'Mentone',
    });
  });
});
