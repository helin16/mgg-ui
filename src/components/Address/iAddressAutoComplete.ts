import {iAutoCompleteSingle} from '../common/AutoComplete';

export type iAddressResult = {
  placeId?: string | number;
  street: string;
  suburb: string;
  country: string;
  state: string;
  postcode: string;
  countryCode?: string;
}

type iAddressAutoComplete = {
  className?: string;
  placeHolder?: string;
  isDisabled?: boolean;
  onSelect?: (option: iAddressResult) => void;
  value?: iAutoCompleteSingle;
  allowClear?: boolean;
  inputProps?: any;
  postpend?: any;
};

export default iAddressAutoComplete;
