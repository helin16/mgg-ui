import iSynCommunity from '../Synergetic/iSynCommunity';

type iAlumniRequest = {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
  maiden_name: string | null;
  date_of_birth: string;
  leaving_year: number | null;
  leaving_year_level: string | null;
  old_address: string | null;
  current_address: string;
  email: string;
  contact_number: string | null;
  relationship_to_school: string | null;
  created: Date;
  approved_by_id: number | null;
  approved: boolean;
  approved_at: Date | null;
  isActive: boolean;
  updatedAt: Date | null | string;
  updatedById: number | null;
  approvedBy?: iSynCommunity | null;
}

export default iAlumniRequest
