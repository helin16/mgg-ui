import {iAutoCompleteSingle} from '../common/AutoComplete';
import {useEffect, useState} from 'react';
import SynLuCampusService from '../../services/Synergetic/SynLuCampusService';
import {Spinner} from 'react-bootstrap';
import iLuCampus from '../../types/Synergetic/iLuCampus';
import SelectBox from '../common/SelectBox';

type iSynCampusSelector = {
  isMulti?: boolean;
  values?: iAutoCompleteSingle[] | string[];
  onSelect?: (campus: iAutoCompleteSingle | null | iAutoCompleteSingle[]) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
  className?: string;
  filterEmptyCodes?: boolean
};

export const translateCampusToOption = (campus: iLuCampus) => {
  return {value: campus.Code, data: campus, label: campus.Description}
}

const SynCampusSelector = ({values, onSelect, allowClear, className, filterEmptyCodes = false,  showIndicator = true, isMulti = false}: iSynCampusSelector) => {
  const [optionMap, setOptionMap] = useState<{ [key: string]: iAutoCompleteSingle }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    if (Object.keys(optionMap).length > 0) { return }
    setIsLoading(true);
    SynLuCampusService.getAllCampuses({
        where: JSON.stringify({
          ActiveFlag: true,
        })
      })
      .then(resp => {
        if (isCancelled === true) { return }
        setOptionMap(
          resp
            .filter(yearLevel => {
              if(filterEmptyCodes !== true) {
                return true;
              }
              return `${yearLevel.Code}`.trim() !== '';
            })
            .reduce((map, campus) => {
              return {
                ...map,
                [campus.Code]: translateCampusToOption(campus),
              }
        }, {}))
      })
      .finally(() => {
        setIsLoading(false);
      })
    return () => {
      isCancelled = true;
    }
  }, [optionMap]);

  const getSelectedValues = () => {
    if (!values) {
      return null;
    }
    if (values?.length <= 0) {
      return [];
    }
    return values.map(value => {
      if(typeof value === 'string') {
        return (value in optionMap ? optionMap[value] : {value, label: value, data: null})
      }
      return value;
    })
  }

  if (isLoading === true) {
    return <Spinner animation={'border'} size={'sm'}/>;
  }
  return (
    <SelectBox
      options={Object.values(optionMap)}
      isMulti={isMulti}
      className={className}
      onChange={onSelect}
      value={getSelectedValues()}
      isClearable={allowClear}
      showDropdownIndicator={showIndicator}
    />
  )
};

export default SynCampusSelector;
