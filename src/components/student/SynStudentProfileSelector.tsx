import { useCallback } from "react";
import {iSelectBox, iSelectOptionProps} from "../common/SelectBox";
import AsyncSelectBox from "../common/AsyncSelectBox";
import { debounce, uniqBy } from "lodash";
import UtilsService from "../../services/UtilsService";
import { OP_LIKE, OP_OR } from "../../helper/ServiceHelper";
import SynVStudentService from "../../services/Synergetic/Student/SynVStudentService";
import Toaster from "../../services/Toaster";
import { iVPastAndCurrentStudent } from "../../types/Synergetic/Student/iVStudent";
type iSynStudentSelector = iSelectBox & {
  onChange?: (
    selected: iVPastAndCurrentStudent[] | iVPastAndCurrentStudent | null
  ) => void;
};

const SynStudentProfileSelector = ({onChange, ...props}: iSynStudentSelector) => {

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
              (data: iVPastAndCurrentStudent) => ({
                value: data.StudentID,
                label: `[${data.StudentID}] ${data.StudentGiven1} ${data.StudentSurname}`,
                data: data
              })
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
      onChange={value => {
        onChange &&
        onChange(
          value !== null && props.isMulti === true
            ? value.map((val: iSelectOptionProps) => val.data)
            : value.data
        )
      }}
      loadOptions={searchStudent}
    />
  );
};

export default SynStudentProfileSelector;
