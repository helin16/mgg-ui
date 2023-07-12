import {iStudentAbsence} from './iStudentAbsence';
import iSynCommunity from '../Synergetic/iSynCommunity';

type iStudentAbsenceSchedule = {
  id: number;
  eventType: string;
  eventId: number;
  startDate: Date;
  endDate: Date;
  time: string;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  active: boolean;
  created_at: Date | string | null;
  created_by_id: number | null;
  updated_at: Date | string | null;
  updated_by_id: number | null;
  lastCreatedEventId: number | null;
  Event?: iStudentAbsence;
  CreatedBy?: iSynCommunity | null;
  UpdatedBy?: iSynCommunity | null;
}

export default iStudentAbsenceSchedule;
