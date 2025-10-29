import styled from 'styled-components';
import EnrolmentsProjectedNumbers from '../../../../components/Enrollments/EnrolmentsProjectedNumbers';
import SectionDiv from '../../../../components/common/SectionDiv';
import {Tab, Tabs} from 'react-bootstrap';
import {useState} from 'react';
import ShortTermStayNumbers from '../../../../components/Enrollments/ShortTermStayNumbers';

enum TabNames {
  FutureNumbers= 'FutureNumbers',
  ShortTermStay= 'ShortTermStay',
}
const Wrapper = styled.div``
const VRTQAPanel = () => {
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
      </Tabs>
    </Wrapper>
  )
}

export default VRTQAPanel;
