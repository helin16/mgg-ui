import iSynLuRelationship from '../Lookup/iSynLuRelationship';

type iSynRelationship = {
  RelationshipSeq: number;
  ID: number;
  Relationship: string;
  RelatedID: number;
  CreatedDate: Date | string |null;
  CreatedBy: string | null;
  ModifiedDate: Date | string |null;
  ModifiedBy: string | null;
  NonCommunityRelation: string;
  UseSMS: string;
  UseEmail: string;
  PortalApproval: string;
  SynLuRelationship?: iSynLuRelationship;
}

export default iSynRelationship;
