import AutoComplete, {iAutoCompleteSingle} from '../common/AutoComplete';
import {OP_LIKE, OP_OR} from '../../helper/ServiceHelper';
import {useEffect, useState} from 'react';
import Toaster from '../../services/Toaster';
import {Spinner} from 'react-bootstrap';
import SynVCreditorService from '../../services/Synergetic/Finance/SynVCreditorService';
import iSynVCreditor from '../../types/Synergetic/Finance/iSynVCreditor';

type iSynCreditorSelector = {
  onSelect?: (option: iAutoCompleteSingle | null) => void;
  value?: number | null;
  allowClear?: boolean;
  isDisabled?: boolean;
}
const SynCreditorSelector = ({onSelect, value, allowClear, isDisabled}: iSynCreditorSelector) => {
  const [isLoading, setIsLoading] = useState(false);
  const [preSelectedValue, setPreSelectedValue] = useState<iSynVCreditor | null>(null);

  useEffect(() => {
    const staffID = `${value || ''}`.trim();
    if (staffID === '') {
      setPreSelectedValue(null);
      return;
    }
    let isCanceled = false;
    setIsLoading(true);
    SynVCreditorService.getAll({
      where: JSON.stringify({CreditorID: value}),
    })
      .then(resp => {
        if (isCanceled) return;
        const data = resp.data || [];
        setPreSelectedValue(data.length > 0 ? data[0] : null);
      })
      .catch(err => {
        if (isCanceled) return;
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCanceled) return;
        setIsLoading(false);
      })
  }, [value])

  const handleSearchFn = async (searchText: string) => {
    if (searchText === '') {
      return []
    }
    return SynVCreditorService.getAll({
      where: JSON.stringify({
        ActiveFlag: 1,
        [OP_OR]: [
          {CreditorNameExternal: { [OP_LIKE]: `%${searchText}%` }},
          {CreditorID: { [OP_LIKE]: `%${searchText}%` }},
        ]
      }),
      perPage: 9999999,
      sort: 'CreditorNameInternal:ASC',
    }).then(({data}) => data)
  }

  const convertDataToOption = (creditor: iSynVCreditor) => {
    return {
      label: `[${creditor.CreditorID}] ${creditor.CreditorNameExternal}`,
      data: creditor,
      value: creditor.CreditorID,
    }
  }

  const renderOptionItem = (options: iSynVCreditor[]) => {
    return options.map(option => convertDataToOption(option));
  }

  if (isLoading) {
    return <Spinner animation={'border'} />
  }

  return (
    <AutoComplete
      isDisabled={isDisabled}
      isMulti={false}
      // @ts-ignore
      onSelected={onSelect}
      allowClear={allowClear}
      value={preSelectedValue ? convertDataToOption(preSelectedValue) : undefined}
      placeholder={'Search Creditor ...'}
      handleSearchFn={handleSearchFn}
      renderOptionItemFn={renderOptionItem}
    />
  )
}

export default SynCreditorSelector;
