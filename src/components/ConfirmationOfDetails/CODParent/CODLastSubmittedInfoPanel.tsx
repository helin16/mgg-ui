import {useEffect, useState} from 'react';
import iConfirmationOfDetailsResponse from '../../../types/ConfirmationOfDetails/iConfirmationOfDetailsResponse';
import Toaster from '../../../services/Toaster';
import ConfirmationOfDetailsResponseService
  from '../../../services/ConfirmationOfDetails/ConfirmationOfDetailsResponseService';
import {OP_NOT} from '../../../helper/ServiceHelper';
import PageLoadingSpinner from '../../common/PageLoadingSpinner';
import styled from 'styled-components';
import {Alert} from 'react-bootstrap';
import moment from 'moment-timezone';
import SynCommunityService from '../../../services/Synergetic/Community/SynCommunityService';

type iCODLastSubmittedInfoPanel = {
  studentId: number;
}

const Wrapper = styled.div``;
const CODLastSubmittedInfoPanel = ({studentId}: iCODLastSubmittedInfoPanel) => {
  const [isLoading, setIsLoading] = useState(false);
  const [codResponse, setCodResponse] = useState<iConfirmationOfDetailsResponse | null>(null);

  useEffect(() => {

    const getData = async () => {
      const resp = await ConfirmationOfDetailsResponseService.getAll({
        where: JSON.stringify({StudentID: studentId, submittedAt: {[OP_NOT]: null}}),
        sort: 'submittedAt:DESC',
        perPage: 1,
      });
      const data = resp.data || [];
      const response = data.length > 0 ? data[0] : null;
      if (response === null) {
        return;
      }

      const communityResp = await SynCommunityService.getCommunityProfiles({
        where: JSON.stringify({ID: [response.StudentID, response.submittedById || ''].filter(id => `${id}`.trim() !== '')}),
      })
      const profileMap = (communityResp.data || []).reduce((map: any, profile) => {
        return {
          ...map,
          [profile.ID]: profile
        }
      }, {});
      setCodResponse({
        ...response,
        Student: studentId in profileMap ? profileMap[studentId] : null,
        SubmittedBy: (response.submittedById || '') in profileMap ? profileMap[response.submittedById || ''] : null,
      });
    }

    let isCanceled = false;
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

  }, [studentId]);

  const getLastResponsePanel = () => {
    if (isLoading) {
      return <PageLoadingSpinner />
    }

    if (!codResponse) {
      return (<Alert variant={'warning'}>Can't find any last submission</Alert>)
    }

    return (
      <Alert variant={'success'}>
        <h6>Last Submission for {
          // @ts-ignore
          codResponse?.Student?.NameInternal || ''
        } [{studentId}]</h6>
        <div><b>By:</b> {codResponse?.SubmittedBy?.NameInternal || ''}</div>
        {`${codResponse?.submittedAt || ''}`.trim() === '' ? null : (<div><b>@:</b> {moment(`${codResponse?.submittedAt || ''}`.trim()).format('ll')}</div>)}
      </Alert>
    )
  }

  return (
    <Wrapper>{getLastResponsePanel()}</Wrapper>
  )
}

export default CODLastSubmittedInfoPanel;
