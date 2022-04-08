import React, {useEffect, useRef, useState} from 'react';
import {InputGroup, FormControl} from 'react-bootstrap';
import {Search} from 'react-bootstrap-icons';
import LoadingBtn from '../../../components/common/LoadingBtn';
import StudentService from '../../../services/StudentService';
import iVStudent from '../../../types/student/iVStudent';
import styled from 'styled-components';
import PanelTitle from '../../../components/PanelTitle';
import EmptyState from '../../../components/common/EmptyState';


const Wrapper = styled.div`
  .search-result {
    .search-result-item {
      border-bottom: 1px solid #ddd !important;
      padding: 0.5rem;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      :hover {
        background-color: #f5f5f5 !important;
      }
      :nth-child(2n+1) {
        background-color: #f9f9f9;
      }
    }
  }
`
const SearchPage = ({onSelect}: {onSelect: (student: iVStudent) => void}) => {
  const innerRef = useRef();
  const [searchTxt, setSearchTxt] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [students, setStudents] = useState<iVStudent[] | undefined>(undefined);

  // @ts-ignore
  useEffect(() => innerRef.current && innerRef.current.focus());

  const onSearch = () => {
    if (`${searchTxt}`.trim() === '') {
      return;
    }
    setIsSearching(true);
    StudentService.searchStudents(searchTxt)
      .then(resp => {
        setIsSearching(false);
        setStudents(resp
          .sort((stu1, stu2) => {
            return (stu1.StudentSurname > stu2.StudentSurname) ? 1 : -1
          })
        )
      })
  }

  const search = (event: any) => {
    if (event.key === 'Enter') {
      return onSearch();
    }
    return true;
  }

  const getStudentSearchResults = () => {
    if (students === undefined) {
      return null;
    }
    if (students.length <= 0) {
      return <EmptyState
        title={'No Students found'}
        description={'Please refine your search and try again.'}
        hideLogo
      />;
    }
    return (
      <div className={'student-search-result'}>
        {/*// @ts-ignore*/}
        <p ref={innerRef}>Click on any of the students listed below to view their academic reports.</p>
        <PanelTitle>Search Result</PanelTitle>
        <div className={'search-result'}>
          {students.map(student => (
            <div
              key={student.StudentID}
              onClick={() => onSelect(student)}
              className={'search-result-item'}>
              <div className={'left'}>
                {student.StudentSurname}, {student.StudentGiven1} ({student.StudentPreferred}) - {student.StudentID}
              </div>
              <div className={'right'}>
                {student.StudentForm}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Wrapper className={'search-box-wrapper'}>
      <h3>Student Report</h3>
      <p>Welcome to the student academic report viewer. Type the homeroom or name of the student you want to locate below.</p>
      <div className={'search-bar'}>
        <InputGroup className="mb-3">
          <FormControl
            disabled={isSearching === true}
            placeholder="Name of student, homeroom (e.g. 'Amanda', '9C') or Student ID..."
            value={searchTxt}
            onChange={(event) => setSearchTxt(event.target.value)}
            onKeyUp={(event) => search(event)}
          />
          <LoadingBtn variant={'primary'} isLoading={isSearching} onClick={() => onSearch()}><Search /></LoadingBtn>
        </InputGroup>
      </div>
      {getStudentSearchResults()}
    </Wrapper>
  )
};

export default SearchPage;
