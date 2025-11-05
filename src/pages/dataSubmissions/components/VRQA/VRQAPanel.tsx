import styled from 'styled-components';
import EnrolmentsProjectedNumbers from '../../../../components/Enrollments/EnrolmentsProjectedNumbers';
import SectionDiv from '../../../../components/common/SectionDiv';
import {Tab, Tabs} from 'react-bootstrap';
import {useState} from 'react';
import ShortTermStayNumbers from '../../../../components/Enrollments/ShortTermStayNumbers';
import RetentionsPanel from '../../../../components/Enrollments/RetentionsPanel';

enum TabNames {
  FutureNumbers= 'FutureNumbers',
  ShortTermStay= 'ShortTermStay',
  Retentions= 'Retentions',
}
const Wrapper = styled.div``
const VRQAPanel = () => {
  const [selectedTab, setSelectedTab] = useState<TabNames>(TabNames.FutureNumbers);
  return (
    <Wrapper>
      <Tabs
        variant={'pills'}
        activeKey={selectedTab}
        onSelect={(tab) => setSelectedTab(tab as TabNames || TabNames.FutureNumbers)}
        unmountOnExit
      >
        <Tab eventKey={TabNames.FutureNumbers} title={'Future Numbers'}>
          <SectionDiv>
            <EnrolmentsProjectedNumbers />
          </SectionDiv>
        </Tab>

        <Tab eventKey={TabNames.ShortTermStay} title={'Short Term Stay Numbers'}>
          <SectionDiv>
            <ShortTermStayNumbers />
          </SectionDiv>
        </Tab>

        <Tab eventKey={TabNames.Retentions} title={'Retentions'}>
          <SectionDiv>
            <RetentionsPanel />
          </SectionDiv>
        </Tab>
      </Tabs>
    </Wrapper>
  )
}

export default VRQAPanel;
