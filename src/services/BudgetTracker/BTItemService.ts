import appService, {iConfigParams} from '../AppService';
import {AxiosRequestConfig} from 'axios';
import iPaginatedResult from '../../types/iPaginatedResult';
import iBTItem, {
  BT_ITEM_STATUS_APPROVED,
  BT_ITEM_STATUS_DECLINED,
  BT_ITEM_STATUS_NEW
} from '../../types/BudgetTacker/iBTItem';
import MathHelper from '../../helper/MathHelper';

const endPoint = '/bt/item'
const getAll = (params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iPaginatedResult<iBTItem>> => {
  return appService.get(endPoint, params, config).then(({data}) => data);
};

const create = (data: iConfigParams = {}, config: AxiosRequestConfig = {}): Promise<iBTItem> => {
  return appService.post(endPoint, data, config).then(({data}) => data);
};

const update = (id: number, data: iConfigParams = {}, config: AxiosRequestConfig = {}): Promise<iBTItem> => {
  return appService.put(`${endPoint}/${id}`, data, config).then(({data}) => data);
};


export type iBTItemSum = {
  requested: number;
  approved: number;
  declined: number;
  pending: number;
}
const getAmountByType = (item: iBTItem, existing?: iBTItemSum): iBTItemSum => {
  const totalAmt = MathHelper.mul(item.item_quantity || 0, item.item_cost || 0);
  return {
    requested: MathHelper.add(totalAmt, existing?.requested || 0),
    approved: MathHelper.add((item.approved ? (item.approved_amount || 0) : 0), existing?.approved || 0),
    declined: MathHelper.add((item.declined ? totalAmt : 0), existing?.declined || 0),
    pending: MathHelper.add((!item.approved && !item.declined) ? totalAmt : 0, existing?.pending || 0),
  };
}

const getBTItemStatusNameFromItem = (item: iBTItem) => {
  if (item.declined) {
    return BT_ITEM_STATUS_DECLINED;
  }
  if (item.approved) {
    return BT_ITEM_STATUS_APPROVED;
  }
  return BT_ITEM_STATUS_NEW;
}

export default {
  getAll,
  getAmountByType,
  create,
  update,
  getBTItemStatusNameFromItem,
}
