import AsyncSelect from 'react-select/async';

export type iAutoCompleteSingle = {
  label: string;
  value: string | number;
  data?: any;
}

type iAutoComplete = {
  placeholder?: string,
  minSearchLength?: number,
  handleSearchFn: (keyword: string) => Promise<any>;
  renderOptionItemFn: (option: any) => iAutoCompleteSingle[];
  onSelected?: (option: iAutoCompleteSingle | null) => void;
}

const AutoComplete = ({
    placeholder, handleSearchFn, renderOptionItemFn, onSelected
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
    <AsyncSelect
      placeholder={placeholder}
      onChange={onChange}
      cacheOptions
      defaultOptions={false}
      loadOptions={loadOptions}
    />
  );
}

export default AutoComplete;
