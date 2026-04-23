import AppService, {iConfigParams} from '../../AppService';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iSynVDebtorFee, {AUTO_TUITION_VARIATION_TYPE_FULL_FEE} from '../../../types/Synergetic/Finance/iSynVDebtorFee';
import MathHelper from '../../../helper/MathHelper';


const endPoint = '/syn/vDebtorFee'
const getAll =  (params: iConfigParams = {}): Promise<iPaginatedResult<iSynVDebtorFee>> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const getAnnualFeeAmount = (record: iSynVDebtorFee) => {
  // full fee student pays every semester, twice a year.
  if (record.TuitionVariationType === AUTO_TUITION_VARIATION_TYPE_FULL_FEE) {
    return MathHelper.mul(record.Amount, 2);
  }
  // local student pays every term, four times a year.
  return MathHelper.mul(record.Amount, 4)
}

const SynVDebtorFeeService = {
  getAll,
  getAnnualFeeAmount,
};

export default SynVDebtorFeeService;
