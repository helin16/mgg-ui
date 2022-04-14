import AppService, {iConfigParams} from '../AppService';
import iSynFileSemester from '../../types/Synergetic/iSynFileSemester';

const getFileSemesters = (params: iConfigParams = {}): Promise<iSynFileSemester[]> => {
  return AppService.get(`/syn/fileSemester`, params).then(resp => resp.data);
};

const SynFileSemesterService = {
  getFileSemesters,
}

export default SynFileSemesterService;
