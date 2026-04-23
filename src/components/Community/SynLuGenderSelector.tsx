import {iAutoCompleteSingle} from '../common/AutoComplete';
import {useEffect, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import iSynLuGender, {
  LU_GENDER_CODE_FEMALE,
  LU_GENDER_CODE_MALE,
  LU_GENDER_CODE_OTHER
} from '../../types/Synergetic/Lookup/iSynLuGender';
import SelectBox from '../common/SelectBox';
import Toaster from '../../services/Toaster';
import SynLuGenderService from '../../services/Synergetic/Lookup/SynLuGenderService';

type iLuGenderSelector = {
  values?: iAutoCompleteSingle[] | string[];
  onSelect?: (LuGender: iAutoCompleteSingle | iAutoCompleteSingle[] | null) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
  isMulti?: boolean;
  classname?: string;
  limitCodes?: string[];
  isDisabled?: boolean;
};

const getLabel = (luGender: iSynLuGender) => {
  return luGender.Description;
}
export const translateLuGenderToOption = (LuGender: iSynLuGender) => {
  return {value: LuGender.Code, data: LuGender, label: getLabel(LuGender)}
}

export const translateDescriptionToCode = (description: string) => {
  const name = `${description || ''}`.trim().toLowerCase();
  if (name === 'male' || name === LU_GENDER_CODE_MALE.toLowerCase()) {
    return LU_GENDER_CODE_MALE;
  }
  if (name === 'female' || name === LU_GENDER_CODE_FEMALE.toLowerCase()) {
    return LU_GENDER_CODE_FEMALE;
  }
  if (name === 'other' || name === LU_GENDER_CODE_OTHER.toLowerCase()) {
    return LU_GENDER_CODE_OTHER;
  }
  return '';
}

const SynLuGenderSelector = ({isDisabled, values, onSelect, limitCodes = [], allowClear, classname, showIndicator = true, isMulti = false}: iLuGenderSelector) => {
  const [optionsMap, setOptionsMap] = useState<{[key: string]: iAutoCompleteSingle}>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    const whereObj = {
      ...(limitCodes?.length > 0 ? {Code: limitCodes} : {}),
      ActiveFlag: true,
    }
    SynLuGenderService.getAll({
        ...(Object.keys(whereObj).length > 0 ? {where: JSON.stringify(whereObj)} : {}),
        sort: 'Code:ASC',
      })
      .then(resp => {
        if (isCancelled === true) { return }
        setOptionsMap(resp
          .filter(LuGender => `${LuGender.Code || ''}`.trim() !== '')
          .reduce((map, LuGender) => {
          return {
            ...map,
            [LuGender.Code]: translateLuGenderToOption(LuGender),
          };
        }, {}))
      })
      .catch(err => {
        if (isCancelled === true) { return }
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCancelled === true) { return }
        setIsLoading(false);
      })
    return () => {
      isCancelled = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const getSelectedValues = () => {
    if (!values) {
      return null;
    }
    if (values?.length <= 0) {
      return [];
    }
    return values.map(value => {
      if(typeof value === 'string') {
        return (value in optionsMap ? optionsMap[value] : {value, label: value, data: null})
      }
      return value;
    })
  }

  const getOptions = () => {
    return Object.values(optionsMap)
      .sort((opt1, opt2) => {
        if (!opt1.data || !opt2.data) {
          return 1;
        }
        return opt1.data.Code > opt2.data.Code ? 1 : -1;
      })
  }

  if (isLoading === true) {
    return <Spinner animation={'border'} size={'sm'}/>;
  }

  return (
    <SelectBox
      isDisabled={isDisabled}
      className={classname}
      options={getOptions()}
      isMulti={isMulti}
      onChange={onSelect}
      value={getSelectedValues()}
      isClearable={allowClear}
      showDropdownIndicator={showIndicator}
    />
  )
};

export default SynLuGenderSelector;
