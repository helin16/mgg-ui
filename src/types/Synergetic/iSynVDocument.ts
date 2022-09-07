type iSynVDocument = {
  ID: number;
  tDocumentsSeq: number;
  Description: string;
  DocumentCreatedByID: number;
  DocumentCreatedDate: Date;
  DocumentModifiedByID: number;
  DocumentModifiedDate: Date;
  SourceCode: string;
  SourceDate: Date;
  SourceRef: string;
  SourcePath: string;
  Document: string;
  DocumentType: string;
  DocumentThumbnail: string | null;
  ClassificationCode: string;
  SelectFlag: boolean;
  UpdateFlag: boolean;
  InsertFlag: boolean;
  DeleteFlag: boolean;
  MastertDocumentsSeq: number | null,
  Module: string;
  SourceTable: string;
  CommunityID: number;
  SynDatabaseCode: string;
  ClassificationDescription: string;
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

export default iSynVDocument;
