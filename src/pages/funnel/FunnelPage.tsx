import styled from 'styled-components';
import React, {useState} from 'react';
import ModuleAdminBtn from '../../components/module/ModuleAdminBtn';
import {MGGS_MODULE_ID_FUNNEL} from '../../types/modules/iModuleUser';
import FunnelAdminPage from './FunnelAdminPage';
import StudentNumberForecastDashboard
  from '../../components/reports/StudentNumberForecast/StudentNumberForecastDashboard';
const Wrapper = styled.div``;
const FunnelPage = () => {
  const [showingAdminPage, setShowingAdminPage] = useState(false);

  const getContent = () => {

    if (showingAdminPage === true) {
      return <FunnelAdminPage onRedirectBack={() => setShowingAdminPage(false)} />
    }

    return (
      <>
        <h3>
          Funnel
          <ModuleAdminBtn
            moduleId={MGGS_MODULE_ID_FUNNEL}
            className={'float-right'}
            onClick={() => setShowingAdminPage(true)}
          />
        </h3>
        <div className={'section-row'}>
          <StudentNumberForecastDashboard />
        </div>
      </>
    )
  }

  return (
    <Wrapper>
      {getContent()}
    </Wrapper>
  );
}

export default FunnelPage;
