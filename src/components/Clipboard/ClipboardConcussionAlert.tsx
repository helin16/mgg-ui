import React, {useEffect, useMemo, useState} from 'react';
import styled from 'styled-components';
import moment from 'moment-timezone';

import SynVStudentClassService from '../../services/Synergetic/Student/SynVStudentClassService';
import ClipboardIncidentService from '../../services/Clipboard/ClipboardIncidentService';
import Toaster from '../../services/Toaster';
import iSynVStudentClass from '../../types/Synergetic/Student/iSynVStudentClass';
import iClipboardIncident from '../../types/Clipboard/iClipboardIncident';
import {HEADER_NAME_SELECTING_FIELDS, MAX_PAGE_SIZE} from '../../services/AppService';

const Wrapper = styled.div`
  position: relative;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  background-color: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;

  a {
    color: #004085;
    text-decoration: underline;

    &:hover {
      color: #002752;
    }
  }

  strong {
    color: #721c24;
  }
`;

type iClipboardConcussionAlertProps = {
  classCode: string;
  currentDate: string | Date;
  periodNumber: number;
  className?: string;
};

const getFileSemester = (dateValue: string | Date) => {
  const currentMoment = moment(dateValue);
  if (!currentMoment.isValid()) {
    return moment();
  }

  return currentMoment;
};

const getIncidentDisplayName = (incident: iClipboardIncident) => {
  const student = incident.studentConcerned;
  if (!student) {
    return 'Unknown student';
  }
  const firstName = `${student.firstName || ''}`.trim();
  const lastName = `${student.lastName || ''}`.trim();
  const fullName = `${firstName} ${lastName}`.trim();
  return fullName === '' ? 'Unknown student' : fullName;
};

const getIncidentUrl = (incident: iClipboardIncident) => {
  return `https://go.clipboard.app/incidents/${incident.id}`;
};

const getIncidentReturnDate = (incident: iClipboardIncident) => {
  return incident.returnToPlayDate;
};

const getIncidentReturnDateMoment = (incident: iClipboardIncident) => {
  const returnDateRaw = getIncidentReturnDate(incident);
  if (`${returnDateRaw || ''}`.trim() === '') {
    return null;
  }

  const returnDate = moment.utc(returnDateRaw).local();
  return returnDate.isValid() ? returnDate : null;
};

const getIncidentReturnDateText = (incident: iClipboardIncident) => {
  const returnDate = getIncidentReturnDateMoment(incident);
  return returnDate ? returnDate.format('ddd Do MMMM YYYY') : '';
};

const getIncidentReasonText = (incident: iClipboardIncident) => {
  const reason = `${incident.returnToPlayReason || ''}`.trim();
  return reason === '' ? 'Concussion' : reason;
};

const ClipboardConcussionAlert = ({
  classCode,
  currentDate,
  periodNumber,
  className,
}: iClipboardConcussionAlertProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [incidents, setIncidents] = useState<iClipboardIncident[]>([]);

  const currentMoment = useMemo(() => {
    return getFileSemester(currentDate);
  }, [currentDate]);

  useEffect(() => {
    const classCodeStr = `${classCode || ''}`.trim();
    if (classCodeStr === '') {
      setIncidents([]);
      return;
    }

    let isCanceled = false;
    setIsLoading(true);

    const loadIncidents = async () => {
      try {
        const studentClassResp = await SynVStudentClassService.getAll(
          {
            where: JSON.stringify({
              ClassCode: classCodeStr,
              CurrentSemesterOnlyFlag: true,
            }),
            perPage: MAX_PAGE_SIZE,
          },
          {
            headers: {
              [HEADER_NAME_SELECTING_FIELDS]: JSON.stringify([
                'StudentID',
                'ClassCode',
                'ClassDescription',
              ]),
            },
          }
        );

        if (isCanceled) {
          return;
        }

        const studentIds = Array.from(new Set((studentClassResp.data || [])
          .map((studentClass: iSynVStudentClass) => `${studentClass.StudentID || ''}`.trim())
          .filter(studentId => studentId !== '')));

        if (studentIds.length <= 0) {
          setIncidents([]);
          return;
        }

        const incidentResp = await ClipboardIncidentService.getAll({
          sisIds: studentIds,
          concussionStatuses: ['confirmed'],
          startDateTime: currentMoment.clone().subtract(21, 'days').startOf('day').toISOString(),
          endDateTime: currentMoment.clone().endOf('day').toISOString(),
        });

        if (isCanceled) {
          return;
        }

        const activeIncidents = (incidentResp.data || []).filter((incident: iClipboardIncident) => {
          const restrictionMoment = getIncidentReturnDateMoment(incident);
          if (!restrictionMoment) {
            return true;
          }
          return restrictionMoment.isSameOrAfter(currentMoment, 'day');
        });

        setIncidents(activeIncidents);
      } catch (err) {
        if (isCanceled) {
          return;
        }
        Toaster.showApiError(err);
        setIncidents([]);
      } finally {
        if (isCanceled) {
          return;
        }
        setIsLoading(false);
      }
    };

    void loadIncidents();

    return () => {
      isCanceled = true;
    };
  }, [classCode, currentMoment, periodNumber]);

  if (isLoading) {
    return null;
  }

  if (incidents.length <= 0) {
    return null;
  }

  return (
    <Wrapper className={className}>
      {incidents.map((incident, index) => {
        const studentName = getIncidentDisplayName(incident);
        const reasonText = getIncidentReasonText(incident);
        const returnDateText = getIncidentReturnDateText(incident);
        const incidentUrl = getIncidentUrl(incident);

        return (
          <div key={`${incident.id}-${index}`}>
            {index > 0 && <br />}
            <strong>
              <a href={incidentUrl} target={'_blank'} rel={'noreferrer'}>
                {studentName}
              </a>
            </strong>{' '}
            should not return to play {returnDateText !== '' ? `until ${returnDateText} ` : ''}due to "{reasonText}".
          </div>
        );
      })}
    </Wrapper>
  );
};

export default ClipboardConcussionAlert;
