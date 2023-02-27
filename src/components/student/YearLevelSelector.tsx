import {iAutoCompleteSingle} from '../common/AutoComplete';
import {useEffect, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import SynLuYearLevelService from '../../services/Synergetic/SynLuYearLevelService';
import iLuYearLevel from '../../types/Synergetic/iLuYearLevel';
import SelectBox from '../common/SelectBox';
import {CAMPUS_CODE_ELC, CAMPUS_CODE_JUNIOR, CAMPUS_CODE_SENIOR} from '../../types/Synergetic/iLuCampus';
import UtilsService from '../../services/UtilsService';
import Toaster from '../../services/Toaster';

type iYearLevelSelector = {
  values?: iAutoCompleteSingle[] | string[];
  campusCodes?: string[];
  onSelect?: (yearLevel: iAutoCompleteSingle | iAutoCompleteSingle[] | null) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
  isMulti?: boolean;
  classname?: string;
};

const getLabel = (yearLevel: iLuYearLevel) => {
  return UtilsService.isNumeric(yearLevel.Description) ? `Year ${yearLevel.Description}` : yearLevel.Description;
}
export const translateYearLevelToOption = (yearLevel: iLuYearLevel) => {
  return {value: yearLevel.Code, data: yearLevel, label: getLabel(yearLevel)}
}

const YearLevelSelector = ({values, onSelect, allowClear, campusCodes, classname, showIndicator = true, isMulti = false}: iYearLevelSelector) => {
  const [optionsMap, setOptionsMap] = useState<{[key: string]: iAutoCompleteSingle}>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (Object.keys(optionsMap).length > 0) { return }
    let isCancelled = false;
    setIsLoading(true);
    // @ts-ignore
    SynLuYearLevelService.getAllYearLevels({
        where: JSON.stringify({
          Campus: campusCodes || [CAMPUS_CODE_JUNIOR, CAMPUS_CODE_ELC, CAMPUS_CODE_SENIOR],
        }),
        sort: 'YearLevelSort:ASC',
      })
      .then(resp => {
        if (isCancelled === true) { return }
        setOptionsMap(resp.reduce((map, yearLevel) => {
          return {
            ...map,
            [yearLevel.Code]: translateYearLevelToOption(yearLevel),
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
  }, [optionsMap, campusCodes]);

  if (isLoading === true) {
    return <Spinner animation={'border'} size={'sm'}/>;
  }

  const getSelectedValues = () => {
    if (!values) {
      return null;
    }
    if (values?.length <= 0) {
      return [];
    }
    return values.map(value => {
      if(typeof value === 'string' || typeof value === 'number') {
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
        return opt1.data.YearLevelSort > opt2.data.YearLevelSort ? 1 : -1;
      })
  }

  return (
    <SelectBox
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

export default YearLevelSelector;
