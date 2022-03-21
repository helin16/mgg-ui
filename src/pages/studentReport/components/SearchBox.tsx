import React, {useState} from 'react';
import {InputGroup, FormControl, Button} from 'react-bootstrap';
import {Search} from 'react-bootstrap-icons';
import LoadingBtn from '../../../components/common/LoadingBtn';

const SearchBox = () => {
  const [searchTxt, SetSearchTxt] = useState('');
  const [isSearching, SetIsSearching] = useState(false);

  const onSearch = () => {
    SetIsSearching(true);
  }

  const search = (event: any) => {
    if (event.key === 'Backspace') {
      return SetSearchTxt(`${searchTxt}`.slice(0, -1));
    }

    if (event.key === 'Enter') {
      return onSearch();
    }
    return SetSearchTxt(`${searchTxt}${event.key}` || '');
  }

  return (
    <div className={'search-box-wrapper'}>
      <div className={'search-bar'}>
        <InputGroup className="mb-3">
          <FormControl
            disabled={isSearching === true}
            placeholder="Name of student or homeroom (e.g. 'Amanda', '9C')"
            value={searchTxt}
            onChange={(event) => {}}
            onKeyUp={(event) => search(event)}
          />
          <LoadingBtn variant={'primary'} isLoading={isSearching} onClick={() => onSearch()}><Search /></LoadingBtn>
        </InputGroup>
      </div>
    </div>
  )
};

export default SearchBox;
