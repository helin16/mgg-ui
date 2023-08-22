export const SYN_COMMUNICATION_TEMPLATE_TYPE_HTML = 'HTML';
export const SYN_COMMUNICATION_TEMPLATE_DOCUMENT_CLASSIFICATION_GENERAL_INFO = 'GENINFO';

type iSynCommunicationTemplate = {
  CommunicationTemplatesSeq: number;
  Name: string;
  Description: string;
  MessageType: string;
  MessageSubject: string;
  MessageBody: string;
  CreatedBy: string;
  CreatedDate: Date | string | null;
  ModifiedBy: string;
  ModifiedDate: Date | string | null;
  Owner: string;
  PrivateFlag: boolean;
  DocumentClassification: string;
  SenderEmail: string;
  ProgramName: string;
}

export default iSynCommunicationTemplate;
