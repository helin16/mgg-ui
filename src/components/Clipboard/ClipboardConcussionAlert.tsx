import React, {useEffect, useMemo, useState} from 'react';
import styled from 'styled-components';
import moment from 'moment-timezone';
import {Alert} from 'react-bootstrap';

import SynVStudentClassService from '../../services/Synergetic/Student/SynVStudentClassService';
import ClipboardIncidentService from '../../services/Clipboard/ClipboardIncidentService';
import Toaster from '../../services/Toaster';
import iSynVStudentClass from '../../types/Synergetic/Student/iSynVStudentClass';
import iClipboardIncident from '../../types/Clipboard/iClipboardIncident';
import {HEADER_NAME_SELECTING_FIELDS, MAX_PAGE_SIZE} from '../../services/AppService';

const Wrapper = styled.div``;

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

const getIncidentStaffName = (incident: iClipboardIncident) => {
  const staff = incident.staff || incident.staffMember;
  const firstName = `${staff?.firstName || ''}`.trim();
  const lastName = `${staff?.lastName || ''}`.trim();
  const fullName = `${firstName} ${lastName}`.trim();
  return fullName === '' ? 'Unknown staff' : fullName;
};

const getIncidentUrl = (incident: iClipboardIncident) => {
  return `https://go.clipboard.app/incidents/${incident.id}`;
};

const getIncidentDateTime = (incident: iClipboardIncident) => {
  const dateTime = moment.utc(incident.dateTime).local();
  if (!dateTime.isValid()) {
    return 'Unknown date time';
  }
  return dateTime.format('ddd DD MMM YYYY h:mm A');
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
          startDateTime: currentMoment.clone().startOf('day').toISOString(),
          endDateTime: currentMoment.clone().endOf('day').toISOString(),
        });

        if (isCanceled) {
          return;
        }

        const activeIncidents = (incidentResp.data || []).filter((incident: iClipboardIncident) => {
          const restrictionDate = incident.RestrictedEndDate || incident.ReviewDate;
          if (`${restrictionDate || ''}`.trim() === '') {
            return true;
          }
          const restrictionMoment = moment(restrictionDate);
          return restrictionMoment.isValid() ? restrictionMoment.isSameOrAfter(currentMoment, 'day') : true;
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
        const staffName = getIncidentStaffName(incident);
        const incidentDateTime = getIncidentDateTime(incident);
        const incidentUrl = getIncidentUrl(incident);
        const reason = 'Concussion';

        return (
          <Alert key={`${incident.id}-${index}`} variant={'warning'}>
            <strong>
              <a href={incidentUrl} target={'_blank'} rel={'noreferrer'}>
                {studentName}
              </a>
            </strong>{' '}
            is confirmed with &quot;{reason}&quot; in Clipboard by <strong>{staffName}</strong> at {incidentDateTime}.
          </Alert>
        );
      })}
    </Wrapper>
  );
};

export default ClipboardConcussionAlert;
