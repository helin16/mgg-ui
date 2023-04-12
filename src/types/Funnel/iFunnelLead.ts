export const FUNNEL_STAGE_NAME_CLOSED_WON = 'Closed Won';
export const FUNNEL_STAGE_NAME_OFFER_ACCEPTED = 'Offer Accepted';
export const FUNNEL_STAGE_NAME_STUDENT_LEARNING_PROFILE = 'Student Learning Profile';
export const FUNNEL_STAGE_NAME_INTERVIEW = 'Interview';
export const FUNNEL_STAGE_NAME_OFFER_SENT = 'Offer Sent';
export const FUNNEL_STAGE_NAME_ENQUIRY = 'Enquiry';
export const FUNNEL_STAGE_NAME_SCHOOL_VISIT = 'School Visit';
export const FUNNEL_STAGE_NAME_APPLICATION_RECEIVED = 'Application Received';

type iFunnelLead = {
  id: number;
  externalId: string;
  pipeline_stage_name: string;
  created_at: Date | string | null;
  updated_at: Date | string | null;
  student_starting_year: string | null;
  student_starting_year_level: string | null;
  student_first_name: string;
  student_last_name: string;
  student_date_of_birth: string | null;
  student_is_citizen: boolean | null;
  student_gender: string | null;
  parent_salutation: string | null;
  parent_first_name: string | null;
  parent_last_name: string | null;
  parent_email: string | null;
  parent_phone_number: string | null;
  parent_relationship: string | null;
  parent1_salutation: string | null;
  parent1_first_name: string | null;
  parent1_last_name: string | null;
  parent1_email: string | null;
  parent1_phone_number: string | null;
  parent1_relationship: string | null;
  externalObj: any;
  isActive: boolean;
  checkSum: string | null;
}

export default iFunnelLead;
