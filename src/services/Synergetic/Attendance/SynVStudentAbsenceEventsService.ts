import AppService, { iConfigParams } from "../../AppService";
import iPaginatedResult from "../../../types/iPaginatedResult";
import iSynVStudentAbsenceEvents from "../../../types/Synergetic/Attendance/iSynVStudentAbsenceEvents";

const endPoint = "/syn/vStudentAbsenceEvents";

const getAll = (
  params: iConfigParams = {},
  options?: iConfigParams
): Promise<iPaginatedResult<iSynVStudentAbsenceEvents>> => {
  return AppService.get(endPoint, params, options).then(resp => resp.data);
};

const SynVStudentAbsenceEventsService = {
  getAll,
};

export default SynVStudentAbsenceEventsService;
