import iSynLuSkill from '../Lookup/iSynLuSkill';

type iSynCommunitySkill =  {
  SkillSeq: number;
  ID: number;
  SkillCode: string;
  SkillLevel: string;
  Comment: string | null;
  AttainedDate: Date | string | null;
  ExpiryDate: Date | string | null;
  SynLuSkill?: iSynLuSkill;
}

export default iSynCommunitySkill;
