import React from 'react';
import moment from 'moment';
import {useSelector} from 'react-redux';
import {Alert, Button, Form, Table} from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import DataTable, {iTableColumn} from '../../../components/common/Table';
import DeleteConfirmPopup from '../../../components/common/DeleteConfirm/DeleteConfirmPopup';
import LoadingBtn from '../../../components/common/LoadingBtn';
import SectionDiv from '../../../components/common/SectionDiv';
import {RootState} from '../../../redux/makeReduxStore';
import Toaster, {TOAST_TYPE_ERROR, TOAST_TYPE_SUCCESS} from '../../../services/Toaster';
import {FlexContainer} from '../../../styles';
import iParentTeacherInterviewCalendarEventSummary from '../../../types/ParentTeacherInterview/iParentTeacherInterviewCalendarEventSummary';
import iParentTeacherInterviewScheduleRow from '../../../types/ParentTeacherInterview/iParentTeacherInterviewScheduleRow';

type iParentTeacherInterviewSchedulePanel = {
  isAdmin: boolean;
  isSubmitting: boolean;
  missingSettingsMessage: string | null;
  rows: iParentTeacherInterviewScheduleRow[];
  onBack: () => void;
  onDateTimeChange: (staffId: number, fieldName: 'startDateTime' | 'endDateTime', value: string) => void;
  onRetryRetrieval: (staffId: number) => void;
  onRetryCreate: (staffId: number) => void;
  onSubmit: () => void;
};

const isValidLocalDateTime = (value: string | null) => {
  if (!value) {
    return false;
  }
  return moment(value, moment.HTML5_FMT.DATETIME_LOCAL, true).isValid();
};

const getRowValidationMessage = (row: iParentTeacherInterviewScheduleRow) => {
  if (!isValidLocalDateTime(row.startDateTime)) {
    return 'Start datetime is required.';
  }
  if (!isValidLocalDateTime(row.endDateTime)) {
    return 'End datetime is required.';
  }

  const startMoment = moment(row.startDateTime);
  const endMoment = moment(row.endDateTime);

  if (endMoment.isBefore(startMoment)) {
    return 'End datetime must be later than or equal to start datetime.';
  }

  return null;
};

const isCreateEligible = (row: iParentTeacherInterviewScheduleRow) => {
  if (getRowValidationMessage(row) !== null) {
    return false;
  }

  if (row.retrievalStatus !== 'READY' && row.retrievalStatus !== 'EMPTY') {
    return false;
  }

  const startMoment = moment(row.startDateTime);
  const endMoment = moment(row.endDateTime);

  if (!endMoment.isAfter(startMoment)) {
    return false;
  }

  return !startMoment.isBefore(moment());
};

type iExistingEventRow = {
  id: string;
  title: string;
  time: string;
};

const isCanceledEvent = (event: iParentTeacherInterviewCalendarEventSummary) => {
  return /^(cancelled|canceled):/i.test(`${event.subject || ''}`.trim());
};

const ParentTeacherInterviewSchedulePanel = ({
  isAdmin,
  isSubmitting,
  missingSettingsMessage,
  rows,
  onBack,
  onDateTimeChange,
  onRetryRetrieval,
  onRetryCreate,
  onSubmit,
}: iParentTeacherInterviewSchedulePanel) => {
  const {user: currentUser} = useSelector((state: RootState) => state.auth);
  const [isShowingSubmitConfirm, setIsShowingSubmitConfirm] = React.useState(false);
  const [confirmString, setConfirmString] = React.useState('na');
  const allRowsCreateEligible = rows.length > 0 && rows.every(isCreateEligible);
  const showMeetingColumns = rows.some(
    row => row.createStatus === 'CREATED' || row.createStatus === 'FAILED' || row.createStatus === 'EXISTS'
  );
  const createDisabledReason = !isAdmin
    ? 'Only module admins can create Parent Teacher Interview event links.'
    : missingSettingsMessage || (!allRowsCreateEligible ? 'Complete valid schedule details for every selected staff member before creating event links.' : null);
  const existingEventColumns: iTableColumn<iExistingEventRow>[] = [
    {
      key: 'title',
      sort: 1,
      header: 'Title',
      cell: (_, event) => <td key={`title-${event.id}`} style={{width: '330px'}}>{event.title}</td>,
    },
    {
      key: 'time',
      sort: 2,
      header: 'Time',
      cell: (_, event) => <td key={`time-${event.id}`} style={{width: '235px'}}>{event.time}</td>,
    },
  ];

  const getRetrievalContent = (row: iParentTeacherInterviewScheduleRow) => {
    if (row.retrievalStatus === 'IDLE') {
      return null;
    }

    if (row.retrievalStatus === 'LOADING') {
      return <div>Loading existing events...</div>;
    }

    if (row.retrievalStatus === 'FAILED') {
      return (
        <Alert variant={'danger'} className={'mb-0'}>
          <div>{row.retrievalMessage || 'Failed to load existing events.'}</div>
          <Button size={'sm'} variant={'outline-danger'} onClick={() => onRetryRetrieval(row.staffId)}>
            Retry retrieval
          </Button>
        </Alert>
      );
    }

    if (row.retrievalStatus === 'EMPTY') {
      return null;
    }

    const visibleEvents = row.events.filter(event => !isCanceledEvent(event));
    if (visibleEvents.length <= 0) {
      return null;
    }

    return (
      <small>
        <DataTable
          className={'mb-0'}
          columns={existingEventColumns}
          hover
          striped
          showHeader={false}
          rows={visibleEvents.map((event: iParentTeacherInterviewCalendarEventSummary) => ({
            id: event.id,
            title: event.subject,
            time: `${moment(event.startDateTime).format('DD/MM/YYYY HH:mm')} - ${moment(event.endDateTime).format('DD/MM/YYYY HH:mm')}`,
          }))}
        />
      </small>
    );
  };

  const detailColumnCount = showMeetingColumns ? 6 : 7;
  const copyLinkToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      Toaster.showToast('Link copied successfully', TOAST_TYPE_SUCCESS);
    } catch (error) {
      Toaster.showToast('Failed to copy link.', TOAST_TYPE_ERROR);
    }
  };

  const handleConfirmSubmit = async () => {
    await onSubmit();
    setIsShowingSubmitConfirm(false);
  };

  React.useEffect(() => {
    setConfirmString(`${currentUser?.synergyId || Math.ceil(Math.random() * 100000)}`);
  }, [currentUser]);

  const exportMeetingRows = () => {
    const exportRows = rows
      .filter(row => row.createResult?.event !== null && row.createResult?.event !== undefined)
      .map(row => {
        const event = row.createResult?.event;
        return [
          row.staffId,
          row.staffName,
          row.staffCode,
          row.staffEmail || '',
          event?.subject || '',
          event?.startDateTime ? moment(event.startDateTime).format('DD/MM/YYYY HH:mm') : '',
          event?.endDateTime ? moment(event.endDateTime).format('DD/MM/YYYY HH:mm') : '',
          event?.teamsJoinUrl || '',
        ];
      });

    if (exportRows.length <= 0) {
      return;
    }

    const escapeCsvValue = (value: string | number) => {
      const normalizedValue = `${value ?? ''}`.replace(/"/g, '""');
      return `"${normalizedValue}"`;
    };

    const csvContent = [
      [
        'StaffID',
        'Staff Name',
        'Staff Code',
        'Staff EMail',
        'Interview Meeting Title',
        'Interview Meeting Date Time Start',
        'Interview Meeting Date Time End',
        'Interview Meeting Url',
      ],
      ...exportRows,
    ]
      .map(columns => columns.map(escapeCsvValue).join(','))
      .join('\n');

    const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `parent_teacher_interview_meetings_${moment().format('YYYYMMDD_HHmmss')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const getMeetingContent = (row: iParentTeacherInterviewScheduleRow) => {
    const createdEvent = row.createResult?.event;
    const teamsJoinUrl = row.createResult?.event?.teamsJoinUrl;
    if (row.createStatus === 'CREATED' && teamsJoinUrl) {
      return (
        <div>
          {createdEvent?.subject ? <div>{createdEvent.subject}</div> : null}
          {createdEvent?.startDateTime && createdEvent?.endDateTime ? (
            <div>{`${moment(createdEvent.startDateTime).format('DD/MM/YYYY HH:mm')} - ${moment(createdEvent.endDateTime).format('DD/MM/YYYY HH:mm')}`}</div>
          ) : null}
          <FlexContainer className={'with-gap lg-gap wrap align-items center'}>
            <a href={teamsJoinUrl} target={'_blank'} rel={'noreferrer'}>Link</a>
            <Button
              size={'sm'}
              variant={'link'}
              className={'p-0 border-0'}
              aria-label={'Copy link'}
              onClick={() => copyLinkToClipboard(teamsJoinUrl)}
            >
              <Icons.Clipboard />
            </Button>
          </FlexContainer>
        </div>
      );
    }

    if (row.createStatus === 'FAILED') {
      return (
        <Alert variant={'danger'} className={'mb-0 p-2'}>
          <FlexContainer className={'with-gap wrap align-items center'}>
            <span>{row.createMessage || 'Failed to create event link.'}</span>
            <Button size={'sm'} variant={'outline-danger'} onClick={() => onRetryCreate(row.staffId)}>
              Retry
            </Button>
          </FlexContainer>
        </Alert>
      );
    }

    if (createdEvent?.subject || (createdEvent?.startDateTime && createdEvent?.endDateTime) || teamsJoinUrl) {
      return (
        <div>
          {createdEvent?.subject ? <div>{createdEvent.subject}</div> : null}
          {createdEvent?.startDateTime && createdEvent?.endDateTime ? (
            <div>{`${moment(createdEvent.startDateTime).format('DD/MM/YYYY HH:mm')} - ${moment(createdEvent.endDateTime).format('DD/MM/YYYY HH:mm')}`}</div>
          ) : null}
          {teamsJoinUrl ? (
            <div>
              <a href={teamsJoinUrl} target={'_blank'} rel={'noreferrer'}>Link</a>
            </div>
          ) : null}
        </div>
      );
    }

    return row.createMessage || row.createResult?.message || null;
  };

  return (
    <SectionDiv className={'no-top'}>
      <SectionDiv className={'no-top margin-bottom'}>
        <h5>Schedule Parent Teacher Interview</h5>
        <p>Enter browser-local start and end datetimes for each selected staff member. Existing events load automatically once a valid range is entered.</p>
      </SectionDiv>

      {!isAdmin ? (
        <Alert variant={'warning'}>
          You can review existing events, but only module admins can create event links.
        </Alert>
      ) : null}

      {missingSettingsMessage ? (
        <Alert variant={'danger'}>
          {missingSettingsMessage}
        </Alert>
      ) : null}

      <Table striped responsive hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Staff Name</th>
            <th>Staff Code</th>
            <th>Staff Email</th>
            {!showMeetingColumns ? (
              <>
                <th>Interview Start Time</th>
                <th>Interview End Time</th>
                <th>Existing Events</th>
              </>
            ) : (
              <>
                <th>Existing Events</th>
                <th>
                  <FlexContainer className={'with-gap lg-gap wrap align-items center'}>
                    <span>Interview Meeting</span>
                    <Button
                      size={'sm'}
                      variant={'link'}
                      className={'p-0'}
                      aria-label={'Export interview meetings'}
                      onClick={exportMeetingRows}
                    >
                      <Icons.Download />
                    </Button>
                  </FlexContainer>
                </th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <React.Fragment key={row.staffId}>
              <tr>
                <td>{row.staffId}</td>
                <td>{row.staffName}</td>
                <td>{row.staffCode}</td>
                <td>{row.staffEmail || null}</td>
                {!showMeetingColumns ? (
                  <>
                    <td>
                      <Form.Control
                        aria-label={`Starting datetime for ${row.staffName}`}
                        type={'datetime-local'}
                        value={row.startDateTime || ''}
                        onChange={event => onDateTimeChange(row.staffId, 'startDateTime', event.target.value)}
                      />
                    </td>
                    <td>
                      <Form.Control
                        aria-label={`Ending datetime for ${row.staffName}`}
                        type={'datetime-local'}
                        value={row.endDateTime || ''}
                        onChange={event => onDateTimeChange(row.staffId, 'endDateTime', event.target.value)}
                      />
                    </td>
                    <td>{getRetrievalContent(row)}</td>
                  </>
                ) : (
                  <>
                    <td>{getRetrievalContent(row)}</td>
                    <td style={{width: '550px'}}>{getMeetingContent(row)}</td>
                  </>
                )}
              </tr>
              {getRowValidationMessage(row) || (row.createStatus && row.createStatus !== 'IDLE' && row.createStatus !== 'CREATED' && row.createStatus !== 'FAILED') ? (
                <tr>
                  <td colSpan={detailColumnCount}>
                    {getRowValidationMessage(row) ? (
                      <Alert
                        variant={'warning'}
                        className={row.createStatus && row.createStatus !== 'IDLE' && row.createStatus !== 'CREATED' && row.createStatus !== 'FAILED' ? 'mb-2' : 'mb-0'}
                      >
                        {getRowValidationMessage(row)}
                      </Alert>
                    ) : null}
                    {row.createStatus && row.createStatus !== 'IDLE' && row.createStatus !== 'CREATED' && row.createStatus !== 'FAILED' ? (
                      <Alert
                        variant={'info'}
                        className={'mb-0'}
                      >
                        <div>{row.createMessage}</div>
                        {row.createResult?.event?.teamsJoinUrl && !showMeetingColumns ? (
                          <a href={row.createResult.event.teamsJoinUrl} target={'_blank'} rel={'noreferrer'}>
                            Open meeting link
                          </a>
                        ) : null}
                      </Alert>
                    ) : null}
                  </td>
                </tr>
              ) : null}
            </React.Fragment>
          ))}
        </tbody>
      </Table>

      <div className={'d-flex justify-content-between'}>
        <LoadingBtn variant={'secondary'} onClick={onBack}>
          Back
        </LoadingBtn>
        <div className={'text-end'}>
          {createDisabledReason ? <div className={'mb-2'}>{createDisabledReason}</div> : null}
          <LoadingBtn
            variant={'primary'}
            isLoading={isSubmitting}
            disabled={createDisabledReason !== null}
            onClick={() => setIsShowingSubmitConfirm(true)}
          >
            Create link(s) for {rows.length} staff
          </LoadingBtn>
        </div>
      </div>
      <DeleteConfirmPopup
        isOpen={isShowingSubmitConfirm}
        onClose={() => setIsShowingSubmitConfirm(false)}
        onConfirm={handleConfirmSubmit}
        isDeleting={isSubmitting}
        confirmString={confirmString}
        confirmBtnString={'Create event links'}
        confirmBtnVariant={'primary'}
        title={'Create Parent Teacher Interview links?'}
        description={`Type ${confirmString} to confirm event link creation for ${rows.length} staff.`}
      />
    </SectionDiv>
  );
};

export {getRowValidationMessage, isCreateEligible, isValidLocalDateTime};
export default ParentTeacherInterviewSchedulePanel;
