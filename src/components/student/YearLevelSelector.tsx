import Select from 'react-select';
import {iAutoCompleteSingle} from '../common/AutoComplete';
import {useEffect, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import SynLuYearLevelService from '../../services/Synergetic/SynLuYearLevelService';
import iLuYearLevel from '../../types/Synergetic/iLuYearLevel';

type iYearLevelSelector = {
  values?: iAutoCompleteSingle[] | string[];
  campusCodes?: string[];
  onSelect?: (yearLevel: iAutoCompleteSingle | null) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
};

export const translateYearLevelToOption = (yearLevel: iLuYearLevel) => {
  return {value: yearLevel.Code, data: yearLevel, label: yearLevel.Description}
}

const YearLevelSelector = ({values, onSelect, allowClear, campusCodes, showIndicator = true}: iYearLevelSelector) => {
  const [optionsMap, setOptionsMap] = useState<{[key: string]: iAutoCompleteSingle}>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    if (Object.keys(optionsMap).length > 0) { return }

    setIsLoading(true);
    const where = campusCodes && campusCodes.length > 0 ? {
      where: JSON.stringify({
        Campus: campusCodes
      })
    } : {};
    // @ts-ignore
    SynLuYearLevelService.getAllYearLevels({
        ...where,
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
      .finally(() => {
        setIsLoading(false);
      })
    return () => {
      isCancelled = true;
    }
  }, [campusCodes, optionsMap]);

  if (isLoading === true) {
    return <Spinner animation={'border'} />;
  }

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
  return (
    <Select
      options={Object.values(optionsMap)}
      onChange={onSelect}
      value={getSelectedValues()}
      isClearable={allowClear}
      components={showIndicator === true ? undefined : { DropdownIndicator:() => null, IndicatorSeparator:() => null }}
    />
  )
};

export default YearLevelSelector;
