import AppService, {iConfigParams} from '../AppService';

const endPoint = '/cp';

const getWestpacSettings = (params?: iConfigParams, options?: iConfigParams): Promise<{key: string}> => {
  return AppService.get(`${endPoint}/westpac`, params, options).then(resp => resp.data);
}


const makeADonation = (data: iConfigParams, options?: iConfigParams): Promise<{success: boolean, message: string}> => {
  return AppService.post(`${endPoint}/donation`, data, options).then(resp => resp.data);
}
const PaymentService = {
  getWestpacSettings,
  makeADonation,
}

export default PaymentService;
