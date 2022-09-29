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

export default iSynVDocument;
