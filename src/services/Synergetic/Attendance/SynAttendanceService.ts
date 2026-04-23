import AppService, { iConfigParams } from "../../AppService";
import iPaginatedResult from "../../../types/iPaginatedResult";
import iSynAttendance from "../../../types/Synergetic/Attendance/iSynAttendance";

const endPoint = "/syn/attendance";
const getAll = (
  params: iConfigParams = {},
  options?: iConfigParams
): Promise<iPaginatedResult<iSynAttendance>> => {
  return AppService.get(endPoint, params, options).then(resp => resp.data);
};

const update = (
  sequence: number,
  params: iConfigParams = {},
  options?: iConfigParams
): Promise<iSynAttendance> => {
  return AppService.put(`${endPoint}/${sequence}`, params, options).then(
    resp => resp.data
  );
};

const SynAttendanceService = {
  getAll,
  update
};

export default SynAttendanceService;
