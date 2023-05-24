import {Button, Col, Row, Table} from 'react-bootstrap';
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
import CSVExportBtn from '../../../components/form/CSVExportBtn';
import * as XLSX from 'sheetjs-style';
import YearLevelSelector from '../../../components/student/YearLevelSelector';
import FormLabel from '../../../components/form/FormLabel';
import AlumniRelationshipSelector from '../../../components/alumni/AlumniRelationshipSelector';
import FileYearSelector from '../../../components/student/FileYearSelector';

const Wrapper = styled.div`
  .search-panel {
    > div[class^='col-'] {
      padding-left: 0px;
    }
    .btns {
      text-align: right;
    }
  }
`;
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
  const [searchingYearLevels, setSearchingYearLevels] = useState<string[]>([]);
  const [searchRelationships, setSearchRelationships] = useState<string[]>([]);
  const [searchingYear, setSearchingYear] = useState<number | null>(null);


  const getSearchFunc = (pageNo = 1) => {
    return AlumniRequestService.getAll({
      where: JSON.stringify({
        isActive: true,
        ...(status === ALUMNI_REQUEST_STATUS_ALL ? {} : (status === ALUMNI_REQUEST_STATUS_PENDING ? {approved_at: null} : {approved: true})),
        ...((searchRelationships || []).length === 0 ? {} : {relationship_to_school: searchRelationships}),
        ...((searchingYearLevels || []).length === 0 ? {} : {leaving_year_level: searchingYearLevels}),
        ...(searchingYear === null ? {} : {leaving_year: searchingYear}),
      }),
      include: 'approvedBy',
      sort: 'created:DESC',
      currentPage: pageNo,
      perPage: 20,
    })
  }

  useEffect(() => {
    let isCanceled = false;
    setIsLoading(true);
    getSearchFunc(currentPage).then(resp => {
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
    return <AlumniRequestApprovePopupBtn request={request} onApproved={() => {
      setCount(MathHelper.add(count, 1))
    }}/>
  }

  const genCSVFile = (data: any[]) => {
    const titleRows: any = [
      [`Requested At`, 'Email', 'Name', 'Date Of Birth', 'Contact Number', 'Relationship To School', 'Leaving Year', 'Leaving Year Level', 'Status'],
    ];

    const rows = data.map(request => {
      return [
        moment(request.createdAt).format('lll'),
        request.email,
        `${request.title} ${request.first_name} ${request.last_name}`,
        request.date_of_birth,
        request.contact_number,
        request.relationship_to_school,
        request.leaving_year,
        request.leaving_year_level,
        request.approved === true ? 'Approved' : 'Pending',
      ]
    });
    // const {rows, cellStyleMap, mergeCells} = getRows(3); //start from row 3, as there are two title rows
    const ws = XLSX.utils.aoa_to_sheet([...titleRows, ...rows]);

    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'].forEach(colRef => {
      ws[`${colRef}1`].s = {
        font: { sz: 14, bold: true }
      }
    })

    ws['!cols'] = [
      {wch: 20},
      {wch: 30},
      {wch: 20},
      {wch: 20},
      {wch: 20},
      {wch: 30},
      {wch: 18},
      {wch: 18},
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${moment().format('DD_MMM_YYYY_HH_mm_ss')}`);
    XLSX.writeFile(wb, `Alumni_requests_${moment().format('YYYY_MM_DD_HH_mm_ss')}.xlsx`);
  }


  if (isLoading === true && currentPage === 1) {
    return <PageLoadingSpinner />
  }

  return (
    <Wrapper>
      <Row className={'search-panel'}>
        <Col md={4}>
          <FormLabel label={'Relationship'} />
          <AlumniRelationshipSelector
            values={searchRelationships}
            isMulti
            allowClear
            onSelect={(option) => {
              setSearchRelationships(option === null ? [] : Array.isArray(option) ? option.map(opt => `${opt.value}`) : [`${option.value}`])
            }}
          />
        </Col>
        <Col md={3}>
          <FormLabel label={'Year'} />
          <FileYearSelector
            value={searchingYear}
            allowClear
            onSelect={(option) => {
              setSearchingYear(option)
            }}
          />
        </Col>
        <Col md={3}>
          <FormLabel label={'Year Level'} />
          <YearLevelSelector
            values={searchingYearLevels}
            isMulti
            allowClear
            onSelect={(option) => {
              setSearchingYearLevels(option === null ? [] : Array.isArray(option) ? option.map(opt => `${opt.value}`) : [`${option.value}`])
            }}
          />
        </Col>
        <Col md={2}>
          <FormLabel label={' '} />
          <div className={'btns'}>
            <LoadingBtn isLoading={isLoading} onClick={() => {setCurrentPage(1); setCount(MathHelper.add(count, 1))}}>
              <Icons.Search /> {' '} Search
            </LoadingBtn>
          </div>
        </Col>
      </Row>
      <FlexContainer className={'section-row justify-content space-between space-above'}>
        <div>
          <ButtonGroup>
            <Button
              size={'sm'}
              variant={status === ALUMNI_REQUEST_STATUS_PENDING ? 'primary' : 'outline-primary'}
              onClick={() => changeStatus(ALUMNI_REQUEST_STATUS_PENDING)}
            >
              Pending
            </Button>
            <Button
              size={'sm'}
              variant={status === ALUMNI_REQUEST_STATUS_APPROVED ? 'success' : 'outline-success'}
              onClick={() => changeStatus(ALUMNI_REQUEST_STATUS_APPROVED)}
            >
              Approved
            </Button>
            <Button
              size={'sm'}
              variant={status === ALUMNI_REQUEST_STATUS_ALL ? 'secondary' : 'outline-secondary'}
              onClick={() => changeStatus(ALUMNI_REQUEST_STATUS_ALL)}
            >
              All
            </Button>
          </ButtonGroup>
          <Button variant={'link'} onClick={() => {setCurrentPage(1); setCount(MathHelper.add(count, 1))}}>
            <Icons.BootstrapReboot /> Refresh
          </Button>
        </div>
        <div>
          {(requestList?.data || []).length <= 0 ? null : (
            <CSVExportBtn
              size={'sm'}
              disabled={isLoading === true}
              fetchingFnc={(pageNo) => getSearchFunc((pageNo))}
              downloadFnc={(data: any[]) => genCSVFile(data)}
            />
          )}
        </div>
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
