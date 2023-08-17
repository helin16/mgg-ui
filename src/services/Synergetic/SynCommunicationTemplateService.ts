import AppService, { iConfigParams } from "../AppService";
import iPaginatedResult from "../../types/iPaginatedResult";
import iSynCommunicationTemplate from "../../types/Synergetic/iSynCommunicationTemplate";

const baseEndPoint = "/syn/communicationTemplate";
const getAll = async (
  params: iConfigParams = {},
  options?: iConfigParams
): Promise<iPaginatedResult<iSynCommunicationTemplate>> => {
  return AppService.get(baseEndPoint, params, options).then(resp => resp.data);
};

const getById = async (
  seq: number,
  params: iConfigParams = {},
  options?: iConfigParams
): Promise<iSynCommunicationTemplate> => {
  return AppService.get(`${baseEndPoint}/${seq}`, params, options).then(
    resp => resp.data
  );
};

const create = async (
  params: iConfigParams = {},
  options?: iConfigParams
): Promise<iSynCommunicationTemplate> => {
  return AppService.post(baseEndPoint, params, options).then(resp => resp.data);
};


const update = async (
  seq: number,
  params: iConfigParams = {},
  options?: iConfigParams
): Promise<iSynCommunicationTemplate> => {
  return AppService.put(`${baseEndPoint}/${seq}`, params, options).then(resp => resp.data);
};

const SynCommunicationTemplateService = {
  getAll,
  getById,
  create,
  update,
};

export default SynCommunicationTemplateService;
