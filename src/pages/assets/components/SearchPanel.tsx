import styled from 'styled-components';
import {Form, Spinner} from 'react-bootstrap';
import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import {Search} from 'react-bootstrap-icons';
import LoadingBtn from '../../../components/common/LoadingBtn';
import CommunityService from '../../../services/Synergetic/CommunityService';
import iSynCommunity from '../../../types/Synergetic/iSynCommunity';
import CommunityGridCell from '../../../components/CommunityGridCell';


const Wrapper = styled.div``

const SEARCH_METHOD_ID = 'id';
const SEARCH_METHOD_EMAIL = 'email';
const initialSearchCriteria = {
  id: '',
  email: '',
}

type iSearchPanel = {
  onSelect: (community: iSynCommunity) => void;
}
const SearchPanel = ({onSelect}: iSearchPanel) => {
  const [searchMethod, setSearchMethod] = useState(SEARCH_METHOD_ID);
  const [searchCriteria, setSearchCriteria] = useState(initialSearchCriteria);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<iSynCommunity[] | null>(null);

  const getButtonVariant = (method: string) => {
    if (method === searchMethod) {
      return 'primary';
    }
    return 'light';
  }

  const changeSearchMethod = (newMethod: string) => {
    if (newMethod === searchMethod) {
      return;
    }
    setSearchCriteria(initialSearchCriteria);
    setSearchResults(null);
    setSearchMethod(newMethod)
  }

  const onSearchInputChange = (fieldName: string, value: string) => {
    setSearchCriteria({
      ...searchCriteria,
      [fieldName]: value,
    })
  }

  const search = () => {
    const searchId = `${searchCriteria.id || ''}`.trim();
    const searchEmail = `${searchCriteria.email || ''}`.trim();
    if (searchId === '' && searchEmail === '') {
      return;
    }
    const where = searchId !== '' ? { ID: searchId } : { OccupEmail: `${searchEmail}@mentonegirls.vic.edu.au` };
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
    if (searchMethod === SEARCH_METHOD_ID) {
      return (
        <Form.Control
          placeholder="Please provide the Synergetic ID or Student ID or Staff ID..."
          value={searchCriteria.id}
          onChange={(event) => onSearchInputChange('id', event.target.value)}
          onKeyDown={(event) => onSearchEnterKey(event)}
        />

      )
    }
    return (
      <>
        <Form.Control
          placeholder="Your email address..."
          value={searchCriteria.email}
          onChange={(event) => onSearchInputChange('email', event.target.value)}
          onKeyDown={(event) => onSearchEnterKey(event)}
        />
        <InputGroup.Text>@mentonegirls.vic.edu.au</InputGroup.Text>
      </>
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
    <div className={'search-methods space bottom'}>
      <ButtonGroup aria-label="search-methods">
        <Button variant={getButtonVariant(SEARCH_METHOD_ID)} onClick={() => changeSearchMethod(SEARCH_METHOD_ID)}>Synergetic ID</Button>
        <Button variant={getButtonVariant(SEARCH_METHOD_EMAIL)} onClick={() => changeSearchMethod(SEARCH_METHOD_EMAIL)}>Email</Button>
      </ButtonGroup>
    </div>

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
