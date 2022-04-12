import AppService from './AppService';

const getAccessToken = (): Promise<{accessToken: string}> => {
  return AppService.post('/powerBI/accessToken', {}).then(resp => resp.data);
}


export default {
  getAccessToken
}
