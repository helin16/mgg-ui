type iParentTeacherInterviewModuleSettings = {
  parentTeacherInterviewCalendar?: {
    subject?: string;
    bodyText?: string;
    isAllDay?: boolean;
    allowUserChange?: boolean;
    startDateTime?: string;
    endDateTime?: string;
    excludedClassDescriptionKeywords?: string[];
  };
};

export default iParentTeacherInterviewModuleSettings;
