import React, {useState} from 'react';
import styled from 'styled-components';
import {Tabs, Tab} from 'react-bootstrap';
import SchoolManagementTable from './SchoolManagementTable';
import MessageListPanel from '../common/MessageListPanel';
import {MESSAGE_TYPE_TERM_ROLLING} from '../../types/Message/iMessage';

type iSchoolManagementPanel = {
  title?: any
}
const Wrapper = styled.div`
  .tab-pane {
    padding: 1rem 0;
  }
`;

const TAB_TABLE = 'table';
const TAB_LOGS = 'logs';
const SchoolManagementPanel = ({title}: iSchoolManagementPanel) => {
  const [viewingTab, setViewingTab] = useState(TAB_TABLE)
  return (
    <Wrapper>
      {title}
      <Tabs
        activeKey={viewingTab}
        onSelect={(name) => setViewingTab(name || TAB_TABLE)}
      >
        <Tab eventKey={TAB_TABLE} title="Records">
          <SchoolManagementTable />
        </Tab>
        <Tab eventKey={TAB_LOGS} title="Logs">
          <h5>Logs of term rolling</h5>
          <MessageListPanel type={MESSAGE_TYPE_TERM_ROLLING} />
        </Tab>
      </Tabs>
    </Wrapper>
  )
}

export default SchoolManagementPanel;
