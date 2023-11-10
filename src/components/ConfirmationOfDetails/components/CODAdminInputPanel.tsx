import {FlexContainer} from '../../../styles';
import FormLabel from '../../form/FormLabel';
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin-top: 1rem;
  min-width: 200px;
  .syn-value {
    max-width: 250px;
  }
`;

type iCODAdminInputPanel = {
  getComponent: (isSameFromDB: boolean) => any;
  isRequired?: boolean;
  label: string;
  value: string;
  valueFromDB: string;
  getIsSameFromDBFn?: () => boolean;
  getSynergeticLabelFn?: (isSameFromDB: boolean, valueFromDB: string) => any;
}
const CODAdminInputPanel = ({getComponent, label, value, valueFromDB, getIsSameFromDBFn, isRequired, getSynergeticLabelFn} : iCODAdminInputPanel) => {
  const isSameInDB = getIsSameFromDBFn ? getIsSameFromDBFn() : `${value || ""}`.trim() === `${valueFromDB}`.trim();
  return (
    <Wrapper className={`input-div ${isSameInDB === true ? "" : "has-error"}`}>
      <FlexContainer className={"justify-content-between"}>
        <FormLabel
          label={label}
          isRequired={isRequired}
          className={isSameInDB === true ? "" : "text-danger"}
        />
        <small
          title={`System Value: ${valueFromDB}`}
          className={`syn-value ellipsis ${isSameInDB === true ? "" : "text-danger"}`}
        >
          {getSynergeticLabelFn ? getSynergeticLabelFn(isSameInDB, valueFromDB) : (`${valueFromDB}`.trim() === '' ? 'NULL' : valueFromDB)}
        </small>
      </FlexContainer>
      {getComponent(isSameInDB)}
      {isSameInDB === true ? null : (
        <small className={"text-danger"}>
          Value is different from the system.
        </small>
      )}
    </Wrapper>
  )
}

export default CODAdminInputPanel;
