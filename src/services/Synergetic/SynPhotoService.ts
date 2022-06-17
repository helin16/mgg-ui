import AppService from '../AppService';
import iSynPhoto from '../../types/Synergetic/iSynPhoto';

const endPoint = '/syn/photo';
const getPhoto = (id: string | number, params = {}): Promise<iSynPhoto> => {
  return AppService.get(`${endPoint}/${id}`, params).then(resp => resp.data);
}

const convertBufferToUrl = (data: any) => {
  const base64String = btoa(String.fromCharCode(...new Uint8Array(data)))
  return `data:image;base64,${base64String}`;
}

const SynPhotoService = {
  getPhoto,
  convertBufferToUrl,
};

export default SynPhotoService;

