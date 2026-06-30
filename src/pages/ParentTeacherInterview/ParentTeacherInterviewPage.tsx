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
import iParentTeacherInterviewScheduleRow from '../../types/ParentTeacherInterview/iParentTeacherInterviewScheduleRow';
import MggsModuleService from '../../services/Module/MggsModuleService';
import AuthService from '../../services/AuthService';
import {ROLE_ID_ADMIN} from '../../types/modules/iRole';
import iParentTeacherInterviewModuleSettings from '../../types/ParentTeacherInterview/iParentTeacherInterviewModuleSettings';
import ParentTeacherInterviewCalendarService from '../../services/ParentTeacherInterview/ParentTeacherInterviewCalendarService';
import ParentTeacherInterviewSchedulePanel from './components/ParentTeacherInterviewSchedulePanel';

const getDefaultScheduleDateTime = (value?: string) => {
  const normalizedValue = `${value || ''}`.trim();
  if (normalizedValue === '') {
    return null;
  }

  return moment(normalizedValue, moment.HTML5_FMT.DATETIME_LOCAL, true).isValid()
    ? normalizedValue
    : null;
};

const getMissingSelectionDefaults = (settings: iParentTeacherInterviewModuleSettings) => {
  const missingFields: string[] = [];
  const subject = `${settings?.parentTeacherInterviewCalendar?.subject || ''}`.trim();
  const startDateTime = getDefaultScheduleDateTime(settings?.parentTeacherInterviewCalendar?.startDateTime);
  const endDateTime = getDefaultScheduleDateTime(settings?.parentTeacherInterviewCalendar?.endDateTime);

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

const ParentTeacherInterviewPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [staffs, setStaffs] = useState<iVStaff[]>([]);
  const [categories, setCategories] = useState<iSynLuStaffCategory[]>([]);
  const [searchText, setSearchText] = useState('');
  const [categoryCodes, setCategoryCodes] = useState<string[]>([]);
  const [selectedStaffIds, setSelectedStaffIds] = useState<number[]>([]);
  const [scheduleRows, setScheduleRows] = useState<iParentTeacherInterviewScheduleRow[]>([]);
  const [currentStep, setCurrentStep] = useState<'select' | 'schedule'>('select');
  const [moduleSettings, setModuleSettings] = useState<iParentTeacherInterviewModuleSettings>({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setLoadFailed(false);

    Promise.all([
      SynVStaffService.getStaffList({
        where: JSON.stringify({
          ActiveFlag: true,
          StaffDepartment: [SynLuDepartmentCodes.TS],
        }),
      }),
      SynLuStaffCategoryService.getAll({
        where: JSON.stringify({
          ActiveFlag: true,
        }),
        sort: 'Code:ASC',
      }),
    ])
      .then(([staffList, categoryList]) => {
        if (isCancelled) {
          return;
        }
        setStaffs(staffList);
        setCategories(categoryList.filter(category => `${category.Code || ''}`.trim() !== ''));
      })
      .catch(error => {
        if (isCancelled) {
          return;
        }
        setLoadFailed(true);
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
  }, []);

  useEffect(() => {
    let isCancelled = false;

    Promise.all([
      MggsModuleService.getModule(MGGS_MODULE_ID_PARENT_TEACHER_INTERVIEW),
      AuthService.isModuleRole(MGGS_MODULE_ID_PARENT_TEACHER_INTERVIEW, ROLE_ID_ADMIN),
    ])
      .then(([module, canCreate]) => {
        if (isCancelled) {
          return;
        }
        setModuleSettings(module?.settings || {});
        setIsAdmin(canCreate === true);
      })
      .catch(error => {
        if (isCancelled) {
          return;
        }
        Toaster.showApiError(error);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    scheduleRows.forEach(row => {
      if (!row.startDateTime || !row.endDateTime) {
        return;
      }

      const startMoment = moment(row.startDateTime, moment.HTML5_FMT.DATETIME_LOCAL, true);
      const endMoment = moment(row.endDateTime, moment.HTML5_FMT.DATETIME_LOCAL, true);
      if (!startMoment.isValid() || !endMoment.isValid() || endMoment.isBefore(startMoment)) {
        return;
      }

      const retrievalRangeKey = `${row.startDateTime}|${row.endDateTime}`;
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
        startDateTime: startMoment.format(),
        endDateTime: endMoment.format(),
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
    });
  }, [categoryCodes, searchText, staffs]);

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
    const defaultStartDateTime = getDefaultScheduleDateTime(moduleSettings?.parentTeacherInterviewCalendar?.startDateTime);
    const defaultEndDateTime = getDefaultScheduleDateTime(moduleSettings?.parentTeacherInterviewCalendar?.endDateTime);

    setScheduleRows(selectedStaffs.map(staff => ({
      staffId: staff.StaffID,
      staffName: staff.StaffNameInternal,
      staffCode: staff.SchoolStaffCode,
      staffEmail: `${staff.StaffOccupEmail || ''}`.trim() || null,
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
        try {
          const response = await ParentTeacherInterviewCalendarService.createCalendarEvent({
            staffId: row.staffId,
            subject,
            bodyText,
            startDateTime: moment(row.startDateTime).format(),
            endDateTime: moment(row.endDateTime).format(),
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

    if (!targetRow || subject === '' || bodyText === '' || !targetRow.startDateTime || !targetRow.endDateTime) {
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
        startDateTime: moment(targetRow.startDateTime).format(),
        endDateTime: moment(targetRow.endDateTime).format(),
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
          <h5>No active teaching staff found.</h5>
        </SectionDiv>
      );
    }

    return (
        <ParentTeacherInterviewStaffSelectionPanel
          categoryCodes={categoryCodes}
          categories={categories}
          searchText={searchText}
          selectedStaffIds={selectedStaffIds}
          staffs={filteredStaffs}
          onCategoryCodesChange={setCategoryCodes}
          onSearchTextChange={setSearchText}
          onToggleAllVisible={handleToggleAllVisible}
          onToggleStaff={updateSelectedStaffId}
        onNext={handleNext}
      />
    );
  };

  const getSchedulePreview = () => {
    return (
      <ParentTeacherInterviewSchedulePanel
        isAdmin={isAdmin}
        isSubmitting={isSubmitting}
        missingSettingsMessage={missingSettingsMessage}
        rows={scheduleRows}
        onBack={() => setCurrentStep('select')}
        onDateTimeChange={handleScheduleDateTimeChange}
        onRetryRetrieval={handleRetryRetrieval}
        onRetryCreate={handleRetryCreateEventLink}
        onSubmit={handleCreateEventLinks}
      />
    );
  };

  return (
    <Page
      title={<h3>Parent Teacher Interview</h3>}
      moduleId={MGGS_MODULE_ID_PARENT_TEACHER_INTERVIEW}
      AdminPage={ParentTeacherInterviewAdminPage}
    >
      {currentStep === 'select' ? getSelectionContent() : getSchedulePreview()}
    </Page>
  );
};

export default ParentTeacherInterviewPage;
