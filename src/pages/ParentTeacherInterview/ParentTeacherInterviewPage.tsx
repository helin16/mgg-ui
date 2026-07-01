import React, {useEffect, useMemo, useState} from 'react';
import moment from 'moment';
import Page from '../../layouts/Page';
import {MGGS_MODULE_ID_PARENT_TEACHER_INTERVIEW} from '../../types/modules/iModuleUser';
import ParentTeacherInterviewAdminPage from './ParentTeacherInterviewAdminPage';
import SynVStaffService from '../../services/Synergetic/SynVStaffService';
import SynLuStaffCategoryService from '../../services/Synergetic/Lookup/SynLuStaffCategoryService';
import Toaster from '../../services/Toaster';
import PageLoadingSpinner from '../../components/common/PageLoadingSpinner';
import PageNotFound from '../../components/PageNotFound';
import SectionDiv from '../../components/common/SectionDiv';
import ParentTeacherInterviewStaffSelectionPanel from './components/ParentTeacherInterviewStaffSelectionPanel';
import SynLuDepartmentCodes from '../../types/Synergetic/Lookup/SynLuDepartmentCodes';
import iVStaff from '../../types/Synergetic/iVStaff';
import iSynLuStaffCategory from '../../types/Synergetic/Lookup/iSynLuStaffCategory';
import iSynLuDepartment from '../../types/Synergetic/Lookup/iSynLuDepartment';
import SynLuStaffCategoryCodes from '../../types/Synergetic/Lookup/SynLuStaffCategoryCodes';
import iParentTeacherInterviewScheduleRow from '../../types/ParentTeacherInterview/iParentTeacherInterviewScheduleRow';
import MggsModuleService from '../../services/Module/MggsModuleService';
import AuthService from '../../services/AuthService';
import {ROLE_ID_ADMIN} from '../../types/modules/iRole';
import iParentTeacherInterviewModuleSettings from '../../types/ParentTeacherInterview/iParentTeacherInterviewModuleSettings';
import ParentTeacherInterviewCalendarService from '../../services/ParentTeacherInterview/ParentTeacherInterviewCalendarService';
import ParentTeacherInterviewSchedulePanel from './components/ParentTeacherInterviewSchedulePanel';
import SynLuDepartmentService from '../../services/Synergetic/Lookup/SynLuDepartmentService';
import SynVStudentClassService from '../../services/Synergetic/Student/SynVStudentClassService';
import iSynVStudentClass from '../../types/Synergetic/Student/iSynVStudentClass';
import {HEADER_NAME_SELECTING_FIELDS, MAX_PAGE_SIZE} from '../../services/AppService';

const isValidLocalDateTime = (value?: string | null) => {
  return moment(`${value || ''}`.trim(), moment.HTML5_FMT.DATETIME_LOCAL, true).isValid();
};

const isValidLocalDate = (value?: string | null) => {
  return moment(`${value || ''}`.trim(), moment.HTML5_FMT.DATE, true).isValid();
};

const getDefaultScheduleDateTime = (value?: string) => {
  const normalizedValue = `${value || ''}`.trim();
  if (normalizedValue === '') {
    return null;
  }

  return moment(normalizedValue, moment.HTML5_FMT.DATETIME_LOCAL, true).isValid()
    ? normalizedValue
    : null;
};

const getDefaultScheduleDate = (value?: string) => {
  const normalizedValue = `${value || ''}`.trim();
  if (normalizedValue === '') {
    return null;
  }

  return moment(normalizedValue, moment.HTML5_FMT.DATE, true).isValid()
    ? normalizedValue
    : null;
};

const getMissingSelectionDefaults = (settings: iParentTeacherInterviewModuleSettings) => {
  const missingFields: string[] = [];
  const subject = `${settings?.parentTeacherInterviewCalendar?.subject || ''}`.trim();
  const isAllDay = settings?.parentTeacherInterviewCalendar?.isAllDay === true;
  const startDateTime = isAllDay
    ? getDefaultScheduleDate(settings?.parentTeacherInterviewCalendar?.startDateTime)
    : getDefaultScheduleDateTime(settings?.parentTeacherInterviewCalendar?.startDateTime);
  const endDateTime = isAllDay
    ? getDefaultScheduleDate(settings?.parentTeacherInterviewCalendar?.endDateTime)
    : getDefaultScheduleDateTime(settings?.parentTeacherInterviewCalendar?.endDateTime);

  if (subject === '') {
    missingFields.push('Subject');
  }
  if (startDateTime === null) {
    missingFields.push('Default Interview Start Time');
  }
  if (endDateTime === null) {
    missingFields.push('Default Interview End Time');
  }

  return missingFields;
};

const getRetrievalWindow = (row: iParentTeacherInterviewScheduleRow) => {
  if (row.isAllDay) {
    if (!isValidLocalDate(row.startDateTime) || !isValidLocalDate(row.endDateTime)) {
      return null;
    }

    const start = moment(row.startDateTime, moment.HTML5_FMT.DATE, true).startOf('day');
    const end = moment(row.endDateTime, moment.HTML5_FMT.DATE, true).endOf('day');
    if (end.isBefore(start)) {
      return null;
    }

    return {
      start,
      end,
      rangeKey: `allDay|${row.startDateTime}|${row.endDateTime}`,
    };
  }

  if (!isValidLocalDateTime(row.startDateTime) || !isValidLocalDateTime(row.endDateTime)) {
    return null;
  }

  const start = moment(row.startDateTime, moment.HTML5_FMT.DATETIME_LOCAL, true);
  const end = moment(row.endDateTime, moment.HTML5_FMT.DATETIME_LOCAL, true);
  if (end.isBefore(start)) {
    return null;
  }

  return {
    start,
    end,
    rangeKey: `timed|${row.startDateTime}|${row.endDateTime}`,
  };
};

const getCreateWindow = (row: iParentTeacherInterviewScheduleRow) => {
  if (row.isAllDay) {
    if (!isValidLocalDate(row.startDateTime) || !isValidLocalDate(row.endDateTime)) {
      return null;
    }

    const start = moment(row.startDateTime, moment.HTML5_FMT.DATE, true).startOf('day');
    const end = moment(row.endDateTime, moment.HTML5_FMT.DATE, true).add(1, 'day').startOf('day');
    if (!end.isAfter(start)) {
      return null;
    }

    return {
      startDateTime: start.format(),
      endDateTime: end.format(),
    };
  }

  if (!isValidLocalDateTime(row.startDateTime) || !isValidLocalDateTime(row.endDateTime)) {
    return null;
  }

  const start = moment(row.startDateTime, moment.HTML5_FMT.DATETIME_LOCAL, true);
  const end = moment(row.endDateTime, moment.HTML5_FMT.DATETIME_LOCAL, true);
  if (!end.isAfter(start)) {
    return null;
  }

  return {
    startDateTime: start.format(),
    endDateTime: end.format(),
  };
};

const toAllDayDateValue = (value?: string | null) => {
  if (isValidLocalDateTime(value)) {
    return moment(value, moment.HTML5_FMT.DATETIME_LOCAL, true).format(moment.HTML5_FMT.DATE);
  }
  if (isValidLocalDate(value)) {
    return `${value}`;
  }
  return null;
};

const fromAllDayDateValue = (value: string | null, defaultTime: '08:00' | '16:00') => {
  if (!isValidLocalDate(value)) {
    return null;
  }

  return `${value}T${defaultTime}`;
};

const normalizeExcludedClassDescriptionKeywords = (keywords?: string[]) => {
  return Array.from(new Set(
    (keywords || [])
      .map(keyword => `${keyword || ''}`.trim())
      .filter(keyword => keyword !== '')
  ));
};

const hasExcludedClassDescriptionKeyword = (classDescription: string, excludedKeywords: string[]) => {
  const normalizedDescription = `${classDescription || ''}`.trim().toLowerCase();
  if (normalizedDescription === '') {
    return false;
  }

  return excludedKeywords.some(keyword => normalizedDescription.includes(keyword.toLowerCase()));
};

const getEligibleStaffIdMap = (studentClasses: iSynVStudentClass[], excludedKeywords: string[]) => {
  return studentClasses.reduce((map, studentClass) => {
    if (studentClass.FileType !== 'A' || studentClass.CurrentSemesterOnlyFlag !== true) {
      return map;
    }

    if (hasExcludedClassDescriptionKeyword(studentClass.ClassDescription, excludedKeywords)) {
      return map;
    }

    if (!studentClass.StaffID) {
      return map;
    }

    return {
      ...map,
      [studentClass.StaffID]: true,
    };
  }, {} as {[key: number]: boolean});
};

const getEligibilityRuleText = (excludedKeywords: string[]) => {
  const baseRuleText = 'Only staff with at least one current-semester academic class (FileType = A, CurrentSemesterOnlyFlag = 1) are shown.';
  if (excludedKeywords.length <= 0) {
    return baseRuleText;
  }

  return `${baseRuleText} Classes with descriptions containing any excluded keyword are ignored: ${excludedKeywords.join(', ')}.`;
};

const sortStaffClasses = <T extends {ClassCode: string}>(rows: T[]) => {
  return [...rows].sort((classA, classB) => {
    return `${classA.ClassCode || ''}`.localeCompare(`${classB.ClassCode || ''}`, undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  });
};

const getStaffClassesByStaffId = (studentClasses: iSynVStudentClass[], excludedKeywords: string[]) => {
  return studentClasses.reduce((map, studentClass) => {
    if (studentClass.FileType !== 'A' || studentClass.CurrentSemesterOnlyFlag !== true) {
      return map;
    }

    if (hasExcludedClassDescriptionKeyword(studentClass.ClassDescription, excludedKeywords)) {
      return map;
    }

    if (!studentClass.StaffID) {
      return map;
    }

    const staffId = studentClass.StaffID;
    const classCode = `${studentClass.ClassCode || ''}`.trim();
    if (classCode === '') {
      return map;
    }

    const currentStaffClasses = map[staffId] || {};
    const currentClass = currentStaffClasses[classCode] || {
      ClassCode: classCode,
      ClassDescription: `${studentClass.ClassDescription || ''}`.trim(),
      StudentCount: 0,
    };

    return {
      ...map,
      [staffId]: {
        ...currentStaffClasses,
        [classCode]: {
          ...currentClass,
          StudentCount: currentClass.StudentCount + 1,
        },
      },
    };
  }, {} as {[key: number]: {[key: string]: {ClassCode: string; ClassDescription: string; StudentCount: number}}});
};

const ParentTeacherInterviewPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [staffs, setStaffs] = useState<iVStaff[]>([]);
  const [categories, setCategories] = useState<iSynLuStaffCategory[]>([]);
  const [departments, setDepartments] = useState<iSynLuDepartment[]>([]);
  const [searchText, setSearchText] = useState('');
  const [categoryCodes, setCategoryCodes] = useState<string[]>([SynLuStaffCategoryCodes.TCHO]);
  const [departmentCodes, setDepartmentCodes] = useState<string[]>([
    SynLuDepartmentCodes.TS,
    SynLuDepartmentCodes.ELCS,
  ]);
  const [selectedStaffIds, setSelectedStaffIds] = useState<number[]>([]);
  const [scheduleRows, setScheduleRows] = useState<iParentTeacherInterviewScheduleRow[]>([]);
  const [currentStep, setCurrentStep] = useState<'select' | 'schedule'>('select');
  const [moduleSettings, setModuleSettings] = useState<iParentTeacherInterviewModuleSettings>({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [staffClassesByStaffId, setStaffClassesByStaffId] = useState<
    {[key: number]: {ClassCode: string; ClassDescription: string; StudentCount: number}[]}
  >({});
  const [activeStaffClassesStaffId, setActiveStaffClassesStaffId] = useState<number | null>(null);

  const loadModuleContext = React.useCallback(async () => {
    try {
      const [module, canCreate] = await Promise.all([
        MggsModuleService.getModule(MGGS_MODULE_ID_PARENT_TEACHER_INTERVIEW),
        AuthService.isModuleRole(MGGS_MODULE_ID_PARENT_TEACHER_INTERVIEW, ROLE_ID_ADMIN),
      ]);
      setModuleSettings(module?.settings || {});
      setIsAdmin(canCreate === true);
    } catch (error) {
      Toaster.showApiError(error);
    }
  }, []);

  useEffect(() => {
    setSelectedStaffIds([]);
  }, [searchText, categoryCodes, departmentCodes]);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setLoadFailed(false);

    Promise.all([
      SynVStaffService.getStaffList({
        where: JSON.stringify({
          ActiveFlag: true,
        }),
      }),
      SynLuStaffCategoryService.getAll({
        where: JSON.stringify({
          ActiveFlag: true,
        }),
        sort: 'Code:ASC',
      }),
      SynLuDepartmentService.getAll({
        where: JSON.stringify({
          ActiveFlag: true,
        }),
        sort: 'Code:ASC',
      }),
      SynVStudentClassService.getAll(
        {
          where: JSON.stringify({
            FileType: 'A',
            CurrentSemesterOnlyFlag: true,
          }),
          perPage: MAX_PAGE_SIZE,
        },
        {
          headers: {
            [HEADER_NAME_SELECTING_FIELDS]: JSON.stringify([
              'StaffID',
              'ClassCode',
              'FileType',
              'CurrentSemesterOnlyFlag',
              'ClassDescription',
            ]),
          },
        }
      ),
    ])
      .then(([staffList, categoryList, departmentList, studentClassResult]) => {
        if (isCancelled) {
          return;
        }
        const excludedKeywords = normalizeExcludedClassDescriptionKeywords(
          moduleSettings?.parentTeacherInterviewCalendar?.excludedClassDescriptionKeywords
        );
        const eligibleStaffIdMap = getEligibleStaffIdMap(studentClassResult?.data || [], excludedKeywords);
        const nextStaffClassesByStaffId = getStaffClassesByStaffId(studentClassResult?.data || [], excludedKeywords);

        setStaffs(staffList.filter(staff => eligibleStaffIdMap[staff.StaffID] === true));
        setStaffClassesByStaffId(Object.keys(nextStaffClassesByStaffId).reduce((map, staffId) => {
          const classMap = nextStaffClassesByStaffId[Number(staffId)] || {};
          return {
            ...map,
            [Number(staffId)]: sortStaffClasses(Object.values(classMap)),
          };
        }, {} as {[key: number]: {ClassCode: string; ClassDescription: string; StudentCount: number}[]}));
        setCategories(categoryList.filter(category => `${category.Code || ''}`.trim() !== ''));
        setDepartments(departmentList.filter(department => `${department.Code || ''}`.trim() !== ''));
      })
      .catch(error => {
        if (isCancelled) {
          return;
        }
        setLoadFailed(true);
        setStaffClassesByStaffId({});
        Toaster.showApiError(error);
      })
      .finally(() => {
        if (isCancelled) {
          return;
        }
        setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [moduleSettings]);

  useEffect(() => {
    loadModuleContext();
  }, [loadModuleContext]);

  useEffect(() => {
    scheduleRows.forEach(row => {
      const retrievalWindow = getRetrievalWindow(row);
      if (!retrievalWindow) {
        return;
      }

      const {start, end, rangeKey: retrievalRangeKey} = retrievalWindow;
      if (row.retrievalStatus === 'LOADING' || row.retrievalRangeKey === retrievalRangeKey) {
        return;
      }

      setScheduleRows(currentRows => currentRows.map(currentRow => currentRow.staffId === row.staffId ? {
        ...currentRow,
        retrievalStatus: 'LOADING',
        retrievalMessage: null,
        retrievalRangeKey,
        events: [],
      } : currentRow));

      ParentTeacherInterviewCalendarService.getCalendarEvents({
        staffId: row.staffId,
        startDateTime: start.format(),
        endDateTime: end.format(),
      })
        .then(response => {
          setScheduleRows(currentRows => currentRows.map(currentRow => {
            if (currentRow.staffId !== row.staffId || currentRow.retrievalRangeKey !== retrievalRangeKey) {
              return currentRow;
            }
            return {
              ...currentRow,
              retrievalStatus: response.events.length > 0 ? 'READY' : 'EMPTY',
              retrievalMessage: null,
              events: response.events || [],
            };
          }));
        })
        .catch(error => {
          setScheduleRows(currentRows => currentRows.map(currentRow => {
            if (currentRow.staffId !== row.staffId || currentRow.retrievalRangeKey !== retrievalRangeKey) {
              return currentRow;
            }
            return {
              ...currentRow,
              retrievalStatus: 'FAILED',
              retrievalMessage: error?.response?.data?.message || error?.message || 'Failed to load existing events.',
              events: [],
            };
          }));
        });
    });
  }, [scheduleRows]);

  const filteredStaffs = useMemo(() => {
    const normalizedSearchText = `${searchText}`.trim().toLowerCase();
    return staffs.filter(staff => {
      if (categoryCodes.length > 0 && !categoryCodes.includes(`${staff.StaffCategory || ''}`)) {
        return false;
      }

      if (departmentCodes.length > 0 && !departmentCodes.includes(`${staff.StaffDepartment || ''}`)) {
        return false;
      }

      if (normalizedSearchText === '') {
        return true;
      }

      const searchTargets = [
        `${staff.StaffID || ''}`,
        `${staff.StaffNameInternal || ''}`,
        `${staff.StaffPreferredName || ''}`,
      ]
        .join(' ')
        .toLowerCase();

      return searchTargets.includes(normalizedSearchText);
    }).sort((staffA, staffB) => {
      const surnameComparison = `${staffA.StaffSurname || ''}`.localeCompare(`${staffB.StaffSurname || ''}`);
      if (surnameComparison !== 0) {
        return surnameComparison;
      }
      return `${staffA.StaffNameInternal || ''}`.localeCompare(`${staffB.StaffNameInternal || ''}`);
    });
  }, [categoryCodes, departmentCodes, searchText, staffs]);

  const eligibilityRuleText = useMemo(() => {
    return getEligibilityRuleText(normalizeExcludedClassDescriptionKeywords(
      moduleSettings?.parentTeacherInterviewCalendar?.excludedClassDescriptionKeywords
    ));
  }, [moduleSettings]);

  useEffect(() => {
    if (activeStaffClassesStaffId !== null && !staffs.some(staff => staff.StaffID === activeStaffClassesStaffId)) {
      setActiveStaffClassesStaffId(null);
    }
  }, [activeStaffClassesStaffId, staffs]);

  const selectedStaffs = useMemo(() => {
    const selectedStaffIdMap = selectedStaffIds.reduce((map, staffId) => {
      return {
        ...map,
        [staffId]: true,
      };
    }, {} as {[key: number]: boolean});
    return staffs.filter(staff => selectedStaffIdMap[staff.StaffID] === true);
  }, [selectedStaffIds, staffs]);

  const updateSelectedStaffId = (staffId: number, checked: boolean) => {
    setSelectedStaffIds(currentStaffIds => {
      if (checked) {
        return currentStaffIds.includes(staffId) ? currentStaffIds : [...currentStaffIds, staffId];
      }
      return currentStaffIds.filter(currentStaffId => currentStaffId !== staffId);
    });
  };

  const handleToggleAllVisible = (checked: boolean) => {
    const visibleStaffIds = filteredStaffs.map(staff => staff.StaffID);
    setSelectedStaffIds(currentStaffIds => {
      const remainingStaffIds = currentStaffIds.filter(currentStaffId => !visibleStaffIds.includes(currentStaffId));
      if (!checked) {
        return remainingStaffIds;
      }
      return [...remainingStaffIds, ...visibleStaffIds];
    });
  };

  const handleNext = () => {
    const defaultIsAllDay = moduleSettings?.parentTeacherInterviewCalendar?.isAllDay === true;
    const defaultStartDateTime = defaultIsAllDay
      ? getDefaultScheduleDate(moduleSettings?.parentTeacherInterviewCalendar?.startDateTime)
      : getDefaultScheduleDateTime(moduleSettings?.parentTeacherInterviewCalendar?.startDateTime);
    const defaultEndDateTime = defaultIsAllDay
      ? getDefaultScheduleDate(moduleSettings?.parentTeacherInterviewCalendar?.endDateTime)
      : getDefaultScheduleDateTime(moduleSettings?.parentTeacherInterviewCalendar?.endDateTime);

    setScheduleRows(selectedStaffs.map(staff => ({
      staffId: staff.StaffID,
      staffName: staff.StaffNameInternal,
      staffCode: staff.SchoolStaffCode,
      staffEmail: `${staff.StaffOccupEmail || ''}`.trim() || null,
      isAllDay: defaultIsAllDay,
      startDateTime: defaultStartDateTime,
      endDateTime: defaultEndDateTime,
      retrievalStatus: 'IDLE',
      retrievalMessage: null,
      retrievalRangeKey: null,
      events: [],
      createStatus: 'IDLE',
      createMessage: null,
      createResult: null,
    })));
    setCurrentStep('schedule');
  };

  const handleScheduleDateTimeChange = (staffId: number, fieldName: 'startDateTime' | 'endDateTime', value: string) => {
    setScheduleRows(currentRows => currentRows.map(row => {
      if (row.staffId !== staffId) {
        return row;
      }
      return {
        ...row,
        [fieldName]: value === '' ? null : value,
        retrievalStatus: 'IDLE',
        retrievalMessage: null,
        retrievalRangeKey: null,
        events: [],
        createStatus: 'IDLE',
        createMessage: null,
        createResult: null,
      };
    }));
  };

  const handleScheduleAllDayChange = (staffId: number, checked: boolean) => {
    setScheduleRows(currentRows => currentRows.map(row => {
      if (row.staffId !== staffId) {
        return row;
      }

      return {
        ...row,
        isAllDay: checked,
        startDateTime: checked ? toAllDayDateValue(row.startDateTime) : fromAllDayDateValue(row.startDateTime, '08:00'),
        endDateTime: checked ? toAllDayDateValue(row.endDateTime) : fromAllDayDateValue(row.endDateTime, '16:00'),
        retrievalStatus: 'IDLE',
        retrievalMessage: null,
        retrievalRangeKey: null,
        events: [],
        createStatus: 'IDLE',
        createMessage: null,
        createResult: null,
      };
    }));
  };

  const handleRetryRetrieval = (staffId: number) => {
    setScheduleRows(currentRows => currentRows.map(row => row.staffId === staffId ? {
      ...row,
      retrievalStatus: 'IDLE',
      retrievalMessage: null,
      retrievalRangeKey: null,
      events: [],
    } : row));
  };

  const missingSettingsMessage = useMemo(() => {
    const subject = `${moduleSettings?.parentTeacherInterviewCalendar?.subject || ''}`.trim();
    const bodyText = `${moduleSettings?.parentTeacherInterviewCalendar?.bodyText || ''}`.trim();

    if (subject !== '' && bodyText !== '') {
      return null;
    }

    return 'Parent Teacher Interview module settings must define both subject and body text before event links can be created.';
  }, [moduleSettings]);

  const missingSelectionDefaults = useMemo(
    () => getMissingSelectionDefaults(moduleSettings),
    [moduleSettings]
  );

  const handleCreateEventLinks = async () => {
    const subject = `${moduleSettings?.parentTeacherInterviewCalendar?.subject || ''}`.trim();
    const bodyText = `${moduleSettings?.parentTeacherInterviewCalendar?.bodyText || ''}`.trim();

    if (subject === '' || bodyText === '') {
      return;
    }

    setIsSubmitting(true);
    setScheduleRows(currentRows => currentRows.map(row => ({
      ...row,
      createStatus: 'SUBMITTING',
      createMessage: null,
      createResult: null,
    })));

    try {
      await Promise.all(scheduleRows.map(async row => {
        const createWindow = getCreateWindow(row);
        if (!createWindow) {
          return;
        }

        try {
          const response = await ParentTeacherInterviewCalendarService.createCalendarEvent({
            staffId: row.staffId,
            subject,
            bodyText,
            startDateTime: createWindow.startDateTime,
            endDateTime: createWindow.endDateTime,
            isAllDay: row.isAllDay,
          });
          setScheduleRows(currentRows => currentRows.map(currentRow => currentRow.staffId === row.staffId ? {
            ...currentRow,
            createStatus: response.outcome,
            createMessage: response.message,
            createResult: response,
          } : currentRow));
        } catch (error: any) {
          setScheduleRows(currentRows => currentRows.map(currentRow => currentRow.staffId === row.staffId ? {
            ...currentRow,
            createStatus: 'FAILED',
            createMessage: error?.response?.data?.message || error?.message || 'Failed to create event link.',
            createResult: null,
          } : currentRow));
        }
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetryCreateEventLink = async (staffId: number) => {
    const subject = `${moduleSettings?.parentTeacherInterviewCalendar?.subject || ''}`.trim();
    const bodyText = `${moduleSettings?.parentTeacherInterviewCalendar?.bodyText || ''}`.trim();
    const targetRow = scheduleRows.find(row => row.staffId === staffId);

    const createWindow = targetRow ? getCreateWindow(targetRow) : null;
    if (!targetRow || !createWindow || subject === '' || bodyText === '') {
      return;
    }

    setScheduleRows(currentRows => currentRows.map(row => row.staffId === staffId ? {
      ...row,
      createStatus: 'SUBMITTING',
      createMessage: null,
      createResult: null,
    } : row));

    try {
      const response = await ParentTeacherInterviewCalendarService.createCalendarEvent({
        staffId: targetRow.staffId,
        subject,
        bodyText,
        startDateTime: createWindow.startDateTime,
        endDateTime: createWindow.endDateTime,
        isAllDay: targetRow.isAllDay,
      });
      setScheduleRows(currentRows => currentRows.map(currentRow => currentRow.staffId === staffId ? {
        ...currentRow,
        createStatus: response.outcome,
        createMessage: response.message,
        createResult: response,
      } : currentRow));
    } catch (error: any) {
      setScheduleRows(currentRows => currentRows.map(currentRow => currentRow.staffId === staffId ? {
        ...currentRow,
        createStatus: 'FAILED',
        createMessage: error?.response?.data?.message || error?.message || 'Failed to create event link.',
        createResult: null,
      } : currentRow));
    }
  };

  const getSelectionContent = () => {
    if (isLoading) {
      return <PageLoadingSpinner />;
    }

    if (loadFailed) {
      return (
        <SectionDiv>
          <h5>Unable to load teaching staff.</h5>
          <p>Reload the page and try again.</p>
        </SectionDiv>
      );
    }

    if (missingSelectionDefaults.length > 0) {
      const highlightedMissingFields = missingSelectionDefaults.map((field, index) => {
        const isHighlightedField = field === 'Default Interview Start Time' || field === 'Default Interview End Time';
        return (
          <React.Fragment key={field}>
            {index > 0 ? ', ' : null}
            {isHighlightedField ? <strong>{field}</strong> : field}
          </React.Fragment>
        );
      });

      return (
        <PageNotFound
          title={'Parent Teacher Interview defaults are incomplete'}
          description={<>Missing fields: {highlightedMissingFields}</>}
        />
      );
    }

    if (staffs.length <= 0) {
      return (
        <SectionDiv>
          <h5>No eligible teaching staff found.</h5>
        </SectionDiv>
      );
    }

    return (
      <ParentTeacherInterviewStaffSelectionPanel
        categoryCodes={categoryCodes}
        categories={categories}
        departmentCodes={departmentCodes}
        departments={departments}
        searchText={searchText}
        selectedStaffIds={selectedStaffIds}
        staffs={filteredStaffs}
        eligibilityRuleText={eligibilityRuleText}
        staffClassesByStaffId={staffClassesByStaffId}
        activeStaffClassesStaffId={activeStaffClassesStaffId}
        onCategoryCodesChange={setCategoryCodes}
        onDepartmentCodesChange={setDepartmentCodes}
        onSearchTextChange={setSearchText}
        onToggleAllVisible={handleToggleAllVisible}
        onToggleStaff={updateSelectedStaffId}
        onNext={handleNext}
        onOpenStaffClasses={setActiveStaffClassesStaffId}
        onCloseStaffClasses={() => setActiveStaffClassesStaffId(null)}
      />
    );
  };

  const getSchedulePreview = () => {
    const eventTitleFilter = `${moduleSettings?.parentTeacherInterviewCalendar?.subject || ''}`.trim() || null;
    const allowUserChange = moduleSettings?.parentTeacherInterviewCalendar?.allowUserChange !== false;

    return (
      <ParentTeacherInterviewSchedulePanel
        allowUserChange={allowUserChange}
        eventTitleFilter={eventTitleFilter}
        isAdmin={isAdmin}
        isSubmitting={isSubmitting}
        missingSettingsMessage={missingSettingsMessage}
        rows={scheduleRows}
        onBack={() => setCurrentStep('select')}
        onAllDayChange={handleScheduleAllDayChange}
        onDateTimeChange={handleScheduleDateTimeChange}
        onRetryRetrieval={handleRetryRetrieval}
        onRetryCreate={handleRetryCreateEventLink}
        onSubmit={handleCreateEventLinks}
      />
    );
  };

  const handleAdminPageClose = async () => {
    setSearchText('');
    setCategoryCodes([SynLuStaffCategoryCodes.TCHO]);
    setDepartmentCodes([SynLuDepartmentCodes.TS, SynLuDepartmentCodes.ELCS]);
    setSelectedStaffIds([]);
    setScheduleRows([]);
    setCurrentStep('select');
    await loadModuleContext();
  };

  return (
    <Page
      title={<h3>Parent Teacher Interview</h3>}
      moduleId={MGGS_MODULE_ID_PARENT_TEACHER_INTERVIEW}
      AdminPage={ParentTeacherInterviewAdminPage}
      onAdminPageClose={handleAdminPageClose}
    >
      {currentStep === 'select' ? getSelectionContent() : getSchedulePreview()}
    </Page>
  );
};

export default ParentTeacherInterviewPage;
