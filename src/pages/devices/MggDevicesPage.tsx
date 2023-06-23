import styled from 'styled-components';
import ExplanationPanel from '../../components/ExplanationPanel';
import SectionDiv from '../../components/common/SectionDiv';
import MggDeviceList from './components/MggDeviceList';

const Wrapper = styled.div``;
const MggDevicesPage = () => {
  return (
    <Wrapper>
      <h3>MGG Internal App Devices</h3>
      <ExplanationPanel
        variant={'info'}
        text={
          <>
            <b>MGG Devices App Registry</b>
            <div>
              You need to register your app, before you sign into the MGG Internal APP.
            </div>
          </>
        }
      />
      <SectionDiv>
        <MggDeviceList />
      </SectionDiv>
    </Wrapper>
  )
}

export default MggDevicesPage;
