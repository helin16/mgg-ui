import AppService, { iConfigParams } from "../../AppService";
import iSynLuDebtorFeeCategory from '../../../types/Synergetic/Lookup/iSynLuDebtorFeeCategory';

const endPoint = "/syn/luDebtorFeeCategory";
const getAll = (
  params: iConfigParams = {}
): Promise<iSynLuDebtorFeeCategory[]> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};
const SynLuDebtorFeeCategoryService = {
  getAll
};

export default SynLuDebtorFeeCategoryService;
