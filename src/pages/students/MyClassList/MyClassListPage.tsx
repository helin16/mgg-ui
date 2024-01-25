import React, { useState } from "react";
import StudentListResultPanel from "./components/StudentListResultPanel";
import ExplanationPanel from "../../../components/ExplanationPanel";
import StudentListSearchPanel, {
  iSearchCriteria
} from "./components/StudentListSearchPanel";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/makeReduxStore";
import SynVStudentClassService from "../../../services/Synergetic/Student/SynVStudentClassService";
import moment from "moment-timezone";
import Toaster from "../../../services/Toaster";
import iVStudent from "../../../types/Synergetic/Student/iVStudent";
import SynVStudentService from "../../../services/Synergetic/Student/SynVStudentService";
import { HEADER_NAME_SELECTING_FIELDS } from "../../../services/AppService";
import { OP_LIKE, OP_OR } from "../../../helper/ServiceHelper";
import iSynVStudentClass from "../../../types/Synergetic/Student/iSynVStudentClass";
import TimeTableImportPopupBtn from "../../../components/timeTable/TimeTableImportPopupBtn";
import styled from "styled-components";
import UtilsService from "../../../services/UtilsService";
import Page401 from "../../../components/Page401";
import SynVStudentContactAllAddressService
  from '../../../services/Synergetic/Student/SynVStudentContactAllAddressService';
import {STUDENT_CONTACT_TYPE_SC1} from '../../../types/Synergetic/Student/iStudentContact';
import iSynVStudentContactAllAddress from '../../../types/Synergetic/Student/iSynVStudentContactAllAddress';

const Wrapper = styled.div``;
const MyClassListPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<iVStudent[]>([]);
  const [studentIdClassCodeMap, setStudentIdClassCodeMap] = useState<{
    [key: string]: iSynVStudentClass[];
  }>({});
  const [parentMap, setParentMap] = useState<{
    [key: string]: iSynVStudentContactAllAddress;
  }>({});

  const onSearch = (criteria: iSearchCriteria) => {
    const getData = async () => {
      const resp = await Promise.all([
        SynVStudentService.getCurrentVStudents({
          where: JSON.stringify({
            FileYear: user?.SynCurrentFileSemester?.FileYear || moment().year(),
            FileSemester: user?.SynCurrentFileSemester?.FileSemester || 1,
            ...(`${criteria.searchText || ""}`.trim() !== ""
              ? {
                [OP_OR]: [
                  {
                    StudentForm: {
                      [OP_LIKE]: `%${`${criteria.searchText || ""}`.trim()}%`
                    }
                  },
                  {
                    StudentNameInternal: {
                      [OP_LIKE]: `%${`${criteria.searchText || ""}`.trim()}%`
                    }
                  },
                  {
                    StudentNameExternal: {
                      [OP_LIKE]: `%${`${criteria.searchText || ""}`.trim()}%`
                    }
                  },
                  {
                    StudentOccupEmail: {
                      [OP_LIKE]: `%${`${criteria.searchText || ""}`.trim()}%`
                    }
                  },
                  ...(UtilsService.isNumeric(criteria.searchText || "") === true
                    ? [{ StudentID: `${criteria.searchText || ""}`.trim() }]
                    : [])
                ]
              }
              : {})
          }),
          sort: "StudentForm:ASC,StudentNameInternal:ASC",
          perPage: 9999999
        }),
        SynVStudentClassService.getAll(
          {
            where: JSON.stringify({
              ...(criteria.classCodes.length > 0
                ? { ClassCode: criteria.classCodes }
                : {}),
              FileYear: user?.SynCurrentFileSemester?.FileYear || moment().year(),
              FileSemester: user?.SynCurrentFileSemester?.FileSemester || 1
            }),
            perPage: "9999"
          },
          {
            headers: {
              [HEADER_NAME_SELECTING_FIELDS]: JSON.stringify([
                "StudentID",
                "ClassCode",
                "ClassDescription"
              ])
            }
          }
        ),
        SynVStudentContactAllAddressService.getAll({
          where: JSON.stringify({
            StudentContactType: [STUDENT_CONTACT_TYPE_SC1],
            FileYear: user?.SynCurrentFileSemester?.FileYear || moment().year(),
            FileSemester: user?.SynCurrentFileSemester?.FileSemester || 1,
          }),
          perPage: 999999,
        }, {
          headers: {[HEADER_NAME_SELECTING_FIELDS]: JSON.stringify([
              'StudentID',
              'StudentContactID',
              'StudentName',
              'StudentContactID',
              'StudentContactTitle',
              'StudentContactNameExternal',
              'StudentContactDefaultEmail',
              'StudentContactDefaultMobilePhone',
              'StudentContactSpouseID',
              'StudentContactSpouseTitle',
              'StudentContactSpouseNameExternal',
              'StudentContactSpouseDefaultMobilePhone',
              'StudentContactSpouseDefaultEmail',
              'StudentParentsSeparatedFlag',
            ])}
        })
      ]);
      const studentFromClassCodeMap = (resp[1].data || []).reduce((map, studentClass) => {
        const studentId = studentClass.StudentID;
        if (!(studentId in map)) {
          return {
            ...map,
            [studentId]: [studentClass]
          };
        }
        return {
          ...map,
          // @ts-ignore
          [studentId]: [...map[studentId], ...[studentClass]]
        };
      }, {});

      const studentIdsFromClassCodes = (resp[1].data || []).map(
        result => result.StudentID
      );
      setStudents(
        (resp[0] || []).filter(
          student => studentIdsFromClassCodes.indexOf(student.StudentID) >= 0
        )
      );
      setStudentIdClassCodeMap(studentFromClassCodeMap);
      setParentMap((resp[2].data || []).reduce((map, parent) => {
        const studentId = parent.StudentID;
        return {
          ...map,
          [studentId]: parent
        };
      }, {}))
    }

    setIsLoading(true);
    getData().catch((err: any) => {
      Toaster.showApiError(err);
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  if (user?.isStaff !== true) {
    return <Page401 />;
  }

  return (
    <Wrapper>
      <h3>
        My Class List
        <TimeTableImportPopupBtn
          className={"float-right"}
          btnPros={{ size: "sm" }}
        />
      </h3>
      <ExplanationPanel
        text={
          <>
            This page is designed for teachers export student list, in order to import them into external tools like: Education Perfect. Data is pulled from Synergetic directly.
            <h6 className={'text-danger text-capitalize'}>Only staff will have access to this page</h6>
          </>
        }
      />
      <StudentListSearchPanel isLoading={isLoading} onSearch={onSearch} />
      <StudentListResultPanel
        isLoading={isLoading}
        students={students}
        studentClassCodeMap={studentIdClassCodeMap}
        parentMap={parentMap}
      />
    </Wrapper>
  );
};

export default MyClassListPage;
