import * as _ from 'lodash';

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

const UtilsService = {
  isNumeric,
  handleEnterKeyPressed,
  formatIntoCurrency,
  uniqByObjectKey,
}

export default UtilsService;
