import {iAddressResult} from '../../../components/Address/iAddressAutoComplete';

describe('iAddressAutoComplete', () => {
  test('supports the expected address result shape', () => {
    const result: iAddressResult = {
      placeId: 'place-1',
      street: '12 Smith St',
      suburb: 'Mentone',
      country: 'Australia',
      state: 'VIC',
      postcode: '3194',
      countryCode: 'AU',
    };

    expect(result.countryCode).toBe('AU');
    expect(result.street).toBe('12 Smith St');
  });
});
