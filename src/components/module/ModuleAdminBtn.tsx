import React from 'react';
import {Button, ButtonProps} from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import {ROLE_ID_ADMIN} from '../../types/modules/iRole';
import ModuleAccessWrapper from './ModuleAccessWrapper';

const ModuleAdminBtn = ({moduleId, ...props}: ButtonProps & {moduleId: number}) => {
  return (
    <ModuleAccessWrapper moduleId={moduleId} roleId={ROLE_ID_ADMIN} silentMode={true}>
      <Button variant={'success'} size={'sm'} {...props}>
        <Icons.Gear />{' '}
        <span className={'d-none d-sm-inline-block'}>Admin</span>
      </Button>
    </ModuleAccessWrapper>
  )
};

export default ModuleAdminBtn;
