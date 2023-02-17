import iBTItemCategory from './iBTItemCategory';

export const BT_ITEM_STATUS_NEW = 'new';
export const BT_ITEM_STATUS_APPROVED = 'approved';
export const BT_ITEM_STATUS_DECLINED = 'declined';

type iBTItem = {
  id?: number;
  budget_item_category_guid?: string| null;
  name?: string | null;
  description?: string | null;
  item_cost?: number | null;
  item_quantity?: number | null;
  gl_code?: string | null;
  year?: number | null;
  approved?: boolean | null;
  declined?: boolean | null;
  created_at?: Date | string | null;
  author_id?: number | null;
  creator_id?: number | null;
  updated_at?: Date | string | null;
  approved_amount?: number | null;
  approver_comments?: string | null;
  BTItemCategory?: iBTItemCategory | null;
  status?: string;
};

export default iBTItem;
