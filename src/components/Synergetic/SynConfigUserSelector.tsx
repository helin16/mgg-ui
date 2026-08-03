import {useEffect, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import {iAutoCompleteSingle} from '../common/AutoComplete';
import SelectBox from '../common/SelectBox';
import SynConfigUserService from '../../services/Synergetic/SynConfigUserService';
import Toaster from '../../services/Toaster';
import iSynConfigUser from '../../types/Synergetic/iSynConfigUser';

type iSynConfigUserSelector = {
  values?: iAutoCompleteSingle[] | number[];
  onSelect?: (users: iAutoCompleteSingle | iAutoCompleteSingle[] | null) => void;
  allowClear?: boolean;
  isMulti?: boolean;
};

const translateConfigUserToOption = (user: iSynConfigUser): iAutoCompleteSingle => ({
  value: user.ID,
  label: `[${user.ID}] ${user.LoginName}`,
  data: user,
});

const SynConfigUserSelector = ({
  values,
  onSelect,
  allowClear,
  isMulti = false,
}: iSynConfigUserSelector) => {
  const [optionsMap, setOptionsMap] = useState<{[key: number]: iAutoCompleteSingle}>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    SynConfigUserService.getAll({perPage: 9999, sort: 'LoginName:ASC'})
      .then(resp => {
        if (isCancelled) return;
        setOptionsMap((resp.data || []).reduce((map, user) => ({
          ...map,
          [user.ID]: translateConfigUserToOption(user),
        }), {}));
      })
      .catch(err => {
        if (isCancelled) return;
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCancelled) return;
        setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  if (isLoading) {
    return <Spinner animation={'border'} size={'sm'} />;
  }

  const selectedValues = !values ? null : values.map(value => {
    if (typeof value !== 'number') return value;
    return optionsMap[value] || {value, label: `${value}`, data: null};
  });

  return (
    <SelectBox
      options={Object.values(optionsMap)}
      isMulti={isMulti}
      onChange={onSelect}
      value={selectedValues}
      isClearable={allowClear}
    />
  );
};

export {translateConfigUserToOption};
export default SynConfigUserSelector;
