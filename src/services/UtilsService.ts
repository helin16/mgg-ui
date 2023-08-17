import * as _ from 'lodash';
import {Moment} from 'moment-timezone';

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
}

export default UtilsService;
