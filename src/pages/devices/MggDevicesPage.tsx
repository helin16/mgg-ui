import styled from 'styled-components';
import ExplanationPanel from '../../components/ExplanationPanel';
import SectionDiv from '../../components/common/SectionDiv';
import MggDeviceList from './components/MggDeviceList';
import ModuleAdminBtn from '../../components/module/ModuleAdminBtn';
import {MGGS_MODULE_ID_MGG_APP_DEVICES} from '../../types/modules/iModuleUser';
import {useState} from 'react';
import MggDevicesAdminPage from './MggDevicesAdminPage';

const Wrapper = styled.div``;
const MggDevicesPage = () => {
  const [showingAdminPage, setShowingAdmninPage] = useState(false);


  if (showingAdminPage === true) {
    return <MggDevicesAdminPage onNavBack={() => setShowingAdmninPage(false)} />
  }

  return (
    <Wrapper>
      <h3>
        MGG Internal App Devices
        <div className={'pull-right'} onClick={() => setShowingAdmninPage(true)}>
          <ModuleAdminBtn moduleId={MGGS_MODULE_ID_MGG_APP_DEVICES} />
        </div>
      </h3>
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
