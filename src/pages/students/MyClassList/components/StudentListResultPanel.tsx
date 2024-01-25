import PageLoadingSpinner from "../../../../components/common/PageLoadingSpinner";
import iVStudent from "../../../../types/Synergetic/Student/iVStudent";
import { Image } from "react-bootstrap";
import styled from "styled-components";
import iSynVStudentClass from "../../../../types/Synergetic/Student/iSynVStudentClass";
import moment from "moment-timezone";
import Table, { iTableColumn } from "../../../../components/common/Table";
import React, { useEffect, useState } from "react";
import ColumnPopupSelector, {
  getSelectedColumnsFromLocalStorage
} from "../../../../components/common/ColumnPopupSelector";
import { STORAGE_COLUMN_KEY_MY_CLASS_LIST } from "../../../../services/LocalStorageService";
import CSVExportFromHtmlTableBtn from "../../../../components/form/CSVExportFromHtmlTableBtn";
import { FlexContainer } from "../../../../styles";
import MathHelper from "../../../../helper/MathHelper";
import iSynVStudentContactAllAddress from "../../../../types/Synergetic/Student/iSynVStudentContactAllAddress";

type iStudentListResultPanel = {
  isLoading: boolean;
  students: iVStudent[];
  studentClassCodeMap: { [key: number]: iSynVStudentClass[] };
  parentMap: { [key: number]: iSynVStudentContactAllAddress };
};

const Wrapper = styled.div`
  td.photo {
    width: 80px;
    img {
      width: 100%;
      height: auto;
    }
  }
`;

const StudentListResultPanel = ({
  isLoading = false,
  students,
  studentClassCodeMap,
  parentMap
}: iStudentListResultPanel) => {
  const [columns, setColumns] = useState<iTableColumn[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<iTableColumn[]>([]);
  const [resultTableHtmlId] = useState(
    `mcl-${moment().unix()}-${Math.random()}`
  );

  useEffect(() => {
    const cols: iTableColumn[] = [
      {
        key: "photo",
        header: "Photo",
        isDefault: true,
        group: "Student",
        cell: (col: iTableColumn, data: iVStudent) => {
          return (
            <td key={col.key} className={col.key}>
              <Image src={data.profileUrl} />
            </td>
          );
        }
      },
      {
        key: "id",
        header: "Student ID",
        isSelectable: false,
        isDefault: true,
        group: "Student",
        cell: (col: iTableColumn, data: iVStudent) => {
          return (
            <td key={col.key} className={col.key}>
              {data.StudentID}
            </td>
          );
        }
      },
      {
        key: "dob",
        header: "DOB",
        isDefault: true,
        group: "Student",
        cell: (col: iTableColumn, data: iVStudent) => {
          return (
            <td key={col.key} className={col.key}>
              {moment(data.StudentBirthDate).format("DD MMM YYYY")}
            </td>
          );
        }
      },
      {
        key: "student-email",
        header: "Student Email",
        isDefault: true,
        group: "Student",
        cell: (col: iTableColumn, data: iVStudent) => {
          return (
            <td key={col.key} className={col.key}>
              {`${data.StudentOccupEmail || ""}`.trim() === "" ? null : (
                <a href={`mailto:${data.StudentOccupEmail}`}>
                  {data.StudentOccupEmail}
                </a>
              )}
            </td>
          );
        }
      },
      {
        key: "form",
        header: "Form",
        isDefault: true,
        group: "School",
        cell: (col: iTableColumn, data: iVStudent) => {
          return (
            <td key={col.key} className={col.key}>
              {data.StudentForm}
            </td>
          );
        }
      },
      {
        key: "year-level",
        header: "Year Level",
        isDefault: true,
        group: "School",
        cell: (col: iTableColumn, data: iVStudent) => {
          return (
            <td key={col.key} className={col.key}>
              {data.StudentYearLevel}
            </td>
          );
        }
      },
      {
        key: "houseCode",
        header: "House Code",
        group: "School",
        cell: (col: iTableColumn, data: iVStudent) => {
          return (
            <td key={col.key} className={col.key}>
              {data.StudentHouse}
            </td>
          );
        }
      },
      {
        key: "house",
        header: "House",
        isDefault: true,
        group: "School",
        cell: (col: iTableColumn, data: iVStudent) => {
          return (
            <td key={col.key} className={col.key}>
              {data.StudentHouseDescription}
            </td>
          );
        }
      },
      {
        key: "parent1-id",
        header: "Parent ID",
        group: "Parent",
        cell: (col: iTableColumn, data: iVStudent) => {
          const parent =
            data.StudentID in parentMap ? parentMap[data.StudentID] : null;
          return (
            <td key={col.key} className={col.key}>
              {parent?.StudentContactID || ""}
            </td>
          );
        }
      },
      {
        key: "parent1-name",
        header: "Parent Name",
        isDefault: true,
        group: "Parent",
        cell: (col: iTableColumn, data: iVStudent) => {
          const parent =
            data.StudentID in parentMap ? parentMap[data.StudentID] : null;
          return (
            <td key={col.key} className={col.key}>
              {parent?.StudentContactTitle || ""}{' '}
              {parent?.StudentContactNameExternal || ""}
            </td>
          );
        }
      },
      {
        key: "parent1-email",
        header: "Parent Email",
        isDefault: true,
        group: "Parent",
        cell: (col: iTableColumn, data: iVStudent) => {
          const parent =
            data.StudentID in parentMap ? parentMap[data.StudentID] : null;
          const parentEmail = `${parent?.StudentContactDefaultEmail ||
            ""}`.trim();
          return (
            <td key={col.key} className={col.key}>
              {parentEmail === "" ? null : (
                <a href={`mailto:${parentEmail}`}>{parentEmail}</a>
              )}
            </td>
          );
        }
      },
      {
        key: "parent1-mobile",
        header: "Parent Mobile",
        isDefault: true,
        group: "Parent",
        cell: (col: iTableColumn, data: iVStudent) => {
          const parent =
            data.StudentID in parentMap ? parentMap[data.StudentID] : null;
          return <td key={col.key} className={col.key}>{parent?.StudentContactDefaultMobilePhone || ""}</td>;
        }
      },
      {
        key: "parent2-id",
        header: "Parent2 ID",
        group: "Parent",
        cell: (col: iTableColumn, data: iVStudent) => {
          const parent =
            data.StudentID in parentMap ? parentMap[data.StudentID] : null;
          return <td key={col.key} className={col.key}>{parent?.StudentContactSpouseID || ''}</td>;
        }
      },
      {
        key: "parent2-name",
        header: "Parent2 Name",
        isDefault: true,
        group: "Parent",
        cell: (col: iTableColumn, data: iVStudent) => {
          const parent =
            data.StudentID in parentMap ? parentMap[data.StudentID] : null;
          return (
            <td key={col.key} className={col.key}>
              {parent?.StudentContactSpouseTitle || ""}{' '}
              {parent?.StudentContactSpouseNameExternal || ""}
            </td>
          );
        }
      },
      {
        key: "parent2-email",
        header: "Parent2 Email",
        isDefault: true,
        group: "Parent",
        cell: (col: iTableColumn, data: iVStudent) => {
          const parent =
            data.StudentID in parentMap ? parentMap[data.StudentID] : null;
          const parentEmail = `${parent?.StudentContactSpouseDefaultEmail ||
          ""}`.trim();
          return (
            <td key={col.key} className={col.key}>
              {parentEmail === "" ? null : (
                <a href={`mailto:${parentEmail}`}>{parentEmail}</a>
              )}
            </td>
          );
        }
      },
      {
        key: "parent2-mobile",
        header: "Parent2 Mobile",
        isDefault: true,
        group: "Parent",
        cell: (col: iTableColumn, data: iVStudent) => {
          const parent =
            data.StudentID in parentMap ? parentMap[data.StudentID] : null;
          return <td key={col.key} className={col.key}>{parent?.StudentContactSpouseDefaultMobilePhone || ''}</td>;
        }
      },
      {
        key: "parent-separated-flag",
        header: "Is Separated",
        isDefault: true,
        group: "Parent",
        cell: (col: iTableColumn, data: iVStudent) => {
          const parent =
            data.StudentID in parentMap ? parentMap[data.StudentID] : null;
          return <td key={col.key} className={`${col.key} ${parent?.StudentParentsSeparatedFlag === true ? 'bg-danger text-white' : ''}`}>{parent?.StudentParentsSeparatedFlag === true ? 'YES' : ''}</td>;
        }
      },
      {
        key: "classes",
        header: "Classes",
        isDefault: true,
        group: "Classes",
        cell: (col: iTableColumn, data: iVStudent) => {
          const classes =
            data.StudentID in studentClassCodeMap
              ? studentClassCodeMap[data.StudentID]
              : [];
          return (
            <td key={col.key} className={col.key}>
              {classes.map((studentClass, index) => {
                return (
                  <div key={studentClass.ClassCode}>
                    {studentClass.ClassCode} - {studentClass.ClassDescription}
                    {MathHelper.add(index, 1) < classes.length ? " | " : null}
                  </div>
                );
              })}
            </td>
          );
        }
      }
    ];

    const selectedCols = getSelectedColumnsFromLocalStorage(
      STORAGE_COLUMN_KEY_MY_CLASS_LIST,
      cols
    );
    setColumns(cols);
    setSelectedColumns(
      selectedCols.length > 0
        ? selectedCols
        : cols.filter(column => column.isDefault === true)
    );
  }, [studentClassCodeMap, parentMap]);

  if (isLoading) {
    return <PageLoadingSpinner />;
  }

  return (
    <Wrapper>
      <FlexContainer
        className={"space-below space-above justify-content-between"}
      >
        <h6>Found ({students.length}) Student(s)</h6>
        <FlexContainer>
          <CSVExportFromHtmlTableBtn
            size={"sm"}
            variant={"link"}
            disabled={students.length <= 0}
            tableHtmlId={resultTableHtmlId}
            fileName={`my_class_list_${moment().format(
              "YYYY_MM_DD_HH_mm_ss"
            )}.xlsx`}
          />
          <ColumnPopupSelector
            variant={"link"}
            localStorageKey={STORAGE_COLUMN_KEY_MY_CLASS_LIST}
            columns={columns}
            selectedColumns={selectedColumns}
            size={"sm"}
            onColumnSelected={cols => setSelectedColumns(cols)}
          />
        </FlexContainer>
      </FlexContainer>

      <Table
        id={resultTableHtmlId}
        columns={selectedColumns}
        rows={students}
        size={"sm"}
        hover
        responsive
      />
    </Wrapper>
  );
};

export default StudentListResultPanel;
