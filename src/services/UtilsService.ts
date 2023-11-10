import * as _ from 'lodash';
import {Moment} from 'moment-timezone';
import {Buffer} from 'buffer';
import {THIRD_PARTY_AUTH_PATH} from '../helper/SchoolBoxHelper';
import {iConfigParams} from './AppService';
import Toaster, {TOAST_TYPE_WARNING} from './Toaster';

const isNumeric = (str: string) => {
  return !isNaN(parseFloat(str)) && isFinite(Number(str));
}

const formatIntoCurrency  = (number: number, currency = 'AUD') => {
  const formatter = new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency
  });
  return formatter.format(number);
}

const handleEnterKeyPressed = (event: any, enterFunc?: Function, notEnterFnc?: Function) => {
  if (event.key === 'Enter') {
    return enterFunc && enterFunc();
  }
  return notEnterFnc && notEnterFnc();
}

const uniqByObjectKey = (objs: any[], key: string | number) => {
  return _.uniqBy(objs, (obj => obj[key]));
}

const validateEmail = (emailString: string) => {
  // eslint-disable-next-line no-useless-escape
  const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return regex.test(`${emailString}`.trim());
}

const validateMacAddress = (macAddress: string) => {
  // eslint-disable-next-line no-useless-escape
  const regex = /^[0-9a-f]{2}([\.:-])(?:[0-9a-f]{2}\1){4}[0-9a-f]{2}$/i
  return regex.test(`${macAddress}`.trim());
}

const validateTime = (time: string) => {
  const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(`${time}`.trim());
}

const getWeekdaysBetweenDates = (fromDate: Moment, toDate: Moment)  => {
  const Sunday = 0;
  const Saturday = 6;
  const weekDays = [];
  const newDate = fromDate.clone();
  if (newDate.day() !== Sunday && newDate.day() !== Saturday) {
    weekDays.push(newDate.clone());
  }
  while (newDate.isBefore(toDate)) {
    newDate.add(1, 'days');
    if (newDate.day() !== Sunday && newDate.day() !== Saturday) {
      weekDays.push(newDate.clone());
    }
  }

  return weekDays;
}

const letterRange = (start: string, stop: string) => {
  const result=[];
  for (let idx= start.charCodeAt(0),end= stop.charCodeAt(0); idx <= end; ++idx){
    result.push(String.fromCharCode(idx));
  }
  return result;
}

const stripHTMLTags = (html: string) => {
  const el = document.createElement('div');
  el.innerHTML = html;
  return el.textContent;
}

const getFullUrl = (path: string) => {
  return `${process.env.REACT_APP_URL || ''}/${path}`;
}

const getModuleUrl = (customUrl: string, customBaseUrl?: string, customAuthPath = THIRD_PARTY_AUTH_PATH, mConnectBaseUrl?: string) => {
  const customPathBased64 = Buffer.from(customUrl).toString('base64');
  const url = `${customBaseUrl || (process.env.REACT_APP_URL || '')}${customAuthPath}/${customPathBased64}`;
  const base64 = Buffer.from(url).toString('base64');
  return `${mConnectBaseUrl || ''}/modules/remote/${base64}`;
}

const getUrlParams = (params: iConfigParams = {}) => {
  const paramString =
    typeof params === 'object' && Object.keys(params).length > 0
      ? new URLSearchParams(params).toString()
      : '';
  return paramString === '' ? '' : `?${paramString}`;
};

const openNewWindow = (url: string) => {
  const newTab = window.open();
  if (!newTab) {
    Toaster.showToast(`Pop-up blocked. Please allow pop-ups for this website.`, TOAST_TYPE_WARNING);
    return;
  }
  newTab.location.href = url;
}

const UtilsService = {
  isNumeric,
  handleEnterKeyPressed,
  formatIntoCurrency,
  uniqByObjectKey,
  validateEmail,
  getWeekdaysBetweenDates,
  validateMacAddress,
  validateTime,
  letterRange,
  stripHTMLTags,
  getFullUrl,
  getModuleUrl,
  getUrlParams,
  openNewWindow,
}

export default UtilsService;
