import Page from "../../../layouts/Page";
import StudentList from "./components/StudentList";
import StudentListSearchPanel from "./components/StudentListSearchPanel";
import { useState } from "react";
import styled from 'styled-components';


const Wrapper = styled.div`
  .search-panel {
    margin-bottom: 1rem;
  }
  
  .student-list-wrapper {
    .table-responsive {
      min-height: 20rem;
    }
  }
`;

const StudentListPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({});
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
