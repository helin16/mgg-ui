import ServiceTestHelper from '../helper/ServiceTestHelper';
import GoogleMapService from '../../services/GoogleMapService';

describe('GoogleMapService', () => {
  const endPoint = '/googleMap';

  ServiceTestHelper.testCustom({
    name: 'getSuggestions',
    serviceFn: GoogleMapService.getSuggestions,
    appMethod: 'get',
    callArgs: ['mentone', {fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
    expectedArgs: [`${endPoint}/address/autocomplete?input=mentone`, {fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
  });

  ServiceTestHelper.testCustom({
    name: 'getApiKey',
    serviceFn: GoogleMapService.getApiKey,
    appMethod: 'get',
    callArgs: [{fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
    expectedArgs: [`${endPoint}/key`, {fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
  });
});
