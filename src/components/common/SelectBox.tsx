import Select from 'react-select';
import styled from 'styled-components';

type iSelectBox = {
  isMulti?: boolean;
  className?: string;
  options: any;
  onChange?: (options: any) => void;
  value?: any | any[];
  isClearable?: boolean;
  showDropdownIndicator?: boolean;
  showIndicatorSeparator?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
}

const Wrapper = styled.div`
  input[id^='react-select-'][id$='-input'] {
    min-height: 0px;
    height: auto;
  }

  div[class$='-menu'] {
    z-index: 99999;
  }
  
  .form-control {
    padding: 0px;
    &.is-invalid {
      padding-right: calc(1.5em + 0.75rem);
      div[class$='-control']:hover {
        border: none;
        box-shadow: none;
        outline: none;
      }
    }
    
    div[class$='-control'] {
      border: none;
      outline: none;
    }
  }
`

const SelectBox = ({
  className, options, onChange, value, isClearable, isMulti, isInvalid = false, showDropdownIndicator = true, showIndicatorSeparator = true, isDisabled
}: iSelectBox) => {
  const getComponents = () => {
    if (showDropdownIndicator === false) {
      return {
        DropdownIndicator:() => null,
        IndicatorSeparator:() => null,
      };
    }

    if (showIndicatorSeparator === false) {
      return {
        IndicatorSeparator:() => null,
      };
    }

    return undefined;
  }

  return (
    <Wrapper>
      <Select
        isDisabled={isDisabled}
        isMulti={isMulti}
        className={`${className || ''} ${isInvalid === true ? 'is-invalid form-control' : ''}`}
        options={options}
        onChange={onChange}
        value={value}
        isClearable={isClearable}
        components={getComponents()}
      />
    </Wrapper>
  )
}

export default SelectBox
