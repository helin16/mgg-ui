import Select from 'react-select';
import {iAutoCompleteSingle} from '../common/AutoComplete';
import {useEffect, useState} from 'react';
import SynLuCampusService from '../../services/Synergetic/SynLuCampusService';
import {Spinner} from 'react-bootstrap';
import iLuCampus from '../../types/Synergetic/iLuCampus';

type iCampusSelector = {
  values?: iAutoCompleteSingle[] | string[];
  onSelect?: (campus: iAutoCompleteSingle | null) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
};

export const translateCampusToOption = (campus: iLuCampus) => {
  return {value: campus.Code, data: campus, label: campus.Description}
}

const CampusSelector = ({values, onSelect, allowClear, showIndicator = true}: iCampusSelector) => {
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
        setOptionMap(resp.reduce((map, campus) => {
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
    return <Spinner animation={'border'} />;
  }
  return (
    <Select
      // @ts-ignore
      options={Object.values(optionMap)}
      // @ts-ignore
      onChange={onSelect}
      value={getSelectedValues()}
      isClearable={allowClear}
      components={showIndicator === true ? undefined : { DropdownIndicator:() => null, IndicatorSeparator:() => null }}
    />
  )
};

export default CampusSelector;
