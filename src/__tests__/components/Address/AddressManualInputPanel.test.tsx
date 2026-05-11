import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComponentTestHelper from '../../helper/ComponentTestHelper';
import {
  SynLuCountrySelectorKey,
  SynLuCountrySelectorOption,
  SynLuCountrySelectorTestId,
} from '../../../components/Community/__mocks__/SynLuCountrySelector';
import {
  SynLuStateSelectorKey,
  SynLuStateSelectorTestId,
} from '../../../components/Community/__mocks__/SynLuStateSelector';
import AddressManualInputPanel from '../../../components/Address/AddressManualInputPanel';
import SynLuCountryService from '../../../services/Synergetic/Lookup/SynLuCountryService';
import Toaster from '../../../services/Toaster';

jest.mock('../../../components/form/FormLabel');
jest.mock('../../../components/Community/SynLuCountrySelector');
jest.mock('../../../components/Community/SynLuStateSelector');
jest.mock('../../../services/Synergetic/Lookup/SynLuCountryService', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
  },
}));
jest.mock('../../../services/Toaster');

describe('AddressManualInputPanel', () => {
  ComponentTestHelper.prepare();

  const mockedCountryService = SynLuCountryService as jest.Mocked<typeof SynLuCountryService>;
  const mockedToaster = Toaster as jest.Mocked<typeof Toaster>;

  beforeEach(() => {
    mockedCountryService.getAll.mockResolvedValue([
      {Code: 'AU', Description: 'Australia'},
    ] as any);
  });

  test('renders the provided address and normalizes suburb input to uppercase', async () => {
    const onChange = jest.fn();
    render(
      <AddressManualInputPanel
        value={{
          street: '12 Smith St',
          suburb: '',
          state: 'VIC',
          postcode: '3194',
          country: 'Australia',
          countryCode: 'AU',
        }}
        onChange={onChange}
      />
    );

    const suburbInput = screen.getByPlaceholderText('eg: MENTONE');
    fireEvent.change(suburbInput, {
      target: {value: 'cheltenham'},
    });

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        suburb: 'CHELTENHAM',
      })
    );
    expect(screen.getByTestId(SynLuStateSelectorTestId)).toBeInTheDocument();
    expect(ComponentTestHelper.get(SynLuStateSelectorKey).length).toBeGreaterThan(0);
  });

  test('resolves a missing country code from the country name', async () => {
    render(
      <AddressManualInputPanel
        value={{
          street: '',
          suburb: '',
          state: '',
          postcode: '',
          country: 'Australia',
          countryCode: '',
        }}
      />
    );

    await waitFor(() =>
      expect(mockedCountryService.getAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.stringContaining('Description'),
        })
      )
    );
  });

  test('updates the editing country when a new country is selected', async () => {
    render(
      <AddressManualInputPanel
        value={{
          street: '',
          suburb: '',
          state: '',
          postcode: '',
          country: '',
          countryCode: '',
        }}
      />
    );

    expect(screen.getByTestId(SynLuCountrySelectorTestId)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {name: 'Select Country'}));

    expect(ComponentTestHelper.get(SynLuCountrySelectorKey)[0]).toMatchObject({
      values: [],
    });
    expect(SynLuCountrySelectorOption.data.Description).toBe('Australia');
  });

  test('shows api errors when country lookup fails', async () => {
    const error = new Error('Country lookup failed');
    mockedCountryService.getAll.mockRejectedValue(error);

    render(
      <AddressManualInputPanel
        value={{
          street: '',
          suburb: '',
          state: '',
          postcode: '',
          country: 'Australia',
          countryCode: '',
        }}
      />
    );

    await waitFor(() => expect(mockedToaster.showApiError).toHaveBeenCalledWith(error));
  });
});
