import styled from 'styled-components';
import {Form, Spinner} from 'react-bootstrap';
import React, {useState} from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import {Search} from 'react-bootstrap-icons';
import LoadingBtn from '../../../components/common/LoadingBtn';
import CommunityService from '../../../services/Synergetic/CommunityService';
import iSynCommunity from '../../../types/Synergetic/iSynCommunity';
import CommunityGridCell from '../../../components/CommunityGridCell';
import {OP_LIKE, OP_OR} from '../../../helper/ServiceHelper';
import UtilsService from '../../../services/UtilsService';


const Wrapper = styled.div``

type iSearchPanel = {
  onSelect: (community: iSynCommunity) => void;
}
const SearchPanel = ({onSelect}: iSearchPanel) => {
  const [searchText, SetSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<iSynCommunity[] | null>(null);


  const search = () => {
    const searchTxt = `${searchText || ''}`.trim();
    if (searchTxt === '') {
      return;
    }
    const where = UtilsService.isNumeric(searchTxt) ? { ID: searchTxt}: {
      [OP_OR]: [
        { OccupEmail: {[OP_LIKE]: `%${searchTxt}%`} },
        { Given1: {[OP_LIKE]: `%${searchTxt}%`} },
        { Surname: {[OP_LIKE]: `%${searchTxt}%`} },
      ],
    };
    setIsSearching(true);
    CommunityService.getCommunityProfiles({ where: JSON.stringify(where) })
      .then(resp => {
        setSearchResults(resp.data);
      })
      .finally(() => {
        setIsSearching(false)
      });
  }

  const onSearchEnterKey = (event: any) => {
    if (event.key === 'Enter') {
      search();
    }
  }

  const getSearchInputs = () => {
    return (
      <Form.Control
        placeholder="Synergetic ID, Given name, email ..."
        value={searchText}
        onChange={(event) => SetSearchText(event.target.value)}
        onKeyDown={(event) => onSearchEnterKey(event)}
      />

    )
  }

  const getSearchResults = () => {
    if (isSearching === true) {
      return <Spinner animation={'border'} />
    }
    if (searchResults === null) {
      return null;
    }
    if (searchResults.length <= 0) {
      return <h4>No result found</h4>
    }
    return (
      <>
        {searchResults.map(searchResult => {
          return (
            <CommunityGridCell
              communityProfile={searchResult}
              key={searchResult.ID}
              onClick={() => onSelect(searchResult)}
            />
          )
        })}
      </>
    )
  }

  return <Wrapper className={'search-panel'}>
    <div className={'search-methods space bottom'} />

    <div className={'search-inputs space bottom'}>
      <InputGroup>
        {getSearchInputs()}
        <LoadingBtn variant={'primary'} onClick={() => search()} isLoading={isSearching === true}>
          <Search />{' '}
          <div className={'d-none d-sm-inline-block'}>Search</div>
        </LoadingBtn>
      </InputGroup>
    </div>

    <div className={'search-results space bottom'}>
      {getSearchResults()}
    </div>

  </Wrapper>
}

export default SearchPanel;
