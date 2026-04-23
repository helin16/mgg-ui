import AppService, { iConfigParams } from "../../AppService";
import iPaginatedResult from "../../../types/iPaginatedResult";
import iSynDebtorTransaction from "../../../types/Synergetic/Finance/iSynDebtorTransaction";

const endPoint = "/syn/debtorTransaction";
const getAll = (
  params: iConfigParams = {}
): Promise<iPaginatedResult<iSynDebtorTransaction>> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};
const SynDebtorTransactionService = {
  getAll
};

export default SynDebtorTransactionService;
