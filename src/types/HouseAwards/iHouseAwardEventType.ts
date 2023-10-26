
export const HOUSE_AWARD_EVENT_TYPE_ACHIEVEMENTS = 'Achievements';
export const HOUSE_AWARD_EVENT_TYPE_SERVICES = 'Services';

type iHouseAwardEventType = {
  id: number;
  name: string;
  points_to_be_awarded: number;
  comments: string;

  created_at: Date | string | null;
  created_by_id: number | null;
  updated_at: Date | string | null;
  updated_by_id: number | null;
}

export default iHouseAwardEventType;
