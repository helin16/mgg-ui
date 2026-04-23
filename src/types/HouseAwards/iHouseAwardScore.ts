import iHouseAwardEvent from './iHouseAwardEvent';
import iHouseAwardEventType from './iHouseAwardEventType';
import iSynCommunity from '../Synergetic/iSynCommunity';

type iHouseAwardScore = {
  id: number;
  StudentID: number;
  FileYear: number;
  score: number;
  event_id: number;
  event_type_id: number;
  event?: iHouseAwardEvent;
  eventType?: iHouseAwardEventType;

  active: boolean;
  created_at: Date | string;
  created_by_id: number | null;
  updated_at: Date | string;
  updated_by_id: number | null;
  awarded_at: Date | string | null;
  awarded_by_id: number | null;
  awarded_id: number | null;
  awarded?: iSynCommunity | null;
}

export default iHouseAwardScore;
