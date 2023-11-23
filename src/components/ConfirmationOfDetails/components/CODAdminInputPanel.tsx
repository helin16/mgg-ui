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
  
  .invalid-tooltip {
    display: block;
    top: 320%;
    right: 4px;
  }
`;

type iCODAdminInputPanel = {
  getComponent: (isSameFromDB: boolean) => any;
  isRequired?: boolean;
  label: string;
  value: string;
  hint?: any;
  valueFromDB?: string;
  getIsSameFromDBFn?: () => boolean;
  getSynergeticLabelFn?: (isSameFromDB: boolean, valueFromDB: string) => any;
  errMsg?: string;
}
const CODAdminInputPanel = ({getComponent, label, value, valueFromDB, getIsSameFromDBFn, isRequired, getSynergeticLabelFn, hint, errMsg} : iCODAdminInputPanel) => {
  const isSameInDB = getIsSameFromDBFn ? getIsSameFromDBFn() : `${value || ""}`.trim() === `${valueFromDB}`.trim();

  const getValueFromDBPanel = () => {
    if (valueFromDB === undefined) {
      return null;
    }
    return (
      <small
        title={`System Value: ${valueFromDB}`}
        className={`syn-value ellipsis ${isSameInDB === true ? "" : "bg-warning"}`}
      >
        {getSynergeticLabelFn ? getSynergeticLabelFn(isSameInDB, valueFromDB) : (`${valueFromDB || ''}`.trim() === '' ? 'NULL' : valueFromDB)}
      </small>
    )
  }

  const getErrorMsgPanel = () => {
    const errMsgString = `${errMsg || ''}`.trim();
    if (errMsgString === '') {
      return null;
    }
    return (
      <div className="invalid-tooltip">
        {errMsgString}
      </div>
    )
  }

  return (
    <Wrapper className={`input-div`}>
      <div className={'position-relative'}>
        <FlexContainer className={"justify-content-between"}>
          <FormLabel
            label={label}
            isRequired={isRequired}
          />
          {getValueFromDBPanel()}
        </FlexContainer>
        {getErrorMsgPanel()}
      </div>
      {getComponent(isSameInDB)}
      <div className={'hint-wrapper'}>{hint}</div>
      {isSameInDB === true ? null : (
        <small className={"bg-warning"}>
          Value is different from the system.
        </small>
      )}
    </Wrapper>
  )
}

export default CODAdminInputPanel;
