import {Button, Table} from 'react-bootstrap';
import React, {useState, useEffect} from 'react';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iAlumniRequest from '../../../types/Alumni/iAlumniRequest';
import AlumniRequestService from '../../../services/Alumni/AlumniRequestService';
import Toaster from '../../../services/Toaster';
import PageLoadingSpinner from '../../../components/common/PageLoadingSpinner';
import styled from 'styled-components';
import PopupModal from '../../../components/common/PopupModal';
import moment from 'moment-timezone';
import LoadingBtn from '../../../components/common/LoadingBtn';
import MathHelper from '../../../helper/MathHelper';
import * as Icons from 'react-bootstrap-icons';
import {FlexContainer} from '../../../styles';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DeleteConfirmPopupBtn from '../../../components/common/DeleteConfirm/DeleteConfirmPopupBtn';
import AlumniRequestApprovePopupBtn from './AlumniRequestApprovePopupBtn';

const Wrapper = styled.div``;
const ALUMNI_REQUEST_STATUS_APPROVED = 'approved';
const ALUMNI_REQUEST_STATUS_PENDING = 'pending';
const ALUMNI_REQUEST_STATUS_ALL = '';
const AlumniRequestList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [requestList, setRequestList] = useState<iPaginatedResult<iAlumniRequest> | null>(null)
  const [status, setStatus] = useState<string>(ALUMNI_REQUEST_STATUS_PENDING);
  const [currentPage, setCurrentPage] = useState(1);
  const [showingRequest, setShowingRequest] = useState<iAlumniRequest | null>(null);
  const [count, setCount] = useState(1);

  useEffect(() => {
    let isCanceled = false;
    setIsLoading(true);
    AlumniRequestService.getAll({
      where: JSON.stringify({
        isActive: true,
        ...(status === ALUMNI_REQUEST_STATUS_ALL ? {} : (status === ALUMNI_REQUEST_STATUS_PENDING ? {approved_at: null} : {approved: true}))
      }),
      include: 'approvedBy',
      sort: 'created:DESC',
      currentPage,
      perPage: 20,
    }).then(resp => {
      if (isCanceled) return;
      setRequestList({...resp, data: currentPage === 1 ? resp.data : [...(requestList?.data || []), ...resp.data]})
    }).catch(err => {
      if (isCanceled) return;
      Toaster.showApiError(err);
    }).finally(() => {
      if (isCanceled) return;
      setIsLoading(false);
    })

    return () => {
      isCanceled = true;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, currentPage, count]);


  const changeStatus = (newStatus: string) => {
    setCurrentPage(1);
    setStatus(newStatus);
  }

  const getShowingDetailPopup = () => {
    if(showingRequest === null) {
      return null;
    }
    return (
      <PopupModal
        header={
          <b>Request for {showingRequest.title} {showingRequest.first_name} {showingRequest.last_name}, submitted @ {moment(showingRequest.created).format('lll')}</b>
        }
        show={true}
        handleClose={() => setShowingRequest(null)}
        footer={
          <>
            <div />
            <div>
              <Button variant={'primary'} onClick={() => setShowingRequest(null)}>OK</Button>
            </div>
          </>
        }
        size={'lg'}
      >
        <div>
          <Table striped borderless hover>
            <tbody>
              {Object.keys(showingRequest).map(key => {
                return (
                  <tr key={key}>
                    <td><b>{key}</b></td>
                {/*// @ts-ignore*/}
                    <td>{`${showingRequest[key] || ''}`}</td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
      </PopupModal>
    )
  }

  const getShowMoreDiv = () => {
    if (!requestList || requestList.currentPage >= requestList.pages) {
      return null;
    }
    return (
      <div>
        <LoadingBtn
          variant={'outline-primary'}
          isLoading={isLoading === true && currentPage > 1}
          onClick={() => setCurrentPage(MathHelper.add(currentPage, 1))}

        >
          <Icons.ArrowDown />
          Load More
        </LoadingBtn>
      </div>
    )
  }

  const getApprovedBtn = (request: iAlumniRequest) => {
    if (request.approved === true) {
      return (
        <small>
          <div>By: {request.approvedBy?.Given1} {request.approvedBy?.Surname}</div>
          <div>@: {moment(request.approved_at).format('lll')}</div>
        </small>
      )
    }
    return <AlumniRequestApprovePopupBtn request={request} onApproved={() => 1}/>
  }


  if (isLoading === true && currentPage === 1) {
    return <PageLoadingSpinner />
  }

  return (
    <Wrapper>
      <FlexContainer className={'section-row'}>
        <ButtonGroup>
          <Button
            variant={status === ALUMNI_REQUEST_STATUS_PENDING ? 'primary' : 'outline-primary'}
            onClick={() => changeStatus(ALUMNI_REQUEST_STATUS_PENDING)}
          >
            Pending
          </Button>
          <Button
            variant={status === ALUMNI_REQUEST_STATUS_APPROVED ? 'success' : 'outline-success'}
            onClick={() => changeStatus(ALUMNI_REQUEST_STATUS_APPROVED)}
          >
            Approved
          </Button>
          <Button
            variant={status === ALUMNI_REQUEST_STATUS_ALL ? 'secondary' : 'outline-secondary'}
            onClick={() => changeStatus(ALUMNI_REQUEST_STATUS_ALL)}
          >
            All
          </Button>
        </ButtonGroup>
        <Button variant={'link'} onClick={() => {setCurrentPage(1); setCount(MathHelper.add(count, 1))}}>
          <Icons.BootstrapReboot /> Refresh
        </Button>
      </FlexContainer>
      <Table hover striped>
        <thead>
        <tr>
          <th>Requested At</th>
          <th>Email</th>
          <th>Name</th>
          <th>D.O.B</th>
          <th>Contact Number</th>
          <th>To School</th>
          <th>Leaving Year</th>
          <th>Leaving Year Level</th>
          <th>Approve</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        {(requestList?.data || []).map(request => {
          return (
            <tr key={request.id}>
              <td>
                <Button variant={'link'} size={'sm'} onClick={() => setShowingRequest(request)}>
                  {moment(request.created).format('lll')}
                </Button>
              </td>
              <td>{request.email}</td>
              <td>{request.title} {request.first_name} {request.last_name}</td>
              <td>{moment(request.date_of_birth).format('ll')}</td>
              <td>{request.contact_number}</td>
              <td>{request.relationship_to_school}</td>
              <td>{request.leaving_year}</td>
              <td>{request.leaving_year_level}</td>
              <td>{getApprovedBtn(request)}</td>
              <td>
                <DeleteConfirmPopupBtn
                  variant={'outline-danger'}
                  title={`Are you sure to delete this request?`}
                  deletingFn={() => AlumniRequestService.deactivate(request.id)}
                  deletedCallbackFn={
                    // @ts-ignore
                    (deletedRequest: iAlumniRequest) => setRequestList({
                      ...requestList,
                      data: (requestList?.data || []).filter(req => req.id !== deletedRequest.id)
                    })
                  }
                  size={'sm'}
                  confirmString={`${request.id}`}
                  description={
                    <>
                      <b className={'text-danger'}>This action can NOT be reversed.</b>
                      <div>
                        Are you sure you want to continue to delete this request submitted by
                        <b>{request.title} {request.first_name} {request.last_name} </b>
                        @ <b>{moment(request.created).format('lll')}</b>
                      </div>
                    </>
                  }
                >
                  <Icons.Trash />
                </DeleteConfirmPopupBtn>
              </td>
            </tr>
          )
        })}
        </tbody>
      </Table>
      {getShowMoreDiv()}
      {getShowingDetailPopup()}
    </Wrapper>
  )
}


export default AlumniRequestList;
