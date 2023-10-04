import {iAutoCompleteSingle} from '../common/AutoComplete';
import {useEffect, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import SynLuMedicalConditionSeverityService from '../../services/Synergetic/Lookup/SynLuMedicalConditionSeverityService';
import iSynLuMedicalConditionSeverity from '../../types/Synergetic/Lookup/iSynLuMedicalConditionSeverity';
import SelectBox from '../common/SelectBox';

type iSynMedicalConditionSeveritySelector = {
  values?: iAutoCompleteSingle[] | string[];
  onSelect?: (MedicalConditionSeverity: iAutoCompleteSingle | iAutoCompleteSingle[] | null) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
  isMulti?: boolean;
};

export const translateMedicalConditionSeverityToOption = (MedicalConditionSeverity: iSynLuMedicalConditionSeverity) => {
  return {value: MedicalConditionSeverity.Code, data: MedicalConditionSeverity, label: MedicalConditionSeverity.Description}
}

const SynMedicalConditionSeveritySelector = ({values, onSelect, allowClear, showIndicator = true, isMulti = false}: iSynMedicalConditionSeveritySelector) => {
  const [optionsMap, setOptionsMap] = useState<{[key: string]: iAutoCompleteSingle}>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    if (Object.keys(optionsMap).length > 0) { return }

    setIsLoading(true);
    // @ts-ignore
    SynLuMedicalConditionSeverityService.getAllMedicalConditionSeverities({
        sort: 'SortOrder:ASC',
      })
      .then(resp => {
        if (isCancelled === true) { return }
        setOptionsMap(resp.reduce((map, synLuMedicalConditionSeverity) => {
          return {
            ...map,
            [synLuMedicalConditionSeverity.Code]: translateMedicalConditionSeverityToOption(synLuMedicalConditionSeverity),
          };
        }, {}))
      })
      .finally(() => {
        setIsLoading(false);
      })
    return () => {
      isCancelled = true;
    }
  }, [optionsMap]);

  if (isLoading) {
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
        return opt1.data.Description > opt2.data.Description ? 1 : -1;
      })
  }

  return (
    <SelectBox
      options={getOptions()}
      isMulti={isMulti}
      onChange={onSelect}
      value={getSelectedValues()}
      isClearable={allowClear}
      showDropdownIndicator={showIndicator}
    />
  )
};

export default SynMedicalConditionSeveritySelector;
