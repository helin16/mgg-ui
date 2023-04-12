import styled from 'styled-components';
import ExplanationPanel from '../../components/ExplanationPanel';
import React, {useState} from 'react';
import ModuleAdminBtn from '../../components/module/ModuleAdminBtn';
import {MGGS_MODULE_ID_FUNNEL} from '../../types/modules/iModuleUser';
import FunnelAdminPage from './FunnelAdminPage';
import StudentNumberForecastDashboard
  from '../../components/reports/StudentNumberForecast/StudentNumberForecastDashboard';
import {
  FUNNEL_STAGE_NAME_CLOSED_WON,
  FUNNEL_STAGE_NAME_APPLICATION_RECEIVED,
  FUNNEL_STAGE_NAME_STUDENT_LEARNING_PROFILE,
  FUNNEL_STAGE_NAME_INTERVIEW,
  FUNNEL_STAGE_NAME_OFFER_SENT,
  FUNNEL_STAGE_NAME_ENQUIRY, FUNNEL_STAGE_NAME_SCHOOL_VISIT
} from '../../types/Funnel/iFunnelLead';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/makeReduxStore';
import MathHelper from '../../helper/MathHelper';
import moment from 'moment-timezone';
const Wrapper = styled.div``;
const FunnelPage = () => {
  const {user} = useSelector((state: RootState) => state.auth);
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
        <ExplanationPanel
          text={
            <>
              All number below are excluding Leavers.
              <ul>
                <li><b>Current Student</b>: the number of student currently</li>
                <li><b>Confirmed</b>: the number of leads from Funnel with status: {FUNNEL_STAGE_NAME_CLOSED_WON} & {FUNNEL_STAGE_NAME_APPLICATION_RECEIVED}</li>
                <li><b>In Progress</b>: the number of leads from Funnel with status: {FUNNEL_STAGE_NAME_STUDENT_LEARNING_PROFILE}, {FUNNEL_STAGE_NAME_INTERVIEW} & {FUNNEL_STAGE_NAME_OFFER_SENT}</li>
                <li><b>Future {MathHelper.add(user?.SynCurrentFileSemester?.FileYear || moment().year(), 1)}</b>: = Current Student on Lower Year Level + Confirmed.</li>
                <li><b>Leads & Tours</b>: the number of leads from Funnel with status: {FUNNEL_STAGE_NAME_ENQUIRY}, {FUNNEL_STAGE_NAME_SCHOOL_VISIT} & {FUNNEL_STAGE_NAME_APPLICATION_RECEIVED}</li>
              </ul>
            </>
          }
        />
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
