import styled from 'styled-components';
import {Form, Spinner} from 'react-bootstrap';
import React, {useState} from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import {Search, ArrowDown} from 'react-bootstrap-icons';
import LoadingBtn from '../../../components/common/LoadingBtn';
import SynCommunityService from '../../../services/Synergetic/Community/SynCommunityService';
import iSynCommunity from '../../../types/Synergetic/iSynCommunity';
import CommunityGridCell from '../../../components/CommunityGridCell';
import {OP_LIKE, OP_OR} from '../../../helper/ServiceHelper';
import UtilsService from '../../../services/UtilsService';
import iPaginatedResult from '../../../types/iPaginatedResult';
import MathHelper from '../../../helper/MathHelper';


const Wrapper = styled.div``

type iSearchPanel = {
  onSelect: (community: iSynCommunity) => void;
}
const SearchPanel = ({onSelect}: iSearchPanel) => {
  const [searchText, SetSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchResults, setSearchResults] = useState<iPaginatedResult<iSynCommunity> | null>(null);


  const search = (currentPage: number) => {
    const searchTxt = `${searchText || ''}`.trim();
    if (searchTxt === '') {
      return;
    }
    const where = UtilsService.isNumeric(searchTxt) ? { ID: searchTxt}: {
      [OP_OR]: [
        { OccupEmail: {[OP_LIKE]: `${searchTxt}%`} },
        { Given1: {[OP_LIKE]: `${searchTxt}%`} },
        { Surname: {[OP_LIKE]: `${searchTxt}%`} },
      ]
    };
    setIsSearching(currentPage === 1);
    setIsLoadingMore(currentPage > 1);
    SynCommunityService.getCommunityProfiles({
        currentOnly: 'true',
        currentPage: `${currentPage}`,
        where: JSON.stringify(where),
        sort: 'ID:DESC',
      })
      .then(resp => {
        if (currentPage > 1) {
          setSearchResults({...resp, data: [...(searchResults?.data || []), ...resp.data]});
        } else {
          setSearchResults(resp);
        }
      })
      .finally(() => {
        setIsSearching(false);
        setIsLoadingMore(false);
      });
  }

  const onSearchEnterKey = (event: any) => {
    if (event.key === 'Enter') {
      search(1);
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

  const getMoreBtnDiv = () => {
    if (!searchResults) { return null }
    if (searchResults?.currentPage >= searchResults?.pages) {
      return null;
    }
    return (
      <div className={'text-center'}>
        <LoadingBtn
          variant={'outline-secondary'}
          onClick={() => {search(MathHelper.add(searchResults?.currentPage, 1))}}
          isLoading={isLoadingMore === true}>
          <ArrowDown />{' '}
          <div className={'d-none d-sm-inline-block'}>Show More</div>
        </LoadingBtn>
      </div>
    )
  }

  const getSearchResults = () => {
    if (isSearching === true) {
      return <Spinner animation={'border'} />
    }
    if (searchResults === null) {
      return null;
    }
    if (searchResults.data.length <= 0) {
      return <h4>No result found</h4>
    }
    return (
      <>
        {searchResults.data.map(searchResult => {
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
        <LoadingBtn variant={'primary'} onClick={() => {search(1)}} isLoading={isSearching === true}>
          <Search />{' '}
          <div className={'d-none d-sm-inline-block'}>Search</div>
        </LoadingBtn>
      </InputGroup>
    </div>

    <div className={'search-results space bottom'}>
      {getSearchResults()}
      {getMoreBtnDiv()}
    </div>

  </Wrapper>
}

export default SearchPanel;
