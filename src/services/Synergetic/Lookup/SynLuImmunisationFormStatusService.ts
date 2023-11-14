import AppService, {iConfigParams} from '../../AppService';
import iSynLuImmunisationFormStatus from '../../../types/Synergetic/Lookup/iSynLuImmunisationFormStatus';

const endPoint = '/syn/luImmunisationFormStatus';

const getAll = (params: iConfigParams = {}): Promise<iSynLuImmunisationFormStatus[]> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynLuImmunisationFormStatusService = {
  getAll,
}

export default SynLuImmunisationFormStatusService;
