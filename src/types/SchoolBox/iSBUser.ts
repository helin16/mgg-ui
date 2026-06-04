type iSBUser = {
  id: number;
  externalId?: string | null;
  username: string;
  group_id?: number;
  title?: string | null;
  firstname?: string;
  lastname?: string | null;
  email_pass?: string;
  synergy_id?: string;
  alt_email?: string | null;
  mail_handler?: 0;
  hash?: string;
  portrait_hash?: string;
  digest?: null;
  key?: string;
  enabled?: number | boolean;
  hide_contacts?: number;
  hide_timetable?: number;
  hide_sidenav?: number;
  hide_notifications_tray?: number;
  position_title?: string | null;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;

  firstName?: string;
  lastName?: string | null;
  preferredName?: string | null;
  fullName?: string;
  altEmail?: string | null;
  role?: {
    id: number;
    name: string;
  };
}

export default iSBUser;
