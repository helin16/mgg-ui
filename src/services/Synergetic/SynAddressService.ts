import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';
import iSynAddress from '../../types/Synergetic/iSynAddress';
import {iAddressResult} from '../../components/Address/iAddressAutoComplete';
import {SYN_COUNTRY_CODE_AUSTRALIA, SYN_COUNTRY_NAME_AUSTRALIA} from '../../types/Synergetic/Lookup/iSynLuCountry';
import {iCODAddressInfo} from '../../types/ConfirmationOfDetails/iConfirmationOfDetailsResponse';

const endPoint = `/syn/address`;
const getAll = (params: iConfigParams = {}): Promise<iPaginatedResult<iSynAddress>> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const getAddressObjFromCODResponse = (addr: iCODAddressInfo | null): iAddressResult | null => {
  if (!addr) {
    return null;
  }
  return {
    street: addr?.object.street || '',
    suburb: addr?.object.suburb || '',
    state: addr?.object.state || '',
    country: '',
    countryCode: addr?.object.countryCode || SYN_COUNTRY_CODE_AUSTRALIA,
    postcode: addr?.object.postcode || '',
  }
}

const convertAddressObjToStr = (obj: iAddressResult | null) => {
  if (!obj) {
    return '';
  }
  const street = `${obj.street || ""}`.trim();
  const suburb = `${obj.suburb || ""}`.trim();
  const state = `${obj.state || ""}`.trim();
  const postCode = `${obj.postcode || ""}`.trim();
  const countryCode = `${obj.countryCode || ""}`.trim();
  const country = countryCode === SYN_COUNTRY_CODE_AUSTRALIA ? SYN_COUNTRY_NAME_AUSTRALIA : `${obj.country || ""}`.trim();
  return [street, suburb, state, postCode, (country === '' ? countryCode : country)].join(' ').trim();
}

const getAddressObjFromSynAddress = (address: iSynAddress | null): {home: iAddressResult, postal: iAddressResult} | null => {
  if (!address) {
    return null;
  }
  return {
    home: {
      street: address?.HomeAddress1 || '',
      suburb: address?.HomeSuburb || '',
      state: address?.HomeState || '',
      country: address?.HomeCountry?.Description || '',
      countryCode: address?.HomeCountryCode || '',
      postcode: address?.HomePostCode || '',
    },
    postal: {
      street: address?.Address1 || '',
      suburb: address?.Suburb || '',
      state: address?.State || '',
      country: address?.Country?.Description || '',
      countryCode: address?.CountryCode || '',
      postcode: address?.PostCode || '',
    },
  }
}

const SynAddressService = {
  getAll,
  convertAddressObjToStr,
  getAddressObjFromSynAddress,
  getAddressObjFromCODResponse,
}

export default SynAddressService;
