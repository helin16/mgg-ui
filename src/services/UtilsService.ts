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

const getWeekdaysBetweenDates = (fromDate: Moment, toDate: Moment)  => {
  const Sunday = 0;
  const Saturday = 6;
  const weekDays = [];
  const newDate = fromDate.clone();
  while (newDate.isBefore(toDate)) {
    newDate.add(1, 'days');
    if (newDate.day() !== Sunday && newDate.day() !== Saturday) {
      weekDays.push(newDate.clone());
    }
  }

  return weekDays;
}

const UtilsService = {
  isNumeric,
  handleEnterKeyPressed,
  formatIntoCurrency,
  uniqByObjectKey,
  validateEmail,
  getWeekdaysBetweenDates,
}

export default UtilsService;
