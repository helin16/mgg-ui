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
}

const Wrapper = styled.div`
  input[id^='react-select-'][id$='-input'] {
    min-height: 0px;
    height: auto;
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
  className, options, onChange, value, isClearable, isMulti, showDropdownIndicator = true, showIndicatorSeparator = true
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
        isMulti={isMulti}
        className={className}
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
