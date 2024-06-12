import styled from "styled-components";
import ExplanationPanel from "../../../../components/ExplanationPanel";
import { Button, FormControl } from "react-bootstrap";
import { useEffect, useState } from "react";
import * as Icons from "react-bootstrap-icons";
import FormLabel from "../../../../components/form/FormLabel";
import moment from "moment-timezone";
import SynSubjectClassSelector from "../../../../components/student/SynSubjectClassSelector";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/makeReduxStore";
import { FlexContainer } from "../../../../styles";
import PageLoadingSpinner from "../../../../components/common/PageLoadingSpinner";
import SectionDiv from "../../../../components/common/SectionDiv";
import LoadingBtn from "../../../../components/common/LoadingBtn";
import Table from "../../../../components/common/Table";
import Toaster, { TOAST_TYPE_ERROR } from "../../../../services/Toaster";
import SynSubjectClassService from "../../../../services/Synergetic/SynSubjectClassService";
import { OP_BETWEEN, OP_LIKE, OP_OR } from "../../../../helper/ServiceHelper";
import SynVStudentClassService from "../../../../services/Synergetic/Student/SynVStudentClassService";
import { HEADER_NAME_SELECTING_FIELDS } from "../../../../services/AppService";
import SynVStudentService from "../../../../services/Synergetic/Student/SynVStudentService";
import MathHelper from "../../../../helper/MathHelper";
import CSVExportFromHtmlTableBtn from "../../../../components/form/CSVExportFromHtmlTableBtn";

type iSearchCriteria = {
  classCodes: string[];
};
type iValues = { [key: string]: any };
type iResult = {
  familyName: string;
  givenName: string;
  middleName: string;
  username: string;
  dateOfBirth: string;
  gender: string;
  tags: string[];
  uniqueId: string;
  yearLevel: string;
  schoolYear: string;
};
const Wrapper = styled.div``;
const PATDataList = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [searchCriteria, setSearchCriteria] = useState<iSearchCriteria | null>(
    null
  );
  const [results, setResults] = useState<iResult[] | null>(null);
  const [values, setValues] = useState<iValues>({
    initPassword: "Mentone32"
  });
  const [showMoreExplanationPanel, setShowMoreExplanationPanel] = useState(
    false
  );
  const [isLoading, setIsLoading] = useState(false);
  const [currentYear, setCurrentYear] = useState(moment().year());
  const [currentSemester, setCurrentSemester] = useState(1);
  const [tableHtmlId, setTableHtmlId] = useState(`PAT_RES_TABLE`);

  useEffect(() => {
    const year = user?.SynCurrentFileSemester?.FileYear || moment().year();
    const semester = user?.SynCurrentFileSemester?.FileSemester || 1;
    setCurrentYear(year);
    setCurrentSemester(semester);
    setTableHtmlId(`PAT_RES_TABLE_${moment().unix()}`);

    let isCanceled = false;
    setIsLoading(true);
    SynSubjectClassService.getAll({
      where: JSON.stringify({
        FileType: "A",
        FileYear: year,
        FileSemester: semester,
        NormalYearLevel: { [OP_BETWEEN]: [0, 10] },
        [OP_OR]: [
          // {NormalYearLevel: {[OP_BETWEEN]: [0, 10]}, [OP_OR]: [{ClassCode: {[OP_LIKE]: '%AAH%'}, Description: {[OP_LIKE]: '%tutor%group%'}}]},
          {
            NormalYearLevel: { [OP_BETWEEN]: [0, 10] },
            [OP_OR]: [
              { Description: { [OP_LIKE]: "%tutor%group%" } },
              { Description: { [OP_LIKE]: "%home%group%" } }
            ]
          },
          {
            NormalYearLevel: { [OP_BETWEEN]: [9, 10] },
            [OP_OR]: [{ Description: { [OP_LIKE]: "%math%" } }]
          }
        ]
      }),
      perPage: 9999999
    })
      .then(resp => {
        if (isCanceled) {
          return;
        }
        setSearchCriteria({
          classCodes: (resp.data || []).map(
            subjectClass => subjectClass.ClassCode
          )
        });
      })
      .catch(err => {
        if (isCanceled) {
          return;
        }
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCanceled) {
          return;
        }
        setIsLoading(false);
      });
    return () => {
      isCanceled = true;
    };
  }, [
    user?.SynCurrentFileSemester?.FileYear,
    user?.SynCurrentFileSemester?.FileSemester
  ]);

  const getMoreExplanation = () => {
    if (showMoreExplanationPanel !== true) {
      return false;
    }

    return (
      <Table
        responsive
        hover
        columns={[
          {
            key: "fieldName",
            header: "Field name",
            cell: (col, data: string[]) => {
              return <td key={col.key}>{data[0]}</td>;
            }
          },
          {
            key: "description",
            header: "Description",
            cell: (col, data: string[]) => {
              return <td key={col.key}>{data[1]}</td>;
            }
          },
          {
            key: "ActualValue",
            header: "Actual Value",
            cell: (col, data: string[]) => {
              return <td key={col.key}>{data[2]}</td>;
            }
          }
        ]}
        rows={[
          [
            `Family name`,
            `Student's family name. Spaces are allowed`,
            "Synergetic Surname"
          ],
          [
            `Given name`,
            `Student's given name(s). Spaces are allowed`,
            "Synergetic Given1"
          ],
          [
            `Middle names`,
            `Student's middle name(s). Spaces are allowed. This field is optional and can be left blank.`,
            "Synergetic Given2"
          ],
          [
            `Username`,
            `A unique combination of letters, numbers, hyphens and underscores. Can be an email address or student ID. Must not contain apostrophes (') or spaces.`,
            "Synergetic ID"
          ],
          [
            `Password`,
            `8 or more of any combination of letters, numbers, symbols. Leave blank to create a random password. Password can be the same for all students. Students will be asked to log in again if their passwords are changed. `,
            "Fixed value: Mentone32"
          ],
          [
            `Date of birth (DD-MM-YYYY)`,
            `In the format DD-MM-YYYY or DD/MM/YYYY, the year must be 4 digits.`,
            "Synergetic Birth Date"
          ],
          [`Gender`, `Male or Female or Gender X`, "Synergetic Gender"],
          [
            `Tags`,
            `Separate tag names with a comma (,). THe tags must be exactly the same tag names in your account. Tags are optional, and the column can be left blank if not being used.`,
            "Synergetic ClassCodes"
          ],
          [
            `Unique ID`,
            `Unique Student ID. This field is optional and can be left blank.`,
            "Synergetic ID"
          ],
          [
            `Year Level`,
            `The year level of this students. e.g. Foundation, Year 1`,
            "Synergetic Year Level"
          ],
          [
            `School year`,
            `The school year the student was enrolled for the given year leve. e.g. 2023-2024`,
            "Current Year - Next Year"
          ]
        ]}
      />
    );
  };

  const searchResult = () => {
    const classCodes = searchCriteria?.classCodes || [];
    if (classCodes.length === 0) {
      Toaster.showToast("Need to select at least one class!", TOAST_TYPE_ERROR);
      return;
    }

    setIsLoading(true);
    Promise.all([
      SynVStudentClassService.getAll(
        {
          where: JSON.stringify({
            ClassCode: classCodes,
            FileYear: currentYear,
            FileSemester: currentSemester,
            StudentYearLevel: { [OP_BETWEEN]: [0, 10] }
          }),
          perPage: 999999
        },
        {
          headers: {
            [HEADER_NAME_SELECTING_FIELDS]: JSON.stringify([
              "StudentID",
              "ClassCode"
            ])
          }
        }
      ),
      SynVStudentService.getCurrentVStudents({
        where: JSON.stringify({
          FileYear: currentYear,
          FileSemester: currentSemester,
          StudentYearLevel: { [OP_BETWEEN]: [0, 10] }
        }),
        perPage: 999999
      })
    ])
      .then(resp => {
        const studentClassMap: { [key: number]: string[] } = (
          resp[0].data || []
        ).reduce((map, data) => {
          const key = Number(data.StudentID);
          return {
            ...map,
            [key]: [
              // @ts-ignore
              ...(key in map ? map[key] : []),
              data.ClassCode
            ]
          };
        }, {});
        setResults(
          (resp[1] || [])
            .filter(data => (data.StudentID in studentClassMap ? true : false))
            .map(data => {
              return {
                familyName: data.StudentSurname,
                givenName: data.StudentGiven1,
                middleName: data.StudentGiven2,
                username: `${data.StudentID}`,
                dateOfBirth:
                  `${data.StudentBirthDate || ""}`.trim() === ""
                    ? ""
                    : moment.utc(data.StudentBirthDate).format("DD-MM-YYYY"),
                gender: data.StudentGender,
                tags:
                  data.StudentID in studentClassMap
                    ? studentClassMap[data.StudentID]
                    : [],
                uniqueId: `${data.StudentID}`,
                yearLevel: data.StudentYearLevelDescription,
                schoolYear: `${currentYear}-${MathHelper.add(currentYear, 1)}`
              };
            })
        );
      })
      .catch(err => {
        Toaster.showToast(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getTableDiv = () => {
    if (isLoading === true) {
      return <PageLoadingSpinner />;
    }

    if (results === null) {
      return null;
    }

    return (
      <Table
        striped
        responsive
        id={tableHtmlId}
        rows={results || []}
        columns={[
          {
            key: "familyName",
            header: "Family name",
            cell: (col, data: iResult) => {
              return <td key={col.key}>{data.familyName || ""}</td>;
            }
          },
          {
            key: "givenName",
            header: "Given name",
            cell: (col, data: iResult) => {
              return <td key={col.key}>{data.givenName || ""}</td>;
            }
          },
          {
            key: "middleName",
            header: "Middle Names",
            cell: (col, data: iResult) => {
              return <td key={col.key}>{data.middleName || ""}</td>;
            }
          },
          {
            key: "username",
            header: "Username",
            cell: (col, data: iResult) => {
              return <td key={col.key}>{data.username || ""}</td>;
            }
          },
          {
            key: "password",
            header: "Password",
            cell: (col, data: iResult) => {
              return <td key={col.key}>{values.initPassword || ""}</td>;
            }
          },
          {
            key: "dateOfBirth",
            header: "Date Of Birth (DD-MM-YYYY)",
            cell: (col, data: iResult) => {
              return <td key={col.key}>{data.dateOfBirth || ""}</td>;
            }
          },
          {
            key: "gender",
            header: "Gender",
            cell: (col, data: iResult) => {
              return <td key={col.key}>{data.gender || ""}</td>;
            }
          },
          {
            key: "tags",
            header: "Tags",
            cell: (col, data: iResult) => {
              return <td key={col.key}>{(data.tags || []).join(",")}</td>;
            }
          },
          {
            key: "uniqueId",
            header: "Unique ID",
            cell: (col, data: iResult) => {
              return <td key={col.key}>{data.uniqueId || ""}</td>;
            }
          },
          {
            key: "yearLevel",
            header: "Year Level",
            cell: (col, data: iResult) => {
              return <td key={col.key}>{data.yearLevel || ""}</td>;
            }
          },
          {
            key: "schoolYear",
            header: "School Year",
            cell: (col, data: iResult) => {
              return <td key={col.key}>{data.schoolYear || ""}</td>;
            }
          }
        ]}
      />
    );
  };

  const getExportBtn = () => {
    const data = results || [];
    if (data.length <= 0) {
      return null;
    }

    return (
      <CSVExportFromHtmlTableBtn
        tableHtmlId={tableHtmlId}
        className={`col-lg-auto col-5`}
        fileName={`PAT_${user?.synergyId}_${moment().format(
          "YYYY_MMM_DD_HH_mm"
        )}.xlsx`}
        variant={"secondary"}
      >
        <Icons.Download /> Export
      </CSVExportFromHtmlTableBtn>
    );
  };

  return (
    <Wrapper>
      <ExplanationPanel
        dismissible
        variant={`info`}
        text={
          <>
            <b>Exporting data every year for enrolling PAT.</b> Generating data
            for PAT, including all <b>CURRENT</b> students enrolled in:
            <ul>
              <li>
                Tutor Group Year Level 0 to Year Level 10 (
                <small>
                  Class Description contains: 'tutor group' or 'home group'
                </small>
                )
              </li>
              <li>Math classes in Year Level 9 and Year Level 10</li>
            </ul>
            <Button
              variant={"link"}
              size={"sm"}
              onClick={() => {
                setShowMoreExplanationPanel(!showMoreExplanationPanel);
              }}
            >
              {showMoreExplanationPanel ? (
                <>
                  Hide details <Icons.CaretUpFill />
                </>
              ) : (
                <>
                  Show more details <Icons.CaretDownFill />
                </>
              )}
            </Button>
            {getMoreExplanation()}
          </>
        }
      />
      <FlexContainer
        className={"flex flex-row flex-wrap gap-2 align-items-end"}
      >
        <div className={"col-lg-8 col-12"}>
          <FormLabel label={"Class Codes"} isRequired />
          <SynSubjectClassSelector
            pageSize={9999}
            FileYear={user?.SynCurrentFileSemester?.FileYear || moment().year()}
            FileSemester={user?.SynCurrentFileSemester?.FileSemester || 1}
            values={searchCriteria?.classCodes}
            // limitedClassCodes={searchLimits.classCodes || []}
            isMulti
            onSelect={values =>
              setSearchCriteria({
                ...searchCriteria,
                classCodes: (values === null
                  ? []
                  : Array.isArray(values)
                  ? values
                  : [values]
                ).map(value => `${value.value}`)
              })
            }
          />
        </div>
        <div className={"col-lg-2 col-12"}>
          <FormLabel label={"Init Passwords"} isRequired />
          <FormControl
            value={values.initPassword || ""}
            placeholder="Value in Column: Password"
            onChange={event =>
              setValues({
                ...values,
                initPassword: event.target.value
              })
            }
          />
        </div>
        <LoadingBtn
          isLoading={isLoading}
          className={`col-lg-auto ${(results || []).length <= 0 ? 'col-12' : 'col-6'}`}
          onClick={() => searchResult()}
        >
          <Icons.Search /> Search
        </LoadingBtn>
        {getExportBtn()}
      </FlexContainer>

      <SectionDiv className={"mt-4"}>{getTableDiv()}</SectionDiv>
    </Wrapper>
  );
};

export default PATDataList;
