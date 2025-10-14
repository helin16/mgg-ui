import AsyncSelect from "react-select/async";
import styled from "styled-components";
import { debounce } from "lodash";
import InputGroup from 'react-bootstrap/InputGroup';
import {dangerRed} from '../../AppWrapper';
import {useEffect, useMemo} from 'react';

export type iAutoCompleteSingle = {
  label: any;
  value: string | number;
  data?: any;
};

type iAutoComplete = {
  inputProps?: any;
  placeholder?: string;
  className?: string;
  allowClear?: boolean;
  isMulti?: boolean;
  minSearchLength?: number;
  handleSearchFn: (keyword: string) => Promise<any>;
  renderOptionItemFn: (option: any) => iAutoCompleteSingle[];
  onSelected?: (
    option: iAutoCompleteSingle | iAutoCompleteSingle[] | null
  ) => void;
  value?: iAutoCompleteSingle | iAutoCompleteSingle[];
  isDisabled?: boolean;
  postpend?: any;
  prepend?: any;
};

const Wrapper = styled.div`
  border: 1px #ced4da solid;
  border-radius: 0.25rem;
  margin: 0px;
  padding: 0px;
  
  &.is-invalid {
    border-color: ${dangerRed};
  }
  
  input[id^="react-select-"][id$="-input"] {
    min-height: 0px;
    height: auto;
  }

  .form-control {
    margin: 0px;
    padding: 0px;
    border: none;

    [class$="-control"] {
      border: none;
    }
  }
  
  .btn {
    border: 0px;
    height: 100%;
  }
  
  .input-group-prepend {
    .btn {
      border-bottom-right-radius: 0px;
      border-top-right-radius: 0px;
    }
  }

  .input-group-append {
    .btn {
      border-bottom-left-radius: 0px;
      border-top-left-radius: 0px;
    }
  }
`;

const AutoComplete = ({
  placeholder,
  handleSearchFn,
  renderOptionItemFn,
  onSelected,
  value,
  allowClear,
  isDisabled,
  isMulti,
  postpend,
  prepend,
  inputProps,
  className,
}: iAutoComplete) => {
  const debouncedSearch = useMemo(
    () =>
      debounce(
        async (inputValue: string, resolve: (opts: iAutoCompleteSingle[]) => void) => {
          const results = await handleSearchFn(inputValue);
          resolve(renderOptionItemFn(results || []));
        },
        500
      ),
    [handleSearchFn, renderOptionItemFn]
  );

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  const loadOptions = (inputValue: string) =>
    new Promise<iAutoCompleteSingle[]>((resolve) => {
      debouncedSearch(inputValue, resolve);
    });

  const getPrepend = () => {
    if (!prepend) {
      return null;
    }
    return <div className={'input-group-prepend'}>{prepend}</div>
  }
  const getPostpend = () => {
    if (!postpend) {
      return null;
    }
    return <div className={'input-group-append'}>{postpend}</div>
  }

  const onChange = (option: iAutoCompleteSingle | null) => {
    if (onSelected) {
      onSelected(option);
    }
  };
  const getAutoComplete = () => {
    return (
      <AsyncSelect
        isMulti={isMulti}
        isDisabled={isDisabled}
        isClearable={allowClear}
        value={value}
        placeholder={placeholder}
        // @ts-ignore
        onChange={onChange}
        cacheOptions={false}
        defaultOptions={false}
        loadOptions={loadOptions}
        className={'form-control'}
        {...inputProps}
      />
    )
  }

  const getInputGroup = () => {
    if (!postpend && !prepend) {
      return getAutoComplete();
    }
    return (
      <InputGroup>
        {getPrepend()}
        {getAutoComplete()}
        {getPostpend()}
      </InputGroup>
    )
  }

  return <Wrapper className={className}>{getInputGroup()}</Wrapper>;
};

export default AutoComplete;
