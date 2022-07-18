import AppService from '../AppService';
import iSynPhoto from '../../types/Synergetic/iSynPhoto';
import {Buffer} from 'buffer';

const endPoint = '/syn/photo';
const getPhoto = (id: string | number, params = {}): Promise<iSynPhoto> => {
  return AppService.get(`${endPoint}/${id}`, params).then(resp => resp.data);
}

const convertBufferToUrl = (data: any, type = 'png') => {
  // @ts-ignore
  const base64String = (new Buffer.from(data)).toString('base64');
  return `data::image/${type.toLowerCase()};base64,${base64String}`;
}

const SynPhotoService = {
  getPhoto,
  convertBufferToUrl,
};

export default SynPhotoService;

