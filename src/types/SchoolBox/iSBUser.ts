type iSBUser = {
  id: number;
  username: string;
  group_id: number;
  title: string;
  firstname: string;
  lastname: string;
  email_pass: string;
  synergy_id: string;
  alt_email: string;
  mail_handler: 0,
  hash: string;
  portrait_hash: string;
  digest: null,
  key: string;
  enabled: number;
  hide_contacts: number;
  hide_timetable: number;
  hide_sidenav: number;
  hide_notifications_tray: number;
  position_title: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export default iSBUser;
