import iHouseAwardEventType from './iHouseAwardEventType';

type iHouseAwardStudentYear = {
  id: number;
  StudentID: number;
  FileYear: number;
  total_score_minus_award: number;
  event_type_id: number;
  eventType?: iHouseAwardEventType;

  active: boolean;
  created_at: Date | string;
  created_by_id: number | null;
  updated_at: Date | string;
  updated_by_id: number | null;
  awarded_at: Date | string | null;
  awarded_by_id: number | null;
  awarded_id: number | null;
}

export default iHouseAwardStudentYear;
