import appService, {iConfigParams} from '../AppService';
import {AxiosRequestConfig} from 'axios';
import iHouseAwardStudentYear from '../../types/HouseAwards/iHouseAwardStudentYear';

const endPoint = '/houseAwards/studentYear';

const getStudentYears = (params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iHouseAwardStudentYear[]> => {
  return appService.get(endPoint, params, config).then(({data}) => data);
};

const HouseAwardStudentYearService = {
  getStudentYears,
}

export default HouseAwardStudentYearService;
