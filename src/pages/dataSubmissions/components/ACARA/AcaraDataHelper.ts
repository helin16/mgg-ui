
// "Please enter a number of 1, 2, 3 or 9 for the sex (gender) of the student:
// 1 = Male;
// 2 = Female;
// 3 = Another term/Non-binary (including use a different term)
// 9 = Where not stated or adequately described."
import {iVPastAndCurrentStudent} from '../../../../types/Synergetic/iVStudent';

const translateGender = (student: iVPastAndCurrentStudent): string => {
  switch (`${student.StudentGender}`.trim().toUpperCase()) {
    case 'M': {
      return '1';
    }
    case 'F': {
      return '2';
    }
    default: {
      return '9';
    }
  }
}

// "Please enter a number of 1, 2, 3, 4 or 9 for the Aboriginal and/or Torres Strait Islander status of the student:
// 1 = Aboriginal but not Torres Strait Islander Origin;
// 2 = Torres Strait Islander but not Aboriginal Origin;
// 3 = Both Aboriginal and Torres Strait Islander Origin;
// 4 = Neither Aboriginal nor Torres Strait Islander Origin;
// 9 = Not stated/Unknown."
const translateATSIStatus = (student: iVPastAndCurrentStudent): string => {
  if (student.IndigenousFlag === true && student.StudentTSIFlag === true) {
    return '3';
  }

  if (student.IndigenousFlag !== true &&  student.StudentTSIFlag === true) {
    return '2';
  }

  if (student.IndigenousFlag === true &&  student.StudentTSIFlag !== true) {
    return '3';
  }

  if (student.IndigenousFlag !== true &&  student.StudentTSIFlag !== true) {
    return '4';
  }

  return '9'
}

const AcaraDataHelper = {
  translateGender,
  translateATSIStatus,
};

export default AcaraDataHelper;
