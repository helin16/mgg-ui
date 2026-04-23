import {Spinner} from 'react-bootstrap';
import AutoComplete, {iAutoCompleteSingle} from '../common/AutoComplete';
import iSynCommunity from '../../types/Synergetic/iSynCommunity';
import {useEffect, useState} from 'react';
import {OP_LIKE, OP_OR} from '../../helper/ServiceHelper';
import SynCommunityService from '../../services/Synergetic/Community/SynCommunityService';
import Toaster from '../../services/Toaster';


type iCommunityAutoComplete = {
  isDisabled?: boolean;
  onSelect?: (option: iAutoCompleteSingle | iAutoCompleteSingle[] | null) => void;
  value?: number;
  allowClear?: boolean;
}
const CommunityAutoComplete = ({isDisabled, onSelect, value, allowClear}: iCommunityAutoComplete) => {
  const [isLoading, setIsLoading] = useState(false);
  const [preSelectedValue, setPreSelectedValue] = useState<iSynCommunity | null>(null);

  useEffect(() => {
    const ID = `${value || ''}`.trim();
    if (ID === '') {
      setPreSelectedValue(null);
      return;
    }
    let isCanceled = false;
    setIsLoading(true);
    SynCommunityService.getCommunityProfiles({
        where: JSON.stringify({ID}),
      })
      .then(resp => {
        if (isCanceled) return;
        const profiles = (resp.data || []);
        setPreSelectedValue(profiles.length > 0 ? profiles[0] : null);
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

  const convertToOption = (communityProfile: iSynCommunity) => {
    return {
      label: `[${communityProfile.ID}] ${communityProfile.Given1} ${communityProfile.Surname}`,
      data: communityProfile,
      value: communityProfile.ID,
    }
  }

  const renderOptionItem = (options: iSynCommunity[]) => {
    return options.map(option => convertToOption(option));
  }

  const handleSearchFn = (searchText: string) => {
    return SynCommunityService.getCommunityProfiles({
      where: JSON.stringify({
        [OP_OR]: [
          {NameInternal: { [OP_LIKE]: `%${searchText}%` }},
          {NameExternal: { [OP_LIKE]: `%${searchText}%` }},
          {PreferredFormal: { [OP_LIKE]: `%${searchText}%` }},
          {OccupEmail: { [OP_LIKE]: `%${searchText}%` }},
          {ID: { [OP_LIKE]: `%${searchText}%` }},
        ]
      })
    }).then(resp => resp.data || [])
  }

  if (isLoading) {
    return <Spinner animation={'border'} />
  }

  return (
    <AutoComplete
      isDisabled={isDisabled}
      onSelected={onSelect}
      allowClear={allowClear}
      value={preSelectedValue ? convertToOption(preSelectedValue) : undefined}
      placeholder={'Search community ...'}
      handleSearchFn={handleSearchFn}
      renderOptionItemFn={renderOptionItem}
    />
  )
}

export default CommunityAutoComplete;
