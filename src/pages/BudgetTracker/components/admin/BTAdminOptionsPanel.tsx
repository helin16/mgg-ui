import {Button} from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import React from 'react';
import ModuleAccessWrapper from '../../../../components/module/ModuleAccessWrapper';
import {MGGS_MODULE_ID_BUDGET_TRACKER} from '../../../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN} from '../../../../types/modules/iRole';
import moment from 'moment-timezone';

export const BT_ADMIN_OPTION_USERS = 'users';
export const BT_ADMIN_OPTION_LOCKDOWNS = 'lockdowns';
export const BT_ADMIN_OPTION_DOWNLOAD_BT_ITEMS = 'download_budget_items';
export const BT_ADMIN_OPTION_CONSOLIDATED_REPORTS = 'consolidated_reports';
export const BT_ADMIN_OPTION_CATEGORIES = 'categories';
export const BT_ADMIN_OPTION_EXCLUDED_GL_CODES = 'excluded_gl_codes';
export const BT_ADMIN_OPTION_NOTIFICATIONS = 'notifications';
export const BT_ADMIN_OPTION_FORECAST = 'forecast';

export type iBTAdminOptions =
  typeof BT_ADMIN_OPTION_USERS
  | typeof BT_ADMIN_OPTION_DOWNLOAD_BT_ITEMS
  | typeof BT_ADMIN_OPTION_CONSOLIDATED_REPORTS
  | typeof BT_ADMIN_OPTION_CONSOLIDATED_REPORTS
  | typeof BT_ADMIN_OPTION_CATEGORIES
  | typeof BT_ADMIN_OPTION_EXCLUDED_GL_CODES
  | typeof BT_ADMIN_OPTION_NOTIFICATIONS
  | typeof BT_ADMIN_OPTION_FORECAST
  | typeof BT_ADMIN_OPTION_LOCKDOWNS;

type iBTAdminOptionsPanel = {
  onSelectAdminModule: (option: iBTAdminOptions | null) => void;
  className?: string;
  preExtraBtns?: any;
}


const BTAdminOptionsPanel = ({onSelectAdminModule, className, preExtraBtns}: iBTAdminOptionsPanel) => {
  return (
    <ModuleAccessWrapper moduleId={MGGS_MODULE_ID_BUDGET_TRACKER} roleId={ROLE_ID_ADMIN} silentMode={true}>
      <div className={className}>
        <h3>Admin Options</h3>
        <div className={'d-grid gap-2'}>
          {preExtraBtns}
          <Button variant={'primary'} size={'sm'} onClick={() => onSelectAdminModule(BT_ADMIN_OPTION_DOWNLOAD_BT_ITEMS)}>
            <Icons.Download /> Download Budget Items
          </Button>
          <Button variant={'primary'} size={'sm'} onClick={() => onSelectAdminModule(BT_ADMIN_OPTION_CONSOLIDATED_REPORTS)}>
            <Icons.BarChart /> Consolidated Reports
          </Button>
          <Button variant={'primary'} size={'sm'} onClick={() => onSelectAdminModule(BT_ADMIN_OPTION_USERS)}>
            <Icons.People /> Users
          </Button>
          <Button variant={'primary'} size={'sm'} onClick={() => onSelectAdminModule(BT_ADMIN_OPTION_CATEGORIES)}>
            <Icons.ListNested /> Categories
          </Button>
          <Button variant={'primary'} size={'sm'} onClick={() => onSelectAdminModule(BT_ADMIN_OPTION_EXCLUDED_GL_CODES)}>
            <Icons.ListTask /> Excluded GL Codes
          </Button>
          <Button variant={'primary'} size={'sm'} onClick={() => onSelectAdminModule(BT_ADMIN_OPTION_NOTIFICATIONS)}>
            <Icons.Mailbox /> Notifications
          </Button>
          <Button variant={'success'} size={'sm'} onClick={() => onSelectAdminModule(BT_ADMIN_OPTION_FORECAST)}>
            <Icons.Mailbox /> Forecast {moment().add(1, 'year').year()}
          </Button>
          <Button variant={'danger'} size={'sm'} onClick={() => onSelectAdminModule(BT_ADMIN_OPTION_LOCKDOWNS)}>
            <Icons.Lock /> Lockdowns
          </Button>
        </div>
      </div>
    </ModuleAccessWrapper>
  )
}

export default BTAdminOptionsPanel;
