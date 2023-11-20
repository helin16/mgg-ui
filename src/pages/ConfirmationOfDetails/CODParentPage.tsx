import {useSelector} from 'react-redux';
import {RootState} from '../../redux/makeReduxStore';
import {Alert} from 'react-bootstrap';
import styled from 'styled-components';
import React, {useEffect, useState} from 'react';
import SynCommunityService from '../../services/Synergetic/Community/SynCommunityService';
import {OP_OR} from '../../helper/ServiceHelper';
import StudentContactService from '../../services/Synergetic/Student/StudentContactService';
import {
  STUDENT_CONTACT_TYPE_SC1,
} from '../../types/Synergetic/Student/iStudentContact';
import * as _ from 'lodash';
import Toaster from '../../services/Toaster';
import SynVActivityService from '../../services/Synergetic/SynVActivityService';
import iSynVActivity, {SYN_ACTIVITY_CODE_CD_READY, SYN_ACTIVITY_CODE_CD_SUBMITTED} from '../../types/Synergetic/iSynVActivity';
import PageLoadingSpinner from '../../components/common/PageLoadingSpinner';
import PageNotFound from '../../components/PageNotFound';
import Page401 from '../../components/Page401';
import CODLastSubmittedInfoPanel from '../../components/ConfirmationOfDetails/CODParent/CODLastSubmittedInfoPanel';
import StudentGridForAParent from '../../components/student/StudentGridForAParent';
import CODParentSubmitForm from '../../components/ConfirmationOfDetails/CODParent/CODParentSubmitForm';

type iActivityMap = {[key: number]: iSynVActivity[]};
const Wrapper = styled.div`
  .mobile-screen-alert {
    display: none;
    @media only print, screen and (max-width: 758px) {
      display: block;
    }
  }

  .pc-screen {
    @media only print, screen and (max-width: 758px) {
      display: none;
    }
  }
`;
const CODParentPage = () => {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [needCDStudentIds, setNeedCDStudentIds] = useState<number[] | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

  useEffect(() => {
    const parentSynId = `${currentUser?.synergyId || ''}`.trim();
    if (parentSynId === '') {
      setNeedCDStudentIds(null);
      return;
    }

    let isCanceled = false;
    const getData = async () => {
      const parentsCommunityProfiles = await SynCommunityService.getCommunityProfiles({
        where: JSON.stringify({ [OP_OR]: [ {SpouseID: parentSynId}, {ID: parentSynId} ] })
      })
      const parentIds: number[] = [];
      (parentsCommunityProfiles.data || []).forEach(profile => {
        parentIds.push(Number(profile.ID));
        parentIds.push(Number(profile.SpouseID));
      });
      if (parentIds.length <= 0) {
        setNeedCDStudentIds(null);
        setSelectedStudentId(null);
        return;
      }

      const contacts = await StudentContactService.getStudentContacts({
        where: JSON.stringify({
          LinkedID:  _.uniq(parentIds),
          ContactType: [STUDENT_CONTACT_TYPE_SC1],
        }),
      });

      const studentIds = _.uniq((contacts.data || []).map(studentContact => studentContact.ID ));
      if (studentIds.length <= 0) {
        setNeedCDStudentIds(null);
        setSelectedStudentId(null);
        return;
      }

      const activities = await Promise.all(studentIds.map(studentId => SynVActivityService.getAllById(studentId, {
        where: JSON.stringify({Activity: [SYN_ACTIVITY_CODE_CD_READY]}),
        perPage: 999999,
      })));
      const studentActivities = activities.map(resp => (resp.data || [])).reduce((arr, data) => ([...arr, ...data]), []);
      const activityMap: iActivityMap = studentActivities.reduce((map: iActivityMap, studentActivity) => {
        const studentId = studentActivity.ID;
        return {
          ...map,
          [studentId]: [...(studentId in map ? map[studentId] : []), studentActivity],
        }
      }, {});

      const needCDStudIds: number[] = [];
      const studIds: number[] = _.uniq(Object.keys(activityMap)).map(id => Number(id));
      // @ts-ignore
      studIds.forEach((studentId: number) => {
        // @ts-ignore
        const studentActs: iSynVActivity[] = activityMap[studentId] || [];
        const cdReady = studentActs.filter(studentAct => studentAct.Activity === SYN_ACTIVITY_CODE_CD_READY);
        const cdSubmitted = studentActs.filter(studentAct => studentAct.Activity === SYN_ACTIVITY_CODE_CD_SUBMITTED);
        if (cdReady.length > cdSubmitted.length) {
          needCDStudIds.push(studentId);
        }
      })

      const ids = _.uniq(needCDStudIds);
      setNeedCDStudentIds(ids);

      if (ids.length === 1) {
        setSelectedStudentId(ids[0]);
      } else if (ids.length < 1) {
        setSelectedStudentId(studIds.length > 0 ? studIds[0] : null);
      } else {
        setSelectedStudentId(null);
      }
    }

    setIsLoading(true);
    getData()
      .catch(err => {
        if (isCanceled) {return}
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCanceled) {return}
        setIsLoading(false);
      })

    return () => {
      isCanceled = false
    }
  }, [currentUser])


  const getScreenAlert = () => {
    const alertMsg = 'Please use a computer to complete this form and not the School App or your phone.';
    return (
      <div className={'mobile-screen-alert'}>
        <Alert variant={'danger'}>
          <strong>{alertMsg}</strong>
        </Alert>
        <PageNotFound title={'Use Computer ONLY'} description={alertMsg}/>
      </div>
    )
  }

  const getPcPanel = () => {
    if (!Array.isArray(needCDStudentIds)) {
      return <Page401 description={`Can't find any students.`} title={'No student found'}/>
    }

    if (selectedStudentId !== null) {
      if (needCDStudentIds.indexOf(selectedStudentId) >=0 ) {
        return <CODParentSubmitForm studentId={selectedStudentId} />;
      }
      return <CODLastSubmittedInfoPanel studentId={selectedStudentId} />;
    }

    if (currentUser?.synergyId) {
      return (
        <>
          <StudentGridForAParent
            parentSynId={currentUser?.synergyId}
            onSelect={student => setSelectedStudentId(student.StudentID)}
            contactTypes={[
              STUDENT_CONTACT_TYPE_SC1,
            ]}
          />
          {needCDStudentIds.length > 0 ? <Alert variant={'success'}>Both Student profile has been submitted.</Alert>: null}
        </>
      );
    }

    return null;
  }

  const getContent = () => {
    if (isLoading === true) {
      return <PageLoadingSpinner />
    }

    return (
      <>
        {getScreenAlert()}
        <div className={'pc-screen'}>
          {getPcPanel()}
        </div>
      </>
    )
  }

  return (
    <Wrapper>
      {getContent()}
    </Wrapper>
  )
}

export default CODParentPage;
