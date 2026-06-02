import {iAutoCompleteSingle} from '../common/AutoComplete';
import {useEffect, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import SynLuYearLevelService from '../../services/Synergetic/Lookup/SynLuYearLevelService';
import ISynLuYearLevel from '../../types/Synergetic/Lookup/iSynLuYearLevel';
import SelectBox from '../common/SelectBox';
import {CAMPUS_CODE_ELC, CAMPUS_CODE_JUNIOR, CAMPUS_CODE_SENIOR} from '../../types/Synergetic/Lookup/iSynLuCampus';
import UtilsService from '../../services/UtilsService';
import Toaster from '../../services/Toaster';

const DEFAULT_LIMIT_CODES: string[] = [];
const DEFAULT_CAMPUS_CODES = [CAMPUS_CODE_JUNIOR, CAMPUS_CODE_ELC, CAMPUS_CODE_SENIOR];

type iYearLevelSelector = {
  values?: iAutoCompleteSingle[] | string[];
  campusCodes?: string[];
  onSelect?: (yearLevel: iAutoCompleteSingle | iAutoCompleteSingle[] | null) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
  isMulti?: boolean;
  classname?: string;
  limitCodes?: string[];
  excludeCodes?: string[];
  isDisabled?: boolean;
};

const getLabel = (yearLevel: ISynLuYearLevel) => {
  return UtilsService.isNumeric(yearLevel.Description) ? `Year ${yearLevel.Description}` : yearLevel.Description;
}
export const translateYearLevelToOption = (yearLevel: ISynLuYearLevel) => {
  return {value: yearLevel.Code, data: yearLevel, label: getLabel(yearLevel)}
}

const YearLevelSelector = ({isDisabled, values, onSelect, allowClear, limitCodes = DEFAULT_LIMIT_CODES, excludeCodes = DEFAULT_LIMIT_CODES, campusCodes, classname, showIndicator = true, isMulti = false}: iYearLevelSelector) => {
  const [optionsMap, setOptionsMap] = useState<{[key: string]: iAutoCompleteSingle}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const normalizedCampusCodes = campusCodes || DEFAULT_CAMPUS_CODES;
  const campusCodesKey = normalizedCampusCodes.join('|');
  const limitCodesKey = limitCodes.join('|');
  const excludeCodesKey = excludeCodes.join('|');

  useEffect(() => {
    setOptionsMap({});
    setHasLoaded(false);
  }, [campusCodesKey, limitCodesKey, excludeCodesKey]);

  useEffect(() => {
    if (hasLoaded === true) { return }
    let isCancelled = false;
    setIsLoading(true);
    // @ts-ignore
    SynLuYearLevelService.getAllYearLevels({
        where: JSON.stringify({
          Campus: normalizedCampusCodes,
          ...(limitCodes?.length > 0 ? {Code: limitCodes} : {}),
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
        setHasLoaded(true);
      })
      .catch(err => {
        if (isCancelled === true) { return }
        Toaster.showApiError(err);
        setHasLoaded(true);
      })
      .finally(() => {
        if (isCancelled === true) { return }
        setIsLoading(false);
      })
    return () => {
      isCancelled = true;
    }
  }, [hasLoaded, campusCodesKey, limitCodesKey, normalizedCampusCodes, limitCodes]);

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
      .filter(option => excludeCodes.indexOf(`${option.value}`) < 0)
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
      isDisabled={isDisabled}
      showDropdownIndicator={showIndicator}
    />
  )
};

export default YearLevelSelector;
