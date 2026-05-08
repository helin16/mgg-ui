import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynAddressService from '../../../services/Synergetic/SynAddressService';

describe('SynAddressService', () => {
  const endPoint = '/syn/address';

  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynAddressService.getAll,
    appMethod: 'get',
    callArgs: [{fakeParams: 'value'}],
    expectedArgs: [endPoint, {fakeParams: 'value'}],
  });

  describe('address helpers', () => {
    test('format and map address objects', () => {
      expect(SynAddressService.getAddressObjFromCODResponse(null)).toBeNull();
      expect(
        SynAddressService.getAddressObjFromCODResponse({
          object: {
            street: '11 Main St',
            suburb: 'Mentone',
            state: 'VIC',
            postcode: '3194',
          },
        } as any)
      ).toEqual({
        street: '11 Main St',
        suburb: 'Mentone',
        state: 'VIC',
        country: '',
        countryCode: '1100',
        postcode: '3194',
      });

      expect(SynAddressService.convertAddressObjToStr(null)).toBe('');
      expect(
        SynAddressService.convertAddressObjToStr({
          street: '11 Main St',
          suburb: 'Mentone',
          state: 'VIC',
          postcode: '3194',
          country: '',
          countryCode: 'AU',
        } as any)
      ).toBe('11 Main St Mentone VIC 3194 AU');
      expect(
        SynAddressService.convertAddressObjToStr({
          street: '11 Main St',
          suburb: 'Mentone',
          state: 'VIC',
          postcode: '3194',
          country: 'New Zealand',
          countryCode: 'NZ',
        } as any)
      ).toBe('11 Main St Mentone VIC 3194 New Zealand');

      expect(
        SynAddressService.getAddressObjFromSynAddress({
          HomeAddress1: '11 Main St',
          HomeSuburb: 'Mentone',
          HomeState: 'VIC',
          HomeCountry: {Description: 'Australia'},
          HomeCountryCode: 'AU',
          HomePostCode: '3194',
          Address1: 'PO Box 1',
          Suburb: 'Mentone',
          State: 'VIC',
          Country: {Description: 'Australia'},
          CountryCode: 'AU',
          PostCode: '3194',
        } as any)
      ).toEqual({
        home: {
          street: '11 Main St',
          suburb: 'Mentone',
          state: 'VIC',
          country: 'Australia',
          countryCode: 'AU',
          postcode: '3194',
        },
        postal: {
          street: 'PO Box 1',
          suburb: 'Mentone',
          state: 'VIC',
          country: 'Australia',
          countryCode: 'AU',
          postcode: '3194',
        },
      });
      expect(SynAddressService.getAddressObjFromSynAddress(null)).toBeNull();
    });
  });
});
