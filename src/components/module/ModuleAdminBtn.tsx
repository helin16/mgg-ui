import React, {useEffect, useState} from 'react';
import {Button, ButtonProps, Spinner} from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import AuthService from '../../services/AuthService';
import {ROLE_ID_ADMIN} from '../../types/modules/iRole';

const ModuleAdminBtn = ({moduleId, ...props}: ButtonProps & {moduleId: number}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [canShowAdminBtn, setCanShowAdminBtn] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    AuthService.canAccessModule(moduleId)
      .then(resp => {
        if (isCancelled === true) { return }
        setCanShowAdminBtn(Object.keys(resp).filter(roleId => `${roleId}` === `${ROLE_ID_ADMIN}`).length > 0)
      })
      .finally(() => {
        setIsLoading(false);
      })
    return () => {
      isCancelled = true;
    }
  }, [])

  if (isLoading === true) {
    return <Spinner animation={'border'} size={'sm'}/>;
  }

  if (canShowAdminBtn !== true) {
    return null;
  }

  return (
    <Button variant={'success'} size={'sm'} {...props}>
      <Icons.Gear />{' '}
      <span className={'d-none d-sm-inline-block'}>Admin</span>
    </Button>
  )
};

export default ModuleAdminBtn;
