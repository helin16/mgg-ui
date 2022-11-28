type iHouseAwardEvent = {
  id: number;
  name: string;
  description: string;

  active: boolean;
  created_at: Date | string | null;
  created_by_id: number | null;
  updated_at: Date | string | null;
  updated_by_id: number | null;
}

export default iHouseAwardEvent;
