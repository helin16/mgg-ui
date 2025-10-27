import {Buffer} from 'buffer';

export const THIRD_PARTY_AUTH_PATH = '/3rdPartyAuth';

const getModuleUrl = (path: string, baseUrl: string = '', authPath: string = '') => {
  const customBaseUrl = `${baseUrl || ''}`.trim() === '' ? `${window.location.protocol}//${window.location.host}` : baseUrl;
  const customAuthPath = `${authPath || ''}`.trim() === '' ? THIRD_PARTY_AUTH_PATH : authPath;
  const customPathBased64 = Buffer.from(path).toString('base64');
  const url = `${customBaseUrl}${customAuthPath}/${customPathBased64}`;
  const base64 = Buffer.from(url).toString('base64');
  const relativeUrl = `/modules/remote/${base64}`;
  return {
    relative: relativeUrl,
    full: `${customBaseUrl}${relativeUrl}`,
  }
}

const SchoolBoxHelper = {
  getModuleUrl,
}

export default SchoolBoxHelper;
