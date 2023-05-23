import AppService, {iConfigParams} from '../AppService';
import iSynLuAbsenceReason from '../../types/StudentAbsence/iSynLuAbsenceReason';

const endPoint = '/syn/luAbsenceReason/';

const getAll = (params: iConfigParams = {}): Promise<iSynLuAbsenceReason[]> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynLuAbsenceReasonService = {
  getAll
}

export default SynLuAbsenceReasonService;
