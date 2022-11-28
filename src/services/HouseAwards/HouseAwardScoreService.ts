import appService, {iConfigParams} from '../AppService';
import {AxiosRequestConfig} from 'axios';
import iHouseAwardScore from '../../types/HouseAwards/iHouseAwardScore';
import iHouseAwardStudentYear from '../../types/HouseAwards/iHouseAwardStudentYear';

const endPoint = '/houseAwards/score';

const getScores = (params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iHouseAwardScore[]> => {
  return appService.get(endPoint, params, config).then(({data}) => data);
};

const createScore = (params: iConfigParams, config: AxiosRequestConfig = {}): Promise<iHouseAwardScore> => {
  return appService.post(endPoint, params, config).then(({data}) => data);
};

const deleteScore = (id: string | number, params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iHouseAwardScore> => {
  return appService.delete(`${endPoint}/${id}`, params, config).then(({data}) => data);
};

const awardScores = (params: { [key: string]: any }, config: AxiosRequestConfig = {}): Promise<{scores: iHouseAwardScore[], studentYear: iHouseAwardStudentYear}> => {
  return appService.post(`${endPoint}/award`, params, config).then(({data}) => data);
};

const HouseAwardScoreService = {
  getScores,
  createScore,
  deleteScore,
  awardScores,
}

export default HouseAwardScoreService;
