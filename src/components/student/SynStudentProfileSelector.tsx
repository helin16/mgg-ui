import { useCallback } from "react";
import {iSelectBox, iSelectOptionProps} from "../common/SelectBox";
import AsyncSelectBox from "../common/AsyncSelectBox";
import { debounce, uniqBy } from "lodash";
import UtilsService from "../../services/UtilsService";
import { OP_LIKE, OP_OR } from "../../helper/ServiceHelper";
import SynVStudentService from "../../services/Synergetic/Student/SynVStudentService";
import Toaster from "../../services/Toaster";
import { iVPastAndCurrentStudent } from "../../types/Synergetic/Student/iVStudent";

type iStudentOption = iSelectOptionProps & {
  data: iVPastAndCurrentStudent;
};

type iSynStudentSelector = iSelectBox & {
  onChange?: (
    selected: iVPastAndCurrentStudent[] | iVPastAndCurrentStudent | null
  ) => void;
  value?:
    | iVPastAndCurrentStudent[]
    | iVPastAndCurrentStudent
    | iStudentOption[]
    | iStudentOption
    | null;
};

export const getStudentOption = (student: iVPastAndCurrentStudent): iSelectOptionProps => ({
  value: `${student.StudentID}`,
  label: `${student.StudentIsPastFlag ? '[Past] ' : ''}[${student.StudentID}] ${student.StudentGiven1} ${student.StudentSurname}`,
  data: student
});

const isStudentOption = (value: unknown): value is iStudentOption => {
  return Boolean(value && typeof value === 'object' && 'data' in (value as iStudentOption));
};

const SynStudentProfileSelector = ({onChange, ...props}: iSynStudentSelector) => {
  const selectedValue = props.value;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchStudent = useCallback(
    debounce((inputValue: string, callback: (options: any[]) => void) => {
      // fetchOptions(inputValue).then(callback);
      SynVStudentService.getVPastAndCurrentStudentAll({
        where: JSON.stringify({
          ...(UtilsService.isNumeric(`${inputValue || ""}`.trim())
            ? { StudentID: `${inputValue || ""}`.trim() }
            : {
                [OP_OR]: [
                  { StudentGiven1: { [OP_LIKE]: `%${inputValue}%` } },
                  { StudentGiven2: { [OP_LIKE]: `%${inputValue}%` } },
                  { StudentPreferred: { [OP_LIKE]: `%${inputValue}%` } },
                  { StudentSurname: { [OP_LIKE]: `%${inputValue}%` } },
                  { StudentNameExternal: { [OP_LIKE]: `%${inputValue}%` } },
                  { StudentNameInternal: { [OP_LIKE]: `%${inputValue}%` } }
                ]
              })
        }),
        sort: "FileYear:DESC,FileSemester:DESC",
        perPage: "30",
        currentPage: 1
      })
        .then(resp => {
          callback(
            uniqBy(resp.data || [], data => data.StudentID).map(
              (data: iVPastAndCurrentStudent) => getStudentOption(data)
            )
          );
        })
        .catch(err => {
          Toaster.showApiError(err);
        });
    }, 700), // 300ms debounce delay
    []
  );

  return (
    <AsyncSelectBox
      {...props}
      className={`student-selector ${props.className || ""}`}
      value={
        selectedValue === null || selectedValue === undefined
          ? null
          : props.isMulti === true
            ? (selectedValue as Array<iVPastAndCurrentStudent | iStudentOption>).map(student => (
              isStudentOption(student) ? student : getStudentOption(student)
            ))
            : isStudentOption(selectedValue)
              ? selectedValue
              : getStudentOption(selectedValue as iVPastAndCurrentStudent)
      }
      onChange={value => {
        if (!onChange) {
          return;
        }

        if (value === null) {
          onChange(null);
          return;
        }

        onChange(
          props.isMulti === true
            ? value.map((val: iSelectOptionProps) => val.data)
            : value.data
        );
      }}
      loadOptions={searchStudent}
    />
  );
};

export default SynStudentProfileSelector;
