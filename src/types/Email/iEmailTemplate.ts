import iBaseType from '../iBaseType';

type iEmailTemplate = iBaseType & {
  CommunicationTemplatesSeq: number;
  templateObj?: any | null;
};

export default iEmailTemplate;
