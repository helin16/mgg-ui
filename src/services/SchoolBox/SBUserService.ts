import AppService, {iConfigParams} from '../AppService';
import iSBUser from '../../types/SchoolBox/iSBUser';

const endPoint = `/sb/user`;

export type iSBUserListResult = {
  data: iSBUser[];
  metadata?: {
    count?: number;
    cursor?: {
      current?: string | null;
      next?: string | null;
    };
  };
};

const getAll = (params: iConfigParams = {}): Promise<iSBUserListResult> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const getBySynergeticId = async (synergeticId: string | number): Promise<iSBUser | null> => {
  const externalId = `${synergeticId || ''}`.trim();
  if (externalId === '') {
    return null;
  }

  const resp = await getAll({
    filter: JSON.stringify({externalId}),
    limit: 1,
  });
  return (resp.data || [])[0] || null;
};

const SBUserService = {
  getAll,
  getBySynergeticId,
}

export default SBUserService;
