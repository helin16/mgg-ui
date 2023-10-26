import Page from "../../../layouts/Page";
import StudentList from "./components/StudentList";
import StudentListSearchPanel from "./components/StudentListSearchPanel";
import React, { useState } from "react";
import styled from 'styled-components';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/makeReduxStore';
import Page401 from '../../../components/Page401';


const Wrapper = styled.div`
  .search-panel {
    margin-bottom: 2rem;
  }
  
  .student-list-wrapper {
    .table-responsive {
      min-height: 20rem;
    }
  }
`;

const StudentListPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({});

  if (user?.isStaff !== true) {
    return (
      <Page401
        title={"Access to staff only"}
        description={<h4>Please contact IT or Module Admins for assistant</h4>}
      />
    )
  }

  // if (user?.isTeacher !== true) {
  //   return (
  //     <Page401
  //       title={"Access to Teachers and Admins only"}
  //       description={<h4>Please contact IT or Module Admins for assistant</h4>}
  //     />
  //   )
  // }

  return (
    <Page>
      <Wrapper>
        <h3>Student List</h3>
        <StudentListSearchPanel
          className={'search-panel'}
          onSearch={setSearchCriteria}
          isLoading={isLoading}
        />
        <StudentList
          searchCriteria={searchCriteria}
          isSearching={isLoading}
          onSearching={isSearching => setIsLoading(isSearching)}
        />
      </Wrapper>
    </Page>
  );
};

export default StudentListPage;
