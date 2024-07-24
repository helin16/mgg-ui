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
import iSynAddress from "../../../../types/Synergetic/iSynAddress";
import SynAddressService from "../../../../services/Synergetic/SynAddressService";
import Toaster from "../../../../services/Toaster";

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

type iAddressMap = { [key: number]: iSynAddress };
const StudentListResultPanel = ({
  isLoading = false,
  students,
  studentClassCodeMap,
  parentMap
}: iStudentListResultPanel) => {
  const [columns, setColumns] = useState<iTableColumn<any>[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<iTableColumn<any>[]>([]);
  const [resultTableHtmlId] = useState(
    `mcl-${moment().unix()}-${Math.random()}`
  );
  const [isGettingData, setIsGettingData] = useState(false);
  const [addressMap, setAddressMap] = useState<iAddressMap>({});

  useEffect(() => {
    let isCanceled = false;
    const addressIds = students.map(student => student.AddressID);
    if (addressIds.length <= 0) {
      setAddressMap({});
      return;
    }

    setIsGettingData(true);
    SynAddressService.getAll({
      where: JSON.stringify({ AddressID: addressIds }),
      perPage: 9999999
    })
      .then(resp => {
        if (isCanceled) {
          return;
        }
        setAddressMap(
          (resp.data || []).reduce((map, address) => {
            return {
              ...map,
              [address.AddressID]: address
            };
          }, {})
        );
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
        setIsGettingData(false);
      });

    return () => {
      isCanceled = true;
    };
  }, [students]);

  useEffect(() => {
    const cols: iTableColumn<iVStudent>[] = [
      {
        key: "photo",
        header: "Photo",
        isDefault: true,
        group: "Student",
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
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
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
          return (
            <td key={col.key} className={col.key}>
              {data.StudentID}
            </td>
          );
        }
      },
      {
        key: "student-given1",
        header: "Student Given",
        group: "Student",
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
          return (
            <td key={col.key} className={col.key}>
              {data.StudentGiven1 || ""}
            </td>
          );
        }
      },
      {
        key: "student-preferred",
        header: "Student Preferred Name",
        group: "Student",
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
          return (
            <td key={col.key} className={col.key}>
              {data.StudentPreferred || ""}
            </td>
          );
        }
      },
      {
        key: "student-surname",
        header: "Student Surname",
        group: "Student",
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
          return (
            <td key={col.key} className={col.key}>
              {data.StudentSurname || ""}
            </td>
          );
        }
      },
      {
        key: "student-internal",
        header: "Student Internal Name",
        isDefault: true,
        group: "Student",
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
          return (
            <td key={col.key} className={col.key}>
              {data.StudentNameInternal || ""}
            </td>
          );
        }
      },
      {
        key: "dob",
        header: "Student D.O.B.",
        isDefault: true,
        group: "Student",
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
          return (
            <td key={col.key} className={col.key}>
              {`${data.StudentBirthDate || ""}`
                .trim()
                .replace("T00:00:00.000Z", "")}
            </td>
          );
        }
      },
      {
        key: "student-age",
        header: "Student Age",
        isDefault: true,
        group: "Student",
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
          const dob = `${data.StudentBirthDate || ""}`
            .trim()
            .replace("T00:00:00.000Z", "");
          return (
            <td key={col.key} className={col.key}>
              {dob === '' ? '' : moment().diff(dob, 'years')}
            </td>
          );
        }
      },
      {
        key: "student-email",
        header: "Student Email",
        isDefault: true,
        group: "Student",
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
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
        key: "student-entry-date",
        header: "Student Entry Date",
        group: "Student",
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
          return (
            <td key={col.key} className={col.key}>
              {`${data.StudentEntryDate || ""}`
                .trim()
                .replace("T00:00:00.000Z", "")}
            </td>
          );
        }
      },
      {
        key: "student-full-fee",
        header: "Student Full Fee",
        group: "Student",
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
          return (
            <td key={col.key} className={col.key}>
              {data.FullFeeFlag === true ? "Y" : ""}
            </td>
          );
        }
      },
      {
        key: "address-full",
        header: "Home Address Full",
        group: "Address",
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
          return (
            <td key={col.key} className={col.key}>
              {data.AddressID && data.AddressID in addressMap
                ? addressMap[data.AddressID].HomeAddressFull
                : ""}
            </td>
          );
        }
      },
      {
        key: "address-street",
        header: "Home Street",
        group: "Address",
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
          return (
            <td key={col.key} className={col.key}>
              {data.AddressID && data.AddressID in addressMap
                ? addressMap[data.AddressID].HomeAddress1
                : ""}
            </td>
          );
        }
      },{
        key: "address-suburb",
        header: "Home Suburb",
        group: "Address",
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
          return (
            <td key={col.key} className={col.key}>
              {data.AddressID && data.AddressID in addressMap
                ? addressMap[data.AddressID].HomeSuburb
                : ""}
            </td>
          );
        }
      },{
        key: "address-state",
        header: "Home State",
        group: "Address",
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
          return (
            <td key={col.key} className={col.key}>
              {data.AddressID && data.AddressID in addressMap
                ? addressMap[data.AddressID].HomeState
                : ""}
            </td>
          );
        }
      },{
        key: "address-postcode",
        header: "Home PostCode",
        group: "Address",
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
          return (
            <td key={col.key} className={col.key}>
              {data.AddressID && data.AddressID in addressMap
                ? addressMap[data.AddressID].HomePostCode
                : ""}
            </td>
          );
        }
      },

      // postal address
      {
        key: "postal-address-full",
        header: "Postal Address Full",
        group: "Address",
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
          return (
            <td key={col.key} className={col.key}>
              {data.AddressID && data.AddressID in addressMap
                ? addressMap[data.AddressID].AddressFull
                : ""}
            </td>
          );
        }
      },
      {
        key: "postal-address-street",
        header: "Postal Street",
        group: "Address",
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
          return (
            <td key={col.key} className={col.key}>
              {data.AddressID && data.AddressID in addressMap
                ? addressMap[data.AddressID].Address1
                : ""}
            </td>
          );
        }
      },{
        key: "postal-address-suburb",
        header: "Postal Suburb",
        group: "Address",
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
          return (
            <td key={col.key} className={col.key}>
              {data.AddressID && data.AddressID in addressMap
                ? addressMap[data.AddressID].Suburb
                : ""}
            </td>
          );
        }
      },{
        key: "postal-address-state",
        header: "Postal State",
        group: "Address",
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
          return (
            <td key={col.key} className={col.key}>
              {data.AddressID && data.AddressID in addressMap
                ? addressMap[data.AddressID].State
                : ""}
            </td>
          );
        }
      },{
        key: "postal-address-postcode",
        header: "Postal PostCode",
        group: "Address",
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
          return (
            <td key={col.key} className={col.key}>
              {data.AddressID && data.AddressID in addressMap
                ? addressMap[data.AddressID].PostCode
                : ""}
            </td>
          );
        }
      },


      {
        key: "form",
        header: "Form",
        isDefault: true,
        group: "School",
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
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
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
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
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
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
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
          return (
            <td key={col.key} className={col.key}>
              {data.StudentHouseDescription}
            </td>
          );
        }
      },
      {
        key: "previousSchoolCode",
        header: "Previous School Code",
        group: "School",
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
          return (
            <td key={col.key} className={col.key}>
              {data.StudentPreviousSchoolCode}
            </td>
          );
        }
      },
      {
        key: "previousSchool",
        header: "Previous School",
        group: "School",
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
          return (
            <td key={col.key} className={col.key}>
              {data.StudentPreviousSchoolDescription}
            </td>
          );
        }
      },
      {
        key: "parent1-id",
        header: "Parent ID",
        group: "Parent",
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
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
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
          const parent =
            data.StudentID in parentMap ? parentMap[data.StudentID] : null;
          return (
            <td key={col.key} className={col.key}>
              {parent?.StudentContactTitle || ""}{" "}
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
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
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
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
          const parent =
            data.StudentID in parentMap ? parentMap[data.StudentID] : null;
          return (
            <td key={col.key} className={col.key}>
              {parent?.StudentContactDefaultMobilePhone || ""}
            </td>
          );
        }
      },
      {
        key: "parent2-id",
        header: "Parent2 ID",
        group: "Parent",
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
          const parent =
            data.StudentID in parentMap ? parentMap[data.StudentID] : null;
          return (
            <td key={col.key} className={col.key}>
              {parent?.StudentContactSpouseID || ""}
            </td>
          );
        }
      },
      {
        key: "parent2-name",
        header: "Parent2 Name",
        isDefault: true,
        group: "Parent",
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
          const parent =
            data.StudentID in parentMap ? parentMap[data.StudentID] : null;
          return (
            <td key={col.key} className={col.key}>
              {parent?.StudentContactSpouseTitle || ""}{" "}
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
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
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
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
          const parent =
            data.StudentID in parentMap ? parentMap[data.StudentID] : null;
          return (
            <td key={col.key} className={col.key}>
              {parent?.StudentContactSpouseDefaultMobilePhone || ""}
            </td>
          );
        }
      },
      {
        key: "parent-separated-flag",
        header: "Is Separated",
        isDefault: true,
        group: "Parent",
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
          const parent =
            data.StudentID in parentMap ? parentMap[data.StudentID] : null;
          return (
            <td
              key={col.key}
              className={`${col.key} ${
                parent?.StudentParentsSeparatedFlag === true
                  ? "bg-danger text-white"
                  : ""
              }`}
            >
              {parent?.StudentParentsSeparatedFlag === true ? "YES" : ""}
            </td>
          );
        }
      },
      {
        key: "classes",
        header: "Classes",
        isDefault: true,
        group: "Classes",
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
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
      },
      {
        key: "StudentDoctorName",
        header: "Student Doctor Name",
        group: "Emergency",
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
          return (
            <td key={col.key} className={col.key}>
              {data.StudentDoctorName || ""}
            </td>
          );
        }
      },
      {
        key: "StudentDoctorPhone",
        header: "Student Doctor Phone",
        group: "Emergency",
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
          return (
            <td key={col.key} className={col.key}>
              {data.StudentDoctorPhone || ""}
            </td>
          );
        }
      },
      {
        key: "StudentEmergencyName",
        header: "Student Emergency Name",
        group: "Emergency",
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
          return (
            <td key={col.key} className={col.key}>
              {data.StudentEmergencyName || ""}
            </td>
          );
        }
      },
      {
        key: "StudentEmergencyPhone",
        header: "Student Emergency Phone",
        group: "Emergency",
        cell: (col: iTableColumn<iVStudent>, data: iVStudent) => {
          return (
            <td key={col.key} className={col.key}>
              {data.StudentEmergencyPhone || ""}
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
  }, [studentClassCodeMap, parentMap, addressMap]);

  if (isLoading === true || isGettingData === true) {
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
