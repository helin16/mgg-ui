import AsyncSelect from 'react-select/async';
import styled from 'styled-components';

export type iAutoCompleteSingle = {
  label: any;
  value: string | number;
  data?: any;
}

type iAutoComplete = {
  placeholder?: string,
  allowClear?: boolean,
  minSearchLength?: number,
  handleSearchFn: (keyword: string) => Promise<any>;
  renderOptionItemFn: (option: any) => iAutoCompleteSingle[];
  onSelected?: (option: iAutoCompleteSingle | null) => void;
  value?: iAutoCompleteSingle;
  isDisabled?: boolean;
}

const Wrapper = styled.div`
  input[id^='react-select-'][id$='-input'] {
    min-height: 0px;
    height: auto;
  }
`;

const AutoComplete = ({
    placeholder, handleSearchFn, renderOptionItemFn, onSelected, value, allowClear, isDisabled
  }: iAutoComplete) => {
  const loadOptions = async (keyword: string) => {
    const results = await handleSearchFn(keyword)
    return renderOptionItemFn(results);
  };

  const onChange = (option: iAutoCompleteSingle | null) => {
    if (onSelected) {
      onSelected(option);
    }
  }

  return (
    <Wrapper>
      <AsyncSelect
        isDisabled={isDisabled}
        isClearable={allowClear}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        cacheOptions
        defaultOptions={false}
        loadOptions={loadOptions}
      />
    </Wrapper>
  );
}

export default AutoComplete;
