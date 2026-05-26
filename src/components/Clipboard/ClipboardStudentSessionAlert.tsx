import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import moment, { Moment } from 'moment-timezone';

import SynVStudentClassService from '../../services/Synergetic/Student/SynVStudentClassService';
import SynTimetableDefinitionService from '../../services/Synergetic/TimeTable/SynTimetableDefinitionService';
import ClipboardSessionService, { iClipboardSessionQueryParams } from '../../services/Clipboard/ClipboardSessionService';
import Toaster from '../../services/Toaster';
import iSynVStudentClass from '../../types/Synergetic/Student/iSynVStudentClass';
import iClipboardSession from '../../types/Clipboard/iClipboardSession';
import { HEADER_NAME_SELECTING_FIELDS, MAX_PAGE_SIZE } from '../../services/AppService';

const Wrapper = styled.div`
  position: relative;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  background-color: #fff3cd;
  border-color: #ffeaa7;
  color: #856404;

  a {
    color: #664d03;
    text-decoration: underline;

    &:hover {
      color: #523000;
    }
  }
`;

type iClipboardStudentSessionAlertProps = {
  classCode: string;
  currentDate: string | Date;
  periodNumber: number;
  activityIds?: number[];
  sessionTypeLabel?: string;
  className?: string;
};

const getFileSemester = (dateValue: string | Date) => {
  const currentMoment = moment(dateValue);
  if (!currentMoment.isValid()) {
    return moment();
  }

  return currentMoment;
};

// Standard school period timetable (Mentone Girls' Grammar School)
const getPeriodTiming = async (periodNumber: number, currentDate: string | Date): Promise<{ start: Moment; end: Moment } | null> => {
  try {
    // Fetch periods from the API
    const semesterData = await SynTimetableDefinitionService.getCurrentSemesterPeriods();
    
    if (!semesterData || !semesterData.periods) {
      console.warn('No period data available from API');
      return null;
    }

    // Find the first matching period (should be consistent across timetable groups)
    // All records with the same periodNumber have the same timeFrom/timeTo
    const periodData = semesterData.periods.find(p => p.periodNumber === periodNumber);
    
    if (!periodData) {
      console.warn(`Period ${periodNumber} not found in timetable`);
      return null;
    }

    const currentMoment = moment(currentDate);
    if (!currentMoment.isValid()) {
      return null;
    }

    // Parse timeFrom and timeTo (format: "HH:mm")
    const [startHour, startMin] = periodData.timeFrom.split(':').map(x => parseInt(x, 10));
    const [endHour, endMin] = periodData.timeTo.split(':').map(x => parseInt(x, 10));

    const start = currentMoment.clone().set({
      hour: startHour,
      minute: startMin,
      second: 0,
    });

    const end = currentMoment.clone().set({
      hour: endHour,
      minute: endMin,
      second: 0,
    });

    if (!start.isValid() || !end.isValid()) {
      return null;
    }

    return { start, end };
  } catch (err) {
    console.error('Error fetching period timing:', err);
    return null;
  }
};

const getTodayDateRange = (currentDate: string | Date): { start: Moment; end: Moment } => {
  const currentMoment = moment(currentDate);
  if (!currentMoment.isValid()) {
    return {
      start: moment().startOf('day'),
      end: moment().endOf('day'),
    };
  }

  return {
    start: currentMoment.clone().startOf('day'),
    end: currentMoment.clone().endOf('day'),
  };
};

const isSessionHappeningToday = (session: iClipboardSession, currentDate: string | Date): boolean => {
  try {
    const sessionStart = moment.utc(session.startDateTime).tz('Australia/Melbourne');
    const todayRange = getTodayDateRange(currentDate);

    if (!sessionStart.isValid()) {
      return false;
    }

    // Check if session start date is the same as today (in local timezone)
    return sessionStart.isSame(todayRange.start, 'day');
  } catch (err) {
    console.error('Error checking if session is happening today:', err);
    return false;
  }
};

const isSessionOverlappingPeriod = (
  session: iClipboardSession,
  periodStart: Moment,
  periodEnd: Moment
): boolean => {
  // Parse session times as UTC and convert to local timezone (API returns UTC times)
  const sessionStart = moment.utc(session.startDateTime).tz('Australia/Melbourne');
  const sessionEnd = moment.utc(session.endDateTime).tz('Australia/Melbourne');

  if (!sessionStart.isValid() || !sessionEnd.isValid()) {
    return false;
  }

  // Session overlaps with period if:
  // sessionStart < periodEnd AND sessionEnd > periodStart
  return sessionStart.isBefore(periodEnd) && sessionEnd.isAfter(periodStart);
};

const ClipboardStudentSessionAlert = ({
  classCode,
  currentDate,
  periodNumber,
  activityIds,
  sessionTypeLabel = 'session',
  className,
}: iClipboardStudentSessionAlertProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [matchedStudents, setMatchedStudents] = useState<iSynVStudentClass[]>([]);
  const studentActivitiesMapRef = React.useRef<Map<string, Array<{activity: string; location: string; sessionId: string; startDateTime: string; endDateTime: string}>>>(new Map());
  const studentNamesMapRef = React.useRef<Map<string, {firstName: string; lastName: string}>>(new Map());

  const currentMoment = useMemo(() => {
    return getFileSemester(currentDate);
  }, [currentDate]);

  useEffect(() => {
    // Return early if no class code
    const classCodeStr = `${classCode || ''}`.trim();
    if (classCodeStr === '') {
      setMatchedStudents([]);
      return;
    }

    let isCanceled = false;
    setIsLoading(true);

    const loadStudentSessions = async () => {
      try {
        // Get students in the class
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
                'StudentNameInternal',
              ]),
            },
          }
        );

        if (isCanceled) {
          return;
        }

        const studentIds = Array.from(
          new Set(
            (studentClassResp.data || [])
              .map((studentClass: iSynVStudentClass) =>
                `${studentClass.StudentID || ''}`.trim()
              )
              .filter(studentId => studentId !== '')
          )
        );

        if (studentIds.length <= 0) {
          setMatchedStudents([]);
          return;
        }

        // Get the period timing from the API
        const periodTiming = await getPeriodTiming(periodNumber, currentDate);

        if (!periodTiming) {
          setMatchedStudents([]);
          return;
        }

        // Query sessions for today (full day in UTC)
        // Additional filtering will be done on the UI side to handle timezone conversion correctly
        const todayRange = getTodayDateRange(currentDate);
        const queryParams: iClipboardSessionQueryParams = {
          sisIds: studentIds,
          ...(activityIds && activityIds.length > 0 ? { activityIds } : {}),
          startDateTime: todayRange.start.clone().utc().format('YYYY-MM-DD HH:mm:ss'),
          endDateTime: todayRange.end.clone().utc().format('YYYY-MM-DD HH:mm:ss'),
          cancelled: false,
          includeStatuses: ['confirmed'],
          includeTeams: true,
          includeStaff: true,
          perPage: MAX_PAGE_SIZE,
        };

        const sessionResp = await ClipboardSessionService.getAll(queryParams);

        if (isCanceled) {
          return;
        }

        // Get unique students and their activities from matching sessions
        // Filter sessions that are happening today and overlapping with the period
        const matchingSessionStudents = new Map<string, Array<{activity: string; location: string; sessionId: string; startDateTime: string; endDateTime: string}>>();
        (sessionResp.data || []).forEach((session: iClipboardSession) => {
          // Check if session is happening today (in Melbourne timezone) and overlaps with period time
          if (isSessionHappeningToday(session, currentDate) && isSessionOverlappingPeriod(session, periodTiming.start, periodTiming.end)) {
            // Add SMS IDs from session students to matched students with activity and location
            if ((session as any).students && (session as any).students.length > 0) {
              const activityName = (session as any).activity?.name || 'activity';
              const locationName = (session as any).location || (session as any).locationData?.name || 'UNKNOWN LOCATION';
              (session as any).students.forEach((student: any) => {
                if (student.smsId) {
                  if (!matchingSessionStudents.has(student.smsId)) {
                    matchingSessionStudents.set(student.smsId, []);
                  }
                  matchingSessionStudents.get(student.smsId)?.push({activity: activityName, location: locationName, sessionId: session.id, startDateTime: session.startDateTime, endDateTime: session.endDateTime});
                  
                  // Store student name for display
                  studentNamesMapRef.current.set(student.smsId, {
                    firstName: student.firstName || '',
                    lastName: student.lastName || ''
                  });
                }
              });
            }
          }
        });

        // Filter student classes to only those in matching sessions
        const filteredStudents = (studentClassResp.data || []).filter(
          (studentClass: iSynVStudentClass) => {
            const studentId = `${studentClass.StudentID || ''}`.trim();
            return matchingSessionStudents.has(studentId);
          }
        );

        // Create a map of student ID to their activities and locations for rendering
        studentActivitiesMapRef.current.clear();
        matchingSessionStudents.forEach((sessions, studentId) => {
          studentActivitiesMapRef.current.set(studentId, sessions);
        });

        setMatchedStudents(filteredStudents);
      } catch (err) {
        if (isCanceled) {
          return;
        }
        Toaster.showApiError(err);
        setMatchedStudents([]);
      } finally {
        if (isCanceled) {
          return;
        }
        setIsLoading(false);
      }
    };

    void loadStudentSessions();

    return () => {
      isCanceled = true;
    };
  }, [classCode, currentDate, currentMoment, periodNumber, activityIds]);

  if (isLoading) {
    return null;
  }

  if (matchedStudents.length <= 0) {
    return null;
  }

  return (
    <Wrapper className={className}>
      {matchedStudents.map((studentClass, index) => {
        const studentId = `${studentClass.StudentID || ''}`.trim();
        const studentNameData = studentNamesMapRef.current.get(studentId);
        const sessions = studentActivitiesMapRef.current.get(studentId) || [];

        if (sessions.length === 0 || !studentNameData) {
          return null;
        }

        const {firstName, lastName} = studentNameData;
        const displayName = `${lastName}, ${firstName}`;

        return (
          <div key={`${studentClass.StudentID}-${index}`}>
            {sessions.map((session, sessionIndex) => {
              const startTime = moment.utc(session.startDateTime).tz('Australia/Melbourne').format('hh:mm a');
              const endTime = moment.utc(session.endDateTime).tz('Australia/Melbourne').format('hh:mm a');
              return (
              <div key={`${studentId}-${sessionIndex}`}>
                <a href={`https://go.clipboard.app/schedule/session/${session.sessionId}`} target="_blank" rel="noopener noreferrer">{displayName}</a> is scheduled to have <b>{session.activity}</b> at <b><u>{session.location}</u></b> from <b>{startTime}</b> to <b>{endTime}</b>.
              </div>
            );
            })}
            {index < matchedStudents.length - 1 && <br />}
          </div>
        );
      })}
    </Wrapper>
  );
};

export default ClipboardStudentSessionAlert;
