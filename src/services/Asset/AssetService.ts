import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';
import iAsset from '../../types/asset/iAsset';
import axios from 'axios';

export const HEADER_NAME_ASSET_TYPE = 'X-MGGS-ASSET-TYPE';

const endPoint = '/asset';

const create = (params: iConfigParams = {}, config?: iConfigParams): Promise<iAsset> => {
  return AppService.post(endPoint, params, config).then(resp => resp.data);
}

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iAsset>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
}

const upload = (params: iConfigParams = {}, config?: iConfigParams): Promise<iAsset> => {
  return AppService.post(`${endPoint}/upload`, params, config).then(resp => resp.data);
}

const deactivate = (id: string, params?: iConfigParams, config?: iConfigParams): Promise<iAsset> => {
  return AppService.delete(`${endPoint}/${id}`, params, config).then(resp => resp.data);
}

const readBlobAsDataURL = (blob: Blob) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result as string);
      } else {
        reject(new Error("Failed to read the blob as Data URL."));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const downloadAssetToBeBase64 = (url: string) => {
  return axios.get(url, {
    responseType: "blob"
  }).then(resp => {
    return readBlobAsDataURL(resp.data)
  })
}

const AssetService = {
  create,
  upload,
  getAll,
  deactivate,
  downloadAssetToBeBase64,
}

export default AssetService;
