import styled from 'styled-components';
import PageNotFound from '../../components/PageNotFound';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/makeReduxStore';
import {useEffect, useState, useCallback} from 'react';
import iPowerBIReport from '../../types/PowerBI/iPowerBIReport';
import PowerBIService from '../../services/PowerBIService';
import Toaster from '../../services/Toaster';
import PageLoadingSpinner from '../../components/common/PageLoadingSpinner';
import PowerBIReportViewer from '../../components/powerBI/PowerBIReportViewer';
import Page401 from '../../components/Page401';
import {FlexContainer} from '../../styles';
import {Button} from 'react-bootstrap';
import * as Icons from "react-bootstrap-icons";

const Wrapper = styled.div`
    .full-page {
        position: absolute;
        left: 0px;
        right: 0px;
        top: 0px;
        bottom: 0px;
        height: 100vh !important;
        width: 100% !important;
        z-index: 99999999999;
    }
`;

type iPowerBIReportViewingPage = {
  reportId?: string;
}
const PowerBIReportViewingPage = ({reportId}: iPowerBIReportViewingPage) => {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [reportObj, setReportObj] = useState<iPowerBIReport | undefined | null>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowingFullPage, setIsShowingFullPage] = useState(false);

  useEffect(() => {
    if (!reportId || `${reportId || ''}`.trim() === '') {
      setReportObj(null);
      setIsLoading(false);
      return;
    }

    let isCanceled = false;
    setIsLoading(true);
    PowerBIService.getById(reportId)
      .then(resp => {
        if (isCanceled) {return};
        setReportObj(resp);
      })
      .catch(err => {
        if (isCanceled) {return};
        Toaster.showToast(err);
      })
      .finally(() => {
        if (isCanceled) {return};
        setIsLoading(false);
      })

    return () => {
      isCanceled = true;
    }

  }, [reportId])

  const handleEscKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsShowingFullPage(false);
      }
    },
    []
  );

  useEffect(() => {
    document.addEventListener('keydown', handleEscKeyPress);

    return () => {
      document.removeEventListener('keydown', handleEscKeyPress);
    };
  }, [handleEscKeyPress]);

  const checkAccess = () => {
    if (!currentUser?.id) {
      return false;
    }

    if (reportObj?.settings.isToAll === true && currentUser?.id) {
      return true;
    }

    const specificUserIds = (reportObj?.settings?.userIds || []);
    if (specificUserIds.indexOf(currentUser?.synergyId || 0) >=0) {
      return true;
    }

    if (reportObj?.settings.isToAllStudents === true && currentUser?.isStudent === true) {
      return true;
    }

    if (reportObj?.settings.isToAllTeachers === true && currentUser?.isTeacher === true) {
      return true;
    }

    if (reportObj?.settings.isToAllNonTeaching === true && (currentUser?.isStaff === true && currentUser?.isTeacher !== true && currentUser?.isCasualStaff !== true)) {
      return true;
    }

    if (reportObj?.settings.isToAllCasualStaff === true && currentUser?.isCasualStaff === true) {
      return true;
    }

    if (reportObj?.settings.isToAllParents === true && currentUser?.isParent === true) {
      return true;
    }

    return false;
  }

  if (isLoading === true || reportObj === undefined) {
    return <PageLoadingSpinner text={<p>Loading report...</p>}/>
  }

  if (reportObj === null || !reportObj.externalId || `${reportObj.externalId || ''}`.trim() === '') {
    return <PageNotFound title={'Report Not Found'} description={`The power BI(reportId=${reportId || ''})not found`} />
  }

  if (checkAccess() !== true) {
    return <Page401 description={<p>You don't have access to this report<br /><b>{reportObj?.name || ''}</b>, <br />id: {reportId || ''}.</p>} />
  }

  return (
    <Wrapper>
      <FlexContainer className={'justify-content-between'}>
        <h3>{reportObj?.name || ''}</h3>
        <div>
          <Button size={'sm'} variant={'link'} onClick={() => setIsShowingFullPage(true)} style={{lineHeight: 1}}>
            <Icons.ArrowsFullscreen /> Full screen<br />
            <small>(ESC key to exit full screen mode after)</small>
          </Button>
        </div>
      </FlexContainer>
      <PowerBIReportViewer reportId={reportObj.externalId} className={isShowingFullPage === true ? 'full-page' : undefined}/>
    </Wrapper>
  )
}

export default PowerBIReportViewingPage
