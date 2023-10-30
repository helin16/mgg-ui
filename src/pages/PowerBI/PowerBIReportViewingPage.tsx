import styled from 'styled-components';
import PageNotFound from '../../components/PageNotFound';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/makeReduxStore';
import {useEffect, useState} from 'react';
import iPowerBIReport from '../../types/PowerBI/iPowerBIReport';
import PowerBIService from '../../services/PowerBIService';
import Toaster from '../../services/Toaster';
import PageLoadingSpinner from '../../components/common/PageLoadingSpinner';
import PowerBIReportViewer from '../../components/powerBI/PowerBIReportViewer';
import Page401 from '../../components/Page401';

const Wrapper = styled.div``;

type iPowerBIReportViewingPage = {
  reportId?: string;
}
const PowerBIReportViewingPage = ({reportId}: iPowerBIReportViewingPage) => {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [reportObj, setReportObj] = useState<iPowerBIReport | undefined | null>(undefined);
  const [isLoading, setIsLoading] = useState(false);

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
      <h3>{reportObj?.name || ''}</h3>
      <PowerBIReportViewer reportId={reportObj.externalId} />
    </Wrapper>
  )
}

export default PowerBIReportViewingPage
