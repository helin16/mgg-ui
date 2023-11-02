import {FlexContainer} from '../../../../../styles';
import FormLabel from '../../../../form/FormLabel';
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin-top: 1rem;
  min-width: 200px;
`;

type iCODAdminInputPanel = {
  getComponent: (isSameFromDB: boolean) => any;
  label: string;
  value: string;
  valueFromDB: string;
  getIsSameFromDBFn?: () => boolean;
}
const CODAdminInputPanel = ({getComponent, label, value, valueFromDB, getIsSameFromDBFn} : iCODAdminInputPanel) => {
  const isSameInDB = getIsSameFromDBFn ? getIsSameFromDBFn() : `${value || ""}`.trim() === `${valueFromDB}`.trim();
  return (
    <Wrapper className={`input-div ${isSameInDB === true ? "" : "has-error"}`}>
      <FlexContainer className={"justify-content-between"}>
        <FormLabel
          label={label}
          isRequired
          className={isSameInDB === true ? "" : "text-danger"}
        />
        <small
          className={isSameInDB === true ? "text-success" : "text-danger"}
        >
          {valueFromDB}
        </small>
      </FlexContainer>
      {getComponent(isSameInDB)}
      {isSameInDB === true ? null : (
        <small className={"text-danger"}>
          Input value is different from DB.
        </small>
      )}
    </Wrapper>
  )
}

export default CODAdminInputPanel;
