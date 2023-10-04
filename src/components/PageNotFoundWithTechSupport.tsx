import {Button} from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import PageNotFound from './PageNotFound';
import React from 'react';

const PageNotFoundWithTechSupport = () => {
  return (
    <PageNotFound
      title={'Service Support'}
      description={`Mentone Girls' Grammar Service Support`}
      primaryBtn={
        <Button variant="primary" href={process.env.REACT_APP_MAIN_WEBSITE_URL || ''}>
          <Icon.HouseDoorFill /> {' '}Home
        </Button>
      }
      secondaryBtn={<div />}
    />
  )
}

export default PageNotFoundWithTechSupport
