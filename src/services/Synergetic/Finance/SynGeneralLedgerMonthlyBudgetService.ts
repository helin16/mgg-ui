import AppService, {iConfigParams} from '../../AppService';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iSynGeneralLedgerMonthlyBudget from '../../../types/Synergetic/Finance/iSynGeneralLedagerMonthlyBudget';


const endPoint = '/syn/generalLedgerMonthlyBudget'
const getAll =  (params: iConfigParams = {}): Promise<iPaginatedResult<iSynGeneralLedgerMonthlyBudget>> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const getAllByYearAndGLCode = (year: number, glCode: string, params: iConfigParams = {}, config?: iConfigParams): Promise<iSynGeneralLedgerMonthlyBudget[]> => {
  return AppService.get(`${endPoint}/${year}/${glCode}`, params, config).then(resp => resp.data);
}

const SynGeneralLedgerMonthlyBudgetService = {
  getAll,
  getAllByYearAndGLCode,
};

export default SynGeneralLedgerMonthlyBudgetService;
