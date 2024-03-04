import {iAutoCompleteSingle} from '../../common/AutoComplete';
import {useEffect, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import SelectBox from '../../common/SelectBox';
import iCampusDisplayLocation from '../../../types/CampusDisplay/iCampusDisplayLocation';
import CampusDisplayLocationService from '../../../services/CampusDisplay/CampusDisplayLocationService';
import Toaster from '../../../services/Toaster';

type iCampusDisplayLocationSelector = {
  isMulti?: boolean;
  values?: iAutoCompleteSingle[] | string[];
  onSelect?: (campus: iAutoCompleteSingle | null | iAutoCompleteSingle[]) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
  className?: string;
  isDisabled?: boolean;
};

export const translateToOption = (display: iCampusDisplayLocation) => {
  return {value: display.id, data: display, label: display.name}
}

const CampusDisplayLocationSelector = ({values, onSelect, allowClear, className, isDisabled = false, showIndicator = true, isMulti = false}: iCampusDisplayLocationSelector) => {
  const [optionMap, setOptionMap] = useState<{ [key: string]: iAutoCompleteSingle }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    if (Object.keys(optionMap).length > 0) { return }
    setIsLoading(true);
    CampusDisplayLocationService.getAll({
      where: JSON.stringify({
        isActive: true,
      }),
      sort: 'name:ASC',
      perPage: 999999,
      include: 'CampusDisplay',
    })
      .then(resp => {
        if (isCancelled === true) { return }
        setOptionMap(
          (resp.data || []).reduce((map, display) => {
            return {
              ...map,
              [display.id]: translateToOption(display),
            }
          }, {})
        )
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
      isDisabled={isDisabled}
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

export default CampusDisplayLocationSelector;
