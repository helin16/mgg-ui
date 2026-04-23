import AppService, {iConfigParams} from '../AppService';
import iSynVDocument from '../../types/Synergetic/iSynVDocument';
import iPaginatedResult from '../../types/iPaginatedResult';


const endPoint = `/syn/vDocument`
const getVDocuments = (params: iConfigParams, config?: iConfigParams): Promise<iPaginatedResult<iSynVDocument>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
};

const getVDocumentBySeq = (tDocumentSeq: number, params?: iConfigParams, config?: iConfigParams): Promise<iSynVDocument> => {
  return AppService.get(`${endPoint}/${tDocumentSeq}`, params, config).then(resp => resp.data);
};

const createVDocument = (synId: string | number, params: iConfigParams, config?: iConfigParams): Promise<iSynVDocument> => {
  return AppService.post(`${endPoint}/${synId}`, params, config).then(resp => resp.data);
}

const getFileType = (document: iSynVDocument) => {
  switch (document.DocumentType.trim().toUpperCase()) {
    case 'PDF': {
      return "application/pdf";
    }
    case 'JPG':
    case 'JPEG': {
      return "image/jpg";
    }
    case 'PNG': {
      return "image/png";
    }
    default: {
      return '';
    }
  }
}

const getFileExtensionFromFileName = (fileName: string) => {
  const typeTypes = fileName.split('.');
  const typeType = typeTypes.pop();
  switch (`${typeType || ''}`.trim().toUpperCase()) {
    case 'PDF': {
      return "pdf";
    }
    case 'JPG':
    case 'JPEG': {
      return "jpg";
    }
    case 'PNG': {
      return "png";
    }
    default: {
      return '';
    }
  }
}

export const getDocumentUrl = (document: iSynVDocument) => {
  // const fileName = `${student.StudentID}_${document.Description.replace(' ', '_').trim()}.${document.DocumentType.toLowerCase()}`;
  // @ts-ignore
  const file = new Blob([new Uint8Array(document.Document.data)], { type: getFileType(document) });
  return URL.createObjectURL(file);
}

export const openDocument = (document: iSynVDocument) => {
  const fileURL = getDocumentUrl(document);
  return window.open(fileURL);
}

const SynVDocumentService = {
  getVDocuments,
  createVDocument,
  getVDocumentBySeq,
  openDocument,
  getFileExtensionFromFileName,
}

export default SynVDocumentService;
