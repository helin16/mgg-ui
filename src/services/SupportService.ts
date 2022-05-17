import AppService from './AppService';
import iModuleUser from '../types/modules/iModuleUser';

const endPoint = `/support`;

type iReportIssue = {email: string; url: string; messages: string};
const reportIssue = (params: iReportIssue): Promise<iModuleUser[]> => {
  return AppService.post(`${endPoint}/email`, params).then(resp => resp.data);
};

const SupportService = {
  reportIssue,
}

export default SupportService;
