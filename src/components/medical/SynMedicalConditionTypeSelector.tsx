import {iAutoCompleteSingle} from '../common/AutoComplete';
import {useEffect, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import SynLuMedicalConditionTypeService from '../../services/Synergetic/Lookup/SynLuMedicalConditionTypeService';
import iSynLuMedicalConditionType from '../../types/Synergetic/Lookup/iSynLuMedicalConditionType';
import SelectBox from '../common/SelectBox';

type iSynMedicalConditionTypeSelector = {
  values?: iAutoCompleteSingle[] | string[];
  onSelect?: (MedicalConditionType: iAutoCompleteSingle | iAutoCompleteSingle[] | null) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
  isMulti?: boolean;
};

export const translateMedicalConditionTypeToOption = (MedicalConditionType: iSynLuMedicalConditionType) => {
  return {value: MedicalConditionType.Code, data: MedicalConditionType, label: MedicalConditionType.Description}
}

const SynMedicalConditionTypeSelector = ({values, onSelect, allowClear, showIndicator = true, isMulti = false}: iSynMedicalConditionTypeSelector) => {
  const [optionsMap, setOptionsMap] = useState<{[key: string]: iAutoCompleteSingle}>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    if (Object.keys(optionsMap).length > 0) { return }

    setIsLoading(true);
    // @ts-ignore
    SynLuMedicalConditionTypeService.getAllMedicalConditionTypes({
        sort: 'SortOrder:ASC',
      })
      .then(resp => {
        if (isCancelled === true) { return }
        setOptionsMap(resp.reduce((map, synLuMedicalConditionType) => {
          return {
            ...map,
            [synLuMedicalConditionType.Code]: translateMedicalConditionTypeToOption(synLuMedicalConditionType),
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
    return <Spinner animation={'border'} size={'sm'} />;
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

export default SynMedicalConditionTypeSelector;
