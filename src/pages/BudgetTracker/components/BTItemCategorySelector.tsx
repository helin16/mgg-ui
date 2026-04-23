import styled from 'styled-components';
import SelectBox from '../../../components/common/SelectBox';
import {useEffect, useState} from 'react';
import BTItemCategoryService from '../../../services/BudgetTracker/BTItemCategoryService';
import Toaster from '../../../services/Toaster';
import {Spinner} from 'react-bootstrap';
import iBTItemCategory from '../../../types/BudgetTacker/iBTItemCategory';

type iBTItemOption = {
  label: string;
  value: string;
  data: iBTItemCategory;
}
type iBTItemCategorySelector = {
  value?: string | null;
  className?: string;
  onSelect?: (option: iBTItemOption | null) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
};


const Wrapper = styled.div``;
const BTItemCategorySelector = ({ className, onSelect, value, allowClear, showIndicator, isInvalid, isDisabled }: iBTItemCategorySelector) => {
  const [isLoading, setIsLoading] = useState(false);
  const [categoryMap, setCategoryMap] = useState<{ [key: string]: iBTItemCategory }>({});

  useEffect(() => {
    setIsLoading(true);
    BTItemCategoryService.getAll({
        where: JSON.stringify({
          active: true,
        }),
        sort: 'name:ASC'
      })
      .then(resp => {
        setCategoryMap(resp.reduce((map, category) => ({...map, [category.guid]: category}), {}))
      }).catch(err => {
        Toaster.showApiError(err);
      }).finally(() => {
        setIsLoading(false);
      })
  }, [])

  const getSelectedOption = () => {
    if (value === undefined || !(`${value || ''}` in categoryMap)) {
      return null;
    }
    const category = categoryMap[`${value || ''}`];
    return {label: category?.name, value: category?.guid, data: value}
  }

  return (
    <Wrapper>
      {isLoading ? <Spinner animation={'border'} /> : (
        <SelectBox
          isDisabled={isDisabled}
          options={Object.values(categoryMap).map(category => ({label: category.name, value: category.guid, data: category}))}
          className={className}
          isInvalid={isInvalid}
          onChange={(option) => onSelect && onSelect(option === null ? null : option)}
          value={getSelectedOption()}
          isClearable={allowClear}
          showDropdownIndicator={showIndicator}
        />
      )}
    </Wrapper>
  )
}

export default BTItemCategorySelector;
