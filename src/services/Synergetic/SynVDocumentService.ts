import AppService, {iConfigParams} from '../AppService';
import iSynVDocument from '../../types/Synergetic/iSynVDocument';
import iPaginatedResult from '../../types/iPaginatedResult';

const getVDocuments = (params: iConfigParams = {}): Promise<iPaginatedResult<iSynVDocument>> => {
  return AppService.get(`/syn/vDocument`, params).then(resp => resp.data);
};

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

export const openDocument = (document: iSynVDocument) => {
  // const fileName = `${student.StudentID}_${document.Description.replace(' ', '_').trim()}.${document.DocumentType.toLowerCase()}`;
  // @ts-ignore
  const file = new Blob([new Uint8Array(document.Document.data)], { type: getFileType(document) });
  const fileURL = URL.createObjectURL(file);
  return window.open(fileURL);
}

const SynVDocumentService = {
  getVDocuments,
  openDocument,
}

export default SynVDocumentService;
