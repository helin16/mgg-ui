import MedicalReportSearchPanel, {
  iSearchState
} from "./components/MedicalReportSearchPanel";
import { useEffect, useState } from "react";
import { Image, Spinner, Table } from "react-bootstrap";
import styled from "styled-components";
import Toaster from "../../services/Toaster";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/makeReduxStore";
import SynVStudentService from "../../services/Synergetic/Student/SynVStudentService";
import iVStudent from "../../types/Synergetic/Student/iVStudent";
import SynVMedicalConditionStudentService from "../../services/Synergetic/Medical/SynVMedicalConditionStudentService";
import iSynVMedicalConditionStudent from "../../types/Synergetic/iSynVMedicalConditionStudent";
import { OP_GT, OP_LIKE, OP_OR } from "../../helper/ServiceHelper";
import moment from "moment-timezone";
import SynVStudentClassService from "../../services/Synergetic/Student/SynVStudentClassService";
import ActionPlanDownloaderDropdown from "./components/ActionPlanDownloaderDropdown";
import iSynVDocument from "../../types/Synergetic/iSynVDocument";
import SynVDocumentService from "../../services/Synergetic/SynVDocumentService";
import { HEADER_NAME_SELECTING_FIELDS } from "../../services/AppService";
import MedicalReportExportDropdown from "./components/MedicalReportExportDropdown";
import Page401 from "../../components/Page401";
import * as _ from 'lodash';
import SynPhotoService from "../../services/Synergetic/SynPhotoService";

const ResultWrapper = styled.div`
  padding: 1rem 0;
  .loading {
    padding: 2rem;
  }

  .result-table {
    .photo {
      width: 90px;
      img {
        width: 100%;
        height: auto;
      }
    }
    .name {
      width: 110px;
    }
    .form {
      width: 40px;
    }

    th.conditions {
      position: relative;
      .download-btn {
        position: absolute;
        right: 0px;
        bottom: 0.5rem;
      }
    }

    td.conditions {
      padding: 0px;
      .conditions-table {
        background-color: transparent;
        margin-bottom: 0px;
        tr {
          border-bottom-width: 1px;
          border-bottom-color: #ccc;
          &:last-child {
            border-bottom: none;
          }
          td {
            padding: 0.5rem 0.5rem;
          }
        }
        .type-name {
          width: 150px;
        }
        .severity {
          width: 150px;
          &.orange {
            background-color: orange;
          }
          &.green {
            background-color: green;
            color: white;
          }
          &.red {
            background-color: red;
            color: white;
          }
        }
        .details {
          font-size: 12px;
        }
      }
    }
  }
`;
const MedicalReportPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [students, setStudents] = useState<iVStudent[]>([]);
  const [conditionsMap, setConditionsMap] = useState<{
    [key: number]: iSynVMedicalConditionStudent[];
  }>({});
  const [docsMap, setDocsMap] = useState<{ [key: number]: iSynVDocument[] }>(
    {}
  );

  const onSearch = async (criteria: iSearchState) => {
      setIsSearching(true);
      const conditionsWhere = {
          ...(criteria.conditionTypes.length > 0
              ? {ConditionTypeCode: criteria.conditionTypes}
              : {}),
          ...(criteria.conditionSeverities.length > 0
              ? {ConditionSeverityCode: criteria.conditionSeverities}
              : {})
      };
      try {
          const resp = await Promise.all([
              SynVStudentService.getCurrentVStudents(
                  {
                      where: JSON.stringify({
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
                                      }
                                  ]
                              }
                              : {}),
                          ...(criteria.campuses.length > 0
                              ? { StudentCampus: criteria.campuses }
                              : {}),
                          ...(criteria.yearLevels.length > 0
                              ? { StudentYearLevel: criteria.yearLevels }
                              : {}),
                          FileYear: user?.SynCurrentFileSemester?.FileYear || moment().year(),
                          FileSemester: user?.SynCurrentFileSemester?.FileSemester || 1,
                          [OP_OR]: [
                              { StudentLeavingDate: null },
                              {
                                  StudentLeavingDate: {
                                      [OP_GT]: moment()
                                          .utc()
                                          .format("YYYY-MM-DD")
                                  }
                              }
                          ]
                      }),
                      sort: `StudentNameInternal:ASC`
                  },
                  {
                      headers: {
                          [HEADER_NAME_SELECTING_FIELDS]: JSON.stringify([
                              "StudentID",
                              "StudentGiven1",
                              "StudentSurname",
                              "StudentForm",
                              "profileUrl",
                              "FileYear",
                              "FileSemester",
                              "StudentYearLevelSort"
                          ])
                      }
                  }
              ),
              SynVMedicalConditionStudentService.getAll(
                  {
                      where: JSON.stringify({
                          ...conditionsWhere,
                          ConditionActiveFlag: true
                      })
                  },
                  {
                      headers: {
                          [HEADER_NAME_SELECTING_FIELDS]: JSON.stringify([
                              "ID",
                              "MedicalConditionSeq",
                              "ConditionTypeDescription",
                              "ConditionSeverityDisplayColour",
                              "ConditionSeverityDescription",
                              "ConditionDetails"
                          ])
                      }
                  }
              ),
              ...(criteria.classCodes.length === 0
                  ? []
                  : [
                      SynVStudentClassService.getAll(
                          {
                              where: JSON.stringify({
                                  ClassCode: criteria.classCodes,
                                  FileYear:
                                      user?.SynCurrentFileSemester?.FileYear || moment().year(),
                                  FileSemester: user?.SynCurrentFileSemester?.FileSemester || 1
                              }),
                              perPage: "99999"
                          },
                          {
                              headers: {
                                  [HEADER_NAME_SELECTING_FIELDS]: JSON.stringify([
                                      "StudentID",
                                      "ClassCode"
                                  ])
                              }
                          }
                      )
                  ]),
          ]);

          setConditionsMap(
              resp[1].reduce((map, condition) => {
                  if (!(condition.ID in map)) {
                      return {
                          ...map,
                          [condition.ID]: [condition]
                      };
                  }
                  // @ts-ignore
                  const existing = map[condition.ID];
                  return {
                      ...map,
                      [condition.ID]: [...existing, ...[condition]]
                  };
              }, {})
          );
          let students = resp[0] || [];
          if (criteria.photoFromSyn === true) {
              const studentArr = resp[0] || [];
              const studentIDs = _.uniq(studentArr.map(st => st.StudentID));
              const photosMap: {[key: number]: string} = ((await Promise.all(studentIDs.map(stId => SynPhotoService.getPhoto(stId)
                  .then(resp => {
                      if (!resp || !('Photo' in resp)) {
                          return [stId, '/images/User-avatar.png'];
                      } else {
                          return [stId, SynPhotoService.convertBufferToUrl(resp.Photo.data, resp.PhotoType)];
                      }
                  })))) || []).reduce((map, [stdId, url]) => ({
                  ...map,
                  [stdId]: url
              }), {});
              students = studentArr.map(student => ({
                  ...student,
                  profileUrl: student.StudentID in photosMap ? photosMap[student.StudentID] : '',
              }))
          }

          const classCodeStudentIds = (resp[2]?.data || []).map(
              studentClass => studentClass.StudentID
          );
          if (
              Object.keys(conditionsWhere).length <= 0 &&
              classCodeStudentIds.length <= 0
          ) {
              setStudents(students);
          } else {
              const conditionStudentIds = resp[1].map(condition => condition.ID);
              setStudents(
                  students.filter(student => {
                      if (Object.keys(conditionsWhere).length <= 0) {
                          return classCodeStudentIds.indexOf(student.StudentID) >= 0;
                      }
                      if (classCodeStudentIds.length <= 0) {
                          return conditionStudentIds.indexOf(student.StudentID) >= 0;
                      }
                      return (
                          classCodeStudentIds.indexOf(student.StudentID) >= 0 &&
                          conditionStudentIds.indexOf(student.StudentID) >= 0
                      );
                  })
              );
          }
          setIsSearching(false);
      } catch (e) {
          Toaster.showApiError(e);
      }
  }

  useEffect(() => {
    if (students.length <= 0) return;

    let isCanceled = false;
    setIsLoadingDocs(true);
    SynVDocumentService.getVDocuments(
      {
        where: JSON.stringify({
          ID: students.map(student => student.StudentID),
          ClassificationCode: "MEDICAL",
          SourceCode: "MEDICAL_CURRENT"
        }),
        perPage: "99999"
      },
      {
        headers: {
          [HEADER_NAME_SELECTING_FIELDS]: JSON.stringify([
            "tDocumentsSeq",
            "ID",
            "Description"
          ])
        }
      }
    )
      .then(resp => {
        if (isCanceled) return;
        setDocsMap(
          resp.data.reduce((map, doc) => {
            if (!(doc.ID in map)) {
              return {
                ...map,
                [doc.ID]: [doc]
              };
            }
            // @ts-ignore
            const existing = map[doc.ID];
            return {
              ...map,
              [doc.ID]: [...existing, ...[doc]]
            };
          }, {})
        );
      })
      .catch(err => {
        if (isCanceled) return;
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCanceled) return;
        setIsLoadingDocs(false);
      });

    return () => {
      isCanceled = true;
    };
  }, [students]);

  const onClear = () => {
    setIsSearching(false);
    setStudents([]);
    setConditionsMap({});
  };

  const getConditionCell = (studentId: number) => {
    if (!(studentId in conditionsMap) || conditionsMap[studentId].length <= 0) {
      return null;
    }
    return (
      <table className={"conditions-table"}>
        <tbody>
          {conditionsMap[studentId].map(condition => {
            return (
              <tr key={condition.MedicalConditionSeq}>
                <td className={"type-name"}>
                  {condition.ConditionTypeDescription}
                </td>
                <td
                  className={`severity ${condition.ConditionSeverityDisplayColour.toLowerCase()}`}
                >
                  {condition.ConditionSeverityDescription}
                </td>
                <td className={"details"}>{condition.ConditionDetails}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const getResultPanel = () => {
    if (isSearching) {
      return (
        <div className={"text-center text-muted loading"}>
          <Spinner animation={"border"} />
          <div>
            <b>Loading ...</b>
          </div>
        </div>
      );
    }

    if (students.length <= 0) {
      return null;
    }

    return (
      <Table striped hover responsive className={"result-table"}>
        <thead>
          <tr>
            <th className={"photo"}> </th>
            <th className={"name"}>Name</th>
            <th className={"form"}>Form</th>
            <th className={"conditions"}>
              Conditions
              <div className={"download-btn"}>
                <MedicalReportExportDropdown
                  students={students}
                  conditionsMap={conditionsMap}
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {students?.map(vStudent => {
            return (
              <tr key={vStudent.StudentID}>
                <td className={"photo"}>
                  <Image src={vStudent.profileUrl} />
                </td>
                <td className={`name`}>
                  <div>{vStudent.StudentSurname},</div>
                  <div>{vStudent.StudentGiven1}</div>
                  <div>
                    <ActionPlanDownloaderDropdown
                      docs={docsMap[vStudent.StudentID] || []}
                      isLoading={isLoadingDocs}
                    />
                  </div>
                </td>
                <td className={`form`}>{vStudent.StudentForm}</td>
                <td className={`conditions`}>
                  {getConditionCell(vStudent.StudentID)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  };

  const getContent = () => {
    if (!user || !user.isStaff) {
      return <Page401 description={<h4>ONLY Staff can access this page</h4>} />;
    }
    return (
      <>
        <MedicalReportSearchPanel
          isSearching={isSearching}
          onSearch={onSearch}
          onClear={onClear}
        />
        <ResultWrapper className={"result-wrapper"}>
          {getResultPanel()}
        </ResultWrapper>
      </>
    );
  };

  return (
    <div>
      <h3>Medical Reports / Action Plans</h3>
      {getContent()}
    </div>
  );
};

export default MedicalReportPage;
