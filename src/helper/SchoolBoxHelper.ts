import {Buffer} from 'buffer';
import UtilsService from '../services/UtilsService';

export const THIRD_PARTY_AUTH_PATH = '/3rdPartyAuth';

const isCurrentHostLocal = () => {
  const hostName = `${window.location.host || ''}`.trim().toLowerCase();
  return hostName.startsWith('localhost')
}

const getBaseUrl = (baseUrl: string = '') => {
  const baseUrlStr = `${baseUrl || ''}`.trim();
  if (baseUrlStr !== '' ) {
    return baseUrlStr;
  }
  if (isCurrentHostLocal()) {
    return `${window.location.protocol}//${window.location.host}`;
  }
  return `${process.env.REACT_APP_PUBLIC_URL || ''}`.trim();
}

const getAllParams = () => {
  if (isCurrentHostLocal()) {
    return Object.fromEntries(new URLSearchParams(window.location.search));
  }
  return {};
}

const getModuleUrl = (path: string, baseUrl: string = '', authPath: string = '') => {
  const customBaseUrl = getBaseUrl(baseUrl);
  const customAuthPath = `${authPath || ''}`.trim() === '' ? THIRD_PARTY_AUTH_PATH : authPath;
  const customPathBased64 = Buffer.from(path).toString('base64');
  const url = `${customBaseUrl}${customAuthPath}/${customPathBased64}`;
  const base64 = Buffer.from(url).toString('base64');
  const relativeUrl = `/modules/remote/${base64}${UtilsService.getUrlParams(getAllParams())}`;
  return {
    relative: relativeUrl,
    full: `${customBaseUrl}${relativeUrl}`,
  }
}

const SchoolBoxHelper = {
  getModuleUrl,
}

export default SchoolBoxHelper;
