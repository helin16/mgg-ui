import React from 'react';
import {Col, Row} from 'react-bootstrap';

const PageTitle = ({children, operations}: {children: any; operations?: any}) => {
  return (
    <Row className={'TwoColumnPageTitle'}>
      <Col>
        {children}
      </Col>
      {operations ? <Col>{operations}</Col>: null }
    </Row>
  );
};

export default PageTitle
