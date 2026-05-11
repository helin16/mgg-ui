import React from 'react';
import {render, waitFor} from '@testing-library/react';
import GoogleAddressAutoComplete from '../../../components/Address/GoogleAddressAutoComplete';
import GoogleMapService from '../../../services/GoogleMapService';
import Toaster from '../../../services/Toaster';

jest.mock('../../../services/GoogleMapService', () => ({
  __esModule: true,
  default: {
    getApiKey: jest.fn(),
  },
}));
jest.mock('../../../services/Toaster');

describe('GoogleAddressAutoComplete', () => {
  const mockedGoogleMapService = GoogleMapService as jest.Mocked<typeof GoogleMapService>;
  const mockedToaster = Toaster as jest.Mocked<typeof Toaster>;
  const appendChild = jest.spyOn(document.body, 'appendChild');
  const removeChild = jest.spyOn(document.body, 'removeChild');

  beforeEach(() => {
    appendChild.mockImplementation(((node: Node) => {
      const result = HTMLElement.prototype.appendChild.call(document.body, node);
      if (node instanceof HTMLScriptElement && typeof node.onload === 'function') {
        node.onload(new Event('load'));
      }
      return result;
    }) as any);
  });

  afterEach(() => {
    appendChild.mockRestore();
    removeChild.mockRestore();
    document.body.innerHTML = '';
    // @ts-ignore
    delete global.google;
  });

  test('loads the google maps script and returns the mapped address on place selection', async () => {
    const onSelect = jest.fn();
    const listeners: Record<string, Function> = {};
    // @ts-ignore
    global.google = {
      maps: {
        places: {
          Autocomplete: jest.fn().mockImplementation(() => ({
            addListener: (event: string, cb: Function) => {
              listeners[event] = cb;
            },
            getPlace: () => ({
              place_id: 'place-1',
              address_components: [
                {long_name: '12', types: ['street_number']},
                {long_name: 'Smith St', types: ['street_address']},
                {long_name: 'Mentone', types: ['sublocality']},
                {long_name: 'Australia', types: ['country']},
                {long_name: '3194', types: ['postal_code']},
              ],
            }),
          })),
        },
      },
    };
    mockedGoogleMapService.getApiKey.mockResolvedValue({key: 'api-key'} as any);

    render(<GoogleAddressAutoComplete onSelect={onSelect} className="gm-field" />);

    await waitFor(() => expect(mockedGoogleMapService.getApiKey).toHaveBeenCalled());
    expect(document.querySelector('script[id^="app-google-map-js-"]')).not.toBeNull();

    listeners.place_changed();
    expect(onSelect).toHaveBeenCalledWith({
      placeId: 'place-1',
      street: '12 Smith St',
      suburb: 'Mentone',
      country: 'Australia',
      state: 'Mentone',
      postcode: '3194',
    });
  });

  test('shows api errors when the key request fails', async () => {
    const error = new Error('Google key failed');
    mockedGoogleMapService.getApiKey.mockRejectedValue(error);

    render(<GoogleAddressAutoComplete />);

    await waitFor(() => expect(mockedToaster.showApiError).toHaveBeenCalledWith(error));
  });
});
