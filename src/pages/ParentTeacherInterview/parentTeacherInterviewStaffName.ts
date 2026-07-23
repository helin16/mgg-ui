import iVStaff from '../../types/Synergetic/iVStaff';

const getParentTeacherInterviewStaffDisplayName = (staff?: Partial<iVStaff> | null) => {
  const title = `${staff?.StaffTitle || ''}`.trim();
  const preferred = `${staff?.StaffPreferred || ''}`.trim();
  const surname = `${staff?.StaffSurname || ''}`.trim();
  const formattedName = [title, preferred, surname].filter(Boolean).join(' ').trim();
  return formattedName || `${staff?.StaffNameInternal || ''}`.trim();
};

export default getParentTeacherInterviewStaffDisplayName;
