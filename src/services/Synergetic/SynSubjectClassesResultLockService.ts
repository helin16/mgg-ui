import AppService, {iConfigParams} from '../AppService';
import iSynSubjectClassesResultLock from '../../types/Synergetic/iSynSubjectClassesResultLock';

const endPoint = `/syn/subjectClassesResultLock`

const getAll = (params: iConfigParams = {}): Promise<iSynSubjectClassesResultLock[]> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const deleteLock = (SubjectClassesResultLockSeq: number, params: iConfigParams = {}): Promise<iSynSubjectClassesResultLock[]> => {
  return AppService.delete(`${endPoint}/${SubjectClassesResultLockSeq}`, params).then(resp => resp.data);
};

const SynSubjectClassesResultLock = {
  getAll,
  deleteLock
}

export default SynSubjectClassesResultLock;
