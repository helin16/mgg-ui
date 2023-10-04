import React from 'react';
import styled from 'styled-components';

const LabelWrapper = styled.label`
  font-size: 0.7rem;
  font-style: inherit;
  line-height: 1.3333333333333333;
  color: #6b778c;
  font-weight: 600;
  display: inline-block;
  span {
    color: red;
  }
  
  &.space-top {
    margin-top: 1rem;
  }
`;

type iFormLabel = {
  label?: string | JSX.Element;
  htmlFor?: string;
  isRequired?: boolean;
  needSpaceTop?: boolean;
}
const FormLabel = ({
 needSpaceTop = false,
 label,
 htmlFor,
 isRequired = false,
}: iFormLabel) => {
  return label ? (
    <LabelWrapper className={`label-wrapper ${needSpaceTop ? 'space-top' : ''}`} htmlFor={htmlFor || 'label'}>
      {label}
      {isRequired && <span>*</span>}
    </LabelWrapper>
  ) : null;
};

export default FormLabel;
