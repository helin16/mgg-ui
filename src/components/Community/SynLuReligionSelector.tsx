import {iAutoCompleteSingle} from '../common/AutoComplete';
import {useEffect, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import iSynLuReligion from '../../types/Synergetic/Lookup/iSynLuReligion';
import SelectBox from '../common/SelectBox';
import Toaster from '../../services/Toaster';
import SynLuReligionService from '../../services/Synergetic/Lookup/SynLuReligionService';

type iLuReligionSelector = {
  values?: iAutoCompleteSingle[] | string[];
  onSelect?: (LuReligion: iAutoCompleteSingle | iAutoCompleteSingle[] | null) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
  isMulti?: boolean;
  classname?: string;
  limitCodes?: string[];
};

const getLabel = (LuReligion: iSynLuReligion) => {
  return `${LuReligion.Code} - ${LuReligion.Description}`;
}
export const translateLuReligionToOption = (LuReligion: iSynLuReligion) => {
  return {value: LuReligion.Code, data: LuReligion, label: getLabel(LuReligion)}
}

const SynLuReligionSelector = ({values, onSelect, limitCodes = [], allowClear, classname, showIndicator = true, isMulti = false}: iLuReligionSelector) => {
  const [optionsMap, setOptionsMap] = useState<{[key: string]: iAutoCompleteSingle}>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    const whereObj = {
      ...(limitCodes?.length > 0 ? {Code: limitCodes} : {}),
    }
    SynLuReligionService.getAll({
        ...(Object.keys(whereObj).length > 0 ? {where: JSON.stringify(whereObj)} : {}),
        sort: 'Code:ASC',
      })
      .then(resp => {
        if (isCancelled === true) { return }
        setOptionsMap(resp
          .filter(LuReligion => `${LuReligion.Code || ''}`.trim() !== '')
          .reduce((map, LuReligion) => {
          return {
            ...map,
            [LuReligion.Code]: translateLuReligionToOption(LuReligion),
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

export default SynLuReligionSelector;
