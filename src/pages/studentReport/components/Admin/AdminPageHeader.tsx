import {Button} from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import React from 'react';

type iAdminPageHeader = {
  title: string;
  backToAdminFn?: () => void
};
const AdminPageHeader = ({title, backToAdminFn}: iAdminPageHeader) => {
  return (
    <h3>
      <Button variant={'link'} size={'sm'} onClick={backToAdminFn}>
        <Icons.ArrowLeft />
      </Button>
      {title}
    </h3>
  )
};

export default AdminPageHeader;
