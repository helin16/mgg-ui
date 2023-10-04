import {iAutoCompleteSingle} from '../common/AutoComplete';
import {useEffect, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import iSynLuSkill from '../../types/Synergetic/Lookup/iSynLuSkill';
import SelectBox from '../common/SelectBox';
import Toaster from '../../services/Toaster';
import SynLuSkillService from '../../services/Synergetic/Lookup/SynLuSkillService';

type iLuSkillSelector = {
  values?: iAutoCompleteSingle[] | string[];
  onSelect?: (luSkill: iAutoCompleteSingle | iAutoCompleteSingle[] | null) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
  isMulti?: boolean;
  classname?: string;
  limitCodes?: string[];
};

const getLabel = (luSkill: iSynLuSkill) => {
  return `${luSkill.Code} - ${luSkill.Description}`;
}
export const translateLuSkillToOption = (luSkill: iSynLuSkill) => {
  return {value: luSkill.Code, data: luSkill, label: getLabel(luSkill)}
}

const SynLuSkillSelector = ({values, onSelect, limitCodes = [], allowClear, classname, showIndicator = true, isMulti = false}: iLuSkillSelector) => {
  const [optionsMap, setOptionsMap] = useState<{[key: string]: iAutoCompleteSingle}>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    const whereObj = {
      ...(limitCodes?.length > 0 ? {Code: limitCodes} : {}),
    }
    SynLuSkillService.getAll({
        ...(Object.keys(whereObj).length > 0 ? {where: JSON.stringify(whereObj)} : {}),
        sort: 'Code:ASC',
      })
      .then(resp => {
        if (isCancelled === true) { return }
        setOptionsMap(resp
          .filter(luSkill => `${luSkill.Code || ''}`.trim() !== '')
          .reduce((map, luSkill) => {
          return {
            ...map,
            [luSkill.Code]: translateLuSkillToOption(luSkill),
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

export default SynLuSkillSelector;
